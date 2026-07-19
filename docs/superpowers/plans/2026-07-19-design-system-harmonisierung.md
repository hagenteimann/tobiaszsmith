# Design-System-Harmonisierung Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Website auf ein einheitliches Spacing-, Typografie- und Komponenten-System umstellen (Radius-Token, Primary-Button-Konsolidierung, Section-Rhythmus, Card-Padding, Font-Weight-System) — basierend auf dem Audit gegen das `designguid`-Repo. Ziel: gleichmäßige Abstände, mehr Luft, keine Magic Numbers, keine dupliziertes CSS für strukturell identische Elemente.

**Architecture:** Build-System bleibt unverändert — `index.html` wird von `build.sh` aus `sections/*.html`-Fragmenten generiert. **Alle Änderungen erfolgen an `sections/*.html`, `styles/*.css` — niemals direkt an `index.html`.** Nach allen Änderungen wird `bash build.sh` ausgeführt.

**Tech Stack:** Vanilla HTML/CSS/JS, keine Frameworks.

**Design-Entscheidungen (bereits getroffen, nicht mehr zu klären):**
- Die drei CTA-Buttons `.hero__cta`, `.operate__cta`, `.kontakt__quick-link` sind bereits pixelgenau identisch (flach, kein Radius, `padding: 0.75rem 1.25rem`, `font-body` 700, uppercase). Das ist die **etablierte** visuelle Linie der Seite (bestätigt durch 3 unabhängige, konsistente Implementierungen). Die in `base.css` vorhandene, aber nirgends genutzte `.btn--primary`-Klasse hat einen abweichenden Pill-Radius (`--radius-full`) + Glow-Schatten — das ist vermutlich ein verwaistes früheres Experiment, NICHT die Zielvorgabe. Entscheidung: `.btn`/`.btn--primary` in `base.css` wird auf die etablierte flache Linie umgestellt (0 sichtbare Änderung an den 3 bestehenden Buttons), damit künftig alle Primary-CTAs eine einzige Quelle haben.
- `.kontakt__submit`, `.services__cta`, `.paket-card__cta` bleiben eigenständige Komponenten (echte funktionale Unterschiede: Full-Width-Submit mit Display-Font, Card-internes Light/Dark-Theming, unterschiedliche Schriftfamilien) — nur ihre Magic-Number-Radien werden tokenisiert, keine Zusammenlegung mit `.btn--primary`.
- `.services__card`, `.testimonials__card`, `.kontakt__form`, `.paket-card` bleiben eigenständige Komponenten (unterschiedliche Hintergründe/Border/Schatten sind bewusstes Design), aber ihr Innenabstand wird auf eine gemeinsame fluide Skala vereinheitlicht — das erzeugt spürbar mehr und gleichmäßigere "Luft", ohne die visuelle Identität jeder Card zu verändern.
- Section-Vertikalabstand wird auf `var(--space-8)` für ALLE Sections vereinheitlicht (inkl. bisheriger Ausreißer `clients`, `footer`, `behind-scenes`) — das ist die explizite Nutzeranforderung nach durchgängiger Gleichmäßigkeit.

---

## Task 1: Radius-Token vereinheitlichen (`--radius-xs`)

**Files:**
- Modify: `styles/tokens.css`
- Modify: `styles/kontakt.css`
- Modify: `styles/footer.css`
- Modify: `styles/services.css`
- Modify: `styles/paket-modal.css`

**Goal:** Ein fehlendes 4px-Radius-Token ergänzen und vier unabhängige lokale Duplikate (`--k-radius`, `--f-radius`, `--services-radius`, sowie ein hartkodiertes `4px` in `paket-modal.css`) darauf umstellen.

- [ ] **Step 1: Token in `styles/tokens.css` ergänzen**

Aktueller Zustand (Zeilen 65-69):
```css
  /* ---------- Radius ---------- */
  --radius-sm:   10px;
  --radius-md:   16px;
  --radius-lg:   20px;
  --radius-full: 999px;
```

