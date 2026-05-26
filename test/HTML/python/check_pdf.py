import fitz
doc = fitz.open(r'C:\Users\Roy\Documents\GitHub\websites\test\backend\data\117002A13.pdf')
page = doc[0]
blocks = page.get_text('dict')['blocks']
for b in blocks[:3]:
    if 'lines' in b:
        for l in b['lines']:
            for s in l['spans']:
                print(f'Font: {s["font"]}, Size: {s["size"]}, Text: {repr(s["text"][:100])}')
