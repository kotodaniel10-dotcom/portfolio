"use client";

import { useEffect, useState, useCallback } from "react";

interface Heart {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function TehilaEasterEgg() {
  const [triggered, setTriggered] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [buffer, setBuffer] = useState("");

  const SECRET = "tehila";

  const spawnHearts = useCallback(() => {
    const newHearts: Heart[] = [];
    for (let i = 0; i < 60; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
        opacity: Math.random() * 0.6 + 0.4,
      });
    }
    setHearts(newHearts);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (triggered) return;
      if (e.key.length !== 1) return;

      const next = (buffer + e.key.toLowerCase()).slice(-SECRET.length);
      setBuffer(next);

      if (next === SECRET) {
        setTriggered(true);
        spawnHearts();
        setTimeout(() => {
          setTriggered(false);
          setHearts([]);
          setBuffer("");
        }, 7000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [buffer, triggered, spawnHearts]);

  if (!triggered) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0"
          style={{
            left: `${heart.x}%`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            animation: `floatUpHeart ${heart.duration}s ease-out ${heart.delay}s forwards`,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Center Message */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          animation: "fadeInMessage 0.8s ease-out 0.5s both",
        }}
      >
        <div className="text-center px-8 py-6 rounded-2xl" style={{ background: "rgba(10,10,20,0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,100,150,0.2)" }}>
          <div className="text-4xl mb-3">💖</div>
          <p className="text-xl md:text-2xl font-bold text-white mb-1">
            Tehila is my biggest motivation
          </p>
          <p className="text-sm text-pink-400/60 font-mono">
            — Daniel
          </p>
        </div>
      </div>

      <style>{`
        @keyframes floatUpHeart {
          0% {
            transform: translateY(0) rotate(0deg) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-5vh) rotate(-5deg) scale(1);
          }
          100% {
            transform: translateY(-110vh) rotate(15deg) scale(0.5);
            opacity: 0;
          }
        }
        @keyframes fadeInMessage {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
