# Impressum, Datenschutz & SEO-Grundlagen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Echte Geschäftsdaten (von der alten Seite https://smithvisuals.de/ übernommen) einbauen: korrekte Mobilnummer überall, eigenständige Impressum- und Datenschutz-Seiten, Footer-Links darauf verweisen lassen, sowie fehlende SEO-Grundlagen (Open Graph/Twitter-Tags, Canonical, robots.txt, JSON-LD LocalBusiness) ergänzen.

**Architecture:** Statische Vanilla-HTML/CSS/JS-Website. `index.html` wird per `bash build.sh` aus `sections/*.html`-Fragmenten generiert — Änderungen NIEMALS direkt an `index.html`, nur an `sections/*.html`/`build.sh`/`styles/*.css`. Neue eigenständige Rechts-Seiten (`impressum.html`, `datenschutz.html`) folgen dem Muster der bestehenden `projekt-*.html`-Seiten (eigenständiges HTML-Dokument, kein Fragment, lädt `styles/fonts.css`, `styles/tokens.css`, `styles/base.css` direkt).

**Tech Stack:** Vanilla HTML/CSS/JS, keine Frameworks.

**Reale Geschäftsdaten (von https://smithvisuals.de/impressum.html und /datenschutz.html übernommen, User hat die Mobilnummer nochmal separat bestätigt):**
- Name: Tobiasz Smith (Einzelunternehmer, handelt unter "Smith Visuals")
- Anschrift: An der Alten Beienburg 16, 51503 Rösrath
- Telefon: +49 176 70067578
- E-Mail: info@smithvisuals.de
- USt-IdNr.: DE458040026
- Website: https://hagenteimann.github.io/tobiaszsmith/ (aktuelle Domain laut `AGENTS.md`)

---

## Task 1: Echte Mobilnummer sitewide einsetzen

**Files:**
- Modify: `sections/kontakt.html`

**Goal:** Der aktuelle Platzhalter `+4917689203110` (Anzeige `+49 (0) 176 8920 3110`) ist NICHT die echte Nummer. Ersetze ihn überall durch die echte Mobilnummer `+49 176 70067578`.

- [ ] **Step 1: `tel:`-Link und Anzeigetext im Kontakt-Item ändern**

Suche mit `grep -n "4917689203110" sections/kontakt.html` alle Stellen. Aktueller Zustand (Kontakt-Item):
```html
              <a class="kontakt__item-value" href="tel:+4917689203110">+49 (0) 176 8920 3110</a>
```
Ersetze durch:
```html
              <a class="kontakt__item-value" href="tel:+4917670067578">+49 176 70067578</a>
```

- [ ] **Step 2: WhatsApp-Link ändern**

Suche die Stelle mit `wa.me/4917689203110` (Quick-Link-Button). Aktueller Zustand:
```html
            <a class="kontakt__quick-link btn btn--primary" href="https://wa.me/4917689203110" target="_blank" rel="noopener noreferrer" aria-label="Schreib uns auf WhatsApp">
```
Ersetze durch:
```html
            <a class="kontakt__quick-link btn btn--primary" href="https://wa.me/4917670067578" target="_blank" rel="noopener noreferrer" aria-label="Schreib uns auf WhatsApp">
```

- [ ] **Step 3: Verifikation**

```bash
grep -rn "4917689203110" sections/*.html
```
Erwartung: keine Treffer mehr.
```bash
grep -c "4917670067578" sections/kontakt.html
```
Erwartung: 2 (tel:-Link + wa.me-Link).

- [ ] **Step 4: Commit**

```bash
git add sections/kontakt.html
git commit -m "fix(kontakt): use real business phone number (+49 176 70067578) instead of placeholder"
```

---

## Task 2: Impressum-Seite erstellen

**Files:**
- Create: `impressum.html`
- Modify: `sections/footer.html`

**Goal:** Eigenständige Impressum-Seite nach dem Muster von `projekt-*.html` (z.B. `projekt-athletik.html` als Referenz für Kopf/Header-Struktur), mit den echten Geschäftsdaten. Footer-Link darauf verweisen lassen.

- [ ] **Step 1: `impressum.html` erstellen**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, follow">
  <title>Impressum - Smith Visuals</title>
  <link rel="stylesheet" href="styles/fonts.css?v=1">
  <link rel="stylesheet" href="styles/tokens.css?v=1">
  <link rel="stylesheet" href="styles/base.css?v=1">
  <style>
    body { background: var(--c-bg); color: var(--c-text-light); }
    .project-header {
      padding: var(--space-6) 0 var(--space-4);
      margin-bottom: var(--space-6);
    }
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--c-accent);
      text-decoration: none;
      font-weight: 600;
      font-size: 1.125rem;
      transition: color 0.2s ease;
    }
    .back-btn:hover { color: var(--c-white); }
    .project-title {
      margin-top: var(--space-4);
    }
    .legal-content {
      max-width: 42rem;
    }
    .legal-content h2 {
      font-family: var(--font-body);
      font-size: var(--fs-subheading);
      font-weight: 700;
      color: var(--c-accent);
      margin-top: var(--space-6);
      margin-bottom: var(--space-2);
    }
    .legal-content h2:first-child { margin-top: 0; }
    .legal-content p {
      font-family: var(--font-body);
      font-size: var(--fs-body);
      color: var(--c-text-light);
      line-height: var(--lh-body);
      margin-bottom: var(--space-3);
    }
    .legal-content a {
      color: var(--c-accent);
      text-decoration: underline;
    }
    .legal-content a:hover { color: var(--c-accent-hover); }
  </style>
