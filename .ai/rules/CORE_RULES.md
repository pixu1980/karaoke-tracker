#
# CORE_RULES

Documento delle regole vincolanti per gli agenti/assistenti AI che lavorano su Karaoke Tracker.

Queste regole sono obbligatorie: ogni prompt o azione automatizzata deve rispettarle. In caso di conflitto tra regole, seguire l'ordine qui riportato.

## Regola fissa (obbligatoria)
- **Evita SEMPRE la sycophancy.** Ogni output, risposta o suggerimento deve essere professionale, diretto e privo di adulazione o linguaggio servile. Questa regola è immutabile e deve essere applicata a tutti i prompt, risposte e generazioni testuali.

## Scopo e ambito
- Si applica a tutte le modifiche al codice, ai template, ai CSS, alla documentazione e ai commit nel repository `karaoke-tracker`.
- Si applica a tutti gli assistenti AI, script automatizzati (CI), e contributori umani che seguono le istruzioni in `.ai/`.

## Convenzioni generali
- Package manager: `pnpm` (vedi `pnpm-lock.yaml` e `pnpm-workspace.yaml`).
- Modulo: ES Modules (import/export). Evitare CommonJS nelle nuove aggiunte.
- Prefisso custom elements: usare `kt-` per tutti i Web Components (es. `kt-song-card`).
- Eventi globali: usare CustomEvent con nomi in kebab-case, ad es. `singers:updated`, `songs:updated`, `performances:updated`.

## Naming e struttura dei componenti
- File JS: `PascalCase.js` per la classe exportata (es. `SongCard.js`) con `customElements.define('kt-<kebab-name>', ClassName)`.
- File template: `<ComponentName>.template.html` nello stesso folder del componente.
- File CSS: `<ComponentName>.css`, preferire selettori element-first e scoping tramite tag del componente (es. `kt-song-card ...`).

## CSS
- Preferire selettori element/attribute-first, poco specifici, es.: `kt-song-card`, `kt-song-card button[data-variant="primary"]`.
- Consentito l'operatore `&` SOLO per pseudo-classi e attribute combinators (`&:hover`, `&[aria-*]`).
- È consentito l'uso di CSS nesting (se il toolchain lo supporta) per organizzare regole sotto il tag del componente.
- Usare variabili CSS per temi e colori (`--color-primary`, `--space-md`, ecc.).

## HTML / template
- Preferire markup semantico: `section`, `article`, `header`, `footer`, `fieldset`, `label`.
- Evitare BEM pesante nelle nuove modifiche; usare `data-role` o attributi per collegare JS/CSS quando serve mantenere ruoli (es. `data-role="message"`).
- I template devono essere autosufficienti: non fare affidamento su classi globali non dichiarate nel CSS del componente.

## JavaScript
- Evitare manipolazioni inline che alterano la struttura semantica del DOM in modo permanente; preferire aggiornare contenuti e attributi.
- Trattare `'0'` come valore valido quando rappresenta dati (es. key `0`): non considerare `0`/"0" come falsy per l'assenza del valore.
- Aggiornamenti UI: quando un'entità muta (es. modifica nome cantante), dispatchare gli eventi rilevanti per aggiornare tutte le view: `singers:updated`, `songs:updated`, `performances:updated`.

## Accessibilità (A11Y)
- Fornire labels visibili o `aria-label` per controlli non testuali.
- Usare `role`/`aria-*` dove necessario (es. `role="dialog"` gestito dal wrapper `pix-dialog`).
- Focus management: quando un dialog si apre, mettere il focus su un controllo significativo.

## Sicurezza e privacy
- Non includere dati sensibili nei log o nei templates pubblici.
- Validare e sanitizzare tutte le stringhe che verranno renderizzate in template per prevenire XSS.

## Testing e qualità
- Se scrivi codice non banale, aggiungi un piccolo test manuale o unitario (quando possibile) e istruzioni per verificarlo.
- Evitare refactor massivi senza ticket o PR descrittivo.

## Documentazione e comunicazione
- Aggiorna `.ai/README.md` o i file nello stesso folder se introduci nuove convenzioni o strumenti.
- Aggiorna la TODO list (`.ai/` o repository TODO) per i task lunghi o multi-step.

## Prompting e comportamento dell'agente
- Quando generi istruzioni per umani o per altri agenti, includi sempre: scopo, passaggi chiave, file da modificare.
- Non fare assunzioni non dichiarate nel repository; se necessario chiedere una conferma al maintainer.

## Eccezioni
- Eventuali eccezioni devono essere documentate nel PR e approvate da un maintainer.

---
Ultimo aggiornamento: 2026-01-01

