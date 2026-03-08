"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const { dict } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 inset-x-0 cyber-line" />
      <div className="absolute end-0 top-1/3 w-96 h-96 bg-neon-pink/5 rounded-full blur-[120px]" />
      <div className="absolute start-0 bottom-1/4 w-72 h-72 bg-neon-blue/5 rounded-full blur-[100px]" />

      <div ref={ref} className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono text-neon-purple border border-neon-purple/20 bg-neon-purple/5 uppercase tracking-widest mb-6">
            {dict.projects.badge}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="gradient-text">{dict.projects.title}</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            {dict.projects.subtitle}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First project spans full width */}
          <div className="md:col-span-2">
            <ProjectCard project={dict.projects.items[0]} index={0} />
          </div>

          {/* Remaining projects in 2-column grid */}
          {dict.projects.items.slice(1).map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