</head>
<body>
  <header class="project-header">
    <div class="container">
      <a href="index.html" class="back-btn">&larr; Zur&uuml;ck</a>
      <h1 class="project-title section-title">Impressum</h1>
    </div>
  </header>

  <main class="container legal-content" style="padding-bottom: var(--space-8);">
    <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
    <p>
      Tobiasz Smith<br>
      Smith Visuals<br>
      An der Alten Beienburg 16<br>
      51503 R&ouml;srath<br>
      Deutschland
    </p>

    <h2>Kontakt</h2>
    <p>
      Telefon: <a href="tel:+4917670067578">+49 176 70067578</a><br>
      E-Mail: <a href="mailto:info@smithvisuals.de">info@smithvisuals.de</a>
    </p>

    <h2>Umsatzsteuer-Identifikationsnummer</h2>
    <p>
      Gem&auml;&szlig; &sect; 27 a Umsatzsteuergesetz: DE458040026
    </p>

    <h2>Verantwortlich f&uuml;r den Inhalt nach &sect; 55 Abs. 2 RStV</h2>
    <p>
      Tobiasz Smith (Anschrift wie oben)
    </p>

    <h2>Streitschlichtung</h2>
    <p>
      Die Europ&auml;ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
      <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>.
      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
      Verbraucherschlichtungsstelle teilzunehmen.
    </p>

    <h2>Haftung f&uuml;r Inhalte</h2>
    <p>
      Als Diensteanbieter sind wir gem&auml;&szlig; &sect; 7 Abs.1 TMG f&uuml;r eigene Inhalte auf diesen Seiten
      nach den allgemeinen Gesetzen verantwortlich. Nach &sect;&sect; 8 bis 10 TMG sind wir als
      Diensteanbieter jedoch nicht verpflichtet, &uuml;bermittelte oder gespeicherte fremde
      Informationen zu &uuml;berwachen oder nach Umst&auml;nden zu forschen, die auf eine
      rechtswidrige T&auml;tigkeit hinweisen.
    </p>
  </main>
</body>
</html>
```

- [ ] **Step 2: Footer-Link in `sections/footer.html` auf die neue Seite verweisen lassen**

Aktueller Zustand (im "Rechtliches"-Block):
```html
            <li><a href="#">Impressum</a></li>
```
Ersetze durch:
```html
            <li><a href="impressum.html">Impressum</a></li>
