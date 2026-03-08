"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, GitCommit } from "lucide-react";

interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

interface ChangelogProps {
  entries: ChangelogEntry[];
  accentColor: string;
}

export default function Changelog({ entries, accentColor }: ChangelogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedVersion, setExpandedVersion] = useState<string | null>(
    entries[0]?.version || null
  );

  return (
    <div className="mt-4">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-gray-300 transition-colors w-full"
        whileTap={{ scale: 0.98 }}
      >
        <GitCommit size={14} style={{ color: accentColor }} />
        <span>Changelog</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={14} />
        </motion.div>
        <div className="flex-1 h-px bg-gradient-to-r from-gray-800 to-transparent ms-2" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.version}
                  className="rounded-lg border border-gray-800/50 overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedVersion(
                        expandedVersion === entry.version
                          ? null
                          : entry.version
                      )
                    }
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                        style={{
                          color: accentColor,
                          backgroundColor: `${accentColor}15`,
                          border: `1px solid ${accentColor}30`,
                        }}
                      >
                        {entry.version}
                      </span>
                      <span className="text-xs text-gray-600 font-mono">
                        {entry.date}
                      </span>
                    </div>
                    <motion.div
                      animate={{
                        rotate:
                          expandedVersion === entry.version ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={12} className="text-gray-600" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedVersion === entry.version && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 space-y-2">
                          {entry.changes.map((change, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs text-gray-500"
                            >
                              <span
                                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: accentColor }}
                              />
                              <span className="leading-relaxed">
                                {change}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
