"""Minimal YOLOv8-ONNX inference (decode + NMS) using only numpy + onnxruntime.

Deliberately does NOT depend on ultralytics/torch — the whole point of
exporting to ONNX (see Stocks/ml/train_yolo.py) is that Render's free-tier
backend can run pattern detection without installing those heavy packages.
"""
from __future__ import annotations

from io import BytesIO

import numpy as np
from PIL import Image


def preprocess_image(png_bytes: bytes, imgsz: int) -> np.ndarray:
    """PNG bytes -> (1, 3, imgsz, imgsz) float32 array in [0, 1].
    chart_render.py always renders at exactly `imgsz`, so no letterboxing
    or aspect-ratio padding is needed here — just decode + normalize.
    """
    img = Image.open(BytesIO(png_bytes)).convert("RGB")
    if img.size != (imgsz, imgsz):
        img = img.resize((imgsz, imgsz))
    arr = np.asarray(img, dtype=np.float32) / 255.0  # HWC
    arr = arr.transpose(2, 0, 1)  # CHW
    return np.expand_dims(arr, 0)  # NCHW


def _iou(box: np.ndarray, boxes: np.ndarray) -> np.ndarray:
    x1 = np.maximum(box[0], boxes[:, 0])
    y1 = np.maximum(box[1], boxes[:, 1])
    x2 = np.minimum(box[2], boxes[:, 2])
    y2 = np.minimum(box[3], boxes[:, 3])
    inter = np.maximum(0, x2 - x1) * np.maximum(0, y2 - y1)
    area_box = (box[2] - box[0]) * (box[3] - box[1])
    area_boxes = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
    union = area_box + area_boxes - inter
    return inter / np.clip(union, 1e-9, None)


def _nms(boxes: np.ndarray, scores: np.ndarray, iou_threshold: float) -> list[int]:
    order = scores.argsort()[::-1]
    keep: list[int] = []
    while order.size > 0:
        i = order[0]
        keep.append(int(i))
        if order.size == 1:
            break
        rest = order[1:]
        ious = _iou(boxes[i], boxes[rest])
        order = rest[ious <= iou_threshold]
    return keep


def run_inference(
    session,
    input_array: np.ndarray,
    conf_threshold: float = 0.25,
    iou_threshold: float = 0.45,
) -> list[dict]:
    """Returns [{class_id, confidence, box:[x1,y1,x2,y2] in pixel coords}, ...].

    Assumes a standard ultralytics YOLOv8 ONNX export: single output of
    shape (1, 4 + num_classes, num_predictions), boxes already in
    cx,cy,w,h pixel space of the input image, class scores post-sigmoid.
    """
    input_name = session.get_inputs()[0].name
    outputs = session.run(None, {input_name: input_array})
    raw = outputs[0]
    if raw.ndim == 3:
        raw = raw[0]
    if raw.shape[0] < raw.shape[1]:
        preds = raw.T  # (N, 4+nc)
    else:
        preds = raw

    boxes_xywh = preds[:, :4]
    scores = preds[:, 4:]
    if scores.size == 0:
        return []
    class_ids = np.argmax(scores, axis=1)
    confidences = scores[np.arange(len(scores)), class_ids]
    mask = confidences >= conf_threshold
    boxes_xywh = boxes_xywh[mask]
    class_ids = class_ids[mask]
    confidences = confidences[mask]
    if len(boxes_xywh) == 0:
        return []

    cx, cy, w, h = boxes_xywh[:, 0], boxes_xywh[:, 1], boxes_xywh[:, 2], boxes_xywh[:, 3]
    boxes_xyxy = np.stack([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2], axis=1)

    results = []
    for class_id in np.unique(class_ids):
        cls_mask = class_ids == class_id
        cls_boxes = boxes_xyxy[cls_mask]
        cls_scores = confidences[cls_mask]
        keep = _nms(cls_boxes, cls_scores, iou_threshold)
        for i in keep:
            results.append({
                "class_id": int(class_id),
                "confidence": float(cls_scores[i]),
                "box": cls_boxes[i].tolist(),
            })
    results.sort(key=lambda r: r["confidence"], reverse=True)
    return results