```

- [ ] **Step 3: Verifikation**

```bash
test -f impressum.html && echo "impressum.html existiert"
grep -n "impressum.html" sections/footer.html
```
Erwartung: Datei existiert, Footer verlinkt darauf.

- [ ] **Step 4: `bash build.sh` ausführen** (baut `index.html` mit dem aktualisierten Footer-Link neu)

- [ ] **Step 5: Commit**

```bash
git add impressum.html sections/footer.html index.html
git commit -m "feat(legal): add Impressum page with real business data, link from footer"
```

---

## Task 3: Datenschutz-Seite erstellen

**Files:**
- Create: `datenschutz.html`
- Modify: `sections/footer.html`

**Goal:** Eigenständige Datenschutz-Seite mit dem 1:1 von der alten Seite übernommenen Text (13 Abschnitte). Footer-Link darauf verweisen lassen.

- [ ] **Step 1: `datenschutz.html` erstellen**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, follow">
  <title>Datenschutz - Smith Visuals</title>
  <link rel="stylesheet" href="styles/fonts.css?v=1">
  <link rel="stylesheet" href="styles/tokens.css?v=1">
  <link rel="stylesheet" href="styles/base.css?v=1">
  <style>
    body { background: var(--c-bg); color: var(--c-text-light); }
    .project-header {
      padding: var(--space-6) 0 var(--space-4);
      margin-bottom: var(--space-6);
    }
    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--c-accent);
      text-decoration: none;
      font-weight: 600;
      font-size: 1.125rem;
      transition: color 0.2s ease;
    }
    .back-btn:hover { color: var(--c-white); }
    .project-title {
      margin-top: var(--space-4);
    }
    .legal-content {
      max-width: 42rem;
    }
    .legal-content h2 {
      font-family: var(--font-body);
      font-size: var(--fs-subheading);
      font-weight: 700;
      color: var(--c-accent);
      margin-top: var(--space-6);
      margin-bottom: var(--space-2);
    }
    .legal-content h2:first-child { margin-top: 0; }
    .legal-content p {
      font-family: var(--font-body);
      font-size: var(--fs-body);
      color: var(--c-text-light);
      line-height: var(--lh-body);
      margin-bottom: var(--space-3);
    }
    .legal-content ul {
      margin: 0 0 var(--space-3);
      padding-left: 1.25rem;
      font-family: var(--font-body);
      font-size: var(--fs-body);
      color: var(--c-text-light);
      line-height: var(--lh-body);
    }
    .legal-content li { margin-bottom: var(--space-1); }
    .legal-content a {
      color: var(--c-accent);
      text-decoration: underline;
    }
    .legal-content a:hover { color: var(--c-accent-hover); }
  </style>
</head>
<body>
  <header class="project-header">
    <div class="container">
      <a href="index.html" class="back-btn">&larr; Zur&uuml;ck</a>
      <h1 class="project-title section-title">Datenschutz</h1>
    </div>
  </header>

  <main class="container legal-content" style="padding-bottom: var(--space-8);">
    <p><em>Datenschutzhinweis f&uuml;r Kunden &ndash; Smith Visuals, Inhaber Tobiasz Smith</em></p>

    <h2>1. Verantwortlicher</h2>
    <p>
      Smith Visuals &ndash; Inhaber Tobiasz Smith<br>
      An der Alten Beienburg 16 | 51503 R&ouml;srath<br>
      Telefon: <a href="tel:+4917670067578">+49 176 70067578</a><br>
      E-Mail: <a href="mailto:info@smithvisuals.de">info@smithvisuals.de</a><br>
      Website: www.smithvisuals.de<br>
      USt-ID: DE458040026
    </p>

    <h2>2. Zwecke der Datenverarbeitung</h2>
    <p>Die Verarbeitung erfolgt zur:</p>
    <ul>
      <li>Durchf&uuml;hrung von Auftr&auml;gen</li>
      <li>Erstellung von Angeboten und Rechnungen</li>
      <li>Kundenkommunikation</li>
      <li>Terminorganisation</li>
      <li>Lieferung digitaler Inhalte</li>
      <li>Eigenwerbung und Portfolio-Nutzung</li>
    </ul>

    <h2>3. Arten der verarbeiteten Daten</h2>
    <ul>
      <li>Stammdaten (Name, Adresse)</li>
      <li>Kontaktdaten (Telefon, E-Mail)</li>
      <li>Vertrags- und Rechnungsdaten</li>
      <li>Kommunikationsdaten (WhatsApp, Instagram, E-Mail, SMS)</li>
      <li>Termin- und Organisationsdaten (z. B. Kalender)</li>
      <li>Foto-, Video- und Audioaufnahmen</li>
    </ul>

    <h2>4. Rechtsgrundlagen</h2>
    <p>Die Verarbeitung erfolgt gem&auml;&szlig;:</p>
    <ul>
      <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserf&uuml;llung)</li>
      <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
      <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse, insbesondere f&uuml;r Portfolio und Werbung)</li>
    </ul>

    <h2>5. Speicherdauer</h2>
    <p>
      Personenbezogene Daten werden nur so lange gespeichert, wie dies f&uuml;r den jeweiligen Zweck
      erforderlich ist. Rohmaterial und Projektdaten werden in der Regel f&uuml;r bis zu 12 Monate
      gespeichert. Steuer- und abrechnungsrelevante Daten werden gem&auml;&szlig; gesetzlichen
      Aufbewahrungsfristen von 6 bis 10 Jahren gespeichert.
    </p>

    <h2>6. Portfolio- und Werbenutzung</h2>
    <p>
      Erstellte Foto- und Videoaufnahmen k&ouml;nnen im Rahmen des berechtigten Interesses f&uuml;r
      Eigenwerbung genutzt werden, sofern keine &uuml;berwiegenden Interessen der betroffenen Person
      entgegenstehen. Ein Widerspruch ist jederzeit mit Wirkung f&uuml;r die Zukunft m&ouml;glich.
    </p>

    <h2>7. Einsatz von Tools und Dienstleistern</h2>
    <p>Zur Verarbeitung werden folgende Dienste genutzt:</p>
    <ul>
      <li>Apple iCloud (Speicherung)</li>
      <li>Lexware Cloud (Rechnungsstellung)</li>
      <li>WhatsApp / Instagram / SMS (Kommunikation)</li>
      <li>Google Kalender (Terminorganisation)</li>
      <li>E-Mail-Provider</li>
    </ul>
    <p>
      Diese Anbieter k&ouml;nnen Daten in Drittl&auml;ndern verarbeiten. Die &Uuml;bermittlung erfolgt
      auf Grundlage von EU-Standardvertragsklauseln oder vergleichbaren Schutzmechanismen.
    </p>

    <h2>8. Weitergabe an Dritte</h2>
    <p>
      Eine Weitergabe erfolgt nur, wenn dies zur Vertragserf&uuml;llung erforderlich ist. Keine
      Weitergabe zu Werbezwecken.
    </p>

    <h2>9. Datensicherheit</h2>
    <p>
      Es werden geeignete technische und organisatorische Ma&szlig;nahmen getroffen, insbesondere
      Zugriffsbeschr&auml;nkungen, Passwortschutz, verschl&uuml;sselte &Uuml;bertragung und
      Systemsicherung.
    </p>

    <h2>10. Rechte der betroffenen Personen</h2>
    <ul>
      <li>Auskunft (Art. 15 DSGVO)</li>
      <li>Berichtigung (Art. 16 DSGVO)</li>
      <li>L&ouml;schung (Art. 17 DSGVO)</li>
      <li>Einschr&auml;nkung (Art. 18 DSGVO)</li>
      <li>Daten&uuml;bertragbarkeit (Art. 20 DSGVO)</li>
      <li>Widerspruch (Art. 21 DSGVO)</li>
      <li>Widerruf von Einwilligungen</li>
    </ul>
    <p>Kontakt: <a href="mailto:info@smithvisuals.de">info@smithvisuals.de</a></p>

    <h2>11. L&ouml;schung von Daten</h2>
    <p>
      Daten werden gel&ouml;scht, sobald der Zweck entf&auml;llt und keine gesetzlichen
      Aufbewahrungspflichten mehr bestehen.
    </p>

    <h2>12. Beschwerderecht</h2>
    <p>Landesbeauftragte f&uuml;r Datenschutz und Informationsfreiheit Nordrhein-Westfalen</p>

    <h2>13. Automatisierte Entscheidungsfindung</h2>
    <p>Es findet keine automatisierte Entscheidungsfindung oder Profiling gem&auml;&szlig; Art. 22 DSGVO statt.</p>

    <p><em>Stand: 2026</em></p>
  </main>
</body>
</html>
```

