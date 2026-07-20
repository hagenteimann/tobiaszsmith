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
        video.dataset.inView = '1';
        if (!video.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else {
        video.dataset.inView = '';
        video.pause();
      }
    });
  }, { rootMargin: '50px 0px' });

  videos.forEach(video => {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    io.observe(video);

    // Manche Browser pausieren ein bereits laufendes Video automatisch, sobald
    // es per Hover entstummt wird — die Autoplay-Policy erlaubt Ton-Wiedergabe
    // nur nach einer "echten" Nutzerinteraktion (Klick/Tap/Taste) irgendwo auf
    // der Seite; ein reines mouseenter zählt dafür nicht. Beim allerersten
    // Hover nach dem Laden bliebe das Video ohne diesen Resume-Handler dann
    // eingefroren stehen, statt weiterzulaufen. Wir versuchen erst erneut mit
    // Ton weiterzuspielen, fallen als letzte Instanz auf stummes Weiterlaufen
    // zurück — ein Video, das lautlos weiterläuft, ist immer besser als eins,
    // das komplett anhält.
    video.addEventListener('pause', () => {
      if (video.dataset.inView !== '1') return;
      video.play().catch(() => {
        if (!video.muted) {
          video.muted = true;
          video.play().catch(() => {});
        }
      });
    });

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
