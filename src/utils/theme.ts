import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function useTheme() {
  const { theme } = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return theme;
}
