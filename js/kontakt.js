// Smith Visuals — Kontaktformular
// Kein Backend angebunden: Submit wird abgefangen, HTML5-Validierung
// bleibt (via reportValidity) aktiv, danach nur clientseitiges Feedback.
// TODO Backend-Anbindung: echten Versand (fetch/POST an Endpoint) ergaenzen,
// sobald ein Formular-Endpoint (z. B. serverless Function, Mailservice) steht.

(function () {
  const form = document.querySelector('[data-form="kontakt"]');
  if (!form) return;

  const feedback = form.querySelector('.kontakt__feedback');
  const submitBtn = form.querySelector('.kontakt__submit');

  function showFeedback(state, message) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.dataset.state = state;
    feedback.hidden = false;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // form hat novalidate, daher hier manuell pruefen — reportValidity()
    // nutzt weiterhin die native HTML5-Validierung (required, type=email, ...)
    // inkl. der gewohnten Browser-Sprechblasen.
    if (!form.checkValidity()) {
      form.reportValidity();
      showFeedback('error', 'Bitte fülle alle Pflichtfelder (*) korrekt aus.');
      return;
    }

    // Kein echter Versand vorhanden — Platzhalter-Erfolgsmeldung.
    showFeedback('success', 'Danke! Deine Anfrage wurde erfasst. Wir melden uns in Kürze bei dir.');

    if (submitBtn) {
      submitBtn.disabled = true;
      window.setTimeout(function () {
        submitBtn.disabled = false;
      }, 1500);
    }

    form.reset();
  });
})();
