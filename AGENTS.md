# Smith Visuals — Projektstand & Leitplanken

Statische Vanilla-HTML/CSS/JS-Website (kein Framework, kein Build-Tool, kein CDN). Deployed via GitHub Actions auf GitHub Pages: https://hagenteimann.github.io/tobiaszsmith/

## Struktur

- `sections/*.html` — ein Fragment pro Abschnitt (Quelle der Wahrheit)
- `styles/*.css` — ein File pro Abschnitt + `tokens.css`/`base.css`/`fonts.css` (globale Basis)
- `js/*.js` — ein File pro Abschnitt mit Interaktion
- `index.html` — **wird von `build.sh` aus den `sections/*.html`-Fragmenten zusammengesetzt** (Kopf + Fragmente in fester Reihenfolge, Array `SECTIONS` im Skript). Nicht direkt in `index.html` editieren — Änderungen gehen beim nächsten `bash build.sh` verloren. Immer das jeweilige `sections/*.html` ändern und `build.sh` neu ausführen. (Ist schon einmal passiert: ein Fix landete nur als Inline-`<script>` in `index.html`, nicht in einer `sections/`-Datei, und wäre bei einem Rebuild verloren gegangen.)
- **Abschnitt an/aus schalten**: In `build.sh` die entsprechende Zeile im `SECTIONS`-Array auskommentieren/einkommentieren UND die zugehörige `<link rel="stylesheet" ...>`-Zeile im Kopf-Heredoc ebenfalls (ver)kommentieren, dann `bash build.sh`. Aktuell deaktiviert: **Divider-Akkordeon** (`sections/divider.html` + `styles/divider.css`) — Dateien/Videos bleiben erhalten, laden aber nicht (keine Section im DOM = kein CSS-Request, keine Video-Requests).
- `assets/logos/` enthält sowohl Original- als auch optimierte Dateien (bewusst, User hat Originale selbst abgelegt — nicht löschen)
- `projekt-*.html` — eigenständige Projekt-Detailseiten (nicht Teil der `index.html`-Zusammenstellung), verlinkt aus den Foto-Mappen in `sections/more-work.html`
- `References_Videos & Fotos/` (falls vorhanden) ist **absichtlich** in `.gitignore` — mehrere GB Rohmaterial, nicht fürs Deployment

## Nicht verändern ohne triftigen Grund

1. **Hero-Foto-Ausrichtung** (`sections/hero.html` + `styles/hero.css`): Wortmarke und beide Foto-Ebenen sind über exakte Prozentkoordinaten (Figma-Canvas 1920×928) positioniert, nicht per Flexbox/Auto-Layout. Beide Fotos zeigen dieselbe Person — sie müssen pixelgenau übereinanderliegen. Bei Änderungen an Bild-Assets: neue Bilder müssen dieselbe Bounding-Box/Ausschnitt-Logik einhalten, sonst entsteht ein "Geister-Doppelbild".
2. **`.hero__lockup`/`.hero__stage` darf KEIN `position:relative` bekommen** — das bricht die `inset:0`-Positionierung der Foto-Ebenen (ist bereits zweimal passiert).
3. **`.hero { height: ... }` (nicht `min-height`)** ist eine harte Grenze, die garantiert, dass die Nav im ersten Viewport sichtbar bleibt. Die Nav-Sektion steht im DOM absichtlich *nach* der Hero-Stage und *vor* `hero-intro` (sticky Scroll-Verhalten: erst normal im Fluss, rastet erst beim Erreichen der Viewport-Oberkante ein).
4. **Parallax** (`js/hero.js`): Beide Foto-Ebenen lesen dieselbe CSS-Variable `--hero-parallax-y` — niemals pro Bild einzeln versetzen, sonst driften sie auseinander.
5. **`base.css`-Reset** (`ul[class]{padding:0}`) hat höhere Spezifität als einfache Klassen-Selektoren — bei neuen `<ul>`-Layouts (z. B. Marquees) ggf. Gap/Padding am Elternelement statt am Kind setzen.
6. Fonts sind lokal in `assets/fonts/` selbst gehostet (kein Google-Fonts-CDN, DSGVO). Nicht auf CDN umstellen.
7. Cache-Busting: `<link>`/`<script>`-Tags in `index.html` haben `?v=<timestamp>` Query-Parameter — beim manuellen Neuaufbau von `index.html` mit EINEM einheitlichen aktuellen Timestamp versehen (nicht mehrere Timestamps aneinanderhängen — ist schon passiert und erzeugte kaputte `?v=1784...,4595,...`-Query-Strings).
8. **Videos (`assets/portfolio/`, `assets/projects/`)**: IMMER komprimiert einchecken (H.264, max. 960px lange Kante, `-crf 28`, Audio falls genutzt auf ~96kbps) — NIEMALS rohes Kamera-Export-Material committen. War schon einmal ein Problem: rohe Reels (~470 MB) wurden direkt committed und gepusht, das `.git`-Verzeichnis wuchs auf 900+ MB, und alle Videos hatten `autoplay`, wodurch die Startseite beim Laden ~20 Videos gleichzeitig zu streamen versuchte.
9. **Video-Lazy-Loading**: `<video>`-Tags nutzen `data-src` statt `src` (kein `autoplay`-Attribut). `js/video-interaction.js` lädt/spielt Grid-Videos (Portfolio, Divider, Projektseiten) erst per `IntersectionObserver`, wenn sie in den Viewport scrollen. `js/more-work.js` lädt/spielt die Foto-Mappen-Videos erst bei tatsächlichem Öffnen (Hover/Tap/Fokus). Neue Videos immer nach diesem Muster einbauen, nie mit direktem `src`+`autoplay`.
10. **Mobile-Interaktion der Foto-Mappen** (`.mw-folder`, jetzt ein echter `<a href="projekt-*.html">`-Link): Auf Touch-Geräten/schmalem Viewport (`isTouch || innerWidth <= 1024`) öffnet der ERSTE Tap nur die Fächer-Vorschau (`is-open` + `pulse-white` Klassen, `e.preventDefault()` verhindert Navigation). Erst ein zweiter Tap auf die bereits offene Mappe navigiert. Auf Desktop öffnet Hover per CSS, ein Klick navigiert sofort. Diese Logik lebt in `js/more-work.js` — nicht als Inline-Script in `index.html` duplizieren.

## FFmpeg unter Git-Bash/MSYS (Windows)

Beim Batch-Verarbeiten von Videos in einer `while read` + `find -print0`-Schleife: **immer `-nostdin` an ffmpeg übergeben** (plus `< /dev/null`). Ohne das liest ffmpeg interaktiv von stdin und kollidiert mit der Pipe der Bash-Schleife — führt zu verstümmelten Dateipfaden und vorzeitigem Schleifenabbruch (schwer zu debuggendes Verhalten, ist bereits passiert).

## Git

- Repo-Root ist `website/`, nicht der übergeordnete "Schmith Visuals"-Ordner.
- Vor jedem `git add -A`: prüfen, ob große/neue Ordner (Video-Rohmaterial etc.) versehentlich mit reingezogen würden.
