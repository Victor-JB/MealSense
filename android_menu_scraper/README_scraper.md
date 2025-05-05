# Android Dining Menu Scraper

Quickly dump **open restaurants** and their **menu items** from the Transact Mobile Ordering app (or any identical white‑label build) on Android using Appium + UIAutomator2 and OCR.

TL;DR
Running python scraper.py (with Appium server already listening) produces a tidy JSON payload you can feed straight into your MealSense pipeline.

## 1. Prerequisites

| Tool | Install command |
|------|-----------------|
| Android SDK + ADB | `sdkmanager "platform-tools" "emulator"` |
| Node.js ≥ 18 | https://nodejs.org |
| Appium 2.x | `npm install -g appium@next` |
| UIAutomator2 driver | `appium driver install uiautomator2` |
| Tesseract OCR engine | macOS: `brew install tesseract`  •  Ubuntu: `sudo apt-get install tesseract-ocr` |
| Python 3.9+ | `python -m venv venv && source venv/bin/activate` |

Then:

```bash
cd android_menu_scraper
pip install -r requirements.txt
```

## 2. Configure capabilities

Edit **caps.json**:

* `deviceName` – output of `adb devices`
* `appPackage` / `appActivity` – grab via `adb shell "cmd package resolve-activity --brief <apk>"`  
* Set `noReset: true` if you don’t need a fresh install each run.

## 3. Run

```bash
# Terminal 1 (Appium server)
appium server --address 0.0.0.0 --port 4723

# Terminal 2 (scraper)
python scraper.py
```

When finished you’ll get **output/menu_data.json**:

```json
{
  "The Global Grill": ["Turkey Burger", "Impossible Burger", "Fries"],
  "Cafe on the Square": ["Latte", "Cold Brew", "..."]
}
```

## 4. How it works

1. Launches the installed app via Appium.
2. Finds restaurant rows; filters out those whose status label contains “Now Closed”.
3. Clicks each open row, scrolls through the menu page, and collects visible text via the accessibility tree.  
   *If a custom view hides text from accessibility, the fallback OCR in `ocr_utils.py` crops the bounding box and runs pytesseract.*
4. Returns to the home list and repeats until every restaurant is processed.
5. Serializes results to JSON for downstream ingestion.

## 5. Tips

* Speed up emulators with `adb shell settings put global window_animation_scale 0`.
* To run on CI, boot a headless AVD:  
  `emulator -avd Pixel_7_API_34 -no-window -no-audio &`
* If OCR accuracy is poor, train Tesseract or switch to `lang='eng+osd'` in `ocr_utils.extract_text_from_bytes`.
* The script guards against duplicate scrolling; tweak `driver.swipe` coordinates to suit other screen sizes.

Happy scraping!
