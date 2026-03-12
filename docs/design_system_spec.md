# Chartered Design — Design System Specification
**Version 1.0 · March 2026**

---

## Visual Identity

**Style:** Technical Brutalism + Engineering Blueprint

The visual language draws from industrial technical manuals, architectural blueprints, and terminal interfaces. Every element feels stamped, pressed, or plotted — never soft or decorative. The site communicates precision, authority, and systematic rigor.

````carousel
![Hero Section — massive uppercase typography, schematic background, hard-shadow buttons](hero_section_1773192675893.png)
<!-- slide -->
![Manifesto Section — high-contrast dark mode, numbered axioms, accent border](manifesto_section_1773192828062.png)
<!-- slide -->
![Case Study Section — full-bleed accent background, oversized data typography](case_study_section_red_1773192854953.png)
````

---

## 1. Color Palette

The system is built on a strict **2-color print foundation** with one accent.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#EFEFE9` | Page background, warm off-white (uncoated stock) |
| `--ink` | `#0A0A0A` | Primary text, borders, structural elements |
| `--accent` | `#FF3B00` | Electric Vermilion — CTAs, highlights, error states, emphasis |

### Derived Usage

| Context | Value | Notes |
|---|---|---|
| White surfaces | `#FFFFFF` | Card backgrounds, input fields |
| Faded ink | `rgba(10,10,10,0.08)` | Grid lines, hatched patterns |
| Muted text | `black/50` – `black/80` | Secondary content via Tailwind opacity |
| Inverted section | `bg-black` + `text-[var(--paper)]` | Manifesto section |
| Accent section | `bg-[var(--accent)]` + `text-black` | Case study section |
| Selection highlight | `bg: var(--accent)` + `color: var(--paper)` | Text selection |
| Meta theme (mobile) | `#EFEFE9` | Matches `--paper` for address bar |

> [!TIP]
> The system intentionally avoids gradients, transparency, or color blending. Every surface is flat and opaque — mimicking offset printing.

---

## 2. Typography

### Font Stack

| Role | Family | Source |
|---|---|---|
| **Display / Headlines** | `Archivo` (400, 500, 700, 900) | Google Fonts |
| **Mono / Technical** | `JetBrains Mono` (400, 700, 800) | Google Fonts |
| **System Fallback** | `-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, sans-serif` | — |

```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;900&family=JetBrains+Mono:wght@400;700;800&display=swap');
```

### Type Classes

| Class | Properties | Usage |
|---|---|---|
| `.neo-grotesque` | `font-family: 'Archivo'; letter-spacing: -0.05em` | All display headlines |
| `.font-mono` | `font-family: 'JetBrains Mono', monospace` | Labels, badges, technical text, buttons |

### Type Scale (Headlines)

| Element | Size | Weight | Leading | Tracking | Case |
|---|---|---|---|---|---|
| **Hero H1** | `clamp(64px, 10vw, 140px)` | 900 | `0.85` | `tighter` (`-0.05em`) | UPPERCASE |
| **Section H2 (large)** | `clamp(40px, 6vw, 80px)` | 900 | `0.95` | `tight` | UPPERCASE |
| **Section H2** | `clamp(40px, 5vw, 72px)` | 900 | `1.0` | `tight` | UPPERCASE |
| **Card H3** | `28px` | 900 | — | `tight` | UPPERCASE |
| **Pipeline H3** | `28px` → `36px` (lg) | 900 | — | `tight` | UPPERCASE |
| **Stat number** | `clamp(32px, 4vw, 56px)` | 900 | — | `tighter` | UPPERCASE |
| **Mega stat** | `clamp(64px, 12vw, 200px)` | 900 | `0.8` | `tighter` | — |

### Body & Utility Text

| Element | Size | Weight | Leading | Font |
|---|---|---|---|---|
| Body paragraph | `18px` | 500 / `font-medium` | `1.6` | Archivo |
| Sub-lead | `20px` – `24px` | 700 / `font-bold` | `1.4` – `1.5` | Archivo |
| Hero sub-lead | `clamp(18px, 2vw, 24px)` | 700 | `1.4` | Archivo |
| Card description | `15px` – `16px` | 700 | `1.6` | Archivo |
| Mono list item | `12px` – `13px` | 700 / 800 | — | JetBrains Mono |
| Section label | `12px` | 700 | — | JetBrains Mono |
| Badge text | `11px` | 800 | — | JetBrains Mono |
| Micro label | `10px` | 700 | — | JetBrains Mono |

