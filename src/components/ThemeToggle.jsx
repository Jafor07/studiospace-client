"use client";

import { useSyncExternalStore } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

// CHALLENGE 3: light / dark theme.
// The page's colours all come from daisyUI variables, so changing one
// attribute (data-theme on <html>) restyles the whole site.
const STORAGE_KEY = "studiospace-theme";

function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute("data-theme"),
    () => "studio-light",
  );
  const isDark = theme === "studio-dark";

  const toggleTheme = () => {
    const next = isDark ? "studio-light" : "studio-dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // private mode: the theme just won't be remembered
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <LuSun size={20} /> : <LuMoon size={20} />}
    </button>
  );
}
