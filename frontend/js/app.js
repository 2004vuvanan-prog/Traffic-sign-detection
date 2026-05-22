// Main Application

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeTheme();
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
        });
    });

    // Image handling
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageInput = document.getElementById('imageInput');

    imageUploadArea.addEventListener('click', () => imageInput.click());
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('dragover');
    });
    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('dragover');
    });
    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });

    // Video handling
    const videoUploadArea = document.getElementById('videoUploadArea');
    const videoInput = document.getElementById('videoInput');

    videoUploadArea.addEventListener('click', () => videoInput.click());
    videoUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        videoUploadArea.classList.add('dragover');
    });
    videoUploadArea.addEventListener('dragleave', () => {
        videoUploadArea.classList.remove('dragover');
    });
    videoUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        videoUploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleVideoUpload(e.dataTransfer.files[0]);
        }
    });

    videoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleVideoUpload(e.target.files[0]);
        }
    });

    // Video control buttons
    document.getElementById('videoDownloadBtn').addEventListener('click', () => {
        const videoResult = document.getElementById('videoResult');
        downloadFile(videoResult.src, `detection-${Date.now()}.mp4`);
    });

    // Webcam handling
    let webcamActive = false;

    document.getElementById('webcamStartBtn').addEventListener('click', () => {
        detectionHandler.startWebcam();
        webcamActive = true;
        detectionHandler.webcamDetectionRunning = true;
        document.getElementById('webcamStartBtn').classList.add('hidden');
        document.getElementById('webcamStopBtn').classList.remove('hidden');
        document.getElementById('webcamSnapshotBtn').classList.remove('hidden');
    });

    document.getElementById('webcamStopBtn').addEventListener('click', () => {
        detectionHandler.stopWebcam();
        webcamActive = false;
        document.getElementById('webcamStartBtn').classList.remove('hidden');
        document.getElementById('webcamStopBtn').classList.add('hidden');
        document.getElementById('webcamSnapshotBtn').classList.add('hidden');
        showNotification('Webcam đã dừng', 'info');
    });

    document.getElementById('webcamSnapshotBtn').addEventListener('click', () => {
        detectionHandler.captureWebcamSnapshot();
    });
}

/**
 * Switch between tabs
 */
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Deactivate all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Activate button
    event.target.classList.add('active');
}

/**
 * Handle image upload
 */
async function handleImageUpload(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
        showNotification('Vui lòng chọn một file ảnh', 'error');
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        showNotification('Ảnh quá lớn (tối đa 50MB)', 'error');
        return;
    }

    // Process image
    await detectionHandler.processImage(file);
}

/**
 * Handle video upload
 */
async function handleVideoUpload(file) {
    // Validate file
    if (!file.type.startsWith('video/')) {
        showNotification('Vui lòng chọn một file video', 'error');
        return;
    }

    if (file.size > 500 * 1024 * 1024) {
        showNotification('Video quá lớn (tối đa 500MB)', 'error');
        return;
    }

    // Process video
    await detectionHandler.processVideo(file);
}

// Prevent default drag-drop behavior
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => e.preventDefault());