> [!IMPORTANT]
> **All headlines are UPPERCASE.** All mono/technical labels are UPPERCASE. Body text is sentence case.

---

## 3. Spacing & Layout

### Global Container

```
max-width: 1280px (max-w-7xl)
padding-x: 24px (px-6) → 48px (lg:px-12)
margin: auto
```

### Section Padding

| Section Type | Vertical Padding | Notes |
|---|---|---|
| Standard section | `py-32` (128px) | Problem, Framework, Templates |
| Hero section | `pt-32 pb-24` | Min-height: 100vh |
| Footer CTA | `py-40` (160px) | Extra breathing room |

### Component Spacing

| Context | Value |
|---|---|
| Card internal padding | `p-8` (32px) or `p-10` (40px) |
| CTA block padding | `p-10 lg:p-16` (40px → 64px) |
| Grid gap | `gap-8` (32px) within card grids |
| Content gap (2-col) | `gap-16 lg:gap-24` (64px → 96px) |
| Element margin-bottom (heading → content) | `mb-6` to `mb-10` |
| Section label → heading | `mb-6` (24px) |

### Structural Grid Overlay

A persistent 4-column guide grid is rendered as a `fixed` overlay at `z-[1]`:
- Responsive: 2 columns (mobile) → 3 (sm) → 4 (md) → 5 edges (lg)
- Lines: `1px solid rgba(10, 10, 10, 0.08)`
- Non-interactive: `pointer-events: none`

---

## 4. Borders & Surfaces

### Border System

| Token | Value | Usage |
|---|---|---|
| `.tech-border` | `2px solid var(--ink)` | Cards, panels, input fields |
| `.tech-border-b` | `border-bottom: 2px solid var(--ink)` | Horizontal dividers |
| Section separator (standard) | `border-b-[2px] border-black` | Between content sections |
| Section separator (heavy) | `border-b-[4px] border-black` | Major section breaks (hero, framework) |
| Section separator (max) | `border-b-[8px] border-black` | Case study bottom |
| Accent border-left | `border-l-[4px] border-black` or `border-[var(--accent)]` | Pull quotes, text callouts |
| Dashed border (AI panels) | `border-[3px] border-black border-dashed` | AI-generated content areas |
| Internal divider | `border-t-2 border-black` | Within cards |

### Hard Shadow System

```css
.tech-shadow {
  box-shadow: 6px 6px 0px 0px var(--ink);
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.tech-shadow:hover {
  box-shadow: 8px 8px 0px 0px var(--accent);
  transform: translate(-2px, -2px);
  border-color: var(--accent);
}
```

> [!NOTE]
> Shadows are always flat, axis-aligned offsets — never blurred. They simulate a physical stack of paper or layered plates.

---

## 5. Component Library

### 5.1 Buttons

#### Primary Button (`.tech-btn`)

```css
background: var(--ink);
color: var(--paper);
border: 2px solid var(--ink);
padding: 16px 24px;
font: 800 13px/1 'JetBrains Mono', monospace;
text-transform: uppercase;
letter-spacing: 0.05em;
box-shadow: 4px 4px 0px 0px var(--accent);
```

| State | Background | Border | Shadow | Transform |
|---|---|---|---|---|
| Default | `var(--ink)` | `var(--ink)` | `4px 4px var(--accent)` | none |
| Hover | `var(--accent)` | `var(--accent)` | `6px 6px var(--ink)` | `translate(-2px, -2px)` |
| Active | — | — | `0px 0px var(--ink)` | `translate(4px, 4px)` |

#### Outline Button (`.tech-btn-outline`)

| State | Background | Border | Shadow | Color |
|---|---|---|---|---|
| Default | `var(--paper)` | `var(--ink)` | `4px 4px var(--ink)` | `var(--ink)` |
| Hover | `#fff` | `var(--accent)` | `6px 6px var(--accent)` | `var(--accent)` |

