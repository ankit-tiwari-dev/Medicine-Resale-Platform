# Reusable Components

All shared components live in `src/components/`. They are designed to be framework-consistent — they use design tokens from Tailwind config and never hardcode raw colors.

---

## Common Components (`src/components/common/`)

### `Button`
A semantic button with built-in states.

```jsx
import Button from '@/components/common/Button';

<Button variant="primary" loading={isLoading} onClick={handleClick}>
  Submit
</Button>
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `primary` \| `outline` \| `ghost` \| `danger` | `primary` | Visual style |
| `loading` | `boolean` | `false` | Shows spinner, disables the button |
| `disabled` | `boolean` | `false` | Disables the button |
| `type` | `button` \| `submit` | `button` | HTML button type |
| `className` | `string` | — | Extra Tailwind classes |

---

### `EmptyState`
Used when a list or data section has no items.

```jsx
import EmptyState from '@/components/common/EmptyState';

<EmptyState
  title="No medicines listed"
  message="You haven't uploaded any medicines yet."
/>
```

---

### `Spinner`
Inline loading indicator.

```jsx
import Spinner from '@/components/common/Spinner';

<Spinner size="md" />
```

---

### `ThemeSwitcher`
Toggle between dark and light modes. Reads from `ThemeContext`.

```jsx
import ThemeSwitcher from '@/components/common/ThemeSwitcher';

<ThemeSwitcher />
```

---

## Form Components (`src/components/forms/`)

### `FormInput`
Labeled input field with consistent styling.

```jsx
import { FormInput } from '@/components/forms/FormInput';

<FormInput
  id="medicine-id"
  label="Medicine Lot ID"
  value={form.medicineId}
  onChange={(e) => setForm(p => ({ ...p, medicineId: e.target.value }))}
  placeholder="e.g. 60a7..."
  required
/>
```

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | **Required.** Unique field ID (for accessibility) |
| `label` | `string` | Label text above the input |
| `value` | `string` | Controlled input value |
| `onChange` | `function` | Change handler |
| `placeholder` | `string` | Input placeholder |
| `required` | `boolean` | Shows required indicator |
| `type` | `string` | Input type (default: `text`) |

---

## Layout Components (`src/components/layout/`)

| Component | Used In | Description |
|---|---|---|
| `Header` | `AppLayout` | Main nav for buyers/sellers |
| `Footer` | `AppLayout` | Site-wide footer |
| `AdminFigmaHeader` | `AdminLayout` | Admin terminal header with theme-aware logo |
| `AdminSidebar` | Old admin layout (archived) | — |
| `AdminTopHeader` | Old admin layout (archived) | — |

---

## Auth Components (`src/components/auth/`)

| Component | Description |
|---|---|
| `AuthCard` | Centered, branded card for auth forms |
| `AuthSplitLayout` | Split-screen layout (image left, form right) |
