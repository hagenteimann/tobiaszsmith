// Smith Visuals — Video-Lazy-Load & Interaktion
// Videos außerhalb der Foto-Mappen (Portfolio-Grid, Divider, Projektseiten):
// `data-src` wird erst zu `src`, wenn das Video in den Viewport scrollt
// (IntersectionObserver), UND es pausiert wieder, sobald es rausscrollt —
// so lädt/läuft nie mehr als das, was der Besucher gerade sieht.
// (Foto-Mappen-Videos werden separat von js/more-work.js gesteuert.)

document.addEventListener('DOMContentLoaded', () => {
  const videos = [...document.querySelectorAll('video[data-src]')].filter(v => !v.closest('.mw-folder'));
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  if (!videos.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        if (!video.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin: '200px 0px' });

  videos.forEach(video => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    io.observe(video);

    // Interaktion (Hover/Tap zum Entstummen) — nur relevant außerhalb
    // der Foto-Mappen, wo Videos sichtbar & interaktiv im Grid liegen.
    const interactionTarget = video.closest('a') || video.parentElement;

    if (!isTouchDevice) {
      interactionTarget.addEventListener('mouseenter', () => { video.muted = false; });
      interactionTarget.addEventListener('mouseleave', () => { video.muted = true; });
    } else {
      interactionTarget.addEventListener('click', (e) => {
        const link = interactionTarget.tagName.toLowerCase() === 'a' ? interactionTarget : interactionTarget.closest('a');
        if (video.muted) {
          if (link) e.preventDefault();
          videos.forEach(v => { if (v !== video) v.muted = true; });
          video.muted = false;
        } else {
          if (link) e.preventDefault();
          video.muted = true;
        }
      });
    }
  });
});