- [ ] **Step 2: Footer-Link in `sections/footer.html` auf die neue Seite verweisen lassen**

Aktueller Zustand (im "Rechtliches"-Block):
```html
            <li><a href="#">Datenschutz</a></li>
```
Ersetze durch:
```html
            <li><a href="datenschutz.html">Datenschutz</a></li>
```

Zusätzlich in `sections/kontakt.html`: die DSGVO-Checkbox-Label verlinkt aktuell nirgends auf die Erklärung. Suche mit `grep -n "Datenschutzerklärung" sections/kontakt.html` die Stelle:
```html
            <label for="kontakt-dsgvo">Ich akzeptiere die Datenschutzerklärung*</label>
```
Ersetze durch (Link auf die neue Seite, öffnet in neuem Tab, damit das Formular nicht verlassen wird):
```html
            <label for="kontakt-dsgvo">Ich akzeptiere die <a href="datenschutz.html" target="_blank" rel="noopener noreferrer">Datenschutzerkl&auml;rung</a>*</label>
```

- [ ] **Step 3: Verifikation**

```bash
test -f datenschutz.html && echo "datenschutz.html existiert"
grep -n "datenschutz.html" sections/footer.html sections/kontakt.html
```
Erwartung: Datei existiert, beide Fragmente verlinken darauf.

