/**
 * Preloader Sequence
 */
document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  const icon = preloader.querySelector(".preloader__icon");
  const smithEl = document.getElementById("preloader-smith");
  const visualsEl = document.getElementById("preloader-visuals");
  const dotsEl = document.getElementById("preloader-dots");

  // State
  const smithText = "SMITH ";
  const visualsText = "VISUALS";
  let smithIndex = 0;
  let visualsIndex = 0;
  let dotsCount = 0;
  let dotsCycle = 0;

  // Timings -- Gesamtsequenz bewusst auf < 2s gestrafft (siehe Summe unten)
  const START_DELAY = 100; // wait before moving icon
  const TYPE_SPEED = 30; // ms per character
  const DOTS_SPEED = 80; // ms per dot
  const DOTS_CYCLES = 2; // wie oft "..." komplett durchläuft, bevor die Seite kommt
  const DOTS_CYCLE_PAUSE = 80; // Pause zwischen den Durchläufen (Punkte geloescht -> naechster Zyklus)
  const HOLD_END = 150; // hold before hiding preloader
  const FADE_OUT_MS = 350; // muss zur CSS-Transition-Dauer von .preloader passen (styles/preloader.css)

  // Sequence:
  // 1. Icon is large in center (via CSS). Wait.
  // 2. Icon scales down and moves left (CSS transition).
  // 3. Type "SMITH ".
  // 4. Type "VISUALS".
  // 5. Type "..." -- DOTS_CYCLES Mal komplett durchlaufen (tippen, kurze Pause, löschen, erneut)
  // 6. Fade out preloader.

  setTimeout(() => {
    // 2. Move icon left (scale down)
    icon.classList.add("is-moved");

    // Wait for icon transition to mostly finish before typing
    setTimeout(typeSmith, 350);
  }, START_DELAY);

  function typeSmith() {
    if (smithIndex < smithText.length) {
      smithEl.textContent += smithText.charAt(smithIndex);
      smithIndex++;
      setTimeout(typeSmith, TYPE_SPEED);
    } else {
      typeVisuals();
    }
  }

  function typeVisuals() {
    if (visualsIndex < visualsText.length) {
      visualsEl.textContent += visualsText.charAt(visualsIndex);
      visualsIndex++;
      setTimeout(typeVisuals, TYPE_SPEED);
    } else {
      typeDots();
    }
  }

  function typeDots() {
    if (dotsCount < 3) {
      dotsEl.textContent += ".";
      dotsCount++;
      setTimeout(typeDots, DOTS_SPEED);
    } else {
      dotsCycle++;
      if (dotsCycle < DOTS_CYCLES) {
        setTimeout(() => {
          dotsEl.textContent = "";
          dotsCount = 0;
          typeDots();
        }, DOTS_CYCLE_PAUSE);
      } else {
        finishPreloader();
      }
    }
  }

  function finishPreloader() {
    setTimeout(() => {
      preloader.classList.add("is-hidden");
      // Signalisiert js/reveal.js, dass Inhalte, die schon im ersten Viewport
      // liegen (z. B. die Hero-Wortmarke), jetzt erst ihren Einflug-Effekt
      // starten sollen — sonst liefe die Animation komplett hinter dem
      // Preloader ab und wäre beim Verschwinden schon fertig.
      window.dispatchEvent(new CustomEvent("preloader:hidden"));
      // Remove from DOM after fade out
      setTimeout(() => {
        preloader.remove();
      }, FADE_OUT_MS);
    }, HOLD_END);
  }
});
