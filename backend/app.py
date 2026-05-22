from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import os
from dotenv import load_dotenv
from routes import detection, upload

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Traffic Sign Detection API",
    description="API for detecting and classifying traffic signs",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(detection.router, prefix="/api", tags=["Detection"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Traffic Sign Detection API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
