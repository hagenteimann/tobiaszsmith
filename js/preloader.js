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

  // Timings
  const START_DELAY = 600; // wait before moving icon
  const TYPE_SPEED = 70; // ms per character
  const DOTS_SPEED = 300; // ms per dot
  const HOLD_END = 800; // hold before hiding preloader

  // Sequence:
  // 1. Icon is large in center (via CSS). Wait.
  // 2. Icon scales down and moves left (CSS transition).
  // 3. Type "SMITH ".
  // 4. Type "VISUALS".
  // 5. Type "..."
  // 6. Fade out preloader.

  setTimeout(() => {
    // 2. Move icon left (scale down)
    icon.classList.add("is-moved");

    // Wait for icon transition to mostly finish before typing
    setTimeout(typeSmith, 600);
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
      finishPreloader();
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
      }, 800);
    }, HOLD_END);
  }
});
