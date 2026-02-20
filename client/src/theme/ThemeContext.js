import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from './colors';
import { typography } from './typography';

const ThemeContext = createContext();

// Maps camelCase theme key -> Tailwind v4 CSS custom property
const KEY_MAP = {
    background: '--theme-background',
    foreground: '--theme-foreground',
    card: '--theme-card',
    cardForeground: '--theme-card-foreground',
    surface: '--theme-card',
    popover: '--theme-popover',
    popoverForeground: '--theme-popover-foreground',
    primary: '--theme-primary',
    primaryForeground: '--theme-primary-foreground',
    secondary: '--theme-secondary',
    secondaryForeground: '--theme-secondary-foreground',
    muted: '--theme-muted',
    mutedForeground: '--theme-muted-foreground',
    accent: '--theme-accent',
    accentForeground: '--theme-accent-foreground',
    destructive: '--theme-destructive',
    destructiveForeground: '--theme-destructive-foreground',
    border: '--theme-border',
    input: '--theme-input',
    ring: '--theme-ring',
    clinicalNavy: '--theme-clinical-navy',
    clinicalNavyLight: '--theme-clinical-navy-light',
    clinicalNavyDark: '--theme-clinical-navy-dark',
    emeraldGreen: '--theme-emerald-green',
    emeraldGreenLight: '--theme-emerald-green-light',
    emeraldGreenDark: '--theme-emerald-green-dark',
    softCyan: '--theme-soft-cyan',
    softCyanLight: '--theme-soft-cyan-light',
    softCyanDark: '--theme-soft-cyan-dark',
    softRed: '--theme-soft-red',
    mutedAmber: '--theme-muted-amber',
    lightSlate: '--theme-light-slate',
};

const applyTheme = (themeObj) => {
    const root = window.document.documentElement;
    Object.entries(themeObj).forEach(([key, value]) => {
        const cssVar = KEY_MAP[key];
        if (cssVar) {
            root.style.setProperty(cssVar, value);
        }
    });
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    const theme = isDarkMode ? darkTheme : lightTheme;

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        applyTheme(theme);
    }, [isDarkMode, theme]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    // Use React.createElement to avoid JSX in a .js file
    return React.createElement(
        ThemeContext.Provider,
        { value: { theme, isDarkMode, toggleTheme, typography } },
        children
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
