# Kontaktformular-Vereinfachung & Hero-CTA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kontaktformular auf 5 essenzielle Felder reduzieren (Name, Telefon, E-Mail, Betreff, DSGVO), den "HOW WE OPERATE"-Prozess kompakt in die Kontakt-Sektion integrieren, und einen passenden CTA-Button im Hero ergänzen.

**Architecture:** Diese Website nutzt ein Build-System: `index.html` wird von `build.sh` aus `sections/*.html`-Fragmenten zusammengesetzt. **Alle Änderungen erfolgen an `sections/*.html` und `styles/*.css` — niemals direkt an `index.html`.** Nach allen Änderungen wird `bash build.sh` ausgeführt, um `index.html` neu zu generieren.

**Tech Stack:** Vanilla HTML/CSS/JS, kein Framework, kein Build-Tool außer dem projekteigenen `build.sh`-Bash-Skript.

**Wichtige Leitplanken (aus `AGENTS.md`):**
- Quelle der Wahrheit sind `sections/*.html`, NICHT `index.html`.
- `.hero { height: ... }` ist eine harte Grenze — nicht auf `min-height` ändern.
- `.hero__stage`/`.hero__lockup` dürfen KEIN `position:relative` bekommen.
- Neue interaktive Elemente im Hero müssen `position:absolute` nutzen, damit sie kein Höhenbudget der Stage beanspruchen (wie `.hero__scroll` es bereits tut).
- CSS-Tokens ausschließlich aus `styles/tokens.css` verwenden (`--c-accent`, `--c-white`, `--c-bg`, `--c-text`, `--c-text-dim`, `--c-text-dark`, `--space-*`, `--fs-*`, `--radius-*`, `--dur-*`, `--ease-*`).
- Neue Sections/Card-Gruppen bekommen `.reveal` (+ `.reveal--stagger` am Parent) nach etabliertem Muster.
- `paket-modal` (sections/paket-modal.html, styles/paket-modal.css, js/paket-modal.js) bleibt UNANGETASTET — wird von den "Pakete"-Buttons in `services.html` benötigt.
- `kontakt.js` braucht KEINE Änderung — `checkValidity()` validiert generisch, unabhängig von der Feldanzahl. Es existiert bewusst kein Backend (siehe TODO-Kommentar in der Datei) — das bleibt so.
- Cache-Busting: Timestamp-Query-Parameter (`?v=$V`) werden automatisch von `build.sh` gesetzt — keine manuelle Bearbeitung nötig.

---

## Task 1: Kontaktformular auf 5 Felder reduzieren

**Files:**
- Modify: `sections/kontakt.html` (Formular-Block, aktuell Zeilen 103-191)
- Modify: `styles/kontakt.css` (Checkbox-Styling ergänzen)

**Goal:** Ersetze das 7-Felder-Formular (name, email, projektart, paket, budget, deadline, nachricht) durch ein 5-Felder-Formular (name, phone, email, subject, dsgvo-checkbox).

- [ ] **Step 1: Formular-HTML in `sections/kontakt.html` ersetzen**

Ersetze den kompletten Block von `<form class="kontakt__form reveal" action="#" method="post" data-form="kontakt" novalidate>` bis zum schließenden `</form>` (aktuell Zeilen 103-191) durch:

```html
      <form class="kontakt__form reveal" action="#" method="post" data-form="kontakt" novalidate>
        <div class="kontakt__fields">

          <div class="kontakt__field">
            <label for="kontakt-name">Name*</label>
            <input class="kontakt__input" type="text" id="kontakt-name" name="name" placeholder="Dein vollständiger Name" autocomplete="name" required />
          </div>

          <div class="kontakt__field">
            <label for="kontakt-phone">Telefonnummer*</label>
            <input class="kontakt__input" type="tel" id="kontakt-phone" name="phone" placeholder="+49 (0) 176 ..." autocomplete="tel" required />
          </div>

          <div class="kontakt__field">
            <label for="kontakt-email">E-Mail*</label>
            <input class="kontakt__input" type="email" id="kontakt-email" name="email" placeholder="Deine E-Mail-Adresse" autocomplete="email" required />
          </div>

          <div class="kontakt__field">
            <label for="kontakt-subject">Betreff*</label>
            <input class="kontakt__input" type="text" id="kontakt-subject" name="subject" placeholder="Worum geht es?" required />
          </div>

          <div class="kontakt__field kontakt__field--checkbox">
            <input class="kontakt__checkbox" type="checkbox" id="kontakt-dsgvo" name="dsgvo" required />
            <label for="kontakt-dsgvo">Ich akzeptiere die Datenschutzerklärung*</label>
          </div>

        </div>

        <button class="kontakt__submit" type="submit">Absenden</button>

        <p class="kontakt__note">*Angaben sind nötig</p>

        <!-- Live-Region fuer Absende-Feedback, wird per JS befuellt -->
        <p class="kontakt__feedback" role="status" aria-live="polite" hidden></p>
      </form>
```

