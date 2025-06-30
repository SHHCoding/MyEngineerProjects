import React from 'react';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'system'>>;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeChange }) => {

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    onThemeChange(themes[nextIndex]);
  };

  const themeIcons = {
    light: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
    dark: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
    system: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
  }

  const themeTitle = { light: "Light", dark: "Dark", system: "System" };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-500"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z"/><path d="M18 18 7 15l-1-4 4 1 5 6-2 1Z"/><path d="m14 11 1-4-4-1 -1 4"/><path d="M2 11h4"/><path d="M18 11h4"/><path d="m19 5-1-1"/><path d="m5 5 1-1"/></svg>
            <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white font-display">
              កម្មវិធីគ្រប់គ្រងគម្រោងវិស្វកម្ម
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label={`Switch to ${themeTitle[theme]} mode`}>
              {themeIcons[theme]}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;