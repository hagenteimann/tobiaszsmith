import re

# Edit more-work.css
with open('styles/more-work.css', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('.mw-item {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: var(--space-2);\n}', '.mw-item {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--space-2);\n}')
content = content.replace('.mw-item__label {\n  font-family: var(--font-body);\n  font-weight: 700;\n  color: var(--c-accent);\n  letter-spacing: 0.03em;\n  margin: 0;\n  transition: color var(--dur-fast) var(--ease-soft);\n  display: flex;\n  flex-direction: column;\n}', '.mw-item__label {\n  font-family: var(--font-body);\n  font-weight: 700;\n  color: var(--c-accent);\n  letter-spacing: 0.03em;\n  margin: 0;\n  transition: color var(--dur-fast) var(--ease-soft);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}')

with open('styles/more-work.css', 'w', encoding='utf-8') as f:
    f.write(content)

# Edit kontakt.html
with open('sections/kontakt.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<ol class=\"kontakt__process reveal--stagger\">\n        <li class=\"kontakt__process-step reveal\">', '<ol class=\"kontakt__process reveal--stagger\">\n        <li class=\"kontakt__process-line reveal\" aria-hidden=\"true\" role=\"presentation\"></li>\n        <li class=\"kontakt__process-step reveal\">')

with open('sections/kontakt.html', 'w', encoding='utf-8') as f:
    f.write(content)

# Edit kontakt.css
with open('styles/kontakt.css', 'r', encoding='utf-8') as f:
    content = f.read()

new_css = '''
.kontakt__process {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-4) var(--space-6);
  width: fit-content;
  max-width: 60rem;
  margin-inline: auto;
  padding: 0;
  position: relative;
}

.kontakt__process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  text-align: center;
  max-width: 8rem;
  flex: 1 1 0;
  min-width: 6rem;
  position: relative;
  z-index: 1;
}

.kontakt__process-line {
  display: none;
}

@media (min-width: 60em) {
  .kontakt__process-line {
    display: block;
    position: absolute;
    top: calc(1.75rem / 2);
    left: 4rem;
    right: 4rem;
    height: 2px;
    background: var(--c-accent);
    z-index: 0;
  }
  .kontakt__process-line.reveal {
    opacity: 1;
    transform: scaleX(0);
    transform-origin: left center;
  }
  .kontakt__process-line.reveal.is-visible {
    transform: scaleX(1);
    transition: transform 1.5s ease-in-out 0.2s;
  }
}
'''
content = content.replace('.kontakt__process {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: var(--space-4) var(--space-6);\n  width: 100%;\n  max-width: 60rem;\n  margin-inline: auto;\n  padding: 0;\n}', new_css.strip())
content = content.replace('.kontakt__process-step {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: var(--space-1);\n  text-align: center;\n  max-width: 8rem;\n}', '') # we already added it above in new_css

with open('styles/kontakt.css', 'w', encoding='utf-8') as f:
    f.write(content)
