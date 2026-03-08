"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, X, Check } from "lucide-react";
import { useTheme, THEMES } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ThemePicker() {
  const { theme, setThemeById } = useTheme();
  const { locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <div ref={panelRef} className="fixed bottom-6 right-6 z-50" style={{ direction: "ltr" }}>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full flex items-center justify-center
                   shadow-lg transition-all duration-300 group relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${theme.accent}20, ${theme.secondary}20)`,
          border: `1px solid ${theme.accent}40`,
          boxShadow: isOpen
            ? `0 0 30px ${theme.accent}30, 0 8px 32px rgba(0,0,0,0.4)`
            : `0 4px 20px rgba(0,0,0,0.3)`,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X size={18} style={{ color: theme.accent }} />
          ) : (
            <Palette size={18} style={{ color: theme.accent }} />
          )}
        </motion.div>
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `inset 0 0 20px ${theme.accent}15, 0 0 20px ${theme.accent}20`,
          }}
        />
      </motion.button>

      {/* Theme Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 right-0 w-[280px] rounded-2xl overflow-hidden"
            style={{
              background: "rgba(10, 10, 20, 0.95)",
              backdropFilter: "blur(30px)",
              border: `1px solid ${theme.accent}20`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${theme.accent}08`,
            }}
          >
            {/* Header */}
            <div
              className="px-5 pt-5 pb-3"
              style={{
                borderBottom: `1px solid ${theme.accent}10`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: theme.accent,
                    boxShadow: `0 0 8px ${theme.accent}80`,
                  }}
                />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">
                  {locale === "en" ? "Theme" : "ערכת נושא"}
                </span>
              </div>
              <p className="text-[10px] text-gray-600">
                {locale === "en"
                  ? "Pick an accent color for the site"
                  : "בחרו צבע מבטא לאתר"}
              </p>
            </div>

            {/* Color Grid */}
            <div className="p-4 grid grid-cols-4 gap-3">
              {THEMES.map((t) => {
                const isActive = theme.id === t.id;
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => setThemeById(t.id)}
                    className="group relative flex flex-col items-center gap-1.5"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    {/* Color orb */}
                    <div className="relative">
                      <div
                        className="w-11 h-11 rounded-full transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${t.accent}, ${t.secondary})`,
                          boxShadow: isActive
                            ? `0 0 20px ${t.accent}60, 0 0 40px ${t.accent}20, inset 0 0 10px rgba(255,255,255,0.2)`
                            : `0 2px 8px rgba(0,0,0,0.3)`,
                          border: isActive
                            ? "2px solid rgba(255,255,255,0.5)"
                            : "2px solid transparent",
                        }}
                      />
                      {/* Check mark */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check size={16} className="text-white drop-shadow-lg" strokeWidth={3} />
                        </motion.div>
                      )}
                      {/* Hover ring */}
                      <div
                        className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          border: `1px solid ${t.accent}40`,
                          boxShadow: `0 0 12px ${t.accent}20`,
                        }}
                      />
                    </div>
                    {/* Label */}
                    <span
                      className="text-[9px] font-medium transition-colors duration-300"
                      style={{
                        color: isActive ? t.accent : "#555",
                      }}
                    >
                      {locale === "en" ? t.name : t.nameHe}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Preview bar */}
            <div
              className="mx-4 mb-4 rounded-xl p-3 flex items-center gap-3"
              style={{
                background: `linear-gradient(135deg, ${theme.accent}08, ${theme.secondary}05)`,
                border: `1px solid ${theme.accent}15`,
              }}
            >
              <div
                className="w-6 h-6 rounded-lg flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.secondary})`,
                  boxShadow: `0 0 12px ${theme.accent}40`,
                }}
              />
              <div className="flex-1 min-w-0">
                <div
                  className="text-[10px] font-bold truncate"
                  style={{ color: theme.accent }}
                >
                  {locale === "en" ? theme.name : theme.nameHe}
                </div>
                <div className="text-[9px] text-gray-600 font-mono">
                  {theme.accent}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
