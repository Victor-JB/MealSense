"""Android restaurant + menu scraper.

Usage:
    1. Start Appium server:  appium server --address 0.0.0.0 --port 4723
    2. python scraper.py
"""
import json, time, os, itertools, io
from pathlib import Path
from appium.webdriver import Remote
from lxml import etree
from PIL import Image

from ocr_utils import extract_text_from_bytes

CAPS_PATH = Path(__file__).with_name("caps.json")
OUTPUT_DIR = Path("output")
OUTPUT_DIR.mkdir(exist_ok=True)

caps = json.load(open(CAPS_PATH))
driver = Remote("http://localhost:4723/wd/hub", caps)

def wait_for_home(timeout=15):
    for _ in range(timeout):
        if driver.find_elements(by="xpath", value="//*[contains(@text,'BENSON CENTER')]"):
            return
        time.sleep(1)
    raise RuntimeError("Home screen not detected")

def get_open_restaurant_elements():
    # return list of (element, title)
    elems = driver.find_elements(by="xpath",
            value="//android.widget.TextView[contains(@text,'Now Closed')]/../..")
    all_rows = driver.find_elements(by="xpath",
            value="//android.widget.LinearLayout[./*/*[contains(@text,'Now') or contains(@text,'AM') or contains(@text,'PM')]]")
    results = []
    for row in all_rows:
        status_elem = row.find_element(by="xpath", value=".//android.widget.TextView[2]")
        name_elem = row.find_element(by="xpath", value=".//android.widget.TextView[1]")
        status_text = status_elem.text.strip()
        if 'Now Closed' not in status_text:
            results.append((row, name_elem.text.strip()))
    return results

data = {}

def ocr_visible_menu_items():
    xml = driver.page_source
    root = etree.fromstring(xml.encode())
    items = []
    for node in root.iter():
        txt = node.attrib.get("text") or ""
        if txt.strip():
            items.append(txt.strip())
    # deduplicate
    return list(dict.fromkeys(items))

def snapshot_menu_list(restaurant_name):
    items_seen = set()
    finished = False
    while not finished:
        menu_items = ocr_visible_menu_items()
        new = [i for i in menu_items if i not in items_seen]
        items_seen.update(new)
        # scroll a bit
        try:
            driver.swipe(500, 1600, 500, 400, 400)
            time.sleep(0.4)
        except Exception:
            finished = True
    data[restaurant_name] = sorted(items_seen)

try:
    wait_for_home()
    # initial scroll to load
    time.sleep(1)
    # iterate until bottom of restaurant list
    seen_restaurants = set()
    while True:
        for elem, title in get_open_restaurant_elements():
            if title in seen_restaurants:
                continue
            seen_restaurants.add(title)
            elem.click()
            time.sleep(2)
            snapshot_menu_list(title)
            driver.back()
            time.sleep(1)
        # scroll restaurant list
        initial_count = len(seen_restaurants)
        driver.swipe(500, 1600, 500, 400, 500)
        time.sleep(0.6)
        if len(seen_restaurants) == initial_count:
            break  # reached bottom

finally:
    driver.quit()
    out_path = OUTPUT_DIR / "menu_data.json"
    out_path.write_text(json.dumps(data, indent=2))
    print(f"Scraping complete -> {out_path}")
