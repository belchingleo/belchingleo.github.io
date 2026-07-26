# Portfolio visual system

## Direction

- **Genre:** editorial portfolio
- **Theme:** studied DNA from Jackie Zhang’s portfolio, adapted into a dark academic, tactile, restrained system
- **Audience:** readers arriving from a CV and people discovering the site outside a recruitment context
- **Primary path:** identity → selected work → experience / research / CV
- **Macrostructures:** Photographic Overlay on the homepage; Long Document on content pages
- **Navigation:** edge-aligned, persistent, no floating pill
- **Signature device:** irregular marginal notes and paper-edge details; the homepage portrait carries the only continuous spatial motion

## Principles

1. Chinese is the primary reading language. English appears only where it is a proper name, field term, or useful piece of metadata.
2. Real product recordings and original screenshots are the visual proof. No redrawn browser or macOS chrome.
3. `#8FA6FF` remains the only saturated anchor. Its visual footprint stays below roughly five percent.
4. Display typography uses a Chinese Song face; body copy uses a neutral Chinese sans. Monospace is reserved for dates, labels, and technical metadata.
5. Sections are separated by rhythm and alignment before rules. Containers are used only when a real object or bounded case needs one.
6. Motion is functional and quiet: a single page entrance, subtle pointer-based depth in the homepage portrait, and restrained media/link feedback. Reduced-motion and coarse-pointer users receive a static photograph.

## Composition

### Homepage

- Full-bleed photographic hero: the existing window portrait sits behind the typographic introduction.
- On precise pointers, a clean background plate, the original person, and near window details move at different depths. The person always comes from the original photograph rather than a generated likeness.
- Selected work is a sequence of two asymmetric diptychs.
- Tiptap and 云文献 use their real silent recordings; supporting text sits in a narrower reading column.
- Project metadata behaves like margin notes, not badges.

### Experience

- Each company begins with a wide editorial mast containing index, identity, role, date, and summary.
- Responsibilities remain open on the page; only true cases and bounded tasks receive a light surface.
- Repeated horizontal rules are replaced with spacing, indents, dots, and short accent ticks.

### Research & Writing

- Long-document rhythm with a narrow label rail and a wide reading column.
- Publications read like a bibliography annotated in plain language.
- Data journalism and public projects remain distinct subsections.

### CV

- Compact document grid with education first.
- Portrait is a supporting identity mark, not a hero.
- Dates and metadata align to a consistent narrow rail.

## Component choices

- Hero: photographic overlay — full-bleed original portrait, left reading column, directional dark scrim, restrained five-layer depth
- Work proof: floating real media, no fake device frame
- Section heads: S2 Hanging for major pages; S4 Inline for small subsections
- CTA: C3 Typographic link — underline + arrow, colour shift
- Footer: Ft2 Inline rule single line — spaced density
- Navigation: custom edge-aligned document mast derived from N9, with the required route cluster retained

## Token source

`tokens.css` is the source of truth. `hallmark.css` consumes only role-based tokens.

## Exports

### Tailwind v4

```css
@theme {
  --color-paper: oklch(16.2% 0.008 265);
  --color-paper-2: oklch(19.6% 0.009 265);
  --color-paper-3: oklch(23.5% 0.010 265);
  --color-ink: oklch(95.5% 0.008 88);
  --color-ink-2: oklch(79% 0.010 270);
  --color-muted: oklch(62% 0.012 270);
  --color-rule: oklch(30% 0.011 270);
  --color-accent: oklch(75.5% 0.126 270);
  --font-display: "Songti SC", "Noto Serif CJK SC", "Source Han Serif SC", STSong, serif;
  --font-body: "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", system-ui, sans-serif;
  --font-outlier: "SFMono-Regular", "IBM Plex Mono", Menlo, monospace;
}
```

### DTCG

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": {"$value": "oklch(16.2% 0.008 265)", "$type": "color"},
    "ink": {"$value": "oklch(95.5% 0.008 88)", "$type": "color"},
    "muted": {"$value": "oklch(62% 0.012 270)", "$type": "color"},
    "rule": {"$value": "oklch(30% 0.011 270)", "$type": "color"},
    "accent": {"$value": "oklch(75.5% 0.126 270)", "$type": "color"}
  },
  "font": {
    "display": {"$value": "Songti SC, Noto Serif CJK SC, Source Han Serif SC, STSong, serif", "$type": "fontFamily"},
    "body": {"$value": "PingFang SC, Noto Sans CJK SC, Microsoft YaHei, system-ui, sans-serif", "$type": "fontFamily"},
    "outlier": {"$value": "SFMono-Regular, IBM Plex Mono, Menlo, monospace", "$type": "fontFamily"}
  }
}
```

### shadcn/ui

```css
:root {
  --background: 16.2% 0.008 265;
  --foreground: 95.5% 0.008 88;
  --card: 19.6% 0.009 265;
  --card-foreground: 95.5% 0.008 88;
  --primary: 75.5% 0.126 270;
  --primary-foreground: 16.2% 0.008 265;
  --secondary: 23.5% 0.010 265;
  --secondary-foreground: 95.5% 0.008 88;
  --muted: 30% 0.011 270;
  --muted-foreground: 62% 0.012 270;
  --border: 30% 0.011 270;
  --ring: 80% 0.15 270;
  --radius: 0.75rem;
}
```
