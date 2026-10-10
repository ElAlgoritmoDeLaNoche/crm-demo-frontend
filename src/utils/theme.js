export const resolveTheme = (saved, prefersDark) =>
  saved === 'light' || saved === 'dark' ? saved : prefersDark ? 'dark' : 'light';
