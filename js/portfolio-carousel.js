// Smith Visuals — Portfolio-Carousel: Pfeil-Buttons scrollen um je ein Item.
// Das eigentliche Swipe/Snap-Verhalten auf Touch-Geraeten ist reines CSS
// (scroll-snap-type auf .portfolio__grid) und braucht kein JS.

(function () {
  var track = document.querySelector('.portfolio__grid');
  var prevBtn = document.querySelector('.portfolio__nav--prev');
  var nextBtn = document.querySelector('.portfolio__nav--next');
  if (!track || !prevBtn || !nextBtn) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollByOneItem(direction) {
    var item = track.querySelector('.portfolio__item');
    if (!item) return;
    var trackStyle = getComputedStyle(track);
    var gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '0') || 0;
    var amount = item.getBoundingClientRect().width + gap;
    track.scrollBy({ left: amount * direction, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  prevBtn.addEventListener('click', function () { scrollByOneItem(-1); });
  nextBtn.addEventListener('click', function () { scrollByOneItem(1); });
})();