**Wichtig:** `data-form="kontakt"` und die `.kontakt__feedback`-Live-Region bleiben unverändert (werden von `js/kontakt.js` per Selektor gefunden — keine JS-Änderung nötig).

- [ ] **Step 2: Checkbox-Styling zu `styles/kontakt.css` hinzufügen**

Füge am Ende der Datei `styles/kontakt.css` (nach der letzten Regel, vor der `@media (prefers-reduced-motion: reduce)`-Regel am Dateiende) folgendes CSS ein:

```css
.kontakt__field--checkbox {
  flex-direction: row;
  align-items: flex-start;
  gap: var(--space-2);
}

.kontakt__checkbox {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.15rem;
  cursor: pointer;
  accent-color: var(--c-accent);
}

.kontakt__field--checkbox label {
  font-weight: 500;
  font-size: var(--fs-body-sm);
  color: var(--c-text-dim);
  cursor: pointer;
}
```

- [ ] **Step 3: Visuell prüfen**

Öffne `sections/kontakt.html` im Kontext (nach Task 5/Rebuild) im Browser und prüfe: Formular zeigt genau 5 Felder + Submit-Button, Checkbox ist anklickbar, Label ist damit verknüpft (Klick auf Text toggled Checkbox).

- [ ] **Step 4: Commit**

```bash
git add sections/kontakt.html styles/kontakt.css
git commit -m "refactor(contact): simplify form to name, phone, email, subject, dsgvo"
```

---

## Task 2: "HOW WE OPERATE" kompakt in Kontakt-Sektion integrieren

**Files:**
- Modify: `sections/kontakt.html` (kompakte Prozess-Leiste einfügen)
- Modify: `styles/kontakt.css` (Styling für die Prozess-Leiste)

**Goal:** Die bisherigen 6 Schritte aus `sections/operate.html` als kompakte, horizontale Nummern-Leiste INNERHALB der Kontakt-Sektion darstellen (nicht als eigene Section).

- [ ] **Step 1: Kompakte Prozess-Leiste in `sections/kontakt.html` einfügen**

Füge direkt nach dem schließenden `</div>` von `.kontakt__heading` (nach der Zeile mit `<p class="kontakt__lead">...</p>` und vor `<div class="kontakt__split reveal--stagger">`) folgendes Markup ein:

```html
    <ol class="kontakt__process reveal--stagger">
      <li class="kontakt__process-step reveal">
        <span class="kontakt__process-num">1</span>
        <span class="kontakt__process-label">Erstgespräch</span>
      </li>
      <li class="kontakt__process-step reveal">
        <span class="kontakt__process-num">2</span>
        <span class="kontakt__process-label">Konzept &amp; Storyboard</span>
      </li>
      <li class="kontakt__process-step reveal">
        <span class="kontakt__process-num">3</span>
        <span class="kontakt__process-label">Produktion</span>
      </li>
      <li class="kontakt__process-step reveal">
        <span class="kontakt__process-num">4</span>
        <span class="kontakt__process-label">Editing &amp; Sound</span>
      </li>
      <li class="kontakt__process-step reveal">
        <span class="kontakt__process-num">5</span>
        <span class="kontakt__process-label">Feedback &amp; Revision</span>
      </li>
      <li class="kontakt__process-step reveal">
        <span class="kontakt__process-num">6</span>
        <span class="kontakt__process-label">Finale Übergabe</span>
      </li>
    </ol>
```

Der resultierende Aufbau innerhalb von `.kontakt__container` ist dann: `.kontakt__heading` → `.kontakt__process` (neu) → `.kontakt__split`.

- [ ] **Step 2: Styling zu `styles/kontakt.css` hinzufügen**