Ersetze durch:
```css
  /* ---------- Radius ---------- */
  --radius-xs:   4px;
  --radius-sm:   10px;
  --radius-md:   16px;
  --radius-lg:   20px;
  --radius-full: 999px;
```

- [ ] **Step 2: `styles/kontakt.css` — `--k-radius` durch `--radius-xs` ersetzen**

Aktueller Zustand (Zeile 9):
```css
  --k-radius: 4px;                                     /* Figma-Radius fuer Inputs/Buttons/Boxen (kein Token deckt 4px ab) */
```

Ersetze durch:
```css
  --k-radius: var(--radius-xs);                        /* Inputs/Buttons/Boxen */
```

(Alle Verwendungen von `var(--k-radius)` im Rest der Datei bleiben unverändert — sie lösen jetzt korrekt zum zentralen Token auf.)

Zusätzlich, `.kontakt__quick-link` (Zeile ~259) nutzt aktuell hartkodiertes `border-radius: 4px;` statt `var(--k-radius)` — ändere dort ebenfalls zu `border-radius: var(--k-radius);`. Suche die Regel per `grep -n "border-radius: 4px" styles/kontakt.css` um die exakte Zeile zu bestätigen, bevor du änderst.

- [ ] **Step 3: `styles/footer.css` — `--f-radius` durch `--radius-xs` ersetzen**

Aktueller Zustand (Zeile 7):
```css
  --f-radius: 4px;              /* Figma-Radius fuer Social-Icon-Boxen (kein Token deckt 4px ab) */
```

Ersetze durch:
```css
  --f-radius: var(--radius-xs); /* Social-Icon-Boxen */
```

- [ ] **Step 4: `styles/services.css` — `--services-radius` durch `--radius-xs` ersetzen**

Aktueller Zustand (im `.services {...}`-Block):
```css
.services {
  --services-radius: 4px;
```

Ersetze durch:
```css
.services {
  --services-radius: var(--radius-xs);
```

- [ ] **Step 5: `styles/paket-modal.css` — hartkodiertes `4px` in `.paket-card__cta` ersetzen**

Suche per `grep -n "border-radius: 4px" styles/paket-modal.css` die `.paket-card__cta`-Regel und ändere `border-radius: 4px;` zu `border-radius: var(--radius-xs);`.

- [ ] **Step 6: Verifizieren**

```bash
grep -rn "radius: 4px\|radius:4px" styles/*.css
```

Erwartetes Ergebnis: keine Treffer mehr (alle 4px-Radien laufen jetzt über `var(--radius-xs)`).

- [ ] **Step 7: Commit**

```bash
git add styles/tokens.css styles/kontakt.css styles/footer.css styles/services.css styles/paket-modal.css
git commit -m "refactor(tokens): add --radius-xs, replace scattered 4px duplicates"
```

---

## Task 2: Primary-Button konsolidieren (`.btn`/`.btn--primary`)

**Files:**
- Modify: `styles/base.css`
- Modify: `styles/hero.css`
- Modify: `styles/portfolio.css`
- Modify: `styles/kontakt.css`
- Modify: `sections/hero.html`
- Modify: `sections/portfolio.html`
- Modify: `sections/kontakt.html`

**Goal:** `.hero__cta`, `.operate__cta`, `.kontakt__quick-link` sind aktuell pixelgenau dieselbe Button-Optik, dreifach dupliziert. Die vorhandene, aber ungenutzte `.btn`/`.btn--primary`-Klasse in `base.css` wird zur echten gemeinsamen Basis — auf die bereits etablierte, flache Optik umgestellt (keine sichtbare Änderung an den 3 bestehenden Buttons).

- [ ] **Step 1: `.btn`/`.btn--primary` in `styles/base.css` auf die etablierte flache Optik umstellen**

Aktueller Zustand (Zeilen 76-101):
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0.9em 2em;
  border-radius: var(--radius-full);
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-label-btn);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  transition: transform var(--dur-fast) var(--ease-soft),
              box-shadow var(--dur-fast) var(--ease-soft),
              background-color var(--dur-fast) var(--ease-soft);
}

