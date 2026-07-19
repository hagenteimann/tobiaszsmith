// Smith Visuals — Kontaktformular
// Kein Backend angebunden: Submit wird abgefangen, HTML5-Validierung
// bleibt (via reportValidity) aktiv. Statt eines echten Versands oeffnet
// der Submit einen mailto:-Link an info@smithvisuals.de mit allen
// Formularangaben in Betreff/Body vorausgefuellt -- das oeffnet die
// Mail-App des Nutzers (Desktop-Mailclient oder Mobile-"Mail"-App).

(function () {
  const form = document.querySelector('[data-form="kontakt"]');
  if (!form) return;

  const feedback = form.querySelector('.kontakt__feedback');
  const submitBtn = form.querySelector('.kontakt__submit');
  const CONTACT_EMAIL = 'info@smithvisuals.de';

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

    const name = form.querySelector('#kontakt-name')?.value || '';
    const phone = form.querySelector('#kontakt-phone')?.value || '';
    const email = form.querySelector('#kontakt-email')?.value || '';
    const subject = form.querySelector('#kontakt-subject')?.value || '';

    const mailSubject = 'Anfrage über die Website: ' + subject;
    const mailBody =
      'Name: ' + name + '\n' +
      'Telefon: ' + phone + '\n' +
      'E-Mail: ' + email + '\n' +
      'Betreff: ' + subject + '\n';

    const mailtoUrl =
      'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent(mailSubject) +
      '&body=' + encodeURIComponent(mailBody);

    window.location.href = mailtoUrl;

    showFeedback('success', 'Deine Mail-App öffnet sich gleich mit allen Angaben, einfach abschicken.');

    if (submitBtn) {
      submitBtn.disabled = true;
      window.setTimeout(function () {
        submitBtn.disabled = false;
      }, 1500);
    }

    form.reset();
  });
})();
