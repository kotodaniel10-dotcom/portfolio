"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1569 2.4189z" />
    </svg>
  );
}

function TypeWriter({ texts, speed = 70 }: { texts: string[]; speed?: number }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [prevTextsKey, setPrevTextsKey] = useState(texts.join("|"));

  // Reset when language changes (texts array changes)
  const textsKey = texts.join("|");
  useEffect(() => {
    if (textsKey !== prevTextsKey) {
      setPrevTextsKey(textsKey);
      setIsDeleting(true);
      setIsPaused(false);
    }
  }, [textsKey, prevTextsKey]);

  useEffect(() => {
    if (isPaused) return;

    const currentFullText = texts[currentTextIndex % texts.length];
    if (!currentFullText) return;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentFullText.length) {
          setCharIndex((c) => c + 1);
        } else {
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 2000);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((c) => c - 1);
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, isPaused, currentTextIndex, texts, speed]);

  const currentFullText = texts[currentTextIndex % texts.length] || "";
  const displayText = currentFullText.slice(0, charIndex);

  return (
    <span className="font-mono text-neon-cyan">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function Hero() {
  const { dict } = useLanguage();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:60px_60px] opacity-30" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-cyan/5 via-transparent to-transparent" />

      {/* Static glow orbs — no animation for performance */}
      <div className="absolute top-1/4 start-1/4 w-96 h-96 rounded-full bg-neon-cyan/[0.04] blur-[120px]" />
      <div className="absolute bottom-1/4 end-1/4 w-96 h-96 rounded-full bg-neon-purple/[0.04] blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="text-lg md:text-xl text-gray-400">
            {dict.hero.greeting}
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tight"
        >
          <span className="gradient-text neon-text">{dict.hero.name}</span>
        </motion.h1>

        {/* Typewriter roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-base md:text-lg mb-6 h-8"
        >
          <TypeWriter texts={dict.hero.roleLines} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-light mb-4 text-balance max-w-3xl mx-auto"
        >
          {dict.hero.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto mb-10"
        >
          {dict.hero.subtitle}
        </motion.p>

        {/* CTA + Discord row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.a
            href="#projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 
                       border border-neon-cyan/30 text-neon-cyan font-medium text-sm
                       hover:from-neon-cyan/30 hover:to-neon-purple/30 hover:border-neon-cyan/50
                       transition-all duration-500"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {dict.hero.cta}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.a>

          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full glass border border-[#5865F2]/30 hover:border-[#5865F2]/60 transition-all duration-300 group cursor-default">
            <DiscordIcon className="w-5 h-5 text-[#5865F2] group-hover:drop-shadow-[0_0_10px_rgba(88,101,242,0.8)] transition-all duration-300" />
            <span className="font-mono text-sm text-[#5865F2] group-hover:text-white transition-colors">
              {dict.hero.discord}
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
