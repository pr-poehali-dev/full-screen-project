import { BATTLE_LOG } from "@/data/gameData";

const modeColors: Record<string, string> = {
  "Загруженное столкновение": "#FFB800",
  "Захват кристаллов": "#00E5FF",
  "Бой с боссом": "#FF1744",
  "Соло столкновение": "#9C27B0",
  "Ограбление": "#00E676",
};

export default function BattleLogScreen() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bebas text-2xl tracking-wider text-glow-gold" style={{ color: "#FFB800" }}>
          Журнал боёв
        </h2>
        <span className="text-sm opacity-60">{BATTLE_LOG.length} боёв</span>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "Победы", value: BATTLE_LOG.filter(b => b.result === "победа").length, icon: "🏆", color: "#00E676" },
          { label: "Поражения", value: BATTLE_LOG.filter(b => b.result === "поражение").length, icon: "💀", color: "#FF1744" },
          { label: "Звёздный", value: BATTLE_LOG.filter(b => b.starPlayer).length, icon: "⭐", color: "#FFB800" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-3 text-center"
            style={{ background: "#1A1D2E", border: `1px solid ${s.color}30` }}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-bebas text-2xl" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs opacity-50">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Battle list */}
      <div className="grid grid-cols-2 gap-2">
        {BATTLE_LOG.map((battle, i) => {
          const modeColor = modeColors[battle.mode] || "#FFB800";
          const isWin = battle.result === "победа";

          return (
            <div key={battle.id}
              className={`rounded-xl p-3 animate-fade-in stagger-${Math.min(i + 1, 5)}`}
              style={{
                background: isWin ? "linear-gradient(135deg, rgba(0,230,118,0.05), #1A1D2E)" : "linear-gradient(135deg, rgba(255,23,68,0.05), #1A1D2E)",
                border: `1px solid ${isWin ? "rgba(0,230,118,0.2)" : "rgba(255,23,68,0.15)"}`,
                opacity: 0,
              }}>
              
              <div className="flex items-center gap-3">
                {/* Result icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: isWin ? "rgba(0,230,118,0.15)" : "rgba(255,23,68,0.15)" }}>
                  <span className="text-xl">{isWin ? "🏆" : "💀"}</span>
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-oswald font-semibold text-sm truncate">{battle.mode}</span>
                    {battle.starPlayer && (
                      <span className="text-sm">⭐</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs opacity-60">
                    <span>{battle.brawler}</span>
                    <span>·</span>
                    <span>{battle.map}</span>
                    <span>·</span>
                    <span>{battle.duration}</span>
                  </div>
                </div>

                {/* Trophy change */}
                <div className="text-right flex-shrink-0">
                  <div className="font-bebas text-lg" style={{ color: isWin ? "#00E676" : "#FF1744" }}>
                    {isWin ? "+" : ""}{battle.trophies}🏆
                  </div>
                  <div className="text-xs opacity-40">{battle.date}</div>
                </div>
              </div>

              {/* Mode color strip */}
              <div className="mt-2 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${modeColor}, transparent)` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}