import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import PlayerHeader from "@/components/PlayerHeader";
import MainMenuScreen from "@/components/MainMenuScreen";
import BrawlersScreen from "@/components/BrawlersScreen";
import TrophyRoadScreen from "@/components/TrophyRoadScreen";
import BattleLogScreen from "@/components/BattleLogScreen";
import LeaderboardScreen from "@/components/LeaderboardScreen";

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
    <div className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-deep)", maxWidth: "480px", margin: "0 auto" }}>
      
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(255,184,0,0.05) 0%, transparent 50%)"
      }} />

      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-4"
        style={{ background: "rgba(10,11,20,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,184,0,0.08)" }}>
        <PlayerHeader />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 pb-24 relative">
        {activeTab === "menu" && <MainMenuScreen />}
        {activeTab === "brawlers" && <BrawlersScreen />}
        {activeTab === "trophies" && <TrophyRoadScreen />}
        {activeTab === "log" && <BattleLogScreen />}
        {activeTab === "leaders" && <LeaderboardScreen />}
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-20"
        style={{ background: "rgba(10,11,20,0.98)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,184,0,0.12)" }}>
        <div className="flex">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 relative"
                style={{ color: isActive ? "#FFB800" : "rgba(255,255,255,0.35)" }}>
                
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ background: "#FFB800", boxShadow: "0 0 8px #FFB800" }} />
                )}

                <span className={`text-xl transition-transform duration-200 ${isActive ? "scale-110" : "scale-100"}`}>
                  {tab.icon}
                </span>
                <span className="font-semibold" style={{ fontSize: "10px" }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
      </div>
    </div>
  );
}
