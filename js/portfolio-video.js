// Smith Visuals — Herzensprojekt-Video: Klick-zum-Laden-Facade
// Erst der Klick auf den Play-Button erzeugt das echte YouTube-<iframe>
// (youtube-nocookie.com) — vorher wird nichts von YouTube nachgeladen.

(function () {
  var player = document.querySelector('.portfolio-video__player');
  if (!player) return;

  var playBtn = player.querySelector('.portfolio-video__play');
  var videoId = player.dataset.videoId;
  if (!playBtn || !videoId) return;

  playBtn.addEventListener('click', function () {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0';
    iframe.title = playBtn.getAttribute('aria-label') || 'YouTube-Video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    player.appendChild(iframe);
    player.classList.add('is-playing');
  });
})();
