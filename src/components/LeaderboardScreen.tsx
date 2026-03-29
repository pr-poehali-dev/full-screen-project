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

      <div className="grid gap-4" style={{ gridTemplateColumns: "260px 1fr" }}>
        {/* LEFT — podium */}
        <div className="rounded-2xl p-4"
          style={{ background: "linear-gradient(135deg, #1A1D2E, #12141F)", border: "1px solid rgba(255,184,0,0.12)" }}>
          <h3 className="font-oswald text-xs opacity-50 uppercase tracking-wider text-center mb-4">Пьедестал</h3>
          <div className="flex items-end justify-center gap-3 h-44">
            {/* 2nd */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl mb-1 border-2 flex items-center justify-center font-bebas text-xl"
                style={{ background: "#12141F", borderColor: "#C0C0C0", color: "#C0C0C0" }}>
                {LEADERBOARD[1].name.charAt(0)}
              </div>
              <div className="text-xs text-center truncate w-full opacity-80 mb-1">{LEADERBOARD[1].name}</div>
              <div className="text-xs font-bold mb-1" style={{ color: "#C0C0C0" }}>
                {(LEADERBOARD[1].trophies / 1000).toFixed(0)}K🏆
              </div>
              <div className="w-full rounded-t-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #2A2A3E, #1A1A2E)", height: "64px", border: "1px solid rgba(192,192,192,0.25)" }}>
                <span className="font-bebas text-3xl" style={{ color: "#C0C0C0" }}>2</span>
              </div>
            </div>
            {/* 1st */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-2xl animate-trophy mb-0.5">👑</span>
              <div className="w-14 h-14 rounded-xl mb-1 border-2 animate-pulse-glow flex items-center justify-center font-bebas text-2xl"
                style={{ background: "#12141F", borderColor: "#FFB800", color: "#FFB800" }}>
                {LEADERBOARD[0].name.charAt(0)}
              </div>
              <div className="text-xs text-center truncate w-full font-bold mb-1" style={{ color: "#FFB800" }}>
                {LEADERBOARD[0].name}
              </div>
              <div className="text-xs font-bold mb-1" style={{ color: "#FFB800" }}>
                {(LEADERBOARD[0].trophies / 1000).toFixed(0)}K🏆
              </div>
              <div className="w-full rounded-t-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(255,184,0,0.2), rgba(255,107,0,0.1))", height: "80px", border: "1px solid rgba(255,184,0,0.4)" }}>
                <span className="font-bebas text-4xl text-glow-gold" style={{ color: "#FFB800" }}>1</span>
              </div>
            </div>
            {/* 3rd */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl mb-1 border-2 flex items-center justify-center font-bebas text-xl"
                style={{ background: "#12141F", borderColor: "#CD7F32", color: "#CD7F32" }}>
                {LEADERBOARD[2].name.charAt(0)}
              </div>
              <div className="text-xs text-center truncate w-full opacity-80 mb-1">{LEADERBOARD[2].name}</div>
              <div className="text-xs font-bold mb-1" style={{ color: "#CD7F32" }}>
                {(LEADERBOARD[2].trophies / 1000).toFixed(0)}K🏆
              </div>
              <div className="w-full rounded-t-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #2A2A3E, #1A1A2E)", height: "48px", border: "1px solid rgba(205,127,50,0.25)" }}>
                <span className="font-bebas text-2xl" style={{ color: "#CD7F32" }}>3</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — full ranking */}
        <div className="space-y-1.5">
          {LEADERBOARD.map((player, i) => (
            <div key={i}
              className={`rounded-xl p-2.5 flex items-center gap-3 transition-all duration-200 ${player.isPlayer ? "ring-1 ring-yellow-400" : ""}`}
              style={{
                background: player.isPlayer ? "linear-gradient(135deg, rgba(255,184,0,0.1), #1A1D2E)" : "#1A1D2E",
                border: `1px solid ${player.isPlayer ? "rgba(255,184,0,0.4)" : "rgba(255,255,255,0.05)"}`,
              }}>
              <div className="w-7 text-center font-bebas text-lg flex-shrink-0"
                style={{ color: rankColors[player.rank] || "rgba(255,255,255,0.35)" }}>
                {player.rank <= 3 ? ["🥇", "🥈", "🥉"][player.rank - 1] : player.rank}
              </div>
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bebas text-base"
                  style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${rankColors[player.rank] || "rgba(255,255,255,0.1)"}`, color: rankColors[player.rank] || "white" }}>
                  {player.name.charAt(0)}
                </div>
                <span className="absolute -bottom-1 -right-1 text-xs">{player.country}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-oswald font-semibold text-sm truncate"
                    style={{ color: player.isPlayer ? "#FFB800" : "white" }}>
                    {player.name}
                  </span>
                  {player.isPlayer && <span className="text-xs opacity-50">(ты)</span>}
                </div>
                <div className="text-xs opacity-45 truncate">{player.club}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-bebas text-base" style={{ color: rankColors[player.rank] || "#FFB800" }}>
                  {player.trophies.toLocaleString()}
                </div>
                <div className="text-xs opacity-40">🏆</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
