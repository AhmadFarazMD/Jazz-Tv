// Initialize the video player
const player = videojs('my-video');

// Show loading animation while buffering
player.on('waiting', () => {
  document.querySelector('.loading-animation').style.display = 'block';
});

// Hide loading animation when video is playing
player.on('playing', () => {
  document.querySelector('.loading-animation').style.display = 'none';
});

// Optional: Add more event listeners for custom functionality
player.on('play', () => {
  console.log('Video is playing');
});

player.on('pause', () => {
  console.log('Video is paused');
});

player.on('ended', () => {
  console.log('Video has ended');
});

// CTA Button Click Event
document.querySelector('.cta-button').addEventListener('click', () => {
  player.play();
  document.querySelector('.tv-overlay').style.display = 'none';
});