Füge nach dem `.kontakt__lead`-Block (nach der `---------- Split Layout ----------`-Kommentarzeile, davor) folgendes CSS ein:

```css
/* ---------- Kompakter Prozess-Ablauf (ex "How We Operate") ---------- */

.kontakt__process {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-5) var(--space-6);
  width: 100%;
  max-width: 60rem;
  margin-inline: auto;
  padding: 0;
}

.kontakt__process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  text-align: center;
  max-width: 8rem;
}

.kontakt__process-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--radius-full);
  background: var(--c-accent);
  color: var(--c-white);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-body-md);
}

.kontakt__process-label {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--fs-body-sm);
  color: var(--c-text-dim);
}

@media (max-width: 40em) {
  .kontakt__process {
    gap: var(--space-4) var(--space-5);
  }

  .kontakt__process-step {
    max-width: 6rem;
  }
}
```

- [ ] **Step 3: Visuell prüfen**

Nach Rebuild (Task 5) prüfen: 6 nummerierte Schritte erscheinen zentriert oberhalb des Formulars, umbrechen sauber auf Mobile (375px), Reveal-Animation greift beim Scrollen.

- [ ] **Step 4: Commit**

```bash
git add sections/kontakt.html styles/kontakt.css
git commit -m "feat(contact): integrate compact 6-step process timeline into contact section"
```

---

## Task 3: Alte "HOW WE OPERATE"-Sektion entfernen

**Files:**
- Delete: `sections/operate.html`
- Delete: `styles/operate.css`
- Modify: `build.sh` (SECTIONS-Array + Head-Heredoc)

**Goal:** Die jetzt redundante eigenständige Operate-Sektion vollständig entfernen (Inhalt lebt jetzt kompakt in Task 2 innerhalb von Kontakt).

- [ ] **Step 1: Dateien löschen**

```bash
git rm sections/operate.html styles/operate.css
```

- [ ] **Step 2: Referenz aus `build.sh` SECTIONS-Array entfernen**

In `build.sh`, im `SECTIONS`-Array, die Zeile

```
  sections/operate.html
```

ersatzlos löschen (Zeile befindet sich zwischen `sections/aat-showcase.html` und `sections/behind-scenes.html`).

- [ ] **Step 3: Stylesheet-Link aus Head-Heredoc entfernen**

In `build.sh`, im Head-Heredoc (Bereich `cat > _head.html <<HEADEOF ... HEADEOF`), die Zeile

```
  <link rel="stylesheet" href="styles/operate.css?v=$V" />
```

ersatzlos löschen.

- [ ] **Step 4: Commit**

```bash
git add build.sh
git commit -m "chore: remove standalone operate section (merged into contact section)"
```

---

## Task 4: Hero-CTA hinzufügen

**Files:**
- Modify: `sections/hero.html`
- Modify: `styles/hero.css`

**Goal:** Einen prominenten, zum Kontaktformular verlinkenden CTA-Button im Hero ergänzen, ohne die bestehende Stage-Positionierung oder Höhenlogik zu verletzen.

**Constraint (aus AGENTS.md):** `.hero` hat eine harte `height`-Grenze, `.hero__stage` darf kein `position:relative` bekommen. Der neue CTA muss wie `.hero__scroll` absolut positioniert sein (kein Höhenbudget-Verbrauch) und darf `.hero__scroll` nicht überlappen.

- [ ] **Step 1: CTA-Link in `sections/hero.html` einfügen**

In `sections/hero.html`, füge den neuen Link NACH dem schließenden `</div>` von `.hero__stage` und VOR dem bestehenden `<a class="hero__scroll" ...>` ein:

```html
  <a class="hero__cta" href="#kontakt" aria-label="Jetzt Projekt anfragen">
    JETZT ANFRAGEN
  </a>
```

Die Datei sieht danach so aus (Ausschnitt):

```html
  <div class="hero__stage">
    ...
  </div>

  <a class="hero__cta" href="#kontakt" aria-label="Jetzt Projekt anfragen">
    JETZT ANFRAGEN
  </a>

  <a class="hero__scroll" href="#hero-intro" aria-label="Nach unten scrollen">
    ...
  </a>
```

- [ ] **Step 2: CTA-Styling in `styles/hero.css` ergänzen**

