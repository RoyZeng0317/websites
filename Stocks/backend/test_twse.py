import requests

urls = [
    'https://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL',
    'https://www.twse.com.tw/exchangeReport/BWIBBU_ALL?response=json',
    'http://openapi.twse.com.tw/v1/exchangeReport/BWIBBU_ALL',
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for url in urls:
    try:
        r = requests.get(url, headers=headers, timeout=15)
        print(f'{url[:60]:60s} status={r.status_code} len={len(r.text)}')
        if r.status_code == 200:
            try:
                data = r.json()
                if isinstance(data, list):
                    print(f'  Total items: {len(data)}')
                    for item in data:
                        if item.get('Code') == '2330':
                            print(f'  2330: PE={item.get("PEratio")} DY={item.get("DividendYield")} PB={item.get("PBratio")}')
                            break
                elif isinstance(data, dict):
                    print(f'  Keys: {list(data.keys())[:5]}')
            except:
                print(f'  First 200: {r.text[:200]}')
        else:
            print(f'  Error: {r.text[:200]}')
    except Exception as e:
        print(f'  Exception: {e}')
    print()
