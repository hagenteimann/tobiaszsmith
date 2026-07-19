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
      if (folder.dataset.justSwiped) { e.preventDefault(); return; } // Swipe soll nicht als Navigation zählen
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

  // --- Wisch-Slider (.mw-folder--slider): mehr Fotos als Plätze im Fächer.
  // Ein Swipe schließt kurz den Fächer (bestehende Collapse-Animation),
  // tauscht dann die 3 Fotos gegen das nächste/vorherige Trio aus dem
  // data-images-Array und öffnet den Fächer erneut -- exakt dieselbe
  // Fächer-Animation wie beim Hover/Tap-Öffnen, nur mit neuem Bildinhalt.
  document.querySelectorAll('.mw-folder--slider').forEach(function (folder) {
    var images;
    try { images = JSON.parse(folder.dataset.images || '[]'); } catch (err) { images = []; }
    if (images.length < 3) return;

    var index = 0;
    var imgs = folder.querySelectorAll('.mw-photo img');
    var tracking = false, startX = 0, dx = 0;

    function render() {
      imgs[0].src = images[index % images.length];
      imgs[1].src = images[(index + 1) % images.length];
      imgs[2].src = images[(index + 2) % images.length];
    }

    function cycle(direction) {
      if (folder.dataset.cycling) return;
      folder.dataset.cycling = '1';
      folder.classList.remove('is-open', 'pulse-white');
      setTimeout(function () {
        index = (index + direction + images.length) % images.length;
        render();
        folder.classList.add('is-open', 'pulse-white');
        delete folder.dataset.cycling;
      }, 700); // entspricht --dur-slow, damit der Fächer erst vollständig einklappt
    }

    folder.addEventListener('pointerdown', function (e) {
      if (!folder.classList.contains('is-open')) return;
      tracking = true;
      startX = e.clientX;
      dx = 0;
    });
    folder.addEventListener('pointermove', function (e) {
      if (!tracking) return;
      dx = e.clientX - startX;
    });
    folder.addEventListener('pointerup', function () {
      if (!tracking) return;
      tracking = false;
      if (Math.abs(dx) > 24) {
        folder.dataset.justSwiped = '1';
        cycle(dx < 0 ? 1 : -1);
        setTimeout(function () { delete folder.dataset.justSwiped; }, 0);
      }
    });
  });
})();