.btn--primary {
  background: var(--c-accent);
  color: var(--c-white);
  box-shadow: var(--shadow-accent);
}
.btn--primary:hover { background: var(--c-accent-hover); transform: translateY(-2px); }
.btn--primary:active { transform: translateY(0); }
```

Ersetze durch:
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0.75rem 1.25rem;
  border: none;
  cursor: pointer;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-label-btn);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  white-space: nowrap;
  transition: background-color var(--dur-fast) var(--ease-soft),
              transform var(--dur-fast) var(--ease-soft);
}

.btn--primary {
  background: var(--c-accent);
  color: var(--c-white);
}
.btn--primary:hover,
.btn--primary:focus-visible { background: var(--c-accent-hover); transform: translateY(-2px); }
.btn--primary:active { transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
}
```

(`.btn--ghost` direkt darunter bleibt unverändert — wird aktuell nirgends genutzt, ist aber als künftige sekundäre Variante sinnvoll und nicht Teil dieses Tasks.)

- [ ] **Step 2: `sections/hero.html` — Klassen ergänzen, Text/Struktur unverändert lassen**

Aktueller Zustand (Zeilen 15-17):
```html
  <a class="hero__cta" href="#kontakt" aria-label="Jetzt Projekt starten">
    JETZT PROJEKT STARTEN
  </a>
```

Ersetze durch:
```html
  <a class="hero__cta btn btn--primary" href="#kontakt" aria-label="Jetzt Projekt starten">
    JETZT PROJEKT STARTEN
  </a>
```

- [ ] **Step 3: `styles/hero.css` — `.hero__cta` auf reine Positionierung reduzieren**

Aktueller Zustand (kompletter Block, ca. Zeilen 303-362):
```css
/* ---------- Hero-CTA: dezenter Button oberhalb des Scroll-Hinweises ----------
   Wie .hero__scroll absolut positioniert -- kein Hoehenbudget-Verbrauch der
   Stage, keine Kollision mit der harten .hero{height:...}-Grenze. Uebernimmt
   bewusst 1:1 den Stil von .operate__cta (styles/portfolio.css) -- selber
   CTA-Text "JETZT PROJEKT STARTEN" an anderer Stelle der Seite, daher hier
   kein eigener, lauterer Button-Stil (kein Glow-Schatten, kein Radius,
   kompakteres Padding), sondern optische Konsistenz zum Rest der Website. */
.hero__cta {
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: clamp(4rem, 3rem + 3vw, 5.5rem);
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  background: var(--c-accent);
  color: var(--c-white);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-label-btn);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  white-space: nowrap;
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
    padding: 0.7rem 1.1rem;
    font-size: var(--fs-body-sm);
    bottom: clamp(4.25rem, 3.75rem + 2vw, 5.5rem);
  }
}

@media (max-width: 400px) {
  .hero__cta {
    padding: 0.6rem 0.9rem;
    font-size: 0.7rem;
    letter-spacing: 0.12em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__cta {
    transition: none;
  }
}
```

Ersetze durch (behält Positionierung + responsive `bottom`-Werte und Kollisionsfreiheit zu `.hero__scroll`, delegiert die komplette visuelle Button-Optik an `.btn.btn--primary`):
```css
/* ---------- Hero-CTA: Positionierung ----------
   Wie .hero__scroll absolut positioniert -- kein Hoehenbudget-Verbrauch der
   Stage, keine Kollision mit der harten .hero{height:...}-Grenze. Die
   visuelle Optik kommt komplett von .btn.btn--primary (base.css) --
   hier nur Position/Transform, keine Duplikation von Button-Styles. */
.hero__cta {
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: clamp(4rem, 3rem + 3vw, 5.5rem);
  transform: translateX(-50%);
}

.hero__cta:hover,
.hero__cta:focus-visible {
  transform: translateX(-50%) translateY(-2px);
}

.hero__cta:active {
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 768px) {
  .hero__cta {
    bottom: clamp(4.25rem, 3.75rem + 2vw, 5.5rem);
  }
}
```

