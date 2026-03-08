"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { ChevronDown, Code2 } from "lucide-react";
import Changelog from "./Changelog";

interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  version: string;
  description: string;
  tags: string[];
  color: string;
  logo?: string;
  changelog: {
    version: string;
    date: string;
    changes: string[];
  }[];
}

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

const CODE_SNIPPETS: Record<string, { filename: string; code: string }> = {
  "amq-script": {
    filename: "leviathanDB.js",
    code: `function initLeviathanDB(backups) {
  const db = { webm: new Map(), mp3: new Map() };
  for (const raw of backups) {
    const entries = JSON.parse(raw);
    for (const [hash, meta] of Object.entries(entries)) {
      const type = hash.endsWith('_webm') ? 'webm' : 'mp3';
      db[type].set(hash, {
        anime: meta.anime, song: meta.song,
        src: meta.directUrl, hash  // "001syb_webm"
      });
    }
  }
  return db; // 20K+ entries, zero-latency lookup
}`,
  },
  "whatsapp-phantom": {
    filename: "bulkSender.js",
    code: `async function sendBulk(contacts, template, config) {
  for (const contact of contacts) {
    if (!this.running) break;
    const msg = interpolate(template, contact);
    const mutated = applyMutators(msg, config.mutators);
    await injectMessage(contact.chatEl, mutated);
    await sleep(config.delay + Math.random() * 800);
    this.stats.sent++;
  }
}`,
  },
  "anilist-premium": {
    filename: "autoLiker.js",
    code: `async start() {
  this.running = true;
  const feed = await this.fetchActivities();
  for (const activity of feed) {
    if (!this.running) break;
    if (!this.matchesFilters(activity)) continue;
    await this.likeActivity(activity.id);
    this.session.likes++;
    this.updateLPM(); // likes-per-minute tracker
    await sleep(this.delay + Math.random() * 800);
  }
}`,
  },
  "youtube-downloader": {
    filename: "downloadEngine.js",
    code: `async function downloadMedia(url, type) {
  const resp = await fetch(url);
  const reader = resp.body.getReader();
  const total = +resp.headers.get('content-length');
  let received = 0, chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    updateProgressRing(received / total * 100);
  }
  return new Blob(chunks, { type });
}`,
  },
  "buyee-oas": {
    filename: "auctionScanner.js",
    code: `function scanPage(config) {
  const items = document.querySelectorAll('.itemCard');
  const deals = [];
  items.forEach(el => {
    const title = el.querySelector('.itemCard__title')
      ?.textContent?.toLowerCase() || '';
    if (config.blacklist.some(b => title.includes(b)))
      return; // skip junk
    for (const cat of config.categories) {
      if (cat.keywords.some(k => title.includes(k)))
        deals.push({ title, category: cat.name });
    }
  });
  return deals;
}`,
  },
};

const SCARSUB_PROGRESS = [
  { label: "UI / Frontend", value: 85, color: "#ff6600" },
  { label: "Database & Auth", value: 70, color: "#00f0ff" },
  { label: "Forum & Blog", value: 75, color: "#b400ff" },
  { label: "Admin Dashboard", value: 80, color: "#ff0044" },
  { label: "Shop & Trading", value: 60, color: "#00ff88" },
];

function InlineCodeSnippet({ snippet, accentColor }: { snippet: { filename: string; code: string }; accentColor: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const highlighted = snippet.code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(\/\/.*)/g, '<span class="text-gray-600">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#a5d6ff">$1</span>')
    .replace(/\b(const|let|var|function|class|async|await|for|if|return|new|this|of|import|export|break|continue)\b/g, '<span style="color:#ff7b72">$1</span>')
    .replace(/\b(true|false|null|undefined|console)\b/g, '<span style="color:#79c0ff">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#79c0ff">$1</span>')
    .replace(/\b(Map|Object|Array|JSON|Math|Date|document|Blob)\b/g, '<span style="color:#ffa657">$1</span>')
    .replace(/(\.\w+)\(/g, '<span style="color:#d2a8ff">$1</span>(');

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-600 hover:text-gray-400 transition-colors w-full"
      >
        <Code2 size={13} style={{ color: accentColor }} />
        <span>{snippet.filename}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={13} />
        </motion.div>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-800 to-transparent ms-2" />
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div
            className="mt-3 rounded-lg overflow-hidden border border-white/[0.06]"
            style={{ background: "#0d1117", direction: "ltr" }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.06]" style={{ background: "#161b22" }}>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[9px] text-gray-600 font-mono">{snippet.filename}</span>
            </div>
            <div className="p-3 overflow-x-auto max-h-[250px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#30363d transparent" }}>
              <pre
                className="text-[10px] md:text-[11px] leading-relaxed font-mono text-left"
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ScarSubProgress() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="mt-5 space-y-3">
      <div className="text-[10px] font-mono uppercase tracking-widest text-gray-600 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff6600] animate-pulse" />
        Development Progress
      </div>
      {SCARSUB_PROGRESS.map((bar, i) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-gray-500">{bar.label}</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: bar.color }}>{bar.value}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: bar.color }}
              initial={{ width: 0 }}
              animate={isInView ? { width: `${bar.value}%` } : { width: 0 }}
              transition={{ duration: 1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const snippet = CODE_SNIPPETS[project.id];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group"
    >
      <div
        className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden transition-all duration-500 cursor-default"
        style={{ borderColor: `${project.color}15` }}
      >
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${project.color}60, transparent)` }} />
        <div className="absolute -top-20 -end-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700" style={{ backgroundColor: project.color }} />

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {project.logo && (
              <img src={project.logo} alt={`${project.title} logo`} className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex-shrink-0" />
            )}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1" style={{ textShadow: `0 0 20px ${project.color}30` }}>
                {project.title}
              </h3>
              <p className="text-sm text-gray-500 font-mono">{project.subtitle}</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full flex-shrink-0" style={{ color: project.color, backgroundColor: `${project.color}10`, border: `1px solid ${project.color}25` }}>
            {project.version}
          </span>
        </div>

        {/* Description */}
        <div className="text-sm md:text-base text-gray-400 leading-relaxed mb-6 space-y-4">
          {project.description.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="text-[10px] md:text-xs font-mono px-2.5 py-1 rounded-md bg-white/[0.03] text-gray-500 border border-white/[0.05] hover:border-white/10 hover:text-gray-400 transition-all duration-300">
              {tag}
            </span>
          ))}
        </div>

        {/* ScarSub Progress Bars */}
        {project.id === "scarsub" && <ScarSubProgress />}

        {/* Inline Code Snippet */}
        {snippet && <InlineCodeSnippet snippet={snippet} accentColor={project.color} />}

        {/* Changelog */}
        <Changelog entries={project.changelog} accentColor={project.color} />
      </div>
    </motion.div>
  );
}
