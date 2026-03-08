"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function About() {
  const { dict } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 cyber-line" />
      <div className="absolute start-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-neon-purple/5 rounded-full blur-[100px]" />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-5xl mx-auto px-6"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <span className="px-4 py-1.5 rounded-full text-xs font-mono text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5 uppercase tracking-widest">
            {dict.about.badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 tracking-tight"
        >
          <span className="gradient-text">{dict.about.title}</span>
        </motion.h2>

        {/* Bio Card */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-2xl p-8 md:p-12 mb-16 relative overflow-hidden group"
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-2xl border border-neon-cyan/10 group-hover:border-neon-cyan/20 transition-colors duration-700" />
          <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />

          <div className="space-y-6 relative z-10">
            {dict.about.paragraphs.map((paragraph, index) => {
              const isHighlight = index === 3;
              return (
                <motion.p
                  key={index}
                  variants={itemVariants}
                  className={`text-base md:text-lg leading-relaxed ${
                    isHighlight
                      ? "text-neon-cyan font-medium text-lg md:text-xl py-2"
                      : "text-gray-400"
                  }`}
                >
                  {paragraph}
                </motion.p>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {dict.about.stats.map((stat, index) => (
            <motion.div
              key={index}
              className="glass rounded-xl p-6 text-center group hover:border-neon-cyan/30 transition-all duration-500 relative overflow-hidden"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="text-3xl md:text-4xl font-black gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-500 font-mono uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
