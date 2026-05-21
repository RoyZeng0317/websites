import requests

# Use the user's Finnhub API key
key = "d87id6pr01qmhakfua8gd87id6pr01qmhakfua90"

# Check what Finnhub returns for AAPL - a dividend-paying stock
r = requests.get(f"https://finnhub.io/api/v1/stock/metric?symbol=AAPL&metric=all&token={key}", timeout=10)
print(f'AAPL status={r.status_code}')
if r.status_code == 200:
    m = r.json().get("metric", {})
    # Print all non-None fields
    for k, v in sorted(m.items()):
        if v is not None:
            print(f'  {k}: {v}')
    print()
    # Check specific fields we care about
    print('=== Specific fields ===')
    for f in ['forwardPE', 'beta', 'dividendYield5Y', 'payoutRatio', 'exDividendDate',
              'epsForward', 'forwardEps', 'dividendPerShare', 'dividendPayoutRatio',
              'operatingMarginTTM', 'netProfitMarginTTM', 'roaTTM', 'roeTTM',
              'revenuePerShareTTM', 'bookValuePerShareQuarterly', 'pbQuarterly',
              'totalDebt/totalEquityQuarterly', '52WeekPriceReturnDaily',
              'peBasicExclExtraTTM', 'epsBasicExclExtraItemsTTM']:
        print(f'  {f}: {m.get(f)}')
