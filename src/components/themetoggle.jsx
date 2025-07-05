// src/components/themeprovider.jsx
import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light", // force default to light
  storageKey = "ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    // No system logic — apply light or dark directly
    if (theme === "light" || theme === "dark") {
      root.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      if (newTheme === "light" || newTheme === "dark") {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
