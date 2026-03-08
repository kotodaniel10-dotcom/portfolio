"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface ThemePreset {
  id: string;
  name: string;
  nameHe: string;
  accent: string;
  accentRgb: string;
  secondary: string;
  secondaryRgb: string;
  glow: string;
}

export const THEMES: ThemePreset[] = [
  {
    id: "cyan",
    name: "Neon Cyan",
    nameHe: "ציאן ניאון",
    accent: "#00f0ff",
    accentRgb: "0 240 255",
    secondary: "#b400ff",
    secondaryRgb: "180 0 255",
    glow: "#00f0ff",
  },
  {
    id: "purple",
    name: "Ultraviolet",
    nameHe: "אולטרה סגול",
    accent: "#b400ff",
    accentRgb: "180 0 255",
    secondary: "#ff00aa",
    secondaryRgb: "255 0 170",
    glow: "#b400ff",
  },
  {
    id: "pink",
    name: "Hot Pink",
    nameHe: "ורוד חם",
    accent: "#ff00aa",
    accentRgb: "255 0 170",
    secondary: "#ff6600",
    secondaryRgb: "255 102 0",
    glow: "#ff00aa",
  },
  {
    id: "green",
    name: "Matrix Green",
    nameHe: "ירוק מטריקס",
    accent: "#00ff88",
    accentRgb: "0 255 136",
    secondary: "#00f0ff",
    secondaryRgb: "0 240 255",
    glow: "#00ff88",
  },
  {
    id: "orange",
    name: "Ember",
    nameHe: "גחלת",
    accent: "#ff6600",
    accentRgb: "255 102 0",
    secondary: "#ff0044",
    secondaryRgb: "255 0 68",
    glow: "#ff6600",
  },
  {
    id: "red",
    name: "Crimson",
    nameHe: "ארגמן",
    accent: "#ff0044",
    accentRgb: "255 0 68",
    secondary: "#ff6600",
    secondaryRgb: "255 102 0",
    glow: "#ff0044",
  },
  {
    id: "gold",
    name: "Gold",
    nameHe: "זהב",
    accent: "#ffd700",
    accentRgb: "255 215 0",
    secondary: "#ff8c00",
    secondaryRgb: "255 140 0",
    glow: "#ffd700",
  },
  {
    id: "ice",
    name: "Ice Blue",
    nameHe: "כחול קרח",
    accent: "#44aaff",
    accentRgb: "68 170 255",
    secondary: "#0066ff",
    secondaryRgb: "0 102 255",
    glow: "#44aaff",
  },
];

type ThemeContextType = {
  theme: ThemePreset;
  setThemeById: (id: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES[0],
  setThemeById: () => {},
});

function applyThemeToDOM(theme: ThemePreset) {
  const root = document.documentElement;
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-rgb", theme.accentRgb);
  root.style.setProperty("--secondary", theme.secondary);
  root.style.setProperty("--secondary-rgb", theme.secondaryRgb);
  root.style.setProperty("--glow", theme.glow);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemePreset>(THEMES[0]);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved) {
      const found = THEMES.find((t) => t.id === saved);
      if (found) {
        setTheme(found);
        applyThemeToDOM(found);
      }
    } else {
      applyThemeToDOM(THEMES[0]);
    }
  }, []);

  const setThemeById = useCallback((id: string) => {
    const found = THEMES.find((t) => t.id === id);
    if (found) {
      setTheme(found);
      applyThemeToDOM(found);
      localStorage.setItem("portfolio-theme", id);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setThemeById }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
