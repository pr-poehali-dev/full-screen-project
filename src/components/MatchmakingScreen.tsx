import { useState, useEffect } from "react";
import { MODES, BRAWLERS, PLAYER } from "@/data/gameData";
import GameCanvas from "@/components/GameCanvas";

interface Props {
  onCancel: () => void;
}

const ENEMY_NAMES = ["DarkWolf99", "CrystalBlade", "NeonStrike", "IronFist", "ShadowX"];
const ENEMY_TAGS = ["#ABC123", "#XY9K2", "#QW8RT", "#ZZ1PQ", "#MN4LR"];

type Phase = "selecting" | "searching" | "found" | "countdown" | "playing";

export default function MatchmakingScreen({ onCancel }: Props) {
  const [phase, setPhase] = useState<Phase>("selecting");
  const [selectedMode, setSelectedMode] = useState(0);
  const [selectedBrawler, setSelectedBrawler] = useState(0);
  const [searchTime, setSearchTime] = useState(0);
  const [dots, setDots] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [teammates, setTeammates] = useState<string[]>([]);
  const [enemies, setEnemies] = useState<string[]>([]);

  // Dots animation
  useEffect(() => {
    if (phase !== "searching") return;
    const t = setInterval(() => setDots(d => d === 3 ? 1 : d + 1), 500);
    return () => clearInterval(t);
  }, [phase]);

  // Search timer
  useEffect(() => {
    if (phase !== "searching") return;
    const t = setInterval(() => setSearchTime(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Auto-find match after 3-6 seconds
  useEffect(() => {
    if (phase !== "searching") return;
    const delay = 3000 + Math.random() * 3000;
    const t = setTimeout(() => {
      setTeammates([ENEMY_NAMES[1], ENEMY_NAMES[2]]);
      setEnemies([ENEMY_NAMES[3], ENEMY_NAMES[4], ENEMY_NAMES[0]]);
      setPhase("found");
    }, delay);
    return () => clearTimeout(t);
  }, [phase]);

  // Countdown after found
  useEffect(() => {
    if (phase !== "found") return;
    const t = setTimeout(() => setPhase("countdown"), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) { setPhase("playing"); return; }
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [phase, countdown]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const mode = MODES[selectedMode];
  const brawler = BRAWLERS[selectedBrawler];

  // === PLAYING PHASE ===
  if (phase === "playing") {
    return (
      <GameCanvas
        brawlerIdx={selectedBrawler}
        mode={selectedMode === 2 ? "gems" : "brawl"}
        onExit={(victory, score) => onCancel()}
      />
    );
  }

  // === SELECTION PHASE ===
  if (phase === "selecting") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col animate-fade-in"
        style={{ background: "#0A0B14", opacity: 0 }}>
        
        {/* Header */}
        <div className="px-4 pt-6 pb-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(255,184,0,0.1)" }}>
          <button onClick={onCancel}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}>
            ✕
          </button>
          <div>
            <h2 className="font-bebas text-xl tracking-wider" style={{ color: "#FFB800" }}>В БОЙ</h2>
            <p className="text-xs opacity-50">Выбери режим и бойца</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Mode selection */}
          <div>
            <h3 className="font-oswald text-xs opacity-50 uppercase tracking-wider mb-3">Режим игры</h3>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m, i) => (
                <button key={i} onClick={() => setSelectedMode(i)}
                  className="rounded-xl p-3 flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left"
                  style={{
                    background: selectedMode === i ? `${m.color}18` : "#1A1D2E",
                    border: `1px solid ${selectedMode === i ? `${m.color}80` : "rgba(255,255,255,0.06)"}`,
                    boxShadow: selectedMode === i ? `0 0 12px ${m.color}30` : "none",
                  }}>
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <div className="text-xs font-semibold leading-tight" style={{ color: selectedMode === i ? m.color : "white" }}>
                      {m.name}
                    </div>
                    <div className="text-xs opacity-40">{m.players}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Brawler selection */}
          <div>
            <h3 className="font-oswald text-xs opacity-50 uppercase tracking-wider mb-3">Боец</h3>
            <div className="grid grid-cols-3 gap-2">
              {BRAWLERS.map((b, i) => (
                <button key={i} onClick={() => setSelectedBrawler(i)}
                  className="rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    border: `2px solid ${selectedBrawler === i ? b.rarityColor : "transparent"}`,
                    boxShadow: selectedBrawler === i ? `0 0 14px ${b.rarityColor}50` : "none",
                  }}>
                  <div className="relative">
                    <img src={b.image} alt={b.name} className="w-full h-20 object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #12141F 0%, transparent 60%)" }} />
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 text-center">
                      <div className="text-xs font-semibold truncate">{b.name}</div>
                      <div className="text-xs" style={{ color: "#FFB800" }}>⚡{b.power}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start button */}
        <div className="px-4 pb-8 pt-3" style={{ borderTop: "1px solid rgba(255,184,0,0.1)" }}>
          <button
            onClick={() => { setSearchTime(0); setPhase("searching"); }}
            className="w-full rounded-2xl py-4 font-bebas text-2xl tracking-widest relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${mode.color}, ${mode.color}CC)`,
              color: "#0A0B14",
              boxShadow: `0 0 24px ${mode.color}50`,
            }}>
            <div className="absolute inset-0 animate-shimmer" />
            <span className="relative">{mode.icon} НАЧАТЬ ПОИСК</span>
          </button>
        </div>
      </div>
    );
  }

  // === SEARCHING PHASE ===
  if (phase === "searching") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: "radial-gradient(ellipse at 50% 40%, #1A0D2E 0%, #0A0B14 60%)" }}>
        
        {/* Rotating rings */}
        <div className="relative w-52 h-52 mb-8 flex items-center justify-center">
          {[1, 2, 3].map((ring) => (
            <div key={ring} className="absolute rounded-full border"
              style={{
                width: `${ring * 60 + 30}px`,
                height: `${ring * 60 + 30}px`,
                borderColor: `rgba(255,184,0,${0.3 - ring * 0.08})`,
                borderStyle: ring === 1 ? "solid" : "dashed",
                animation: `spin-slow ${ring * 7}s linear ${ring % 2 === 0 ? "reverse" : "normal"} infinite`,
              }} />
          ))}
          {/* Center brawler */}
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden z-10 animate-pulse-glow"
            style={{ border: `2px solid ${mode.color}` }}>
            <img src={brawler.image} alt={brawler.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Mode info */}
        <div className="text-center mb-6">
          <div className="font-bebas text-3xl tracking-wider mb-1 animate-neon-flicker" style={{ color: mode.color }}>
            {mode.icon} {mode.name}
          </div>
          <div className="font-oswald text-base text-white">
            Поиск игроков{".".repeat(dots)}
          </div>
        </div>

        {/* Timer */}
        <div className="mb-8 font-bebas text-5xl" style={{ color: "rgba(255,255,255,0.15)" }}>
          {formatTime(searchTime)}
        </div>

        {/* Searching players indicators */}
        <div className="flex gap-4 mb-8">
          {["Ты", "...", "..."].map((name, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center"
                style={{
                  background: i === 0 ? "rgba(255,184,0,0.2)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${i === 0 ? "rgba(255,184,0,0.5)" : "rgba(255,255,255,0.1)"}`,
                  animation: i !== 0 ? `pulse-glow ${1 + i * 0.3}s ease-in-out infinite` : "none",
                }}>
                {i === 0
                  ? <img src={PLAYER.avatar} alt="" className="w-full h-full object-cover" />
                  : <span className="text-xl opacity-30">?</span>
                }
              </div>
              <span className="text-xs opacity-50">{i === 0 ? PLAYER.name : name}</span>
            </div>
          ))}
        </div>

        {/* Cancel */}
        <button onClick={onCancel}
          className="px-8 py-3 rounded-full font-oswald font-semibold text-sm transition-all hover:scale-105 active:scale-95"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>
          Отмена
        </button>
      </div>
    );
  }

  // === FOUND / COUNTDOWN PHASE ===
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-scale-in"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #0D1A0D 0%, #0A0B14 60%)", opacity: 0 }}>
      
      {/* Found flash */}
      <div className="text-center mb-8">
        <div className="font-bebas text-5xl tracking-widest mb-2" style={{ color: "#00E676", textShadow: "0 0 30px #00E676" }}>
          МАТЧ НАЙДЕН!
        </div>
        <div className="text-sm opacity-60">{mode.icon} {mode.name}</div>
      </div>

      {/* VS layout */}
      <div className="flex items-center gap-4 mb-8 w-full px-6">
        {/* Our team */}
        <div className="flex-1 space-y-2">
          {[PLAYER.name, ...teammates].map((name, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2 animate-slide-up"
              style={{
                background: "rgba(255,184,0,0.1)",
                border: "1px solid rgba(255,184,0,0.3)",
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}>
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                style={{ background: "#1A1D2E", border: "1px solid rgba(255,184,0,0.3)" }}>
                {i === 0
                  ? <img src={PLAYER.avatar} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center font-bebas text-sm" style={{ color: "#FFB800" }}>{name.charAt(0)}</div>
                }
              </div>
              <span className="text-xs font-semibold truncate">{name}</span>
            </div>
          ))}
        </div>

        {/* VS */}
        <div className="font-bebas text-2xl" style={{ color: "rgba(255,255,255,0.2)" }}>VS</div>

        {/* Enemy team */}
        <div className="flex-1 space-y-2">
          {enemies.map((name, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2 animate-slide-up"
              style={{
                background: "rgba(255,23,68,0.08)",
                border: "1px solid rgba(255,23,68,0.25)",
                animationDelay: `${i * 0.1}s`,
                opacity: 0,
              }}>
              <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bebas text-sm"
                style={{ background: "rgba(255,23,68,0.15)", border: "1px solid rgba(255,23,68,0.3)", color: "#FF1744" }}>
                {name.charAt(0)}
              </div>
              <span className="text-xs font-semibold truncate">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Countdown */}
      {phase === "countdown" && (
        <div className="text-center">
          <div className="font-bebas text-8xl animate-scale-in" style={{ color: "#FFB800", textShadow: "0 0 40px #FFB800", opacity: 0 }}>
            {countdown}
          </div>
          <div className="text-sm opacity-50 mt-2">до начала боя</div>
        </div>
      )}
    </div>
  );
}