Füge nach dem `.hero__scroll-icon`-Block und den zugehörigen Keyframes/Media-Queries (nach der `@keyframes hero-scroll-bounce`-Regel und ihrer `@media (prefers-reduced-motion: reduce)`-Regel, vor dem Kommentar `/* ---------- Tagline-Block ... ---------- */`) folgendes CSS ein:

```css
/* ---------- Hero-CTA: prominenter Button oberhalb des Scroll-Hinweises ----------
   Wie .hero__scroll absolut positioniert -- kein Hoehenbudget-Verbrauch der
   Stage, keine Kollision mit der harten .hero{height:...}-Grenze. */
.hero__cta {
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: clamp(3rem, 2.2rem + 3vw, 4.5rem);
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  background: var(--c-accent);
  color: var(--c-white);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-label-btn);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-accent);
  transition: background-color var(--dur-fast) var(--ease-soft),
              transform var(--dur-fast) var(--ease-soft);
}

.hero__cta:hover,
.hero__cta:focus-visible {
  background: var(--c-accent-hover);
  transform: translateX(-50%) translateY(-2px);
}

.hero__cta:active {
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 768px) {
  .hero__cta {
    padding: 0.75rem 1.5rem;
    font-size: var(--fs-body-sm);
    bottom: clamp(3.5rem, 3rem + 2vw, 4.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__cta {
    transition: none;
  }
}
```

- [ ] **Step 3: Kollisionsprüfung**

Nach Rebuild (Task 5) im Browser bei 375px, 768px und 1440px Breite prüfen: `.hero__cta` und `.hero__scroll` überlappen sich an keiner Breite, beide bleiben innerhalb der Hero-Stage sichtbar (kein Abschneiden durch `overflow: hidden` auf `.hero`), Wortmarke/Foto werden nicht verdeckt.

- [ ] **Step 4: Commit**

```bash
git add sections/hero.html styles/hero.css
git commit -m "feat(hero): add CTA button linking to contact form"
```

---

## Task 5: Rebuild ausführen und `index.html` verifizieren

**Files:**
- Regenerate: `index.html` (via `build.sh`)

**Goal:** `index.html` aus den aktualisierten Fragmenten neu bauen und sicherstellen, dass alle Änderungen korrekt eingeflossen sind.

- [ ] **Step 1: Build ausführen**

```bash
bash build.sh
```

Erwartete Ausgabe: `index.html gebaut (<N> Zeilen).`

- [ ] **Step 2: Diff der generierten `index.html` prüfen**

```bash
git diff --stat index.html
```

Prüfen: `index.html` enthält keine Referenz mehr auf `styles/operate.css`, keine `<section class="operate">` mehr, aber `.kontakt__process`, `.hero__cta`, und das 5-Feld-Formular sind vorhanden.

```bash
grep -c 'class="operate"' index.html   # erwartet: 0
grep -c 'kontakt__process' index.html  # erwartet: > 0
grep -c 'hero__cta' index.html         # erwartet: > 0
grep -c 'kontakt-nachricht' index.html # erwartet: 0 (Feld entfernt)
```

- [ ] **Step 3: Cache-Busting-Timestamp prüfen**

```bash
grep -o 'v=[0-9]*' index.html | sort -u
```

Erwartet: genau EIN einheitlicher Timestamp-Wert für alle `?v=`-Query-Parameter (siehe AGENTS.md Punkt 7 — mehrere unterschiedliche Timestamps wären ein Bug).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "chore: rebuild index.html from updated sections"
```

---

## Self-Review Checkliste (vom Plan-Autor bereits durchgeführt)

- ✅ Alle Änderungen zielen auf `sections/*.html` / `styles/*.css`, nicht auf `index.html` direkt
- ✅ Nur echte, in `tokens.css` existierende CSS-Variablen verwendet
- ✅ `paket-modal` unangetastet gelassen (wird von `services.html` benötigt)
- ✅ Kein erfundenes Backend — `kontakt.js` bleibt unverändert, Form-Validierung bleibt clientseitig
- ✅ "How We Operate" wird IN die Kontakt-Sektion integriert, nicht als neue Sektion davor
- ✅ Hero-CTA nutzt `position:absolute` und kollidiert nicht mit `.hero__scroll` oder der harten Height-Grenze
- ✅ `build.sh` SECTIONS-Array und Head-Heredoc werden konsistent mit den Datei-Löschungen aktualisiert
- ✅ Abschließender Rebuild-Task stellt sicher, dass `index.html` korrekt regeneriert wird