Hinweis: `padding`/`font-size` auf sehr kleinen Screens (vorher `@media (max-width: 400px)`) werden bewusst NICHT mehr separat verkleinert — `.btn` nutzt jetzt überall dieselbe Größe wie `.operate__cta` (das auf der Portfolio-Seite bei jeder Breite ohne eigene Mobile-Verkleinerung auskommt). Falls der Text auf sehr schmalen Screens (< 360px) eng wird, greift `white-space: nowrap` aus `.btn` nicht mehr — daher zusätzlich prüfen (Step 6 unten).

- [ ] **Step 4: `sections/portfolio.html` — Klassen ergänzen**

Aktueller Zustand (Zeile 62):
```html
      <a href="#kontakt" class="operate__cta">JETZT PROJEKT STARTEN</a>
```

Ersetze durch:
```html
      <a href="#kontakt" class="btn btn--primary">JETZT PROJEKT STARTEN</a>
```

(Die Klasse `operate__cta` entfällt hier komplett — sie hatte keine eigene Positionierung, nur die jetzt zentralisierte Button-Optik.)

- [ ] **Step 5: `styles/portfolio.css` — `.operate__cta`-Regeln entfernen**

Aktueller Zustand (kompletter Block):
```css
.operate__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  background: var(--c-accent);
  color: var(--c-white);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-label-btn);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  transition: background-color var(--dur-fast) var(--ease-soft),
              transform var(--dur-fast) var(--ease-soft);
}

.operate__cta:hover {
  background: var(--c-accent-hover);
  transform: translateY(-2px);
}

.operate__cta:active {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .operate__cta {
    transition: none;
  }
}
```

Lösche diesen kompletten Block ersatzlos. `.portfolio__cta-row` (der umgebende Layout-Container) bleibt unverändert erhalten.

- [ ] **Step 6: `sections/kontakt.html` — Klassen an den WhatsApp/Instagram-Quick-Links ergänzen**

Aktueller Zustand (Ausschnitt, WhatsApp-Link):
```html
            <a class="kontakt__quick-link" href="https://wa.me/4917689203110" target="_blank" rel="noopener noreferrer" aria-label="Schreib uns auf WhatsApp">
```

Ersetze durch:
```html
            <a class="kontakt__quick-link btn btn--primary" href="https://wa.me/4917689203110" target="_blank" rel="noopener noreferrer" aria-label="Schreib uns auf WhatsApp">
```

Und analog beim Instagram-Link (`kontakt__quick-link` → `kontakt__quick-link btn btn--primary`, restliche Attribute unverändert).

- [ ] **Step 7: `styles/kontakt.css` — `.kontakt__quick-link` auf Layout-Restwerte reduzieren**

Aktueller Zustand (kompletter Block):
```css
.kontakt__quick-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-xs);
  background: var(--c-accent);
  color: var(--c-white);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--fs-label-btn);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  transition: background-color var(--dur-fast) var(--ease-soft),
              transform var(--dur-fast) var(--ease-soft);
}

.kontakt__quick-link svg {
  flex-shrink: 0;
}

.kontakt__quick-link:hover,
.kontakt__quick-link:focus-visible {
  background: var(--c-accent-hover);
  transform: translateY(-2px);
}

.kontakt__quick-link:active {
  transform: translateY(0);
}
```

(Hinweis: `border-radius: var(--radius-xs);` stammt aus Task 1 Step 2 — falls Task 1 bereits ausgeführt wurde, ist die Zeile schon so vorhanden.)

Ersetze durch:
```css
.kontakt__quick-link svg {
  flex-shrink: 0;
}
```

(`.btn.btn--primary` liefert jetzt Padding, Radius, Farbe, Typografie, Hover/Active komplett. `gap: var(--space-2)` kommt bereits aus `.btn`. Nur die SVG-spezifische `flex-shrink`-Regel bleibt als eigenständiger Rest.)

- [ ] **Step 8: Verifizieren**

```bash
grep -n "operate__cta\|kontakt__quick-link {" styles/portfolio.css styles/kontakt.css
```

