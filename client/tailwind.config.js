/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--theme-background)",
        foreground: "var(--theme-foreground)",
        primary: {
          DEFAULT: "var(--theme-primary)",
          foreground: "var(--theme-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--theme-secondary)",
          foreground: "var(--theme-secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--theme-muted)",
          foreground: "var(--theme-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--theme-accent)",
          foreground: "var(--theme-accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--theme-destructive)",
          foreground: "var(--theme-destructive-foreground)",
        },
        border: "var(--theme-border)",
        input: "var(--theme-input)",
        ring: "var(--theme-ring)",
        surface: "var(--theme-card)", // Map surface to card variable
        card: {
          DEFAULT: "var(--theme-card)",
          foreground: "var(--theme-card-foreground)",
        },
        popover: {
          DEFAULT: "var(--theme-popover)",
          foreground: "var(--theme-popover-foreground)",
        },

        // Medical palette
        "clinical-navy": "var(--theme-clinical-navy)",
        "clinical-navy-light": "var(--theme-clinical-navy-light)",
        "clinical-navy-dark": "var(--theme-clinical-navy-dark)",
        "emerald-green": "var(--theme-emerald-green)",
        "emerald-green-light": "var(--theme-emerald-green-light)",
        "emerald-green-dark": "var(--theme-emerald-green-dark)",
        "soft-cyan": "var(--theme-soft-cyan)",
        "soft-cyan-light": "var(--theme-soft-cyan-light)",
        "soft-cyan-dark": "var(--theme-soft-cyan-dark)",
        "soft-red": "var(--theme-soft-red)",
        "muted-amber": "var(--theme-muted-amber)",
        "light-slate": "var(--theme-light-slate)",
      },
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        serif: ["'Roboto Slab'", "serif"],
      },
      maxWidth: {
        container: "1440px",
      },
    },
  },
  plugins: [],
};
