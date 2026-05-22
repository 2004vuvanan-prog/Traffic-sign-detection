import torch
import cv2
import numpy as np
from ultralytics import YOLO
from config import MODEL_PATH, CONFIDENCE_THRESHOLD, IOU_THRESHOLD, TRAFFIC_SIGN_CLASSES
from typing import List, Dict

class TrafficSignDetector:
    def __init__(self, model_path: str = MODEL_PATH):
        """
        Initialize the detector with YOLO model
        """
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"Using device: {self.device}")
        
        try:
            self.model = YOLO(model_path)
            self.model.to(self.device)
        except Exception as e:
            print(f"Warning: Could not load model from {model_path}")
            print(f"Error: {e}")
            print("Using pretrained YOLOv8n instead")
            self.model = YOLO('yolov8n.pt')
            self.model.to(self.device)
    
    def detect(self, image: np.ndarray) -> List[Dict]:
        """
        Detect traffic signs in image
        Returns: List of detections with bounding boxes
        """
        results = self.model(
            image,
            conf=CONFIDENCE_THRESHOLD,
            iou=IOU_THRESHOLD,
            verbose=False
        )
        
        detections = []
        for result in results:
            for box in result.boxes:
                detection = {
                    'x': float(box.xyxy[0][0]),
                    'y': float(box.xyxy[0][1]),
                    'width': float(box.xyxy[0][2] - box.xyxy[0][0]),
                    'height': float(box.xyxy[0][3] - box.xyxy[0][1]),
                    'confidence': float(box.conf[0]),
                    'label': TRAFFIC_SIGN_CLASSES.get(int(box.cls[0]), 'Unknown')
                }
                detections.append(detection)
        
        return detections
    
    def detect_batch(self, images: List[np.ndarray]) -> List[List[Dict]]:
        """
        Detect traffic signs in multiple images
        """
        all_detections = []
        for image in images:
            detections = self.detect(image)
            all_detections.append(detections)
        return all_detections

# Create global detector instance
detector = None

def get_detector():
    global detector
    if detector is None:
        detector = TrafficSignDetector()
    return detector
