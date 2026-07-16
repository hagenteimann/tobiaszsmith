document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video');

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  videos.forEach(video => {
    // Ensure all videos play silently in background
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.play().catch(err => console.log('Autoplay prevented:', err));
    
    // Disable audio hover for "more-work" folder previews
    if (video.closest('.mw-folder')) {
      return;
    }

    // Attach listeners to the parent link or container so pseudo-elements don't block mouse events
    const interactionTarget = video.closest('a') || video.parentElement;

    if (!isTouchDevice) {
      // Desktop: Unmute on hover, mute on leave
      interactionTarget.addEventListener('mouseenter', () => {
        video.muted = false;
      });

      interactionTarget.addEventListener('mouseleave', () => {
        video.muted = true;
      });
    } else {
      // Mobile: Tap to toggle mute, prevent link navigation on first tap
      interactionTarget.addEventListener('click', (e) => {
        const link = interactionTarget.tagName.toLowerCase() === 'a' ? interactionTarget : interactionTarget.closest('a');
        
        if (video.muted) {
          if (link) e.preventDefault(); // Don't navigate, just unmute
          videos.forEach(v => {
            if (v !== video) v.muted = true;
          });
          video.muted = false;
        } else {
          // If already unmuted, tap again to mute.
          if (link) e.preventDefault();
          video.muted = true;
        }
      });
    }
  });
});
