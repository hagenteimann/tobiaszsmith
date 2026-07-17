#!/bin/bash
# Smith Visuals — index.html-Zusammenbau
# Setzt index.html aus den sections/*.html-Fragmenten + Kopf/Fuß zusammen.
#
# Abschnitt AN/AUS schalten: Zeile in SECTIONS auskommentieren/einkommentieren
# und dieses Skript neu ausführen. Zugehörige styles/*.css-Zeile im Kopf
# ebenfalls auskommentieren, sonst wird ungenutztes CSS nachgeladen.

cd "$(dirname "$0")"
V=$(date +%s)

cat > _head.html <<HEADEOF
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Smith Visuals — Cineastische Videos und hochwertige Fotos für Unternehmen, Marken und Kreative." />
  <title>Smith Visuals — Cinematic Visuals for Modern Brands</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='46' fill='%23A11919'/%3E%3C/svg%3E" />

  <link rel="preload" href="assets/fonts/geist-regular.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="assets/fonts/league-gothic-variable.ttf" as="font" type="font/ttf" crossorigin />

  <link rel="stylesheet" href="styles/fonts.css?v=$V" />
  <link rel="stylesheet" href="styles/tokens.css?v=$V" />
  <link rel="stylesheet" href="styles/base.css?v=$V" />
  <link rel="stylesheet" href="styles/nav.css?v=$V" />
  <link rel="stylesheet" href="styles/hero.css?v=$V" />
  <link rel="stylesheet" href="styles/clients.css?v=$V" />
  <link rel="stylesheet" href="styles/services.css?v=$V" />
  <link rel="stylesheet" href="styles/paket-modal.css?v=$V" />
  <!-- <link rel="stylesheet" href="styles/divider.css?v=$V" /> --> <!-- Akkordeon deaktiviert, siehe SECTIONS unten -->
  <link rel="stylesheet" href="styles/operate.css?v=$V" />
  <link rel="stylesheet" href="styles/testimonials.css?v=$V" />
  <link rel="stylesheet" href="styles/portfolio-intro.css?v=$V" />
  <link rel="stylesheet" href="styles/portfolio.css?v=$V" />
  <link rel="stylesheet" href="styles/portfolio-video.css?v=$V" />
  <link rel="stylesheet" href="styles/aat-showcase.css?v=$V" />
  <link rel="stylesheet" href="styles/more-work.css?v=$V" />
  <link rel="stylesheet" href="styles/behind-scenes.css?v=$V" />
  <link rel="stylesheet" href="styles/kontakt.css?v=$V" />
  <link rel="stylesheet" href="styles/footer.css?v=$V" />
  <link rel="stylesheet" href="styles/grain.css?v=$V" />
  <link rel="stylesheet" href="styles/preloader.css?v=$V" />
  <script src="js/preloader.js?v=$V" defer></script>
</head>
<body>
HEADEOF
cat sections/preloader.html >> _head.html
cat >> _head.html <<'EOF'

  <a class="skip-link" href="#main-content">Zum Inhalt springen</a>

EOF

cat > _main_open.html <<'EOF'

  <main id="main-content">
EOF

cat > _main_close_tail.html <<'EOF'
  </main>

EOF

cat > _tail.html <<TAILEOF

  <script src="js/video-interaction.js?v=$V" defer></script>
  <script src="js/nav.js?v=$V" defer></script>
  <script src="js/hero.js?v=$V" defer></script>
  <script src="js/more-work.js?v=$V" defer></script>
  <script src="js/kontakt.js?v=$V" defer></script>
  <script src="js/paket-modal.js?v=$V" defer></script>
  <script src="js/portfolio-video.js?v=$V" defer></script>
  <script src="js/portfolio-carousel.js?v=$V" defer></script>
  <script src="js/reveal.js?v=$V" defer></script>
</body>
</html>
TAILEOF
sed -i "s/\$V/$V/g" _tail.html

# --- Abschnitte in Reihenfolge (auskommentieren = deaktivieren) -----------
SECTIONS=(
  sections/hero.html
  sections/nav.html
  __MAIN_OPEN__
  sections/clients.html
  sections/portfolio.html
  sections/services.html
  # sections/divider.html      # <- Akkordeon: einkommentieren zum Reaktivieren
  sections/more-work.html
  sections/testimonials.html
  sections/portfolio-video.html
  sections/aat-showcase.html
  sections/operate.html
  sections/behind-scenes.html
  sections/kontakt.html
  __MAIN_CLOSE__
  sections/paket-modal.html
  sections/footer.html
)

FILES=(_head.html)
for s in "${SECTIONS[@]}"; do
  case "$s" in
    __MAIN_OPEN__) FILES+=(_main_open.html) ;;
    __MAIN_CLOSE__) FILES+=(_main_close_tail.html) ;;
    *) FILES+=("$s") ;;
  esac
done
FILES+=(_tail.html)

cat "${FILES[@]}" > index.html
rm -f _head.html _main_open.html _main_close_tail.html _tail.html

echo "index.html gebaut ($(wc -l < index.html) Zeilen)."
