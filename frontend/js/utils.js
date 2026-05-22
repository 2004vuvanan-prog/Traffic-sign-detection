// Utility Functions

/**
 * Show loading spinner
 */
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

/**
 * Show notification
 * @param {string} message
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {number} duration - milliseconds
 */
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

/**
 * Format bytes to human readable
 * @param {number} bytes
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Draw bounding boxes on canvas
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement|HTMLVideoElement} media
 * @param {Array} detections - Array of {x, y, width, height, label, confidence}
 */
function drawDetections(canvas, media, detections) {
    const ctx = canvas.getContext('2d');
    canvas.width = media.width || media.videoWidth || media.offsetWidth;
    canvas.height = media.height || media.videoHeight || media.offsetHeight;

    // Draw media
    ctx.drawImage(media, 0, 0, canvas.width, canvas.height);

    // Draw detections
    detections.forEach((detection, index) => {
        const { x, y, width, height, label, confidence } = detection;

        // Random color for each detection
        const hue = (index * 60) % 360;
        const color = `hsl(${hue}, 100%, 50%)`;

        // Draw box
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw label background
        const text = `${label} (${(confidence * 100).toFixed(1)}%)`;
        const textMetrics = ctx.measureText(text);
        const textHeight = 20;
        const textPadding = 5;

        ctx.fillStyle = color;
        ctx.fillRect(
            x,
            y - textHeight - textPadding,
            textMetrics.width + textPadding * 2,
            textHeight + textPadding * 2
        );

        // Draw text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textBaseline = 'top';
        ctx.fillText(text, x + textPadding, y - textHeight);
    });
}

/**
 * Convert canvas to blob
 * @param {HTMLCanvasElement} canvas
 */
function canvasToBlob(canvas) {
    return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
    });
}

/**
 * Download file
 * @param {Blob} blob
 * @param {string} filename
 */
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Format detection stats
 * @param {Array} detections
 */
function formatDetectionStats(detections) {
    const stats = [];
    const labels = {};

    detections.forEach(det => {
        labels[det.label] = (labels[det.label] || 0) + 1;
    });

    const totalConfidence = detections.reduce((sum, det) => sum + det.confidence, 0);
    const avgConfidence = detections.length > 0 ? totalConfidence / detections.length : 0;

    stats.push({
        label: 'Tổng biển báo',
        value: detections.length
    });

    stats.push({
        label: 'Độ tin cậy trung bình',
        value: (avgConfidence * 100).toFixed(1) + '%'
    });

    for (const [label, count] of Object.entries(labels)) {
        stats.push({
            label: `${label}`,
            value: count
        });
    }

    return stats;
}

/**
 * Render stats
 * @param {Array} stats
 * @param {HTMLElement} container
 */
function renderStats(stats, container) {
    if (!container) return;

    container.innerHTML = '';
    stats.forEach(stat => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.innerHTML = `
            <span class="stat-label">${stat.label}</span>
            <span class="stat-badge">${stat.value}</span>
        `;
        container.appendChild(statItem);
    });
}

/**
 * Toggle theme
 */
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    }
}

/**
 * Initialize theme from localStorage
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if ((savedTheme === 'dark' || (!savedTheme && prefersDark)) && !document.body.classList.contains('dark-theme')) {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').textContent = '☀️';
    }
}

/**
 * API call wrapper
 * @param {string} endpoint
 * @param {object} options
 */
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const mergedOptions = { ...defaultOptions, ...options };
    const apiBase = options.apiBase || 'http://localhost:8000/api';

    try {
        const response = await fetch(`${apiBase}${endpoint}`, mergedOptions);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

/**
 * Upload file to API
 * @param {File} file
 * @param {string} endpoint
 */
async function uploadFile(file, endpoint) {
    const formData = new FormData();
    formData.append('file', file);

    const apiBase = 'http://localhost:8000/api';

    try {
        const response = await fetch(`${apiBase}${endpoint}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Upload Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initializeTheme);