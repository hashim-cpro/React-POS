// Theme management utilities
export const THEME_COLORS = {
  light: {
    "--bg-primary": "#f6f8fc",
    "--bg-secondary": "#ffffff",
    "--bg-tertiary": "#f3f4f6",
    "--text-primary": "#1f2937",
    "--text-secondary": "#4b5563",
    "--text-tertiary": "#9DB2CE",
    "--border-color": "#e5e7eb",
    "--accent-primary": "#9747ff",
    "--accent-secondary": "#ff5364",
    "--input-bg": "#e6e9f3",
    "--shadow-color": "rgba(0, 0, 0, 0.1)",
    "--hover-bg": "#9747FF1A",
    "--success": "#33d6a6",
    "--warning": "#ff8c37",
    "--error": "#ec3750",
    "--info": "#338eda",
  },
  dark: {
    "--bg-primary": "#111827",
    "--bg-secondary": "#1f2937",
    "--bg-tertiary": "#374151",
    "--text-primary": "#f9fafb",
    "--text-secondary": "#d1d5db",
    "--text-tertiary": "#6B7280",
    "--border-color": "#374151",
    "--accent-primary": "#9747ff",
    "--accent-secondary": "#ff5364",
    "--input-bg": "#374151",
    "--shadow-color": "rgba(0, 0, 0, 0.3)",
    "--hover-bg": "#9747FF33",
    "--success": "#059669",
    "--warning": "#d97706",
    "--error": "#dc2626",
    "--info": "#2563eb",
  },
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  const colors = THEME_COLORS[theme];

  Object.entries(colors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

export const getSystemTheme = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const initializeTheme = (userPreference = "system") => {
  const theme = userPreference === "system" ? getSystemTheme() : userPreference;
  applyTheme(theme);
  return theme;
};
