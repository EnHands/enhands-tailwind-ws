// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  
  // Safety check: ensure elements exist before accessing properties
  if (progressBar && updatingBar) {
    updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
    if (event.detail.totalProgress === 1) {
      progressBar.classList.add('hide');
    } else {
      progressBar.classList.remove('hide');
      const prePrompt = event.target.querySelector('.center-pre-prompt');
      if (event.detail.totalProgress === 0 && prePrompt) {
        prePrompt.classList.add('hide');
      }
    }
  }
};

// Attach listener to ALL model-viewer elements, not just the first one
document.querySelectorAll('model-viewer').forEach(viewer => {
  viewer.addEventListener('progress', onProgress);
});

// Add a click event listener to the button
const donateButton = document.getElementById('donate-button');
if (donateButton) {
  donateButton.addEventListener('click', function (event) {
    // Prevent the default behavior of the anchor tag
    event.preventDefault();

    // Scroll to the target section smoothly
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
}
