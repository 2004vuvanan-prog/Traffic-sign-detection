from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import cv2
import numpy as np
import io
from PIL import Image
from models.detector import get_detector

router = APIRouter()

@router.post("/detect/image")
async def detect_image(file: UploadFile = File(...)):
    """
    Detect traffic signs in uploaded image
    """
    try:
        # Read image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image")
        
        # Detect
        detector = get_detector()
        detections = detector.detect(image)
        
        return {
            "status": "success",
            "detections": detections,
            "image_shape": list(image.shape)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/detect/video")
async def detect_video(file: UploadFile = File(...)):
    """
    Detect traffic signs in uploaded video
    """
    try:
        # Save video temporarily
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name
        
        try:
            # Open video
            cap = cv2.VideoCapture(tmp_path)
            if not cap.isOpened():
                raise HTTPException(status_code=400, detail="Invalid video")
            
            # Get video properties
            fps = cap.get(cv2.CAP_PROP_FPS)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # Create output video
            import tempfile
            output_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
            output_path = output_tmp.name
            output_tmp.close()
            
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
            # Process frames
            detector = get_detector()
            all_detections = []
            frame_count = 0
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Detect
                detections = detector.detect(frame)
                all_detections.extend(detections)
                
                # Draw detections
                for det in detections:
                    x = int(det['x'])
                    y = int(det['y'])
                    w = int(det['width'])
                    h = int(det['height'])
                    conf = det['confidence']
                    label = det['label']
                    
                    # Draw box
                    cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                    
                    # Draw label
                    text = f"{label} {conf:.2f}"
                    cv2.putText(frame, text, (x, y - 10),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
                out.write(frame)
                frame_count += 1
            
            cap.release()
            out.release()
            
            # Return result with file path (in production, use proper file serving)
            return {
                "status": "success",
                "detections": all_detections,
                "video_url": f"/video/{os.path.basename(output_path)}",
                "frames_processed": frame_count
            }
        
        finally:
            # Cleanup
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
