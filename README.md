# 🚦 Traffic Sign Detection - Ứng dụng Phát hiện Biển báo Giao thông

Ứng dụng web sử dụng Deep Learning (YOLO v8) để phát hiện và phân loại biển báo giao thông từ video, ảnh và webcam real-time.

## 📋 Mục tiêu Dự án

- ✅ Phát hiện vị trí biển báo trong video/ảnh (Object Detection)
- ✅ Phân loại loại biển báo (cấm, nguy hiểm, chỉ dẫn, hiệu lệnh)
- ✅ Hiển thị kết quả real-time (Bounding box + tên biển)
- ✅ Hỗ trợ xử lý: ảnh tĩnh, video, webcam
- ✅ Độ chính xác ≥ 80%
- ✅ Responsive design (Web & Mobile)

## 🏗️ Cấu trúc Dự án

```
Traffic-sign-detection/
├── frontend/                 # Web Interface
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── app.js
│   │   ├── detection.js
│   │   └── utils.js
│   └── assets/
│       └── icons/
│
├── backend/                  # Python Backend (FastAPI)
│   ├── app.py
│   ├── config.py
│   ├── models/
│   │   ├── detector.py
│   │   └── __init__.py
│   ├── routes/
│   │   ├── detection.py
│   │   └── upload.py
│   ├── utils/
│   │   ├── video_processor.py
│   │   └── image_processor.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── training/                 # Model Training
│   ├── train.py
│   ├── dataset_loader.py
│   ├── config/
│   │   └── dataset.yaml
│   ├── dataset/
│   │   ├── images/
│   │   │   ├── train/
│   │   │   ├── val/
│   │   │   └── test/
│   │   └── labels/
│   │       ├── train/
│   │       ├── val/
│   │       └── test/
│   └── models/
│
├── docs/
│   ├── README.md
│   ├── SETUP.md
│   ├── TRAINING.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml
├── .gitignore
└── requirements.txt
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend sẽ chạy tại: `http://localhost:8000`

### 2. Frontend Setup

```bash
# Mở file frontend/index.html trong browser
# Hoặc sử dụng live server
python -m http.server 5500
```

Frontend sẽ chạy tại: `http://localhost:5500`

### 3. Với Docker

```bash
docker-compose up --build
```

## 📊 Dataset

### Các loại biển báo được phát hiện:
- **Biển cấm** (Prohibitory): Cấm vào, cấm chuyển hướng...
- **Biển nguy hiểm** (Warning): Cảnh báo nguy hiểm, giao lộ...
- **Biển chỉ dẫn** (Mandatory): Phải đi, phải rẽ...
- **Biển thông tin** (Information): Hướng dẫn, dừng, đỗ...

### Dataset công khai có thể sử dụng:
- [GTSRB - German Traffic Sign Recognition Benchmark](http://benchmark.ini.rub.de/)
- [Belgian Traffic Signs Dataset](https://btsd.ethz.ch/)
- [LISN Traffic Sign Dataset](https://www.kaggle.com/datasets/meowmeowmeow/gtsrb-german-traffic-sign)

Xem chi tiết: [TRAINING.md](docs/TRAINING.md)

## 🤖 Model

- **Framework**: YOLOv8 (Ultralytics)
- **Input Size**: 640x640
- **Confidence Threshold**: 0.5
- **IOU Threshold**: 0.45

## 🎯 Độ Chính xác

Target: **≥ 80%** trên test set

Metrics:
- mAP@0.5: Precision trên IoU=0.5
- Precision & Recall: Cho từng class
- F1-Score: Đánh giá cân bằng

## 📱 Features

### Frontend
- ✅ Upload ảnh/video
- ✅ Real-time webcam detection
- ✅ Hiển thị bounding boxes và confidence scores
- ✅ Download kết quả
- ✅ Responsive design
- ✅ Dark/Light theme

### Backend
- ✅ REST API
- ✅ Xử lý video stream
- ✅ Model inference
- ✅ Database lưu kết quả

## 🔧 Công nghệ Sử dụng

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- WebRTC (Webcam)
- Canvas API (Vẽ bounding box)

### Backend
- Python 3.9+
- FastAPI (Web framework)
- YOLOv8 (Object detection)
- OpenCV (Image/Video processing)
- SQLAlchemy (Database ORM)
- Uvicorn (ASGI server)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)

## 📖 Hướng dẫn Chi tiết

1. [Setup Hướng dẫn](docs/SETUP.md)
2. [Training Model](docs/TRAINING.md)
3. [API Documentation](docs/API.md)
4. [Deployment](docs/DEPLOYMENT.md)

## 📝 Cách Sử dụng

### Phát hiện từ Ảnh
1. Mở ứng dụng web
2. Click "Upload Image"
3. Chọn ảnh chứa biển báo
4. Kết quả sẽ hiển thị với bounding boxes

### Phát hiện từ Video
1. Click "Upload Video"
2. Chọn file video
3. Chờ xử lý (hiển thị progress bar)
4. Download video kết quả

### Real-time Detection (Webcam)
1. Click "Start Webcam"
2. Cho phép quyền truy cập camera
3. Phát hiện real-time hiển thị ngay

## 🛠️ Troubleshooting

Xem file [SETUP.md](docs/SETUP.md#troubleshooting)

## 👥 Tác giả

- **Sinh viên**: Vũ Văn Ấn
- **Đề tài**: Ứng dụng mô hình học sâu trong phát hiện biển báo giao thông

## 📄 License

MIT License - Xem file LICENSE

## 📞 Liên hệ

Để có thêm thông tin, vui lòng tạo issue hoặc liên hệ.

---

**Happy Coding! 🚀**