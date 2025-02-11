import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSettings } from "../store/slices/userSlice";
import { initializeTheme } from "../utils/theme";

function ThemeToggle() {
  const dispatch = useDispatch();
  const themePreference = useSelector((state) => state.userdata.settings.theme);

  useEffect(() => {
    // Initialize theme on component mount
    initializeTheme(themePreference);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (themePreference === "system") {
        initializeTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themePreference]);

  const handleThemeChange = (newTheme) => {
    dispatch(updateSettings({ theme: newTheme }));
    initializeTheme(newTheme);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">
        Theme Settings
      </h3>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="theme-light"
            name="theme"
            value="light"
            checked={themePreference === "light"}
            onChange={() => handleThemeChange("light")}
            className="text-accent-primary focus:ring-accent-primary"
            aria-label="Light theme"
          />
          <label htmlFor="theme-light" className="text-text-primary">
            Light
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="theme-dark"
            name="theme"
            value="dark"
            checked={themePreference === "dark"}
            onChange={() => handleThemeChange("dark")}
            className="text-accent-primary focus:ring-accent-primary"
            aria-label="Dark theme"
          />
          <label htmlFor="theme-dark" className="text-text-primary">
            Dark
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="radio"
            id="theme-system"
            name="theme"
            value="system"
            checked={themePreference === "system"}
            onChange={() => handleThemeChange("system")}
            className="text-accent-primary focus:ring-accent-primary"
            aria-label="System theme"
          />
          <label htmlFor="theme-system" className="text-text-primary">
            System
          </label>
        </div>
      </div>
    </div>
  );
}

export default ThemeToggle;
