from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from webdriver_manager.firefox import GeckoDriverManager
import time

options = Options()

# 👉 基本反偵測（先穩住）
options.set_preference(
    "general.useragent.override",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36"
)

options.set_preference("dom.webdriver.enabled", False)

# 👉 webdriver-manager 自動下載 driver
service = Service(GeckoDriverManager().install())

driver = webdriver.Firefox(service=service, options=options)

driver.get("https://onlinetest.tw/")

time.sleep(3)

driver.get("https://onlinetest.tw/etest/test2/database/17300/")

time.sleep(5)

print(driver.title)

imgs = driver.find_elements("tag name", "img")
for img in imgs:
    src = img.get_attribute("src")
    if src:
        print(src)

driver.quit()