#### Inverted Button (on accent backgrounds)

```jsx
className="tech-btn !bg-black !text-[var(--accent)]
           hover:!bg-[var(--paper)] hover:!text-black"
```

### 5.2 Badges (`.tech-badge`)

```css
display: inline-flex;
align-items: center;
padding: 4px 8px;
border: 2px solid var(--ink);
font: 800 11px/1 'JetBrains Mono', monospace;
text-transform: uppercase;
letter-spacing: 0.05em;
background: #fff;
```

| Variant | Class | Background | Color | Border |
|---|---|---|---|---|
| Default | `.tech-badge` | `#fff` | `var(--ink)` | `var(--ink)` |
| Accent | `.tech-badge-accent` | `var(--accent)` | `white` | `var(--accent)` |
| Black | `.tech-badge-black` | `var(--ink)` | `var(--paper)` | — |

### 5.3 Input Field (`.tech-input`)

```css
width: 100%;
background: #fff;
border: 2px solid var(--ink);
padding: 16px 20px;
font: 700 14px 'JetBrains Mono', monospace;
color: var(--ink);
```

- **Focus state:** `border-color: var(--accent)`
- **Caret color:** `var(--accent)`
- **Prompt prefix:** `>` character in accent color
- **Placeholder style:** `font-mono text-[14px] text-black/30 font-bold`, mimics terminal placeholder (`ENTER_EMAIL_ADDRESS` + blinking cursor)

### 5.4 Cards

#### Standard Content Card
```
tech-border + bg-white + p-8 + tech-shadow
```
- On hover: entire card fills with `bg-[var(--accent)]`, text inverts to white
- Transition: `transition-colors`

#### AI Panel Card (dashed variant)
```
border-[3px] border-black border-dashed + hatched-bg + p-6 lg:p-8
```
- Background: diagonal-hatched pattern at 45° (`rgba(10,10,10,0.08)`)
- Signals AI/machine-generated content

### 5.5 Section Labels

Terminal-style labels mark every section:

```
[ CATEGORY ] // IDENTIFIER
```

```jsx
<div className="font-mono text-[12px] font-bold tracking-widest text-[var(--accent)] mb-6 uppercase">
  [ DIAGNOSTIC ] // SYSTEM_FAILURE
</div>
```

### 5.6 Inline Highlight

For emphasizing key terms:

```jsx
<strong className="text-[var(--paper)] bg-black px-2 uppercase font-bold text-[14px]">
  Generated and Forgotten
</strong>
```

Black background, paper-colored text, uppercase, padded — creates a "stamped label" effect.

### 5.7 Blinking Cursor

```css
.blinking-cursor {
  display: inline-block;
  width: 10px;
  height: 18px;
  background-color: var(--ink);
  animation: blink 1s step-end infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
```

---

## 6. Texture & Atmosphere

### Film Grain Overlay

A fixed, full-screen SVG fractal noise overlay sits at `z-index: 9999`:
- `opacity: 0.08`
- `mix-blend-mode: multiply`
- `pointer-events: none`

Creates a subtle print/film texture across the entire page.

### Hatched Background Pattern

```css
.hatched-bg {
  background-color: var(--paper);
  background-image: repeating-linear-gradient(
    45deg, transparent, transparent 4px,
    rgba(10, 10, 10, 0.08) 4px,
    rgba(10, 10, 10, 0.08) 5px
  );
}
```

Used exclusively on AI/machine panels to differentiate them from human-authored content.

### Schematic SVG Background

The hero features a large (800×800px) technical schematic at `opacity: 0.06`:
- Concentric circles
- Crosshair lines (horizontal + vertical)
- Inner accent-colored rectangle

---

## 7. Animation & Interaction

### Easing Function

All mechanical transitions use the same **spring-expo** curve:

```
cubic-bezier(0.16, 1, 0.3, 1)
```

Duration: `0.15s` for interactive elements, `0.6s` for scroll reveals.

### FadeIn (Scroll Reveal)

```
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
duration: 0.6s
trigger: IntersectionObserver (once, margin: -10%)
```

