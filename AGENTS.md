# Smith Visuals — Projektstand & Leitplanken

Statische Vanilla-HTML/CSS/JS-Website (kein Framework, kein Build-Tool, kein CDN). Deployed via GitHub Actions auf GitHub Pages: https://hagenteimann.github.io/tobiaszsmith/

## Struktur

- `sections/*.html` — ein Fragment pro Abschnitt (Quelle der Wahrheit)
- `styles/*.css` — ein File pro Abschnitt + `tokens.css`/`base.css`/`fonts.css` (globale Basis)
- `js/*.js` — ein File pro Abschnitt mit Interaktion
- `index.html` — **wird aus den `sections/*.html`-Fragmenten zusammengesetzt** (Kopf + Fragmente in fester Reihenfolge). Nicht direkt in `index.html` editieren — Änderungen gehen bei der nächsten Zusammenstellung verloren. Immer das jeweilige `sections/*.html` ändern und `index.html` neu bauen.
- `assets/logos/` enthält sowohl Original- als auch optimierte Dateien (bewusst, User hat Originale selbst abgelegt — nicht löschen)
- `References_Videos & Fotos/` (falls vorhanden) ist **absichtlich** in `.gitignore` — mehrere GB Rohmaterial, nicht fürs Deployment

## Nicht verändern ohne triftigen Grund

1. **Hero-Foto-Ausrichtung** (`sections/hero.html` + `styles/hero.css`): Wortmarke und beide Foto-Ebenen sind über exakte Prozentkoordinaten (Figma-Canvas 1920×928) positioniert, nicht per Flexbox/Auto-Layout. Beide Fotos zeigen dieselbe Person — sie müssen pixelgenau übereinanderliegen. Bei Änderungen an Bild-Assets: neue Bilder müssen dieselbe Bounding-Box/Ausschnitt-Logik einhalten, sonst entsteht ein "Geister-Doppelbild".
2. **`.hero__lockup`/`.hero__stage` darf KEIN `position:relative` bekommen** — das bricht die `inset:0`-Positionierung der Foto-Ebenen (ist bereits zweimal passiert).
3. **`.hero { height: ... }` (nicht `min-height`)** ist eine harte Grenze, die garantiert, dass die Nav im ersten Viewport sichtbar bleibt. Die Nav-Sektion steht im DOM absichtlich *nach* der Hero-Stage und *vor* `hero-intro` (sticky Scroll-Verhalten: erst normal im Fluss, rastet erst beim Erreichen der Viewport-Oberkante ein).
4. **Parallax** (`js/hero.js`): Beide Foto-Ebenen lesen dieselbe CSS-Variable `--hero-parallax-y` — niemals pro Bild einzeln versetzen, sonst driften sie auseinander.
5. **`base.css`-Reset** (`ul[class]{padding:0}`) hat höhere Spezifität als einfache Klassen-Selektoren — bei neuen `<ul>`-Layouts (z. B. Marquees) ggf. Gap/Padding am Elternelement statt am Kind setzen.
6. Fonts sind lokal in `assets/fonts/` selbst gehostet (kein Google-Fonts-CDN, DSGVO). Nicht auf CDN umstellen.
7. Cache-Busting: `<link>`/`<script>`-Tags in `index.html` haben `?v=<timestamp>` Query-Parameter — beim manuellen Neuaufbau von `index.html` mit aktualisiertem Timestamp versehen, sonst liefern Browser alte gecachte CSS/JS aus.

## Git

- Repo-Root ist `website/`, nicht der übergeordnete "Schmith Visuals"-Ordner.
- Vor jedem `git add -A`: prüfen, ob große/neue Ordner (Video-Rohmaterial etc.) versehentlich mit reingezogen würden.
