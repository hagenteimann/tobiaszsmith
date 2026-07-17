// Smith Visuals — Hero-Hintergrundtext: tippt nacheinander konkrete
// Kaufanlaesse (Category Entry Points) ein, sehr dezent im Hintergrund.

(function () {
  var target = document.getElementById('hero-bg-type-text');
  if (!target) return;

  var phrases = [
    'Hochzeit steht an.',
    'Produktlaunch nächste Woche.',
    'Brauche laufend Social-Content.',
    'Neue Website braucht Bilder.',
    'Event soll festgehalten werden.'
  ];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    target.textContent = phrases[0];
    return;
  }

  var TYPE_SPEED = 55;
  var DELETE_SPEED = 30;
  var HOLD_MS = 1800;
  var NEXT_DELAY = 300;

  var phraseIndex = 0;
  var charIndex = 0;

  function type() {
    var phrase = phrases[phraseIndex];
    if (charIndex < phrase.length) {
      charIndex++;
      target.textContent = phrase.slice(0, charIndex);
      setTimeout(type, TYPE_SPEED);
    } else {
      setTimeout(erase, HOLD_MS);
    }
  }

  function erase() {
    var phrase = phrases[phraseIndex];
    if (charIndex > 0) {
      charIndex--;
      target.textContent = phrase.slice(0, charIndex);
      setTimeout(erase, DELETE_SPEED);
    } else {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, NEXT_DELAY);
    }
  }

  type();
})();