Each element accepts a `delay` prop for staggered reveals.

### Magnetic Cursor Effect

Interactive buttons/CTAs subtly follow the cursor within a small radius:
- Spring physics: `stiffness: 300, damping: 20, mass: 0.5`
- Pull factor: `0.15` (15% of distance to cursor)
- Resets on mouse leave
- Triggers haptic feedback (`navigator.vibrate(15)`) on pointer down

### Sticky Scroll Pipeline

The 7-phase framework section uses a scroll-pinned layout:
- Container height: `7 × 90vh`
- Inner panel: `position: sticky; top: 0; height: 100vh`
- Per-phase opacity/y are driven by `scrollYProgress`
- Central spine fills with accent color as user scrolls

---

## 8. Section Architecture

Each major page section follows a consistent pattern:

| Element | Implementation |
|---|---|
| Section wrapper | Full-width `<section>` with `py-32`, `border-b-[2px\|4px]`, optional `bg` override |
| Ghost section number | `neo-grotesque text-[160px] font-[900] text-black/5` — absolute positioned |
| Section label | `[ CATEGORY ] // ID` in mono, accent-colored, uppercase |
| Section heading | `neo-grotesque`, fluid `clamp()` sizing, `font-[900]`, uppercase |
| Inner container | `max-w-7xl mx-auto px-6 lg:px-12` |

### Section Hierarchy

| # | Section | Background | Border |
|---|---|---|---|
| 01 | Hero | `var(--paper)` | `border-b-[4px] border-black` |
| 02 | Problem | `var(--paper)` | `border-b-[2px] border-black` |
| 03 | Framework | `white` | `border-b-[4px] border-black` |
| 04 | Templates | `var(--paper)` | `border-b-[2px] border-black` |
| 05 | Manifesto | `black` (inverted) | `border-b-[4px] border-white` |
| 06 | Case Study | `var(--accent)` | `border-b-[8px] border-black` |
| 07 | Footer CTA | `var(--paper)` | — |

---

## 9. Content Formatting Rules

| Pattern | Rule |
|---|---|
| **Bullet markers (human)** | `w-2 h-2 bg-black` squares |
| **Bullet markers (AI)** | `>` character in accent color |
| **Error/failure markers** | `X` in accent color |
| **Numbered lists** | Oversized ghost numbers (`40px`–`56px`, `text-white/20` or `text-black/10`) |
| **Pull quotes** | `border-l-[4px]` + `pl-6`, bold text |
| **Key parameters** | Nested box: `border-2 border-black bg-[var(--paper)] p-4` |

---

## 10. Responsive Behavior

| Breakpoint | Layout Changes |
|---|---|
| **Default (mobile)** | Single column, reduced heading sizes, pipeline nodes stack vertically |
| **`sm` (640px)** | Grid columns begin appearing |
| **`md` (768px)** | 2-column grids, pipeline spine + routing lines appear |
| **`lg` (1024px)** | Full 3-column template grid, larger padding, full pipeline layout |

---

## 11. Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Animation | Framer Motion 12 |
| Fonts | Google Fonts (Archivo, JetBrains Mono) |

---

## Quick Reference: CSS Custom Properties

```css
:root {
  --paper: #EFEFE9;
  --ink: #0A0A0A;
  --accent: #FF3B00;
}
```

## Quick Reference: All CSS Utility Classes

```css
.film-grain          /* Full-screen noise texture overlay */
.font-mono           /* JetBrains Mono monospace */
.neo-grotesque       /* Archivo with -0.05em tracking */
.tech-border         /* 2px solid ink border */
.tech-border-b       /* 2px solid ink bottom border */
.tech-shadow         /* 6px hard shadow with hover animation */
.tech-badge          /* Small technical label pill */
.tech-badge-accent   /* Accent-colored badge variant */
.tech-badge-black    /* Black badge variant */
.tech-btn            /* Primary mechanical button */
.tech-btn-outline    /* Outline button variant */
.tech-input          /* Monospace input field */
.blinking-cursor     /* Terminal cursor animation */
.hatched-bg          /* 45° diagonal line pattern */
.grid-col-line       /* Structural grid guide line */
```
