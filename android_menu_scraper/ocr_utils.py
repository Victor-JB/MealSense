from PIL import Image
import pytesseract
import io

def extract_text_from_bytes(img_bytes, lang='eng'):
    """Return OCR text from PNG/JPEG bytes."""
    img = Image.open(io.BytesIO(img_bytes))
    return pytesseract.image_to_string(img, lang=lang).strip()
