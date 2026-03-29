import { PLAYER, TROPHY_ROAD } from "@/data/gameData";

export default function TrophyRoadScreen() {
  const progress = (PLAYER.trophies / 30000) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bebas text-2xl tracking-wider text-glow-gold" style={{ color: "#FFB800" }}>
          Трофейный путь
        </h2>
        <div className="flex items-center gap-1.5 font-bold" style={{ color: "#FFB800" }}>
          <span className="text-lg">🏆</span>
          <span>{PLAYER.trophies.toLocaleString()}</span>
        </div>
      </div>

      {/* Overall progress bar */}
      <div className="rounded-2xl p-4 mb-6"
        style={{ background: "linear-gradient(135deg, #1A1D2E, #12141F)", border: "1px solid rgba(255,184,0,0.2)" }}>
        <div className="flex justify-between text-xs opacity-60 mb-2">
          <span>0</span>
          <span>10 000</span>
          <span>20 000</span>
          <span>30 000</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden relative" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full progress-bar transition-all duration-2000" style={{ width: `${progress}%` }} />
          {/* Trophy marker */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-sm animate-trophy"
            style={{ left: `${progress}%` }}>
            🏆
          </div>
        </div>
        <div className="text-center mt-2 text-xs opacity-60">
          До следующей награды: {(8000 - PLAYER.trophies + 8000).toLocaleString()} трофеев
        </div>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-2 gap-3">
        {TROPHY_ROAD.map((milestone, i) => (
          <div key={i}
            className={`trophy-milestone rounded-xl p-4 flex items-center gap-4 ${milestone.current ? "ring-2 ring-yellow-400" : ""}`}
            style={milestone.current ? { background: "linear-gradient(135deg, rgba(255,184,0,0.15), rgba(255,107,0,0.08))" } : {}}>
            
            {/* Trophies required */}
            <div className="text-center w-16 flex-shrink-0">
              <div className="text-lg font-bold" style={{ color: milestone.claimed ? "#FFB800" : "rgba(255,255,255,0.3)" }}>
                {milestone.trophies >= 1000 ? `${milestone.trophies / 1000}K` : milestone.trophies}
              </div>
              <div className="text-xs opacity-40">🏆</div>
            </div>

            {/* Arrow */}
            <div className="text-xl opacity-30">›</div>

            {/* Reward */}
            <div className="text-4xl flex-shrink-0">{milestone.reward}</div>

            {/* Reward name */}
            <div className="flex-1">
              <div className="font-oswald font-semibold text-sm"
                style={{ color: milestone.current ? "#FFB800" : milestone.claimed ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}>
                {milestone.rewardName}
              </div>
              {milestone.current && (
                <div className="text-xs mt-0.5" style={{ color: "#FFB800" }}>← Следующая цель</div>
              )}
            </div>

            {/* Status */}
            <div className="flex-shrink-0">
              {milestone.claimed ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,230,118,0.2)", border: "1px solid #00E676" }}>
                  <span className="text-sm">✓</span>
                </div>
              ) : milestone.current ? (
                <div className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse-glow"
                  style={{ background: "rgba(255,184,0,0.2)", border: "1px solid #FFB800" }}>
                  <span className="text-sm">⬇</span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span className="text-sm opacity-30">🔒</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}