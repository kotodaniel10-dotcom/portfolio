"use client";

import dynamic from "next/dynamic";

const MusicDashboard = dynamic(
  () => import("@/components/music-db/MusicDashboard"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
          </div>
          <p className="text-gray-500 text-sm font-mono">
            Initializing dashboard...
          </p>
        </div>
      </div>
    ),
  }
);

export default function MusicDatabasePage() {
  return <MusicDashboard />;
}
