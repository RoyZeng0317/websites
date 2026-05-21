import requests

proxies = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
]
for proxy in proxies:
    try:
        url = proxy + 'https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL'
        r = requests.get(url, timeout=20)
        print(f'{proxy[:30]:30s} status={r.status_code}')
        if r.status_code == 200:
            try:
                data = r.json()
                if isinstance(data, list):
                    print(f'  Total: {len(data)}')
                    for item in data:
                        if item.get('Code') == '2330':
                            print(f'  2330: PE={item.get("PEratio")}')
                            break
            except:
                print(f'  Not JSON: {r.text[:100]}')
        else:
            print(f'  Error: {r.status_code} {r.text[:100]}')
    except Exception as e:
        print(f'  Exception: {type(e).__name__}: {str(e)[:80]}')
    print()
