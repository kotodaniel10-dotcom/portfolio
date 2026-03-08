"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Music,
  Wifi,
  WifiOff,
  Database,
  FileAudio,
  Film,
  ChevronDown,
  ArrowUp,
  Loader2,
  Radio,
} from "lucide-react";
import SongCard from "./SongCard";
import LiveToast from "./LiveToast";
import type { Song, ToastItem } from "./types";

const ITEMS_PER_PAGE = 60;
const TOAST_DURATION = 6000;

export default function MusicDashboard() {
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [formatFilter, setFormatFilter] = useState<"all" | "webm" | "mp3">(
    "all"
  );
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [firebaseStatus, setFirebaseStatus] = useState<
    "connecting" | "connected" | "error"
  >("connecting");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const knownKeys = useRef(new Set<string>());
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const toastIdCounter = useRef(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination on filter change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [debouncedQuery, formatFilter]);

  // Scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toast helper
  const addToast = useCallback((song: Song) => {
    const id = String(++toastIdCounter.current);
    setToasts((prev) => [...prev.slice(-4), { id, song, addedAt: Date.now() }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── 1. Load initial JSON data ──
  useEffect(() => {
    async function loadData() {
      try {
        const [webmRes, mp3Res] = await Promise.all([
          fetch("/data/Leviathan_WEBM_Backup_23375.json"),
          fetch("/data/Leviathan_MP3_Backup_1610.json"),
        ]);
        const [webmData, mp3Data] = await Promise.all([
          webmRes.json(),
          mp3Res.json(),
        ]);

        const songs: Song[] = [];
        const merged = { ...webmData, ...mp3Data };

        for (const [key, value] of Object.entries(merged)) {
          knownKeys.current.add(key);
          songs.push({ ...(value as Song), _key: key });
        }

        songs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setAllSongs(songs);
      } catch (err) {
        console.error("Failed to load song data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // ── 2. Firebase real-time sync ──
  useEffect(() => {
    if (isLoading) return;

    let es: EventSource | null = null;

    try {
      es = new EventSource(
        "https://daniel-script-default-rtdb.firebaseio.com/songs.json"
      );

      es.addEventListener("put", (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          setFirebaseStatus("connected");

          if (data.path === "/") {
            // Initial full data dump — check for any new items not in our JSON backups
            if (data.data && typeof data.data === "object") {
              const newSongs: Song[] = [];
              for (const [key, value] of Object.entries(data.data)) {
                if (
                  !knownKeys.current.has(key) &&
                  value &&
                  typeof value === "object"
                ) {
                  knownKeys.current.add(key);
                  newSongs.push({
                    ...(value as Song),
                    _key: key,
                    _isLive: true,
                  });
                }
              }
              if (newSongs.length > 0) {
                newSongs.sort(
                  (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
                );
                setAllSongs((prev) => [...newSongs, ...prev]);
                newSongs.slice(0, 3).forEach(addToast);
              }
            }
          } else {
            // Individual new item
            const key = data.path.replace(/^\//, "");
            if (
              !knownKeys.current.has(key) &&
              data.data &&
              typeof data.data === "object"
            ) {
              knownKeys.current.add(key);
              const newSong: Song = {
                ...(data.data as Song),
                _key: key,
                _isLive: true,
              };
              setAllSongs((prev) => [newSong, ...prev]);
              addToast(newSong);
            }
          }
        } catch (e) {
          console.error("Firebase parse error:", e);
        }
      });

      es.addEventListener("patch", (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.data && typeof data.data === "object") {
            const newSongs: Song[] = [];
            for (const [key, value] of Object.entries(data.data)) {
              if (
                !knownKeys.current.has(key) &&
                value &&
                typeof value === "object"
              ) {
                knownKeys.current.add(key);
                newSongs.push({
                  ...(value as Song),
                  _key: key,
                  _isLive: true,
                });
              }
            }
            if (newSongs.length > 0) {
              setAllSongs((prev) => [...newSongs, ...prev]);
              newSongs.forEach(addToast);
            }
          }
        } catch (e) {
          console.error("Firebase patch error:", e);
        }
      });

      es.onerror = () => {
        setFirebaseStatus("error");
      };
    } catch {
      setFirebaseStatus("error");
    }

    return () => {
      if (es) es.close();
    };
  }, [isLoading, addToast]);

  // ── 3. Infinite scroll trigger ──
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { rootMargin: "600px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Filtered songs ──
  const filteredSongs = useMemo(() => {
    let result = allSongs;

    if (formatFilter !== "all") {
      result = result.filter((s) =>
        formatFilter === "webm"
          ? s.hash?.endsWith(".webm")
          : s.hash?.endsWith(".mp3")
      );
    }

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.animeName?.toLowerCase().includes(q) ||
          s.englishName?.toLowerCase().includes(q) ||
          s.songName?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allSongs, debouncedQuery, formatFilter]);

  const displayedSongs = filteredSongs.slice(0, displayCount);
  const hasMore = displayCount < filteredSongs.length;

  // ── Stats ──
  const stats = useMemo(() => {
    const total = allSongs.length;
    const webm = allSongs.filter((s) => s.hash?.endsWith(".webm")).length;
    const mp3 = allSongs.filter((s) => s.hash?.endsWith(".mp3")).length;
    return { total, webm, mp3 };
  }, [allSongs]);

  // ═══════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 bg-cyber-grid bg-cyber-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-cyan-950/20 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Header ── */}
        <header className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase">
                Live Mining Dashboard
              </span>
              {firebaseStatus === "connected" && (
                <span className="relative flex h-1.5 w-1.5 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3">
              <span className="gradient-text">Music Database</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              <span className="text-white font-semibold font-mono">
                {stats.total.toLocaleString()}
              </span>{" "}
              anime songs datamined and counting. Real-time sync with the
              mining bot.
            </p>
          </motion.div>
        </header>

        {/* ── Stats Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          <StatCard
            icon={<Music className="w-4 h-4" />}
            label="Total Songs"
            value={stats.total.toLocaleString()}
            color="cyan"
          />
          <StatCard
            icon={<Film className="w-4 h-4" />}
            label="WEBM Files"
            value={stats.webm.toLocaleString()}
            color="cyan"
          />
          <StatCard
            icon={<FileAudio className="w-4 h-4" />}
            label="MP3 Files"
            value={stats.mp3.toLocaleString()}
            color="pink"
          />
          <StatCard
            icon={
              firebaseStatus === "connected" ? (
                <Radio className="w-4 h-4" />
              ) : firebaseStatus === "connecting" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )
            }
            label="Mining Bot"
            value={
              firebaseStatus === "connected"
                ? "Online"
                : firebaseStatus === "connecting"
                ? "Syncing..."
                : "Offline"
            }
            color={
              firebaseStatus === "connected"
                ? "green"
                : firebaseStatus === "connecting"
                ? "yellow"
                : "red"
            }
            pulse={firebaseStatus === "connected"}
          />
        </motion.div>

        {/* ── Search & Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime, song name, english name..."
              className="w-full pl-11 pr-20 py-3 rounded-xl bg-dark-800/60 border border-gray-700/50
                text-sm text-gray-200 placeholder-gray-500
                focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 focus:bg-dark-800/80
                backdrop-blur-sm transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs px-2.5 py-1 rounded-lg hover:bg-dark-700/50 border border-gray-700/30 transition-all duration-150"
              >
                Clear
              </button>
            )}
          </div>

          {/* Format Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-700/50 bg-dark-800/60 backdrop-blur-sm shrink-0">
            {(["all", "webm", "mp3"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormatFilter(f)}
                className={`px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200
                  ${
                    formatFilter === f
                      ? f === "mp3"
                        ? "bg-fuchsia-500/15 text-fuchsia-300"
                        : "bg-cyan-500/15 text-cyan-300"
                      : "text-gray-500 hover:text-gray-300 hover:bg-dark-700/30"
                  }`}
              >
                {f === "all" ? "All" : f.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Results Count ── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs text-gray-500 font-mono">
            {isLoading
              ? "Loading database..."
              : `Showing ${displayedSongs.length.toLocaleString()} of ${filteredSongs.length.toLocaleString()} results`}
          </p>
          {debouncedQuery && (
            <p className="text-xs text-gray-500">
              Searching:{" "}
              <span className="text-cyan-400 font-medium">
                &quot;{debouncedQuery}&quot;
              </span>
            </p>
          )}
        </div>

        {/* ── Loading State ── */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
              <Music className="absolute inset-0 m-auto w-6 h-6 text-cyan-400/60" />
            </div>
            <p className="text-gray-400 text-sm font-mono animate-pulse">
              Loading {">"}25,000 songs...
            </p>
          </div>
        )}

        {/* ── Song Grid ── */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {displayedSongs.map((song, i) => (
                <SongCard
                  key={song._key || song.hash || i}
                  song={song}
                  index={i}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredSongs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24">
                <Search className="w-12 h-12 text-gray-700 mb-4" />
                <p className="text-gray-400 text-lg font-medium mb-1">
                  No songs found
                </p>
                <p className="text-gray-600 text-sm">
                  Try adjusting your search or filter
                </p>
              </div>
            )}

            {/* Load More / Infinite Scroll Sentinel */}
            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center pt-10 pb-6">
                <button
                  onClick={() =>
                    setDisplayCount((prev) => prev + ITEMS_PER_PAGE)
                  }
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-dark-800/60 border border-gray-700/40 text-sm text-gray-400
                    hover:border-cyan-500/30 hover:text-cyan-300 hover:bg-dark-700/40
                    backdrop-blur-sm transition-all duration-200"
                >
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  Load More (
                  {(filteredSongs.length - displayCount).toLocaleString()}{" "}
                  remaining)
                </button>
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && filteredSongs.length > 0 && (
              <div className="flex justify-center py-10">
                <p className="text-xs text-gray-600 font-mono">
                  End of results
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Scroll to Top ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 left-6 z-50 p-3 rounded-full glass border border-cyan-500/20 text-cyan-400
              hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all duration-200"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Live Toast Notifications ── */}
      <LiveToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// ═══════════════════════════════════════
//  STAT CARD
// ═══════════════════════════════════════

function StatCard({
  icon,
  label,
  value,
  color,
  pulse,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  pulse?: boolean;
}) {
  const styles: Record<string, { card: string; icon: string }> = {
    cyan: {
      card: "border-cyan-500/15 bg-cyan-500/[0.03]",
      icon: "text-cyan-400",
    },
    pink: {
      card: "border-fuchsia-500/15 bg-fuchsia-500/[0.03]",
      icon: "text-fuchsia-400",
    },
    green: {
      card: "border-green-500/15 bg-green-500/[0.03]",
      icon: "text-green-400",
    },
    yellow: {
      card: "border-yellow-500/15 bg-yellow-500/[0.03]",
      icon: "text-yellow-400",
    },
    red: {
      card: "border-red-500/15 bg-red-500/[0.03]",
      icon: "text-red-400",
    },
  };

  const s = styles[color] || styles.cyan;

  return (
    <div
      className={`rounded-xl border p-4 backdrop-blur-sm transition-colors duration-300 ${s.card}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={s.icon}>{icon}</span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
          {label}
        </span>
        {pulse && (
          <span className="relative flex h-2 w-2 ml-auto">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
        )}
      </div>
      <p className={`text-xl font-bold font-mono tracking-tight ${s.icon}`}>
        {value}
      </p>
    </div>
  );
}
