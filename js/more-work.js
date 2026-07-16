// Smith Visuals — More Work Foto-Mappen
// .mw-folder ist ein echter <a href="projekt-...html">-Link.
// 1) Auf Desktop (Maus, breiter Viewport) öffnet Hover rein per CSS die
//    Fächer-Ansicht — ein Klick navigiert sofort normal weiter.
// 2) Auf Mobile/Touch (oder schmalem Viewport) soll der ERSTE Tap nur die
//    Vorschau zeigen (Fächer + Video), NICHT sofort navigieren — erst ein
//    zweiter Tap auf die bereits geöffnete Mappe lässt den Link greifen.
// 3) Videos laden/spielen ERST beim tatsächlichen Öffnen (Hover/Tap/Fokus),
//    nicht beim Seitenaufruf — `data-src` wird erst dann zu `src`.

(function () {
  var folders = document.querySelectorAll('.mw-folder');
  var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  function setOpen(folder, open) {
    folder.classList.toggle('is-open', open);
    folder.classList.toggle('pulse-white', open);
    folder.setAttribute('aria-pressed', String(open));
    var videos = folder.querySelectorAll('video[data-src]');
    videos.forEach(function (v) {
      if (open) {
        if (!v.src) v.src = v.dataset.src;
        v.play().catch(function () {});
      } else {
        v.pause();
      }
    });
  }

  folders.forEach(function (folder) {
    // Mobile-taugliche Breakpoint-Prüfung zur Klickzeit (nicht beim Laden
    // gecacht), damit Rotation/Resize korrekt behandelt wird.
    folder.addEventListener('click', function (e) {
      var mobileLike = isTouch || window.innerWidth <= 1024;
      if (mobileLike && !folder.classList.contains('is-open')) {
        e.preventDefault(); // Erster Tap: nur öffnen, noch nicht navigieren
        document.querySelectorAll('.more-work .mw-folder.is-open').forEach(function (f) {
          if (f !== folder) setOpen(f, false);
        });
        setOpen(folder, true);
      }
      // Sonst (Desktop-Klick oder bereits offene Mappe auf Mobile): normal navigieren.
    });

    // Desktop-Hover öffnet rein per CSS — hier zusätzlich die Videos ansteuern.
    folder.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') setOpen(folder, true);
    });
    folder.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse') setOpen(folder, false);
    });
    folder.addEventListener('focus', function () { setOpen(folder, true); });
    folder.addEventListener('blur', function () { setOpen(folder, false); });
  });
})();