- [ ] **Step 4: `bash build.sh` ausführen**

- [ ] **Step 5: Commit**

```bash
git add datenschutz.html sections/footer.html sections/kontakt.html index.html
git commit -m "feat(legal): add Datenschutz page with real GDPR text, link from footer and consent checkbox"
```

---

## Task 4: SEO-Grundlagen ergänzen (OG/Twitter, Canonical, robots.txt, JSON-LD)

**Files:**
- Modify: `build.sh`
- Create: `robots.txt`

**Goal:** Fehlende SEO-Basics ergänzen: Open Graph + Twitter-Card-Meta-Tags (für Link-Vorschauen beim Teilen), Canonical-URL, `theme-color`, `robots.txt`, sowie ein JSON-LD `LocalBusiness`-Schema mit den echten Geschäftsdaten.

- [ ] **Step 1: `build.sh` Head-Heredoc erweitern**

Suche per `grep -n "meta name=\"description\"" build.sh` die Stelle. Aktueller Zustand (Ausschnitt im `_head.html`-Heredoc):
```html
  <meta name="description" content="Smith Visuals — Cineastische Videos und hochwertige Fotos für Unternehmen, Marken und Kreative." />
  <title>Smith Visuals — Cinematic Visuals for Modern Brands</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='46' fill='%23A11919'/%3E%3C/svg%3E" />
```
Ersetze durch (ergänzt Canonical, theme-color, OG- und Twitter-Tags, JSON-LD LocalBusiness — Bildpfad `assets/portfolio/og-image.jpg` ist bewusst ein Platzhalter-Pfad, der Nutzer liefert das echte Bild später nach; falls die Datei fehlt, ist das kein Build-Fehler, nur ein totes Bild in Social-Previews bis das Bild nachgereicht wird):
```html
  <meta name="description" content="Smith Visuals — Cineastische Videos und hochwertige Fotos für Unternehmen, Marken und Kreative." />
  <link rel="canonical" href="https://hagenteimann.github.io/tobiaszsmith/" />
  <meta name="theme-color" content="#0a0a0c" />
  <title>Smith Visuals — Cinematic Visuals for Modern Brands</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='46' fill='%23A11919'/%3E%3C/svg%3E" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Smith Visuals" />
  <meta property="og:title" content="Smith Visuals — Cinematic Visuals for Modern Brands" />
  <meta property="og:description" content="Cineastische Videos und hochwertige Fotos für Unternehmen, Marken und Kreative." />
  <meta property="og:url" content="https://hagenteimann.github.io/tobiaszsmith/" />
  <meta property="og:image" content="https://hagenteimann.github.io/tobiaszsmith/assets/portfolio/og-image.jpg" />
  <meta property="og:locale" content="de_DE" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Smith Visuals — Cinematic Visuals for Modern Brands" />
  <meta name="twitter:description" content="Cineastische Videos und hochwertige Fotos für Unternehmen, Marken und Kreative." />
  <meta name="twitter:image" content="https://hagenteimann.github.io/tobiaszsmith/assets/portfolio/og-image.jpg" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Smith Visuals",
    "founder": {
      "@type": "Person",
      "name": "Tobiasz Smith"
    },
    "email": "info@smithvisuals.de",
    "telephone": "+4917670067578",
    "url": "https://hagenteimann.github.io/tobiaszsmith/",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "An der Alten Beienburg 16",
      "postalCode": "51503",
      "addressLocality": "Rösrath",
      "addressCountry": "DE"
    },
    "sameAs": [
      "https://instagram.com/smithvisuals",
      "https://linkedin.com/company/smithvisuals",
      "https://x.com/smithvisuals"
    ]
  }
  </script>
```

