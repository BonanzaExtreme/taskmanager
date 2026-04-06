import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContextCreate";
import { useAuth } from "./useAuth";

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState("light");

  // Initialize theme based on user authentication
  useEffect(() => {
    if (user?.id) {
      // Load user-specific theme preference
      const userThemeKey = `theme_${user.id}`;
      const savedTheme = localStorage.getItem(userThemeKey) || "light";
      setTheme(savedTheme);
      document.body.className = savedTheme;
    } else {
      // Reset to light theme for non-authenticated users (login/signup)
      setTheme("light");
      document.body.className = "light";
    }
  }, [user?.id]);

  // Save theme when it changes (only for authenticated users)
  useEffect(() => {
    document.body.className = theme;
    if (user?.id) {
      const userThemeKey = `theme_${user.id}`;
      localStorage.setItem(userThemeKey, theme);
    }
  }, [theme, user?.id]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
