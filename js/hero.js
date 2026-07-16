// Smith Visuals — Hero-Parallax
// Die Foto-Ebene (Ghost + scharfe Kopie) hinkt beim Scrollen leicht hinter
// der Wortmarke her — klassischer Tiefeneffekt. BEIDE Fotos lesen dieselbe
// CSS-Variable --hero-parallax-y (gesetzt hier), daher bewegen sie sich
// immer exakt synchron, nie relativ zueinander.

(function () {
  var hero = document.getElementById('hero');
  if (!hero) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var PARALLAX_FACTOR = 0.18;
  var active = false;
  var ticking = false;

  function update() {
    ticking = false;
    if (!active) return;
    var rect = hero.getBoundingClientRect();
    var progress = Math.max(0, -rect.top);
    var offset = Math.min(progress * PARALLAX_FACTOR, rect.height * PARALLAX_FACTOR);
    hero.style.setProperty('--hero-parallax-y', offset.toFixed(1) + 'px');
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  // Nur aktiv rechnen, solange der Hero überhaupt in Sichtweite ist
  // (der Rest der Seite ist lang — unnötige Scroll-Arbeit vermeiden).
  var io = new IntersectionObserver(function (entries) {
    active = entries[0].isIntersecting;
    if (active) onScroll();
  }, { rootMargin: '50% 0px' });
  io.observe(hero);

  window.addEventListener('scroll', onScroll, { passive: true });
})();
