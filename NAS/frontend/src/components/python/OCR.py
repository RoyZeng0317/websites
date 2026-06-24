"""
OCR Module — Optical Character Recognition
Uses Tesseract via pytesseract + Pillow for image preprocessing.

Requirements:
    pip install pytesseract pillow opencv-python
    Install Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
    Add Tesseract to PATH or set pytesseract.pytesseract.tesseract_cmd below.
"""

import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import cv2
import numpy as np
import sys
from pathlib import Path

# If Tesseract is not in PATH, uncomment and set the path:
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def preprocess_image(image_path: str) -> Image.Image:
    """Enhance image for better OCR accuracy."""
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Denoise
    denoised = cv2.fastNlMeansDenoising(gray, h=10)

    # Adaptive threshold — handles uneven lighting
    thresh = cv2.adaptiveThreshold(
        denoised, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 11, 2
    )

    return Image.fromarray(thresh)


def extract_text(image_path: str, lang: str = "eng+chi_tra") -> str:
    """
    Extract text from an image file.

    Args:
        image_path: Path to the image (PNG, JPG, BMP, etc.)
        lang: Tesseract language code(s). Default: English + Traditional Chinese.
               Use "eng" for English only.
    Returns:
        Extracted text string.
    """
    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    processed = preprocess_image(image_path)

    config = "--oem 3 --psm 6"  # LSTM engine, assume uniform block of text
    text = pytesseract.image_to_string(processed, lang=lang, config=config)
    return text.strip()


def extract_with_confidence(image_path: str, lang: str = "eng+chi_tra") -> list[dict]:
    """
    Extract text with per-word confidence scores.

    Returns:
        List of dicts with keys: text, conf, left, top, width, height
    """
    path = Path(image_path)
    if not path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")

    processed = preprocess_image(image_path)
    config = "--oem 3 --psm 6"
    data = pytesseract.image_to_data(processed, lang=lang, config=config,
                                     output_type=pytesseract.Output.DICT)

    results = []
    for i, word in enumerate(data["text"]):
        conf = int(data["conf"][i])
        if word.strip() and conf > 0:
            results.append({
                "text": word,
                "conf": conf,
                "left": data["left"][i],
                "top": data["top"][i],
                "width": data["width"][i],
                "height": data["height"][i],
            })
    return results


def batch_extract(folder_path: str, lang: str = "eng+chi_tra") -> dict[str, str]:
    """
    Run OCR on all images in a folder.

    Returns:
        Dict mapping filename → extracted text.
    """
    folder = Path(folder_path)
    if not folder.is_dir():
        raise NotADirectoryError(f"Not a directory: {folder_path}")

    extensions = {".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif"}
    results = {}
    for file in sorted(folder.iterdir()):
        if file.suffix.lower() in extensions:
            try:
                results[file.name] = extract_text(str(file), lang=lang)
                print(f"[OK] {file.name}")
            except Exception as e:
                results[file.name] = f"[ERROR] {e}"
                print(f"[FAIL] {file.name}: {e}")
    return results


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python OCR.py <image_path> [lang]")
        print("  lang default: eng+chi_tra (English + Traditional Chinese)")
        sys.exit(1)

    image = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else "eng+chi_tra"

    print(f"Processing: {image}  lang={language}\n")
    try:
        text = extract_text(image, lang=language)
        print("=== Extracted Text ===")
        print(text)

        print("\n=== Word Confidence ===")
        words = extract_with_confidence(image, lang=language)
        for w in words:
            print(f"  [{w['conf']:3d}%] {w['text']}")
    except FileNotFoundError as e:
        print(f"Error: {e}")
        sys.exit(1)
