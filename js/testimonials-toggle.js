// Smith Visuals — Testimonials: "Mehr lesen" nur einblenden, wenn das
// Zitat tatsaechlich ueber die CSS-line-clamp-Grenze hinausgeht.

(function () {
  var cards = document.querySelectorAll('.testimonials__card');
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
})();
