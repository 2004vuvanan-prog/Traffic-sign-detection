import cv2
import numpy as np
from typing import List

def process_image(image_path: str) -> np.ndarray:
    """
    Load and preprocess image
    """
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Could not load image: {image_path}")
    return image

def process_batch_images(image_paths: List[str]) -> List[np.ndarray]:
    """
    Process multiple images
    """
    images = []
    for path in image_paths:
        image = process_image(path)
        images.append(image)
    return images