- [ ] **Step 2: `robots.txt` im Projekt-Root erstellen**

```
User-agent: *
Allow: /

Sitemap: https://hagenteimann.github.io/tobiaszsmith/sitemap.xml
```

(Hinweis: Es gibt aktuell keine `sitemap.xml` — die Zeile ist ein Verweis für die Zukunft, verursacht bei Fehlen keinen Fehler bei Crawlern, wird nur ignoriert. Erstellung einer `sitemap.xml` ist NICHT Teil dieses Tasks.)

- [ ] **Step 3: `bash build.sh` ausführen**

- [ ] **Step 4: Verifikation**

```bash
grep -c "og:title\|twitter:card\|rel=\"canonical\"\|application/ld+json" index.html
```
Erwartung: mindestens 4 Treffer (je mind. 1x og:title, twitter:card, canonical, ld+json).
```bash
grep -o 'v=[0-9]*' index.html | sort -u
```
Erwartung: genau EIN einheitlicher Cache-Bust-Timestamp (kein doppelter/gemischter Wert).
```bash
test -f robots.txt && cat robots.txt
```

- [ ] **Step 5: Commit**

```bash
git add build.sh robots.txt index.html
git commit -m "feat(seo): add OG/Twitter tags, canonical URL, theme-color, robots.txt, LocalBusiness JSON-LD"
```

---

## Self-Review Checkliste (vom Plan-Autor bereits durchgeführt)

- ✅ Alle Änderungen an `sections/*.html`/`build.sh`, `index.html`-Rebuild ist Teil jedes betroffenen Tasks (nicht separat)
- ✅ Echte Geschäftsdaten (Adresse, Telefon, E-Mail, USt-ID) stammen 1:1 von der alten Live-Seite bzw. vom Nutzer bestätigt — keine erfundenen Daten
- ✅ `og:image`/`twitter:image` verweisen auf einen noch nicht existierenden Platzhalterpfad (`assets/portfolio/og-image.jpg`) — Nutzer wurde vorab informiert, dass ein echtes Bild nachgereicht werden muss; das ist kein Build-Fehler
- ✅ AGB-Seite ist bewusst NICHT Teil dieses Plans (User hat nur Impressum + Datenschutz angefordert, AGB-Text wurde nicht von der alten Seite abgerufen)
- ✅ Die im Kontaktformular sichtbare "Studio"-Adresse (Kreativpark Block 4, Hamburg) wird NICHT angetastet — das ist eine bewusste Entscheidung, da unklar ist, ob die echte Privatadresse öffentlich auf der Kontaktkarte erscheinen soll (nur im rechtlich vorgeschriebenen Impressum zwingend nötig)
- ✅ Jeder Task endet mit Grep-/Datei-Verifikation vor dem Commit
