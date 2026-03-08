"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import en from "@/i18n/en";
import he from "@/i18n/he";
import type { Dictionary } from "@/i18n/en";

type LanguageContextType = {
  dict: Dictionary;
  locale: "en" | "he";
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType>({
  dict: en,
  locale: "en",
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<"en" | "he">("en");

  const toggleLanguage = useCallback(() => {
    setLocale((prev) => (prev === "en" ? "he" : "en"));
  }, []);

  const dict = locale === "en" ? en : he;

  return (
    <LanguageContext.Provider value={{ dict, locale, toggleLanguage }}>
      <div dir={dict.dir} lang={dict.lang} className="min-h-screen">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
