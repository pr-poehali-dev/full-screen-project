import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import MainMenuScreen from "@/components/MainMenuScreen";
import BrawlersScreen from "@/components/BrawlersScreen";
import TrophyRoadScreen from "@/components/TrophyRoadScreen";
import BattleLogScreen from "@/components/BattleLogScreen";
import LeaderboardScreen from "@/components/LeaderboardScreen";
import { PLAYER } from "@/data/gameData";

type Tab = "menu" | "brawlers" | "trophies" | "log" | "leaders";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "menu", label: "Главная", icon: "🏠" },
  { id: "brawlers", label: "Бравлеры", icon: "⚔️" },
  { id: "trophies", label: "Трофеи", icon: "🏆" },
  { id: "log", label: "Бои", icon: "📋" },
  { id: "leaders", label: "Топ", icon: "👑" },
];

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("menu");

  if (loading) {
    return <LoadingScreen onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden" style={{ background: "var(--bg-deep)" }}>

      {/* Background */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 30% 50%, rgba(255,184,0,0.04) 0%, transparent 55%)"
      }} />

      {/* ── LEFT SIDEBAR ── */}
      <aside className="relative z-10 flex flex-col w-56 flex-shrink-0 h-full"
        style={{ background: "rgba(10,11,20,0.97)", borderRight: "1px solid rgba(255,184,0,0.1)", backdropFilter: "blur(20px)" }}>

        {/* Logo */}
        <div className="px-4 pt-5 pb-3" style={{ borderBottom: "1px solid rgba(255,184,0,0.08)" }}>
          <div className="font-bebas text-2xl tracking-widest text-glow-gold" style={{ color: "#FFB800" }}>
            BRAWLFORGE
          </div>
          <div className="text-xs tracking-widest opacity-40 font-oswald" style={{ color: "#00E5FF" }}>BATTLE ARENA</div>
        </div>

        {/* Player card */}
        <div className="mx-3 mt-3 mb-2 rounded-xl p-3 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1A1D2E, #12141F)", border: "1px solid rgba(255,184,0,0.18)" }}>
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #FFB800, transparent)" }} />
          <div className="relative flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-xl overflow-hidden border-2 animate-pulse-glow"
                style={{ borderColor: "#FFB800" }}>
                <img src={PLAYER.avatar} alt={PLAYER.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-bold"
                style={{ background: "#FFB800", color: "#0A0B14", fontSize: "9px" }}>
                {PLAYER.level}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="font-bebas text-sm tracking-wide truncate" style={{ color: "#FFB800" }}>
                  {PLAYER.name}
                </span>
                {PLAYER.brawlPass && (
                  <span className="px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(90deg,#9C27B0,#E040FB)", color: "white", fontSize: "8px" }}>
                    PASS
                  </span>
                )}
              </div>
              <p className="text-xs truncate opacity-60" style={{ color: "#00E5FF", fontSize: "10px" }}>{PLAYER.club}</p>
            </div>
          </div>
          {/* Resources row */}
          <div className="relative flex gap-2 mt-2.5 pt-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { val: PLAYER.trophies.toLocaleString(), icon: "🏆", color: "#FFB800" },
              { val: PLAYER.gems, icon: "💎", color: "#00E5FF" },
              { val: PLAYER.coins.toLocaleString(), icon: "🪙", color: "#FFD700" },
            ].map((r) => (
              <div key={r.icon} className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-base">{r.icon}</span>
                <span className="font-bold" style={{ color: r.color, fontSize: "11px" }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
                style={{
                  background: isActive ? "rgba(255,184,0,0.12)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(255,184,0,0.35)" : "transparent"}`,
                  color: isActive ? "#FFB800" : "rgba(255,255,255,0.45)",
                  boxShadow: isActive ? "0 0 12px rgba(255,184,0,0.15)" : "none",
                }}>
                <span className={`text-xl transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                  {tab.icon}
                </span>
                <span className="font-oswald font-semibold text-sm tracking-wide">{tab.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "#FFB800", boxShadow: "0 0 6px #FFB800" }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom tag */}
        <div className="px-4 py-3 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <span className="font-oswald text-xs opacity-30">{PLAYER.tag}</span>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="relative flex-1 h-full overflow-y-auto">
        <div className="px-6 py-5 min-h-full">
          {activeTab === "menu" && <MainMenuScreen />}
          {activeTab === "brawlers" && <BrawlersScreen />}
          {activeTab === "trophies" && <TrophyRoadScreen />}
          {activeTab === "log" && <BattleLogScreen />}
          {activeTab === "leaders" && <LeaderboardScreen />}
        </div>
      </main>
    </div>
  );
}
