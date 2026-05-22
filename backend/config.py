import os
from dotenv import load_dotenv

load_dotenv()

# API Config
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 8000))
DEBUG = os.getenv("DEBUG", "False") == "True"

# Model Config
MODEL_PATH = os.getenv("MODEL_PATH", "models/best.pt")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", 0.5))
IOU_THRESHOLD = float(os.getenv("IOU_THRESHOLD", 0.45))

# Upload Config
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 500 * 1024 * 1024))  # 500MB

# Ensure upload directory exists
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Traffic sign classes
TRAFFIC_SIGN_CLASSES = {
    0: "Cấm vào",
    1: "Cấm dừng",
    2: "Cấm chuyển hướng trái",
    3: "Cấm chuyển hướng phải",
    4: "Cảnh báo nguy hiểm",
    5: "Cảnh báo giao lộ",
    6: "Chỉ dẫn phải",
    7: "Chỉ dẫn trái",
    8: "Thông tin dừng",
    9: "Thông tin đỗ xe",
}

# Database Config
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
