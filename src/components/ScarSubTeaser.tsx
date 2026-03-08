"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const progressData = {
  en: [
    { label: "UI / Frontend", value: 85, color: "#ff6600" },
    { label: "Database & Auth", value: 70, color: "#00f0ff" },
    { label: "Forum & Blog", value: 75, color: "#b400ff" },
    { label: "Shop & Trading", value: 60, color: "#00ff88" },
    { label: "Admin Dashboard", value: 80, color: "#ff0044" },
    { label: "Real-Time Features", value: 55, color: "#ffd700" },
  ],
  he: [
    { label: "ממשק / Frontend", value: 85, color: "#ff6600" },
    { label: "מסד נתונים ואימות", value: 70, color: "#00f0ff" },
    { label: "פורום ובלוג", value: 75, color: "#b400ff" },
    { label: "חנות והחלפות", value: 60, color: "#00ff88" },
    { label: "לוח בקרה", value: 80, color: "#ff0044" },
    { label: "פיצ'רים בזמן אמת", value: 55, color: "#ffd700" },
  ],
};

function ProgressBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-gray-400">{label}</span>
        <span className="text-xs font-mono font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: delay * 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export default function ScarSubTeaser() {
  const { locale } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const bars = locale === "en" ? progressData.en : progressData.he;

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-0 inset-x-0 cyber-line" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-6"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest mb-6"
            style={{ color: "#ff6600", borderColor: "#ff660030", backgroundColor: "#ff660008", border: "1px solid #ff660025" }}>
            <span className="w-2 h-2 rounded-full bg-[#ff6600] animate-pulse" />
            {locale === "en" ? "Currently Building" : "בבנייה כרגע"}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-4">
            <span className="text-white">ScarSub</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto mt-3">
            {locale === "en"
              ? "A full-stack Hebrew anime community platform — forum, blog, shop, real-time messaging, admin dashboard, and more."
              : "פלטפורמת קהילת אנימה בעברית — פורום, בלוג, חנות, הודעות בזמן אמת, לוח בקרה, ועוד."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Progress Bars */}
          <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #ff660060, transparent)" }} />
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#ff6600]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {locale === "en" ? "Development Progress" : "התקדמות פיתוח"}
            </h3>
            <div className="space-y-4">
              {bars.map((bar, i) => (
                <ProgressBar key={bar.label} {...bar} delay={i} />
              ))}
            </div>
          </div>

          {/* Preview / Info Card */}
          <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #ff660060, transparent)" }} />

            {/* Blurred preview mockup */}
            <div className="flex-1 rounded-xl overflow-hidden mb-6 relative bg-dark-800 min-h-[200px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-[#ff6600]/5 to-transparent" />
              <div className="space-y-3 w-full p-6 blur-[2px] opacity-40">
                <div className="h-8 bg-white/10 rounded-lg w-3/4" />
                <div className="h-4 bg-white/5 rounded w-full" />
                <div className="h-4 bg-white/5 rounded w-5/6" />
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="h-20 bg-white/5 rounded-lg" />
                  <div className="h-20 bg-white/5 rounded-lg" />
                  <div className="h-20 bg-white/5 rounded-lg" />
                </div>
                <div className="h-4 bg-white/5 rounded w-2/3 mt-2" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl mb-2">🔒</div>
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                    {locale === "en" ? "Preview Coming Soon" : "תצוגה מקדימה בקרוב"}
                  </span>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 mb-4">
              {["Next.js", "Supabase", "Tailwind", "TypeScript", "Framer Motion"].map((tech) => (
                <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff6600]/5 text-[#ff6600] border border-[#ff6600]/15">
                  {tech}
                </span>
              ))}
            </div>

            {/* Discord CTA */}
            <a
              href="https://discord.gg/scarsub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] text-sm font-medium
                         hover:bg-[#5865F2]/15 hover:border-[#5865F2]/30 transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
              </svg>
              {locale === "en" ? "Join the Discord" : "הצטרפו לדיסקורד"}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
