// Smith Visuals — Paket-Modal: oeffnen/schliessen + Uebergabe ans Kontaktformular.

(function () {
  var modal = document.getElementById('paket-modal');
  if (!modal) return;

  var openTriggers = document.querySelectorAll('[data-open-paket-modal]');
  var closeTriggers = modal.querySelectorAll('[data-modal-close]');
  var paketButtons = modal.querySelectorAll('.paket-card__cta');
  var lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.setAttribute('data-open', '');
    modal.removeAttribute('aria-hidden');
    modal.removeAttribute('inert');
    document.body.classList.add('paket-modal-open');
    var closeBtn = modal.querySelector('.paket-modal__close');
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function closeModal() {
    modal.removeAttribute('data-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('inert', '');
    document.body.classList.remove('paket-modal-open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeModal();
  }

  openTriggers.forEach(function (btn) {
    btn.addEventListener('click', openModal);
  });

  closeTriggers.forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  paketButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var paket = btn.dataset.paket;
      var label = btn.dataset.paketLabel || '';
      closeModal();

      var select = document.getElementById('kontakt-paket');
      if (select && paket) {
        select.value = paket;
      }

      var kontakt = document.getElementById('kontakt');
      if (kontakt) {
        kontakt.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      }

      var nameField = document.getElementById('kontakt-name');
      if (nameField) {
        window.setTimeout(function () { nameField.focus(); }, 400);
      }
    });
  });
})();
