import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient
from fastapi import FastAPI
import forex

app = FastAPI()
app.include_router(forex.router)
client = TestClient(app)

class ForexTests(unittest.TestCase):
    def test_cross_and_inverse(self):
        for base, quote in [('TWD','HKD'), ('TWD','USD'), ('USD','HKD')]:
            forward = forex.cross_rates(base, quote, {1:32, 2:33}, {1:8, 3:9})
            reverse = forex.cross_rates(quote, base, {1:32, 2:33}, {1:8, 3:9})
            self.assertAlmostEqual(forward[0]['rate'] * reverse[0]['rate'], 1)
        self.assertEqual(forex.cross_rates('TWD','HKD',{1:32},{2:8}), [])
        self.assertEqual(forex.cross_rates('TWD','HKD',{1:32},{1:8})[0]['rate'], .25)

    def test_validation(self):
        self.assertEqual(client.get('/api/forex?pair=EUR/USD').status_code, 400)
        self.assertEqual(client.get('/api/forex?period=2m').status_code, 422)

    @patch('forex.fetch_leg', return_value={})
    def test_empty(self, fetch):
        result = client.get('/api/forex').json()
        self.assertIsNone(result['asOf'])
        self.assertEqual(result['points'], [])

    @patch('forex.fetch_leg', side_effect=TimeoutError)
    def test_failure(self, fetch):
        self.assertEqual(client.get('/api/forex').status_code, 503)

    @patch('forex.fetch_leg', return_value={1:32, 2:33})
    def test_metadata(self, fetch):
        result = client.get('/api/forex?pair=TWD/USD&period=1mo').json()
        self.assertEqual(result['interval'], '1d')
        self.assertIsNone(result['delaySeconds'])
        self.assertEqual(result['asOf'], 2)
        self.assertAlmostEqual(result['points'][0]['rate'], 1/32)

    @patch('forex.urlopen')
    def test_filter_and_cache(self, request):
        import io, json
        payload = {'chart': {'result': [{'meta': {'dataGranularity': '5m'},
            'timestamp': [1, 2, 3, 4, 5, 9999999999],
            'indicators': {'quote': [{'close': [32, None, 0, -1, float('nan'), 33]}]}}]}}
        request.return_value.__enter__.return_value = io.StringIO(json.dumps(payload))
        forex._cache.clear()
        self.assertEqual(forex.fetch_leg('TWD=X', '5d'), {1:32})
        self.assertEqual(forex.fetch_leg('TWD=X', '5d'), {1:32})
        self.assertEqual(request.call_count, 1)
        forex._cache.clear()

    @patch('forex.urlopen')
    def test_reject_daily_fallback(self, request):
        import io, json
        request.return_value.__enter__.return_value = io.StringIO(json.dumps(
            {'chart': {'result': [{'meta': {'dataGranularity': '1d'}}]}}))
        forex._cache.clear()
        with self.assertRaises(ValueError):
            forex.fetch_leg('TWD=X', '5d')