Erwartung: `.operate__cta` liefert keinen Treffer mehr in `styles/portfolio.css`, `.kontakt__quick-link {` liefert keinen Treffer mehr in `styles/kontakt.css` (nur noch der `svg`-Selektor).

```bash
grep -c "btn btn--primary" sections/hero.html sections/portfolio.html sections/kontakt.html
```

Erwartung: `sections/hero.html` → 1, `sections/portfolio.html` → 1, `sections/kontakt.html` → 2 (WhatsApp + Instagram).

- [ ] **Step 9: Commit**

```bash
git add styles/base.css styles/hero.css styles/portfolio.css styles/kontakt.css sections/hero.html sections/portfolio.html sections/kontakt.html
git commit -m "refactor(buttons): consolidate hero/operate/quick-link CTAs into shared .btn.btn--primary"
```

---

## Task 3: Section-Vertikalrhythmus vereinheitlichen

**Files:**
- Modify: `styles/behind-scenes.css`
- Modify: `styles/clients.css`
- Modify: `styles/footer.css`

**Goal:** Alle drei Ausreißer (`--space-9`, zweimal `--space-7`) auf den site-weiten Standard `var(--space-8)` heben — durchgängig gleichmäßiger Rhythmus.

- [ ] **Step 1: `styles/behind-scenes.css`**

Aktueller Zustand:
```css
  padding-block: var(--space-9);
```

Ersetze durch:
```css
  padding-block: var(--space-8);
```

- [ ] **Step 2: `styles/clients.css`**

Aktueller Zustand (Zeile 12):
```css
  padding-block: var(--space-7);
```

Ersetze durch:
```css
  padding-block: var(--space-8);
```

- [ ] **Step 3: `styles/footer.css`**

Aktueller Zustand (im `.footer {...}`-Block):
```css
  padding-block: var(--space-7);
```

Ersetze durch:
```css
  padding-block: var(--space-8);
```

- [ ] **Step 4: Verifizieren**

```bash
grep -rn "padding-block: var(--space-[79])" styles/*.css
```

Erwartung: keine Treffer mehr außerhalb bewusst anderer Kontexte (z.B. `nav.css` mit `--space-2` ist kein Section-Rhythmus-Fall und bleibt unberührt — falls der Grep dort trotzdem etwas anderes findet, das NICHT anfassen, nur `--space-7`/`--space-9` in Section-Padding-Kontexten sind relevant).

- [ ] **Step 5: Commit**

```bash
git add styles/behind-scenes.css styles/clients.css styles/footer.css
git commit -m "style(rhythm): unify section vertical padding to --space-8 across the board"
```

---

## Task 4: Card-Padding vereinheitlichen

**Files:**
- Modify: `styles/tokens.css`
- Modify: `styles/services.css`
- Modify: `styles/testimonials.css`
- Modify: `styles/kontakt.css`
- Modify: `styles/paket-modal.css`

