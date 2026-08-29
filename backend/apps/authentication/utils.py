from io import BytesIO
from uuid import uuid4

from PIL import Image as PILImage


def resize_avatar(image_file, size=256):
    img = PILImage.open(image_file)
    img = img.convert("RGB")
    img.thumbnail((size, size))
    buf = BytesIO()
    img.save(buf, format="JPEG", quality=85)
    return buf.getvalue()


def avatar_filename(user_pk):
    return f"avatar_{user_pk}_{uuid4().hex[:8]}.jpg"
