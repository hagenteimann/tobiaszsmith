(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  function startObserving() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  // Der Preloader liegt als opakes Vollbild-Overlay über der Seite. Elemente,
  // die schon im ersten Viewport liegen (z. B. die Hero-Wortmarke), würden
  // sonst ihren Einflug-Effekt komplett HINTER dem Preloader abspielen und
  // fertig sein, bevor er verschwindet — man sähe nie eine Bewegung. Existiert
  // ein Preloader, wird deshalb erst nach dessen "preloader:hidden"-Event
  // (js/preloader.js) zu beobachten begonnen.
  var preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('preloader:hidden', startObserving, { once: true });
  } else {
    startObserving();
  }
})();
