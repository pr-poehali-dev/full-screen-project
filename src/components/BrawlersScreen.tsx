import { useState } from "react";
import { BRAWLERS } from "@/data/gameData";
import BrawlerDetail from "./BrawlerDetail";

export default function BrawlersScreen() {
  const [selected, setSelected] = useState<(typeof BRAWLERS)[0] | null>(null);

  if (selected) {
    return <BrawlerDetail brawler={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bebas text-2xl tracking-wider text-glow-gold" style={{ color: "#FFB800" }}>
          Бравлеры
        </h2>
        <span className="text-sm opacity-60">{BRAWLERS.length} бойцов</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {BRAWLERS.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setSelected(b)}
            className={`relative overflow-hidden rounded-xl p-0 text-left transition-all duration-200 hover:scale-105 active:scale-95 animate-fade-in stagger-${Math.min(i + 1, 5)}`}
            style={{
              background: "linear-gradient(135deg, #1A1D2E, #12141F)",
              border: `1px solid ${b.rarityColor}40`,
              opacity: 0,
            }}
          >
            {/* Glow overlay */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{ background: `radial-gradient(circle at 50% 50%, ${b.rarityColor}20, transparent 70%)` }} />

            {/* Image area */}
            <div className="relative h-28 overflow-hidden">
              <img src={b.image} alt={b.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, #12141F 0%, transparent 50%)" }} />
              {/* Rarity badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: `${b.rarityColor}`, color: "#0A0B14", fontSize: "10px" }}>
                {b.rarity}
              </div>
            </div>

            {/* Info */}
            <div className="p-3 pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-oswald font-semibold text-sm text-white">{b.name}</span>
                <span className="text-xs font-bold" style={{ color: "#FFB800" }}>⚡{b.power}</span>
              </div>
              
              {/* Trophy bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs">🏆</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full progress-bar rounded-full transition-all duration-1000"
                    style={{ width: `${(b.trophies / b.maxTrophies) * 100}%` }} />
                </div>
                <span className="text-xs font-bold" style={{ color: "#FFB800" }}>{b.trophies}</span>
              </div>

              {/* Buffs */}
              <div className="flex gap-1.5 mt-2">
                {b.buffs.gadget && (
                  <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(0,229,255,0.2)", color: "#00E5FF", fontSize: "10px" }}>
                    🔧 Гаджет
                  </span>
                )}
                {b.buffs.hypercharge && (
                  <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(255,23,68,0.2)", color: "#FF1744", fontSize: "10px" }}>
                    ⚡ Гипер
                  </span>
                )}
                {b.buffs.starPower && (
                  <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: "rgba(255,184,0,0.2)", color: "#FFB800", fontSize: "10px" }}>
                    ⭐ Сила
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
