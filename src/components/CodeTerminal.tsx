"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const codeSnippets = [
  {
    filename: "leviathanDB.js",
    label: "Leviathan DB Parser",
    code: `// Leviathan DB — In-memory anime song database engine
// Parses 20,000+ WEBM/MP3 entries from local JSON backups

function initLeviathanDB(jsonBackups) {
  const db = { webm: new Map(), mp3: new Map() };
  let indexed = 0;

  for (const backup of jsonBackups) {
    const entries = JSON.parse(backup);
    for (const [hash, meta] of Object.entries(entries)) {
      const type = hash.endsWith('_webm') ? 'webm' : 'mp3';
      const key = extractSongKey(meta.anime, meta.song);

      db[type].set(hash, {
        anime: meta.anime,
        song: meta.song,
        src: meta.directUrl,
        hash: hash,  // e.g. "001syb_webm" or "y7m7o4_mp3"
      });
      indexed++;
    }
  }

  console.log(\`[Leviathan] Indexed \${indexed} entries\`);
  return db;
}

function queryByAnime(db, animeName) {
  const results = [];
  for (const [hash, entry] of db.webm) {
    if (entry.anime.toLowerCase().includes(animeName))
      results.push(entry);
  }
  return results; // zero-latency, no server calls
}`,
  },
  {
    filename: "autoLiker.js",
    label: "AniList Auto-Liker",
    code: `// AniList Premium — Automated Liker with targeting filters
// Handles rate limits, session tracking, and LPM analytics

class AutoLiker {
  constructor(config) {
    this.filters = config.targetFilters;
    this.delay = config.delayMs || 1200;
    this.session = { likes: 0, start: Date.now() };
    this.running = false;
  }

  async start() {
    this.running = true;
    const activities = await this.fetchFeed();

    for (const activity of activities) {
      if (!this.running) break;
      if (!this.matchesFilters(activity)) continue;

      await this.likeActivity(activity.id);
      this.session.likes++;
      this.updateLPM();
      await this.sleep(this.delay + Math.random() * 800);
    }
  }

  getLPM() {
    const mins = (Date.now() - this.session.start) / 60000;
    return mins > 0 ? (this.session.likes / mins).toFixed(1) : 0;
  }

  matchesFilters(activity) {
    if (this.filters.minFollowers)
      return activity.user.followers >= this.filters.minFollowers;
    return true;
  }
}`,
  },
  {
    filename: "auctionScanner.js",
    label: "OAS Buyee Scanner",
    code: `// OAS — Online Auction Scanner for Buyee.jp
// Scans listings with 13 categories + blacklist filtering

function scanAuctionPage(config) {
  const items = document.querySelectorAll('.itemCard');
  const bargains = [];

  items.forEach(item => {
    const title = item.querySelector('.itemCard__title')
      ?.textContent?.toLowerCase() || '';
    const price = parsePrice(
      item.querySelector('.itemCard__price')?.textContent
    );

    // Check against blacklist (100+ junk filters)
    if (config.blacklist.some(b => title.includes(b))) {
      STATS.totalBlacklisted++;
      return;
    }

    // Match against device categories
    for (const cat of config.categories) {
      if (!cat.enabled) continue;
      const matched = cat.keywords.some(kw =>
        title.includes(kw.toLowerCase())
      );

      if (matched && price >= cat.minPrice
                   && price <= cat.maxPrice) {
        bargains.push({
          title, price, category: cat.name,
          color: cat.color, url: item.querySelector('a')?.href
        });
        highlightDeal(item, cat.color);
      }
    }
  });

  return bargains;
}`,
  },
];

function SyntaxHighlight({ code }: { code: string }) {
  const highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/(\/\/.*)/g, '<span class="text-gray-600">$1</span>')
    .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#a5d6ff">$1</span>')
    .replace(/\b(const|let|var|function|class|async|await|for|if|return|new|this|of|import|export|default)\b/g, '<span style="color:#ff7b72">$1</span>')
    .replace(/\b(true|false|null|undefined|console)\b/g, '<span style="color:#79c0ff">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#79c0ff">$1</span>')
    .replace(/\b(Map|Object|Array|JSON|Math|Date|document)\b/g, '<span style="color:#ffa657">$1</span>')
    .replace(/(\.\w+)\(/g, '<span style="color:#d2a8ff">$1</span>(');

  return (
    <pre
      className="text-[11px] md:text-xs leading-relaxed font-mono overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}

export default function CodeTerminal() {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-0 inset-x-0 cyber-line" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-6"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5 uppercase tracking-widest mb-6">
            {locale === "en" ? "Code Samples" : "דוגמאות קוד"}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="gradient-text">
              {locale === "en" ? "Under the Hood" : "מתחת למכסה"}
            </span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto mt-3">
            {locale === "en"
              ? "Real code snippets from my projects — this is what I actually write."
              : "קטעי קוד אמיתיים מהפרויקטים שלי — ככה אני כותב קוד."}
          </p>
        </div>

        {/* Terminal Window */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.06]" style={{ background: "#0d1117" }}>
          {/* Title Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]" style={{ background: "#161b22" }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[10px] text-gray-600 font-mono ms-2">~/daniel/projects</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.06] overflow-x-auto" style={{ background: "#161b22" }}>
            {codeSnippets.map((snippet, i) => (
              <button
                key={snippet.filename}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-mono whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === i
                    ? "text-white border-neon-cyan bg-[#0d1117]"
                    : "text-gray-600 border-transparent hover:text-gray-400 hover:bg-white/[0.02]"
                }`}
              >
                <svg className="w-3.5 h-3.5 text-yellow-500/60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {snippet.filename}
              </button>
            ))}
          </div>

          {/* Code Area */}
          <div className="p-4 md:p-6 max-h-[450px] overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#30363d transparent" }}>
            <SyntaxHighlight code={codeSnippets[activeTab].code} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06] text-[9px] font-mono text-gray-700" style={{ background: "#161b22" }}>
            <span>JavaScript</span>
            <span>{codeSnippets[activeTab].code.split("\n").length} lines</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
