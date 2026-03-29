import Icon from "@/components/ui/icon";
import { PLAYER } from "@/data/gameData";

export default function PlayerHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 mb-4"
      style={{ background: "linear-gradient(135deg, #1A1D2E 0%, #12141F 100%)", border: "1px solid rgba(255,184,0,0.2)" }}>
      
      {/* Decorative bg */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #FFB800, transparent)" }} />

      <div className="relative flex items-center gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 animate-pulse-glow"
            style={{ borderColor: "#FFB800" }}>
            <img src={PLAYER.avatar} alt={PLAYER.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "#FFB800", color: "#0A0B14" }}>
            {PLAYER.level}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="font-bebas text-xl tracking-wider text-glow-gold" style={{ color: "#FFB800" }}>
              {PLAYER.name}
            </h2>
            {PLAYER.brawlPass && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: "linear-gradient(90deg, #9C27B0, #E040FB)", color: "white" }}>
                PASS
              </span>
            )}
          </div>
          <p className="text-xs opacity-50 mb-1">{PLAYER.tag}</p>
          <p className="text-xs opacity-70" style={{ color: "#00E5FF" }}>{PLAYER.club}</p>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-1.5 text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <span className="font-bold text-sm" style={{ color: "#FFB800" }}>{PLAYER.trophies.toLocaleString()}</span>
            <span className="text-lg">🏆</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <span className="font-semibold text-sm" style={{ color: "#00E5FF" }}>{PLAYER.gems}</span>
            <span className="text-lg">💎</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <span className="font-semibold text-sm" style={{ color: "#FFD700" }}>{PLAYER.coins.toLocaleString()}</span>
            <span className="text-lg">🪙</span>
          </div>
        </div>
      </div>
    </div>
  );
}
