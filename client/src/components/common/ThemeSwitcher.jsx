import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

const ThemeSwitcher = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-card/50 backdrop-blur-md hover:bg-muted text-muted-foreground hover:text-primary transition-all active:scale-95 border border-border/50 shadow-sm"
            aria-label="Toggle Theme"
        >
            {isDarkMode ? (
                <Sun className="w-5 h-5 animate-in zoom-in spin-in-90 duration-300" />
            ) : (
                <Moon className="w-5 h-5 animate-in zoom-in spin-in-90 duration-300" />
            )}
        </button>
    );
};

export default ThemeSwitcher;
