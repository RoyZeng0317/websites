"""Single shared candlestick chart renderer.

Both the Pi-side YOLO training pipeline (Stocks/ml/yolo_dataset/chart_render.py
imports this file directly) and the Render-side serving code (ml_predict.py)
must render chart images with byte-identical code — otherwise the pattern
detector faces a pixel-level distribution shift between what it was trained
on and what it sees in production. Never duplicate this rendering logic.
"""
from __future__ import annotations

from io import BytesIO

import mplfinance as mpf
import pandas as pd

IMG_SIZE = 416  # keep in sync with ml/config.py WINDOW_IMG_SIZE and the YOLO training imgsz
DPI = 100

STYLE = mpf.make_mpf_style(
    base_mpf_style="charles",
    marketcolors=mpf.make_marketcolors(up="red", down="green", inherit=True),
    gridstyle="",
    facecolor="white",
    edgecolor="white",
    figcolor="white",
)


def _to_mpf_frame(df: pd.DataFrame) -> pd.DataFrame:
    """mplfinance requires a DatetimeIndex + capitalized OHLCV columns."""
    frame = df.rename(columns={
        "open": "Open", "high": "High", "low": "Low", "close": "Close", "volume": "Volume",
    })[["Open", "High", "Low", "Close", "Volume"]]
    if not isinstance(frame.index, pd.DatetimeIndex):
        frame.index = pd.to_datetime(frame.index)
    return frame


def render_figure(df: pd.DataFrame, imgsz: int = IMG_SIZE):
    """Render df (last N bars) to a matplotlib Figure/Axes pair.

    Returns (fig, axlist). Caller is responsible for closing the figure
    (plt.close(fig)) once done — figures are not auto-closed here since
    training-time bbox math needs axlist[0].transData before closing.
    """
    frame = _to_mpf_frame(df)
    fig, axlist = mpf.plot(
        frame,
        type="candle",
        style=STYLE,
        axisoff=True,
        volume=False,
        figsize=(imgsz / DPI, imgsz / DPI),
        returnfig=True,
        scale_padding=0,
        tight_layout=True,
    )
    fig.set_dpi(DPI)
    return fig, axlist


def render_png_bytes(df: pd.DataFrame, imgsz: int = IMG_SIZE) -> bytes:
    """Render df to PNG bytes (serving-time convenience — no bbox math needed)."""
    import matplotlib.pyplot as plt

    fig, _ = render_figure(df, imgsz=imgsz)
    buf = BytesIO()
    fig.savefig(buf, format="png", dpi=DPI)
    plt.close(fig)
    buf.seek(0)
    return buf.read()


def render_to_file(df: pd.DataFrame, out_path: str, imgsz: int = IMG_SIZE):
    """Render df to a PNG file on disk (training-time dataset generation)."""
    import matplotlib.pyplot as plt

    fig, _ = render_figure(df, imgsz=imgsz)
    fig.savefig(out_path, format="png", dpi=DPI)
    plt.close(fig)


def data_to_pixel_xy(axlist, bar_index: float, price: float, imgsz: int = IMG_SIZE) -> tuple[float, float]:
    """Map (bar_index, price) data coordinates to (x, y) pixel coords with
    origin at the TOP-LEFT of the rendered image (YOLO/image-array convention),
    as opposed to matplotlib's transData which has origin at bottom-left.

    bar_index is the 0-based positional index of the bar within the df passed
    to render_figure (mplfinance plots trading days as sequential integers,
    not calendar dates, so gaps/weekends don't shift this).
    """
    ax = axlist[0]
    fig = ax.figure
    disp_x, disp_y = ax.transData.transform((bar_index, price))
    px = disp_x
    py = fig.bbox.height - disp_y  # flip: matplotlib y grows up, image y grows down
    return px, py
