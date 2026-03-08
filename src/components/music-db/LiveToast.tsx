"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ToastItem } from "./types";

interface LiveToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export default function LiveToast({ toasts, onDismiss }: LiveToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const format = toast.song.hash?.endsWith(".mp3")
            ? "MP3"
            : "WEBM";
          const isWebm = format === "WEBM";

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.85 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={() => onDismiss(toast.id)}
              className={`pointer-events-auto relative overflow-hidden rounded-xl border cursor-pointer backdrop-blur-xl p-4 max-w-sm
                ${
                  isWebm
                    ? "bg-dark-900/80 border-cyan-500/30 shadow-[0_0_35px_rgba(0,240,255,0.15)]"
                    : "bg-dark-900/80 border-fuchsia-500/30 shadow-[0_0_35px_rgba(255,0,170,0.15)]"
                }
                hover:scale-[1.02] transition-transform duration-150`}
            >
              {/* Glow line at top */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2px] ${
                  isWebm
                    ? "bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    : "bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent"
                }`}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="relative flex h-2 w-2">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isWebm ? "bg-cyan-400" : "bg-fuchsia-400"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        isWebm ? "bg-cyan-400" : "bg-fuchsia-400"
                      }`}
                    />
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest font-mono ${
                      isWebm ? "text-cyan-400" : "text-fuchsia-400"
                    }`}
                  >
                    Live Mining
                  </span>
                  <span
                    className={`ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono
                    ${
                      isWebm
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
                        : "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/20"
                    }`}
                  >
                    {format}
                  </span>
                </div>

                <p className="text-white/90 text-sm font-semibold leading-tight line-clamp-1">
                  {toast.song.animeName}
                </p>
                <p
                  className={`text-xs mt-0.5 line-clamp-1 ${
                    isWebm
                      ? "text-cyan-300/60"
                      : "text-fuchsia-300/60"
                  }`}
                >
                  {toast.song.songName}
                </p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
