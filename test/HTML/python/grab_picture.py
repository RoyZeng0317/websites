import os
import requests

# 基本網址
base_url = "https://onlinetest.tw/btest/test2/database/17300/"

# 儲存資料夾
img_folder = "python/17300_img"
os.makedirs(img_folder, exist_ok=True)

# headers
headers = {
    "User-Agent": "Mozilla/5.0"
}
# 題號範圍
for i in range(1, 2):

    # 圖片名稱
    img_name = f"3-71-x.jpg"

    # 完整網址
    img_url = base_url + img_name

    print(f"下載中: {img_url}")

    # 發送請求
    response = requests.get(img_url, headers=headers)

    # 判斷是否存在
    if response.status_code == 200:

        # 儲存
        with open(os.path.join(img_folder, img_name), "wb") as f:
            f.write(response.content)

        print(f"成功: {img_name}")

    else:
        print(f"不存在: {img_name}")

print("完成")