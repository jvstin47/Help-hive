/**
 * Dark mode utility — persists preference in localStorage and applies .dark class to <html>
 */
export function applyDarkMode(enabled: boolean) {
  if (enabled) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('helphive_darkmode', '1');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('helphive_darkmode', '0');
  }
}

export function isDarkModeEnabled(): boolean {
  return localStorage.getItem('helphive_darkmode') === '1';
}

export function initDarkMode() {
  if (isDarkModeEnabled()) {
    document.documentElement.classList.add('dark');
  }
}
