import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

export function useTheme(): [Theme, React.Dispatch<React.SetStateAction<Theme>>] {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // This function applies the correct class to the root element
    const applyTheme = (currentTheme: Theme) => {
      const isDark =
        currentTheme === 'dark' ||
        (currentTheme === 'system' && mediaQuery.matches);

      // Clean up previous classes and add the correct one.
      // Tailwind's dark mode relies on the presence or absence of the 'dark' class.
      // There is no 'light' class.
      root.classList.remove('dark');
      if (isDark) {
        root.classList.add('dark');
      }
    };

    applyTheme(theme); // Apply theme on initial load or when `theme` state changes.

    // Listen for changes in the user's system preference
    const handleSystemThemeChange = () => {
      // Only re-apply the theme if the user has selected 'system' preference
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Cleanup listener on component unmount or if `theme` changes
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]); // Re-run this effect whenever the theme state changes

  return [theme, setTheme];
}
