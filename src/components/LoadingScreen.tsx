import { useEffect, useState } from "react";

interface Props {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [hint, setHint] = useState(0);

  const hints = [
    "Загружаем арены боёв...",
    "Призываем бравлеров...",
    "Активируем систему баффов...",
    "Готовим трофейный путь...",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const hintTimer = setInterval(() => {
      setHint(prev => (prev + 1) % hints.length);
    }, 800);

    return () => { clearInterval(timer); clearInterval(hintTimer); };
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: "linear-gradient(135deg, #0A0B14 0%, #0D0A1A 50%, #0A1414 100%)" }}>
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute animate-spin-slow" style={{
          width: "600px", height: "600px", borderRadius: "50%",
          background: "conic-gradient(from 0deg, transparent 0%, rgba(255,184,0,0.05) 25%, transparent 50%, rgba(0,229,255,0.05) 75%, transparent 100%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)"
        }} />
        <div className="absolute" style={{
          width: "300px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,184,0,0.08), transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)"
        }} />
      </div>

      {/* Logo */}
      <div className="relative mb-8 text-center">
        <h1 className="font-bebas text-6xl tracking-widest text-glow-gold animate-neon-flicker"
          style={{ color: "#FFB800", letterSpacing: "0.2em" }}>
          BRAWLFORGE
        </h1>
        <p className="font-oswald text-sm tracking-[0.5em] opacity-60" style={{ color: "#00E5FF" }}>
          BATTLE ARENA
        </p>
        <div className="mt-4 text-6xl animate-float">⚔️</div>
      </div>

      {/* Progress */}
      <div className="w-72">
        <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full progress-bar rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs opacity-50">
          <span>{hints[hint]}</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
