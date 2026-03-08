"use client";

import { useRef, useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { fetchAniListImage, getCachedImage } from "./anilist-cache";
import type { Song } from "./types";

interface SongCardProps {
  song: Song;
  index: number;
}

const SongCard = memo(function SongCard({ song, index }: SongCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(() => {
    const cached = getCachedImage(song.animeName);
    return cached !== undefined ? (cached ?? null) : null;
  });
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const format = song.hash?.endsWith(".mp3") ? "MP3" : "WEBM";
  const isWebm = format === "WEBM";
  const isLive = song._isLive;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !song.animeName) return;

    const cached = getCachedImage(song.animeName);
    if (cached !== undefined) {
      setImageUrl(cached);
      return;
    }

    fetchAniListImage(song.animeName).then((url) => {
      if (url) setImageUrl(url);
    });
  }, [isVisible, song.animeName]);

  return (
    <motion.div
      ref={cardRef}
      initial={
        isLive
          ? { opacity: 0, y: -30, scale: 0.9 }
          : { opacity: 0, y: 20 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: isLive ? 0.5 : 0.35,
        delay: isLive ? 0 : Math.min(index * 0.015, 0.5),
        ease: "easeOut",
      }}
      className={`song-card group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-default
        ${
          isWebm
            ? "border-cyan-500/15 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.12)]"
            : "border-fuchsia-500/15 hover:border-fuchsia-400/40 hover:shadow-[0_0_30px_rgba(255,0,170,0.12)]"
        }
        ${
          isLive
            ? isWebm
              ? "ring-1 ring-cyan-400/30 shadow-[0_0_25px_rgba(0,240,255,0.2)]"
              : "ring-1 ring-fuchsia-400/30 shadow-[0_0_25px_rgba(255,0,170,0.2)]"
            : ""
        }
        bg-dark-800/50 backdrop-blur-sm hover:-translate-y-1`}
    >
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
          <img
            src={imageUrl}
            alt=""
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              imageLoaded
                ? "opacity-25 group-hover:opacity-35"
                : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/85 to-dark-900/50" />

      {/* Skeleton shimmer when no image yet */}
      {isVisible && !imageLoaded && !imageUrl && (
        <div className="absolute inset-0 shimmer-bg opacity-40" />
      )}

      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col justify-end min-h-[180px]">
        {/* Live indicator */}
        {isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest font-bold">
              New
            </span>
          </div>
        )}

        {/* Format Badge */}
        <span
          className={`absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono
          ${
            isWebm
              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/25"
              : "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/25"
          }`}
        >
          {format}
        </span>

        {/* Text Content */}
        <div className="mt-auto">
          <h3 className="text-[13px] font-bold text-white/90 leading-snug mb-0.5 line-clamp-2 group-hover:text-white transition-colors">
            {song.animeName}
          </h3>
          <p
            className={`text-[11px] font-medium leading-snug line-clamp-1 transition-colors
            ${
              isWebm
                ? "text-cyan-400/70 group-hover:text-cyan-300/90"
                : "text-fuchsia-400/70 group-hover:text-fuchsia-300/90"
            }`}
          >
            {song.songName}
          </p>
        </div>
      </div>

      {/* Hover shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className={`absolute inset-0 animate-shimmer ${
            isWebm
              ? "bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent"
              : "bg-gradient-to-r from-transparent via-fuchsia-500/5 to-transparent"
          }`}
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
    </motion.div>
  );
});

export default SongCard;
