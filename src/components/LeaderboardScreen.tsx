import { LEADERBOARD } from "@/data/gameData";

const rankColors: Record<number, string> = {
  1: "#FFB800",
  2: "#C0C0C0",
  3: "#CD7F32",
};

export default function LeaderboardScreen() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bebas text-2xl tracking-wider text-glow-gold" style={{ color: "#FFB800" }}>
          Лидеры
        </h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(255,184,0,0.2)", color: "#FFB800", border: "1px solid rgba(255,184,0,0.4)" }}>
            Глобальный
          </button>
          <button className="px-3 py-1 rounded-full text-xs"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
            Локальный
          </button>
        </div>
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-3 mb-6 px-4 h-32">
        {/* 2nd */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl mb-1 overflow-hidden border-2" style={{ borderColor: "#C0C0C0" }}>
            <div className="w-full h-full flex items-center justify-center font-bebas text-xl" style={{ background: "#1A1D2E", color: "#C0C0C0" }}>
              {LEADERBOARD[1].name.charAt(0)}
            </div>
          </div>
          <div className="text-xs text-center truncate w-full opacity-80">{LEADERBOARD[1].name}</div>
          <div className="w-full rounded-t-lg mt-1 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2A2A3E, #1A1A2E)", height: "56px", border: "1px solid rgba(192,192,192,0.3)" }}>
            <span className="font-bebas text-2xl" style={{ color: "#C0C0C0" }}>2</span>
          </div>
        </div>
        {/* 1st */}
        <div className="flex-1 flex flex-col items-center">
          <div className="animate-trophy">
            <span className="text-3xl">👑</span>
          </div>
          <div className="w-14 h-14 rounded-xl mb-1 overflow-hidden border-2 animate-pulse-glow" style={{ borderColor: "#FFB800" }}>
            <div className="w-full h-full flex items-center justify-center font-bebas text-2xl" style={{ background: "#1A1D2E", color: "#FFB800" }}>
              {LEADERBOARD[0].name.charAt(0)}
            </div>
          </div>
          <div className="text-xs text-center truncate w-full font-bold" style={{ color: "#FFB800" }}>{LEADERBOARD[0].name}</div>
          <div className="w-full rounded-t-lg mt-1 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(255,184,0,0.2), rgba(255,107,0,0.1))", height: "72px", border: "1px solid rgba(255,184,0,0.4)" }}>
            <span className="font-bebas text-3xl text-glow-gold" style={{ color: "#FFB800" }}>1</span>
          </div>
        </div>
        {/* 3rd */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl mb-1 overflow-hidden border-2" style={{ borderColor: "#CD7F32" }}>
            <div className="w-full h-full flex items-center justify-center font-bebas text-xl" style={{ background: "#1A1D2E", color: "#CD7F32" }}>
              {LEADERBOARD[2].name.charAt(0)}
            </div>
          </div>
          <div className="text-xs text-center truncate w-full opacity-80">{LEADERBOARD[2].name}</div>
          <div className="w-full rounded-t-lg mt-1 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2A2A3E, #1A1A2E)", height: "44px", border: "1px solid rgba(205,127,50,0.3)" }}>
            <span className="font-bebas text-2xl" style={{ color: "#CD7F32" }}>3</span>
          </div>
        </div>
      </div>

      {/* Full ranking */}
      <div className="space-y-2">
        {LEADERBOARD.map((player, i) => (
          <div key={i}
            className={`rounded-xl p-3 flex items-center gap-3 transition-all duration-200 ${player.isPlayer ? "ring-1 ring-yellow-400" : ""}`}
            style={{
              background: player.isPlayer
                ? "linear-gradient(135deg, rgba(255,184,0,0.1), #1A1D2E)"
                : "#1A1D2E",
              border: `1px solid ${player.isPlayer ? "rgba(255,184,0,0.4)" : "rgba(255,255,255,0.05)"}`,
            }}>
            
            {/* Rank */}
            <div className="w-8 text-center font-bebas text-xl flex-shrink-0"
              style={{ color: rankColors[player.rank] || "rgba(255,255,255,0.4)" }}>
              {player.rank <= 3 ? ["🥇", "🥈", "🥉"][player.rank - 1] : player.rank}
            </div>

            {/* Country + Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bebas text-lg"
                style={{ background: "rgba(255,255,255,0.08)", border: `1px solid ${rankColors[player.rank] || "rgba(255,255,255,0.1)"}` }}>
                {player.name.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs">{player.country}</span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`font-oswald font-semibold text-sm ${player.isPlayer ? "text-glow-gold" : ""}`}
                  style={{ color: player.isPlayer ? "#FFB800" : "white" }}>
                  {player.name}
                </span>
                {player.isPlayer && <span className="text-xs opacity-60">(ты)</span>}
              </div>
              <div className="text-xs opacity-50">{player.club}</div>
            </div>

            {/* Trophies */}
            <div className="text-right flex-shrink-0">
              <div className="font-bebas text-lg" style={{ color: rankColors[player.rank] || "#FFB800" }}>
                {player.trophies.toLocaleString()}
              </div>
              <div className="text-xs opacity-40">🏆</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
