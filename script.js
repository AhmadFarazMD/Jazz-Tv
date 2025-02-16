const video = document.getElementById('video-player');
const loader = document.querySelector('.loader');
const errorMsg = document.getElementById('error-msg');
const streamUrl = 'https://cdn11lhr.tamashaweb.com:8087/YlUHeDQb7a/champions-abr/live/champions-abr_360p/chunks.m3u8';
let hlsInstance = null;

function initPlayer() {
    loader.style.display = 'block';
    errorMsg.style.display = 'none';
    
    if (Hls.isSupported()) {
        if (hlsInstance) {
            hlsInstance.destroy();
        }

        hlsInstance = new Hls({
            debug: true,
            autoStartLoad: true,
            startLevel: 0,
            maxLoadingDelay: 4,
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
            manifestLoadingTimeOut: 10000,
            manifestLoadingMaxRetry: 5,
            levelLoadingTimeOut: 10000,
            levelLoadingMaxRetry: 4,
            fragLoadingTimeOut: 20000,
            fragLoadingMaxRetry: 6,
            xhrSetup: function(xhr, url) {
                xhr.withCredentials = false; // Try with false first
                xhr.setRequestHeader('Origin', window.location.origin);
                xhr.setRequestHeader('Referer', window.location.href);
            }
        });
        
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
        
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function() {
            loader.style.display = 'none';
            video.play().catch(error => {
                console.error('Playback error:', error);
                showError('Click to play the video');
            });
        });
        
        hlsInstance.on(Hls.Events.ERROR, function(event, data) {
            console.error('HLS Error:', data);
            if (data.fatal) {
                switch(data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        showError('Network error, retrying...');
                        hlsInstance.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        showError('Media error, recovering...');
                        hlsInstance.recoverMediaError();
                        break;
                    default:
                        showError('Stream error. Click to retry');
                        break;
                }
            }
        });
        
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', function() {
            loader.style.display = 'none';
            video.play().catch(error => {
                console.error('Safari playback error:', error);
                showError('Click to play the video');
            });
        });
        
        video.addEventListener('error', function(e) {
            console.error('Video Error:', video.error);
            showError('Error loading stream. Click to retry.');
        });
    } else {
        showError('Your browser does not support HLS playback');
    }
}

function showError(message) {
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    loader.style.display = 'none';
}

// Initialize player on page load
window.addEventListener('load', initPlayer);

// Add retry functionality
errorMsg.addEventListener('click', function() {
    initPlayer();
});

// Add automatic retry every 30 seconds if there's an error
setInterval(function() {
    if (errorMsg.style.display === 'block') {
        initPlayer();
    }
}, 30000);
