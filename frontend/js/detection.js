// Detection Handler

class DetectionHandler {
    constructor() {
        this.apiBase = 'http://localhost:8000/api';
        this.currentDetections = [];
    }

    /**
     * Process image
     */
    async processImage(file) {
        showLoading();
        try {
            // Read image file
            const reader = new FileReader();
            const imagePromise = new Promise((resolve) => {
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });

            const image = await imagePromise;

            // Display preview
            document.getElementById('imagePreview').src = image.src;
            document.getElementById('imagePreviewContainer').classList.remove('hidden');

            // Send to backend
            const result = await this.detectImage(file);

            // Process result
            await this.displayImageResults(result, image);

            showNotification('Phát hiện hoàn tất!', 'success');
        } catch (error) {
            console.error('Image processing error:', error);
            showNotification('Lỗi xử lý ảnh: ' + error.message, 'error');
        } finally {
            hideLoading();
        }
    }

    /**
     * Detect objects in image
     */
    async detectImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.apiBase}/detect/image`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Detection failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Detection error:', error);
            throw error;
        }
    }

    /**
     * Display image detection results
     */
    async displayImageResults(result, image) {
        const canvas = document.getElementById('imageResultCanvas');
        const detections = result.detections || [];

        // Draw detections on canvas
        drawDetections(canvas, image, detections);

        // Display stats
        const stats = formatDetectionStats(detections);
        renderStats(stats, document.getElementById('imageStatsContainer'));

        this.currentDetections = detections;
    }

    /**
     * Process video
     */
    async processVideo(file) {
        showLoading();
        try {
            const processingContainer = document.getElementById('videoProcessingContainer');
            processingContainer.classList.remove('hidden');

            // Send to backend for processing
            const result = await this.detectVideo(file, (progress) => {
                this.updateVideoProgress(progress);
            });

            // Display result
            const resultContainer = document.getElementById('videoResultContainer');
            const videoResult = document.getElementById('videoResult');

            videoResult.src = result.video_url;
            resultContainer.classList.remove('hidden');

            // Display stats
            const stats = formatDetectionStats(result.detections || []);
            renderStats(stats, document.getElementById('videoStatsContainer'));

            showNotification('Xử lý video hoàn tất!', 'success');
        } catch (error) {
            console.error('Video processing error:', error);
            showNotification('Lỗi xử lý video: ' + error.message, 'error');
        } finally {
            hideLoading();
            document.getElementById('videoProcessingContainer').classList.add('hidden');
        }
    }

    /**
     * Detect objects in video
     */
    async detectVideo(file, progressCallback) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${this.apiBase}/detect/video`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Video detection failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Video detection error:', error);
            throw error;
        }
    }

    /**
     * Update video progress
     */
    updateVideoProgress(progress) {
        const progressBar = document.getElementById('videoProgress');
        const progressText = document.getElementById('videoProgressText');

        progressBar.style.width = progress + '%';
        progressText.textContent = `Đang xử lý: ${progress}%`;
    }

    /**
     * Start webcam detection
     */
    async startWebcam() {
        try {
            const video = document.getElementById('webcamVideo');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            video.srcObject = stream;
            video.play();

            // Start detection loop
            this.webcamDetectionLoop();

            showNotification('Webcam khởi động thành công', 'success');
        } catch (error) {
            console.error('Webcam error:', error);
            showNotification('Lỗi khởi động webcam: ' + error.message, 'error');
        }
    }

    /**
     * Stop webcam
     */
    stopWebcam() {
        const video = document.getElementById('webcamVideo');
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        this.webcamDetectionRunning = false;
    }

    /**
     * Webcam detection loop
     */
    webcamDetectionLoop = () => {
        if (!this.webcamDetectionRunning) return;

        const video = document.getElementById('webcamVideo');
        const canvas = document.getElementById('webcamCanvas');

        // Simple demo - in production, you would send frames to backend
        // For now, we'll just draw the video on canvas
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        // Continue loop
        requestAnimationFrame(this.webcamDetectionLoop.bind(this));
    }

    /**
     * Capture webcam snapshot
     */
    captureWebcamSnapshot() {
        const canvas = document.getElementById('webcamCanvas');
        canvas.toBlob((blob) => {
            downloadFile(blob, `snapshot-${Date.now()}.jpg`);
            showNotification('Ảnh chụp đã tải xuống', 'success');
        });
    }
}

// Create global instance
const detectionHandler = new DetectionHandler();