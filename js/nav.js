// Smith Visuals — Navigation
// 1) Scroll-Zustand (dezentes Verdunkeln/Schatten)
// 2) Mobiles Menü: Toggle, Escape, Klick auf Scrim — Tab-Reihenfolge via [inert]

(function () {
  var nav = document.getElementById('site-nav');
  var toggle = document.getElementById('nav-toggle');
  var mobile = document.getElementById('nav-mobile');
  var scrim = document.getElementById('nav-scrim');
  if (!nav || !toggle || !mobile || !scrim) return;

  // --- Nav-Höhe messen (für Hero: 100svh - Nav, echtes Viewport-Fuellen) ---
  var navHeightRO = new ResizeObserver(function () {
    document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
  });
  navHeightRO.observe(nav);

  // --- Scroll-Zustand --------------------------------------------------
  var SCROLL_THRESHOLD = 8;
  var ticking = false;

  function updateScrollState() {
    nav.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollState);
      ticking = true;
    }
  }, { passive: true });

  updateScrollState();

  // --- Mobiles Menü ------------------------------------------------------
  function openMenu() {
    mobile.removeAttribute('inert');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Menü schließen');
    document.body.style.overflow = 'hidden';
    // Ein Frame Pause, sonst startet die Transform-Transition nicht sauber
    // (Element wechselt sonst im selben Paint von display:none zu offen).
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        mobile.dataset.state = 'open';
      });
    });
  }

  function closeMenu(returnFocus) {
    mobile.dataset.state = 'closed';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Menü öffnen');
    document.body.style.overflow = '';
    // inert erst nach der Ausblend-Transition setzen, sonst springt es sichtbar weg
    window.setTimeout(function () {
      if (mobile.dataset.state === 'closed') mobile.setAttribute('inert', '');
    }, 400);
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', function () {
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu(false);
    } else {
      openMenu();
    }
  });

  scrim.addEventListener('click', function () {
    closeMenu(true);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  // Klick auf einen Menü-Link schließt das Drawer (Sprungziel bleibt erhalten)
  mobile.querySelectorAll('a[href]').forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu(false);
    });
  });
})();
