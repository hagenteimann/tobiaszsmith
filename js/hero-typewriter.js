// Smith Visuals — Hero-Hintergrundtext: zwei unabhaengige, statische
// Ecken (oben rechts / unten links) tippen jeweils ihre eigene Phrasen-
// Liste ein -- unterschiedliche Kaufanlaesse fuer unterschiedliche ICPs,
// nicht dieselbe Liste doppelt.

(function () {
  var targetA = document.getElementById('hero-bg-type-a'); // oben rechts
  var targetB = document.getElementById('hero-bg-type-b'); // unten links
  if (!targetA || !targetB) return;

  // Oben rechts: eher private/einmalige Anlaesse.
  var phrasesA = [
    'Feier braucht Erinnerungen.',
    'Marke braucht neuen Auftritt.',
    'Kampagne startet nächsten Monat.',
    'Messe steht vor der Tür.',
    'Investoren brauchen ein starkes Video.'
  ];

  // Unten links: eher gewerbliche/laufende Anlaesse.
  var phrasesB = [
    'Produktlaunch nächste Woche.',
    'Brauche laufend Social-Content.',
    'Neue Website braucht Bilder.'
  ];

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    targetA.textContent = phrasesA[0];
    targetB.textContent = phrasesB[0];
    return;
  }

  function runLoop(target, phrases) {
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
  }

  // Leichter Versatz beim Start, damit beide Ecken nicht synchron im
  // Gleichschritt tippen/loeschen, sondern unabhaengig wirken.
  runLoop(targetA, phrasesA);
  setTimeout(function () { runLoop(targetB, phrasesB); }, 900);
})();
