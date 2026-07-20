// Smith Visuals — Testimonials: "Mehr lesen" nur einblenden, wenn das
// Zitat tatsaechlich ueber die CSS-line-clamp-Grenze hinausgeht.

(function () {
  // Nur die sichtbare Track-Kopie verarbeiten -- die aria-hidden Duplikat-
  // Kopie (fuer den nahtlosen Loop) darf keine fokussierbaren "Mehr lesen"-
  // Buttons bekommen (ARIA: aria-hidden-Container mit fokussierbaren
  // Kindern ist ein Accessibility-Fehler).
  var cards = document.querySelectorAll('.testimonials__track:not([aria-hidden]) .testimonials__card');
  if (!cards.length) return;

  function setUp(card) {
    var text = card.querySelector('.testimonials__text');
    var toggle = card.querySelector('.testimonials__toggle');
    if (!text || !toggle) return;

    if (text.scrollHeight > text.clientHeight + 1) {
      toggle.hidden = false;
    } else {
      return;
    }

    toggle.addEventListener('click', function () {
      var expanded = card.classList.toggle('is-expanded');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.textContent = expanded ? 'Weniger anzeigen' : 'Mehr lesen';
    });
  }

  cards.forEach(setUp);

  // --- Auto-scrollender Marquee mit Interaktions-Pause -------------------
  // Laeuft kontinuierlich per requestAnimationFrame (scrollLeft), springt
  // nahtlos zurueck, sobald die erste (identische) Haelfte durchlaufen ist
  // -- dafuer existiert der zweite, aria-hidden Track als exaktes Duplikat.
  // Interaktion (Klick/Tap/Ziehen) pausiert sofort:
  //   - kurzes Antippen/Ziehen -> nach Loslassen 2s Pause, dann weiter
  //   - gehalten (pointerdown bleibt gedrueckt) -> bleibt pausiert UND
  //     laesst sich per Ziehen manuell verschieben, bis losgelassen wird
  var marquee = document.querySelector('.testimonials__marquee');
  if (!marquee) return;

  var track = marquee.querySelector('.testimonials__track');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SPEED = 40; // px/s
  var RESUME_DELAY = 2000; // ms nach Loslassen, bis der Lauf weitergeht

  var halfWidth = 0;
  function measure() {
    halfWidth = track.scrollWidth / 2;
  }
  measure();
  window.addEventListener('resize', measure);

  var paused = false;
  var resumeTimer = null;
  var isPointerDown = false;
  var dragMoved = false;
  var startX = 0;
  var startScrollLeft = 0;
  var lastFrameTime = null;

  function clearResumeTimer() {
    if (resumeTimer) {
      window.clearTimeout(resumeTimer);
      resumeTimer = null;
    }
  }

  function pause() {
    paused = true;
    clearResumeTimer();
  }

  function scheduleResume() {
    clearResumeTimer();
    resumeTimer = window.setTimeout(function () {
      paused = false;
      lastFrameTime = null;
      resumeTimer = null;
    }, RESUME_DELAY);
  }

  function tick(now) {
    if (!paused && !isPointerDown && !reduceMotion) {
      if (lastFrameTime !== null) {
        var dt = (now - lastFrameTime) / 1000;
        marquee.scrollLeft += SPEED * dt;
        if (halfWidth > 0 && marquee.scrollLeft >= halfWidth) {
          marquee.scrollLeft -= halfWidth;
        }
      }
      lastFrameTime = now;
    } else {
      lastFrameTime = null;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  marquee.addEventListener('pointerdown', function (e) {
    isPointerDown = true;
    dragMoved = false;
    pause();
    startX = e.clientX;
    startScrollLeft = marquee.scrollLeft;
    marquee.classList.add('is-dragging');
  });

  marquee.addEventListener('pointermove', function (e) {
    if (!isPointerDown) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 3) dragMoved = true;
    marquee.scrollLeft = startScrollLeft - dx;
  });

  function endDrag() {
    if (!isPointerDown) return;
    isPointerDown = false;
    marquee.classList.remove('is-dragging');
    // Nahtloser Sprung auch nach manuellem Ziehen, falls ueber die Haelfte
    // hinaus gezogen wurde.
    if (halfWidth > 0) {
      if (marquee.scrollLeft >= halfWidth) marquee.scrollLeft -= halfWidth;
      else if (marquee.scrollLeft < 0) marquee.scrollLeft += halfWidth;
    }
    scheduleResume();
  }

  marquee.addEventListener('pointerup', endDrag);
  marquee.addEventListener('pointercancel', endDrag);
  marquee.addEventListener('pointerleave', function () {
    if (isPointerDown) endDrag();
  });

  // Klick auf "Mehr lesen" o.ae. soll trotz Drag-Handling normal funktionieren --
  // nur einen echten Drag (Bewegung > 3px) als Grund fuer die Pause-Logik werten,
  // ein reiner Klick pausiert ueber pointerdown/-up ohnehin schon kurz.
  marquee.addEventListener('click', function (e) {
    if (dragMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
})();
