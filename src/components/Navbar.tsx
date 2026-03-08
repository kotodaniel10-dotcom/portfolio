"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { dict, locale, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: dict.nav.about, href: "#about" },
    { label: dict.nav.projects, href: "#projects" },
    { label: dict.nav.contact, href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-lg shadow-neon-cyan/5"
          : "bg-transparent"
      }`}
      style={{ direction: "ltr" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo — always on the left */}
        <a href="#" className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
          <span className="gradient-text">D</span>
          <span className="text-gray-400 text-sm font-mono">aniel</span>
        </a>

        {/* Desktop Links — always on the right */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-neon-cyan transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon-cyan group-hover:w-full transition-all duration-300" />
            </a>
          ))}

          {/* Language Toggle — fixed width so it doesn't jump */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 min-w-[70px] justify-center px-3 py-1.5 rounded-full border border-neon-cyan/30 text-neon-cyan text-sm font-mono
                       hover:border-neon-cyan/60 hover:bg-neon-cyan/5
                       active:scale-95 transition-all duration-300"
          >
            <Globe size={13} className="flex-shrink-0 opacity-60" />
            <span>{locale === "en" ? "עב" : "EN"}</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-400 hover:text-neon-cyan transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-strong border-t border-neon-cyan/10"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-400 hover:text-neon-cyan transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-1.5 text-neon-cyan font-mono py-2"
              >
                <Globe size={13} className="opacity-60" />
                <span>{locale === "en" ? "עב" : "EN"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
