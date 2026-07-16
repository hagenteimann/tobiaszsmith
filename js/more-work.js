// Smith Visuals — More Work Foto-Mappen
// Touch/Tastatur-Toggle für alle Mappen-Instanzen unabhängig voneinander
// (Hover erledigt der Desktop-Fall bereits rein per CSS).

(function () {
  var folders = document.querySelectorAll('.mw-folder');

  folders.forEach(function (folder) {
    function toggle() {
      var open = folder.classList.toggle('is-open');
      folder.setAttribute('aria-pressed', String(open));
    }

    folder.addEventListener('click', toggle);
    folder.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
})();