**Goal:** Vier unabhängige, eng bemessene Card-Padding-Skalen (`--card-pad` 1.25–1.75rem, `--testimonials-card-pad` 1.5–2.25rem, `--k-card-pad` 1.5–3rem, `paket-card`'s fixes `var(--space-4)` = 1.5rem) durch eine gemeinsame, großzügigere fluide Skala ersetzen — mehr und gleichmäßigere Luft in allen Cards, ohne deren individuelle Hintergrund-/Rahmen-/Schatten-Identität zu verändern.

- [ ] **Step 1: Neues Token in `styles/tokens.css` ergänzen**

Füge im `/* ---------- Spacing ... ---------- */`-Block (nach der Zeile mit `--space-9`, vor `--container-max`) folgende Zeile ein:

```css
  --space-card-pad: clamp(1.5rem, 1.1rem + 2vw, 2.5rem); /* einheitliches Card-Innenabstand-Fluid fuer alle Card-Komponenten */
```

- [ ] **Step 2: `styles/services.css` — `.services__card`**

Aktueller Zustand:
```css
.services__card {
  --card-pad: clamp(1.25rem, 1.05rem + 0.9vw, 1.75rem); /* 20px → 28px */
  --card-gap: clamp(0.875rem, 0.7rem + 0.75vw, 1.25rem); /* 14px → 20px */

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--card-gap);
  padding: var(--card-pad);
  border-radius: var(--services-radius);
  box-shadow: var(--shadow-card);
  transition: transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft);
}
```

Ersetze durch (nur `--card-pad`-Zeile entfernt, `padding` nutzt jetzt direkt das globale Token):
```css
.services__card {
  --card-gap: clamp(0.875rem, 0.7rem + 0.75vw, 1.25rem); /* 14px → 20px */

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--card-gap);
  padding: var(--space-card-pad);
  border-radius: var(--services-radius);
  box-shadow: var(--shadow-card);
  transition: transform var(--dur-fast) var(--ease-soft), box-shadow var(--dur-fast) var(--ease-soft);
}
```

- [ ] **Step 3: `styles/testimonials.css` — `.testimonials__card`**

Aktueller Zustand (Custom Property im `.testimonials {...}`-Block):
```css
  --testimonials-card-pad: clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem);   /* 24px → 36px */
```

Lösche diese Zeile ersatzlos.

Aktueller Zustand (`.testimonials__card`-Block):
```css
.testimonials__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  flex: 0 0 auto;
  width: min(85vw, 26rem);
  padding: var(--testimonials-card-pad);
  background: var(--c-white);
  border: 1px solid var(--c-border-light);
  border-radius: var(--radius-sm);
}
```

Ersetze `padding: var(--testimonials-card-pad);` durch `padding: var(--space-card-pad);`.

- [ ] **Step 4: `styles/kontakt.css` — `.kontakt__form`**

Aktueller Zustand (Custom Property im `.kontakt {...}`-Block):
```css
  --k-card-pad: clamp(1.5rem, 1rem + 3vw, 3rem),        /* 24px -> 48px */
```

Lösche diese Zeile ersatzlos (exaktes Zeichen am Ende — Komma oder Semikolon — beim Löschen prüfen, damit die umgebende Custom-Property-Liste syntaktisch korrekt bleibt).

Aktueller Zustand (`.kontakt__form`-Block):
```css
.kontakt__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  width: 100%;
  max-width: var(--k-form-max);
  padding: var(--k-card-pad);
  background: var(--c-white);
  border: 1px solid var(--c-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}
```

Ersetze `padding: var(--k-card-pad);` durch `padding: var(--space-card-pad);`.

- [ ] **Step 5: `styles/paket-modal.css` — `.paket-card`**

Aktueller Zustand:
```css
.paket-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--c-bg-elevated);
  border-radius: var(--radius-md);
  border: 1px solid var(--c-border-hair);
}
```

Ersetze `padding: var(--space-4);` durch `padding: var(--space-card-pad);`.

- [ ] **Step 6: Verifizieren**

```bash
grep -rn "card-pad" styles/*.css
```

Erwartung: NUR noch `--space-card-pad` (Definition in `tokens.css` + 4 Verwendungen in services/testimonials/kontakt/paket-modal). Keine `--card-pad`, `--testimonials-card-pad`, `--k-card-pad` mehr vorhanden.

- [ ] **Step 7: Commit**

```bash
git add styles/tokens.css styles/services.css styles/testimonials.css styles/kontakt.css styles/paket-modal.css
git commit -m "style(cards): unify card padding across services/testimonials/kontakt/paket-modal via shared --space-card-pad"
```

---

## Task 5: Typografie-Feinschliff (Font-Weight-System, Line-Height-Token)

**Files:**
- Modify: `styles/nav.css`
- Modify: `styles/kontakt.css`
- Modify: `styles/testimonials.css`
- Modify: `styles/tokens.css`

**Goal:** Die Website nutzt sonst konsequent Font-Weights 400/500/700. Vier Stellen weichen mit `600` davon ab, ohne erkennbaren Grund (gleiche Rolle wie Geschwister-Elemente, die 400/500/700 nutzen). Zusätzlich wird eine Magic-Number-`line-height` als benanntes Token dokumentiert.

- [ ] **Step 1: `styles/nav.css` — `.nav__link` und `.nav__drawer-link` auf gleiches Gewicht (500)**

Aktueller Zustand (Zeile 55-58):
```css
.nav__link {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--fs-nav);
```

Ändere `font-weight: 400;` zu `font-weight: 500;`.

Aktueller Zustand (Zeile 187-190):
```css
.nav__drawer-link {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: var(--fs-subheading);
```

Bereits `500` — keine Änderung nötig, dient nur als Bestätigung, dass beide Nav-Link-Typen jetzt übereinstimmen.

- [ ] **Step 2: `styles/nav.css` — `.nav__link.is-active` von 600 auf 700**

Aktueller Zustand (Zeile 80-82):
```css
.nav__link.is-active {
  font-weight: 600;
  color: var(--c-accent);
```

Ändere `font-weight: 600;` zu `font-weight: 700;` (passt sich dem sitweiten 400/500/700-System an — 700 markiert konsistent "hervorgehoben/aktiv", wie z.B. `.kontakt__eyebrow` oder `.kontakt__item-label`).

**Wichtig:** `.nav__drawer-social` (Zeile ~197-203) hat ebenfalls `font-weight: 600` — das ist eine visuell andere Rolle (Uppercase-Label mit Icon, kein Nav-Link) und bleibt in diesem Task UNVERÄNDERT.

- [ ] **Step 3: `styles/kontakt.css` — `.kontakt__field label` von 600 auf 700**

Aktueller Zustand (Zeile 357-362):
```css
.kontakt__field label {
  font-weight: 600;
  font-size: var(--fs-body-sm);
  letter-spacing: 0.5px;
  color: var(--c-text-dim);
}
```

Ändere `font-weight: 600;` zu `font-weight: 700;` (passt sich `.kontakt__item-label` an, das ebenfalls 700 nutzt für dieselbe Rolle "Feld-/Info-Label").

- [ ] **Step 4: `styles/kontakt.css` — `.kontakt__field--checkbox label` konsistent zu normalem Fließtext**

Aktueller Zustand (Zeile 398-403):
```css
.kontakt__field--checkbox label {
  font-weight: 500;
  font-size: var(--fs-body-sm);
  color: var(--c-text-dim);
  cursor: pointer;
}
```

Ändere `font-weight: 500;` zu `font-weight: 400;` (die DSGVO-Einwilligungszeile ist Fließtext/Legal-Copy, keine hervorgehobene Feld-Bezeichnung wie die anderen Labels — 400 grenzt sie bewusst von den echten Feld-Labels aus Step 3 ab, statt im selben 500er-Niemandsland wie vorher zu stehen).

- [ ] **Step 5: `styles/testimonials.css` — `line-height: 0.8` als benanntes Token dokumentieren**

Aktueller Zustand (`.testimonials__quote`-Block, Zeile 95-100):
```css
.testimonials__quote {
  font-family: var(--font-display);
  font-size: var(--testimonials-quote-size);
  line-height: 0.8;
  color: var(--c-accent);
}
```

Füge in `styles/tokens.css` im `/* Fluid Type Scale */`-Bereich (nach `--lh-body`) folgende Zeile ein:
```css
  --lh-display-quote: 0.8; /* extrem enge Zeilenhoehe fuer das grosse Anfuehrungszeichen-Glyph in Testimonials, bewusste Ausnahme von --lh-tight */
```

Ändere in `styles/testimonials.css` `line-height: 0.8;` zu `line-height: var(--lh-display-quote);`.

- [ ] **Step 6: Verifizieren**

```bash
grep -rn "font-weight: 600" styles/nav.css styles/kontakt.css
```

Erwartung: In `styles/nav.css` nur noch `.nav__drawer-social` (bewusst unverändert). In `styles/kontakt.css` keine Treffer mehr.

```bash
grep -n "line-height: 0.8" styles/testimonials.css
```

Erwartung: keine Treffer mehr (jetzt `var(--lh-display-quote)`).

- [ ] **Step 7: Commit**

```bash
git add styles/nav.css styles/kontakt.css styles/testimonials.css styles/tokens.css
git commit -m "style(typography): normalize stray font-weights to the 400/500/700 system, tokenize quote line-height"
```

---

## Task 6: Rebuild und Gesamt-Verifikation

**Files:**
- Regenerate: `index.html` (via `build.sh`)

**Goal:** `index.html` neu bauen und sicherstellen, dass alle 5 vorherigen Tasks korrekt zusammenspielen, keine Regressionen entstanden sind.

- [ ] **Step 1: Build ausführen**

```bash
bash build.sh
```

Erwartete Ausgabe: `index.html gebaut (<N> Zeilen).`

- [ ] **Step 2: Struktur-Verifikation**

```bash
grep -c "btn btn--primary" index.html
grep -c "class=\"operate__cta\"" index.html
grep -c "radius: 4px" index.html
grep -o 'v=[0-9]*' index.html | sort -u
```

Erwartung: `btn btn--primary` → 4 (Hero + Portfolio + 2x Kontakt-Quick-Links), `operate__cta` → 0, `radius: 4px` → 0 (index.html enthält kein CSS, dieser Grep dient nur als Doppelcheck falls doch Inline-Styles existieren sollten), Cache-Bust-Timestamp → genau EIN einheitlicher Wert.

- [ ] **Step 3: Token-Konsistenz-Endprüfung über alle Stylesheets**

```bash
grep -rn "radius: 4px\|--card-pad:\|--testimonials-card-pad:\|--k-card-pad:" styles/*.css
```

Erwartung: keine Treffer mehr (alle in den vorherigen Tasks bereits auf Tokens umgestellt).

```bash
grep -rn "padding-block: var(--space-7)\|padding-block: var(--space-9)" styles/*.css
```

Erwartung: keine Treffer außerhalb bewusst unveränderter Nicht-Section-Kontexte.

- [ ] **Step 4: Visuelle Stichprobe**

Öffne `index.html` per Read-Tool an den Stellen Hero-CTA, Portfolio-CTA, Kontakt-Quick-Links, Services-Cards, Testimonials-Cards, Kontakt-Formular — bestätige wohlgeformtes HTML ohne abgeschnittene Tags an den Fragment-Übergängen.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "chore: rebuild index.html after design-system harmonization"
```

---

## Self-Review Checkliste (vom Plan-Autor bereits durchgeführt)

- ✅ Alle Änderungen zielen auf `sections/*.html`/`styles/*.css`, nicht auf `index.html` direkt (Rebuild ist eigener letzter Task)
- ✅ Button-Konsolidierung verändert die sichtbare Optik der 3 bestehenden Buttons NICHT (identische Werte, nur zentralisiert)
- ✅ Card-Padding-Vereinheitlichung erhöht durchgängig die Innenabstände (mehr Luft), verändert aber nicht Hintergrund/Rahmen/Schatten der einzelnen Card-Typen (keine Vermischung unterschiedlicher visueller Identitäten)
- ✅ Section-Rhythmus-Vereinheitlichung ist eine reine Clamp-Anpassung, keine strukturelle Änderung
- ✅ Font-Weight-Normalisierung bewegt sich ausschließlich innerhalb des bereits etablierten 400/500/700-Systems, erfindet keine neue Skala
- ✅ `.services__cta`, `.kontakt__submit`, `.paket-card__cta` bewusst NICHT angefasst (echte funktionale Unterschiede, kein falscher Merge-Zwang)
- ✅ `.nav__drawer-social` bewusst von der Font-Weight-Normalisierung ausgenommen (andere Rolle)
- ✅ Jeder Task endet mit Grep-Verifikation vor dem Commit
- ✅ Kein Punkt in diesem Plan erfordert eine inhaltliche/geschäftliche Entscheidung des Nutzers — alles ist reine Design-System-Technik auf Basis bereits etablierter Muster der Seite
