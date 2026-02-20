import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ThemeIcon = ({ theme }) => (
    theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />
);

export function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
        >
            <ThemeIcon theme={theme} />
        </button>
    );
}
