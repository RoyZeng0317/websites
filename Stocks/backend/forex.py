"""Indicative FX bars: no daily fallback or interpolated cross rates."""
import json
import math
import time
from urllib.request import Request, urlopen
from fastapi import APIRouter, HTTPException, Query

router = APIRouter()
_cache = {}
PAIRS = {'TWD/HKD', 'USD/HKD', 'TWD/USD', 'HKD/TWD', 'HKD/USD', 'USD/TWD'}


def fetch_leg(symbol, period):
    key = (symbol, period)
    now = time.time()
    if key in _cache and now - _cache[key][0] < 60:
        return _cache[key][1]
    interval = '5m' if period == '5d' else '1d'
    request = Request(
        f'https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?range={period}&interval={interval}',
        headers={'User-Agent': 'Mozilla/5.0'},
    )
    with urlopen(request, timeout=15) as response:
        result = json.load(response)['chart']['result'][0]
    if result['meta'].get('dataGranularity') != interval:
        raise ValueError('Unexpected data granularity')
    bars = {int(t): float(v) for t, v in zip(result.get('timestamp', []), result['indicators']['quote'][0]['close'])
            if isinstance(v, (int, float)) and math.isfinite(v) and v > 0 and t <= now}
    _cache[key] = (now, bars)
    return bars


def cross_rates(base, quote, twd, hkd):
    legs = {'TWD': twd, 'HKD': hkd}
    required = [legs[c] for c in (base, quote) if c != 'USD']
    timestamps = sorted(set.intersection(*(set(leg) for leg in required)))
    return [{'timestamp': t, 'rate': (1 if quote == 'USD' else legs[quote][t]) /
             (1 if base == 'USD' else legs[base][t])} for t in timestamps]


@router.get('/api/forex')
def forex(pair: str = 'TWD/HKD', period: str = Query('5d', pattern='^(5d|1mo|1y)$')):
    if pair not in PAIRS:
        raise HTTPException(400, 'Unsupported currency pair')
    base, quote = pair.split('/')
    try:
        twd = fetch_leg('TWD=X', period) if 'TWD' in (base, quote) else {}
        hkd = fetch_leg('HKD=X', period) if 'HKD' in (base, quote) else {}
        points = cross_rates(base, quote, twd, hkd)
    except Exception as exc:
        raise HTTPException(503, '匯率供應來源暫時無法使用，請稍後重試') from exc
    return {'pair': pair, 'points': points, 'fetchedAt': int(time.time()),
            'asOf': points[-1]['timestamp'] if points else None,
            'interval': '5m' if period == '5d' else '1d',
            'source': 'Yahoo Finance / ICE（美元基準交叉換算）',
            'delaySeconds': None, 'pollSeconds': 300}
