# Theming & Styles

MedAImart uses a **custom design token system** built on Tailwind CSS with CSS custom properties for easy light/dark theming.

---

## Dark / Light Mode

Mode is toggled via `ThemeContext` (`src/theme/ThemeContext.jsx`). It:
- Adds/removes `.dark` class on `<html>`
- Persists preference to `localStorage` as `theme`

```jsx
import { useTheme } from '@/hooks/useTheme';

const { isDarkMode, toggleTheme } = useTheme();
```

---

## Design Tokens (CSS Variables)

Defined in `src/styles/` and referenced via Tailwind classes. All colors are theme-aware — they automatically change between light and dark modes.

### Core Palette

| Token | Light | Dark | Tailwind Class |
|---|---|---|---|
| `--color-primary` | Teal `#0D9488` | Same | `text-primary`, `bg-primary` |
| `--color-background` | White | Dark navy | `bg-background` |
| `--color-foreground` | Dark text | Light text | `text-foreground` |
| `--color-card` | White | Dark card | `bg-card` |
| `--color-border` | Gray `#E5E7EB` | Dark border | `border-border` |
| `--color-muted-foreground` | Gray text | Dim text | `text-muted-foreground` |

### Semantic Tokens

| Token | Color | Usage |
|---|---|---|
| `emerald-green` | `#10B981` | Success states, verified badges |
| `soft-cyan` | `#22D3EE` | Secondary highlights, rider role |
| `muted-amber` | `#F59E0B` | Warning states, pending badges |
| `danger` | `#EF4444` | Errors, destructive actions |
| `warning` | `#F97316` | Live engine indicator, caution |
| `clinical-navy` | `#0F172A` | Admin terminal dark sections |

---

## Tailwind Configuration (`tailwind.config.js`)

Custom colors and fonts are extended in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: 'var(--color-primary)',
      background: 'var(--color-background)',
      foreground: 'var(--color-foreground)',
      card: 'var(--color-card)',
      border: 'var(--color-border)',
      'emerald-green': '#10B981',
      'soft-cyan': '#22D3EE',
      'muted-amber': '#F59E0B',
      'danger': '#EF4444',
      'clinical-navy': '#0F172A',
    },
    fontFamily: {
      serif: ['Playfair Display', 'serif'],
      sans: ['Inter', 'sans-serif'],
    }
  }
}
```

---

## Logo Assets

Two logo files are in `src/assets/`:

| File | Used When |
|---|---|
| `black-theme-logo.png` | Dark mode (white/light logo on dark bg) |
| `white-theme-logo.png` | Light mode (dark logo on white bg) |

Usage:
```jsx
import { useTheme } from '@/hooks/useTheme';
import blackLogo from '@/assets/black-theme-logo.png';
import whiteLogo from '@/assets/white-theme-logo.png';

const { isDarkMode } = useTheme();
const logoSrc = isDarkMode ? blackLogo : whiteLogo;
```

---

## Typography Conventions

| Element | Class Pattern | Font |
|---|---|---|
| Page headings | `font-serif font-bold text-3xl` | Playfair Display |
| Body text | `font-sans font-medium` | Inter |
| Labels / badges | `text-[10px] font-bold uppercase tracking-widest` | Inter |
| Code / logs | `font-mono text-xs` | System monospace |
