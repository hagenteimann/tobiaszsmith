// Smith Visuals — Projekt-Showcase Snap-Scroll
// Markiert den Dot der aktuell sichtbaren Slide via IntersectionObserver
// (kein manuelles Scroll-Position-Rechnen noetig).

(function () {
  var track = document.querySelector('.project-showcase__track');
  if (!track) return;

  var slides = [...track.querySelectorAll('.project-showcase__slide')];
  var dots = [...document.querySelectorAll('.project-showcase__dot')];
  if (!slides.length || slides.length !== dots.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.intersectionRatio > 0.6) {
        var idx = slides.indexOf(entry.target);
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
      }
    });
  }, { root: track, threshold: [0.6] });

  slides.forEach(function (slide) { io.observe(slide); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      slides[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
  });

  // Pfeil-Buttons: scrollen um je eine Slide (gleiches Prinzip wie
  // js/portfolio-carousel.js, hier Slide-Breite statt Item-Breite).
  var prevBtn = document.querySelector('.project-showcase__nav--prev');
  var nextBtn = document.querySelector('.project-showcase__nav--next');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollByOneSlide(direction) {
    var amount = track.clientWidth * direction;
    track.scrollBy({ left: amount, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { scrollByOneSlide(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { scrollByOneSlide(1); });
})();
