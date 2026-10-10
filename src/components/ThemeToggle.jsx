import { useState, useEffect } from 'react';
import { resolveTheme } from '../utils/theme';
export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    let saved;
    try { saved = localStorage.getItem('aurelia-theme'); } catch { /* Storage may be unavailable. */ }
    return resolveTheme(saved, window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('aurelia-theme', theme); } catch { /* Keep the current session usable. */ }
  }, [theme]);
  return <button type="button" className="theme-toggle" aria-label={`Activar tema ${theme === 'dark' ? 'claro' : 'oscuro'}`} aria-pressed={theme === 'dark'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
    <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span><span>{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
  </button>;
}
