// Dark mode only - always applies dark theme and communicates with Dark Reader extension
const applyDarkTheme = () => {
  const root = document.documentElement;
  root.classList.add('dark');
  root.setAttribute('data-theme', 'dark');
  // Signal to Dark Reader that we have native dark mode
  root.setAttribute('data-darkreader-mode', 'dynamic');
  root.setAttribute('data-darkreader-scheme', 'dark');
};

export const initializeDarkMode = () => {
  applyDarkTheme();
};