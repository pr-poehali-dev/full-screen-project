import { PLAYER, MODES, BRAWLERS } from "@/data/gameData";

export default function MainMenuScreen() {
  return (
    <div className="space-y-4">
      {/* Season Pass Banner */}
      <div className="relative overflow-hidden rounded-2xl p-4"
        style={{ background: "linear-gradient(135deg, #2D0B5C, #1A0A3D, #0D0A2E)", border: "1px solid rgba(156,39,176,0.4)" }}>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 80% 50%, rgba(156,39,176,0.3), transparent 60%)",
        }} />
        <div className="absolute top-2 right-4 text-5xl opacity-20 animate-float">🌟</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: "linear-gradient(90deg, #9C27B0, #E040FB)", color: "white" }}>
              BRAWL PASS
            </span>
            <span className="text-xs opacity-60">Сезон 18</span>
          </div>
          <h3 className="font-bebas text-2xl tracking-wide text-white">Пески Времени</h3>
          <p className="text-xs opacity-70 mb-3">Египетская коллекция · Новые скины · Эксклюзивные награды</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
              <div className="h-full rounded-full" style={{ width: "65%", background: "linear-gradient(90deg, #9C27B0, #E040FB)" }} />
            </div>
            <span className="text-xs font-bold" style={{ color: "#E040FB" }}>65%</span>
          </div>
        </div>
      </div>

      {/* Play button */}
      <button className="w-full rounded-2xl py-4 font-bebas text-2xl tracking-widest relative overflow-hidden transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #FF6B00, #FFB800)",
          color: "#0A0B14",
          boxShadow: "0 0 30px rgba(255,184,0,0.4), 0 4px 20px rgba(0,0,0,0.4)",
        }}>
        <div className="absolute inset-0 animate-shimmer" />
        <span className="relative">⚔️ В БОЙ!</span>
      </button>

      {/* Game modes */}
      <div>
        <h3 className="font-oswald text-xs font-semibold mb-3 opacity-50 uppercase tracking-wider">Режимы игры</h3>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((mode) => (
            <button key={mode.name}
              className="rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: "#1A1D2E", border: `1px solid ${mode.color}30` }}>
              <span className="text-2xl">{mode.icon}</span>
              <span className="text-xs text-center leading-tight font-semibold" style={{ color: mode.color }}>
                {mode.name.split(" ").slice(0, 2).join(" ")}
              </span>
              <span className="text-xs opacity-40">{mode.players}</span>
            </button>
          ))}
        </div>
      </div>

      {/* New features banner */}
      <div className="rounded-2xl p-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D1F0D, #1A2E1A)", border: "1px solid rgba(0,230,118,0.3)" }}>
        <div className="absolute -right-4 -top-4 text-7xl opacity-10">📦</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ background: "rgba(0,230,118,0.2)", color: "#00E676", border: "1px solid rgba(0,230,118,0.4)" }}>
              НОВОЕ
            </span>
            <span className="text-xs opacity-60">Обновление 18.1</span>
          </div>
          <h3 className="font-oswald font-bold text-base mb-1" style={{ color: "#00E676" }}>
            Загруженное столкновение
          </h3>
          <p className="text-xs opacity-60">Бомбы, боулинг и машинки-бамперы изменят ход боя!</p>
        </div>
      </div>

      {/* Quick brawlers preview */}
      <div>
        <h3 className="font-oswald text-xs font-semibold mb-3 opacity-50 uppercase tracking-wider">Твои бравлеры</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {BRAWLERS.slice(0, 4).map((b) => (
            <div key={b.id} className="flex-shrink-0 rounded-xl overflow-hidden transition-all hover:scale-105 cursor-pointer"
              style={{ width: "80px", background: "#1A1D2E", border: `1px solid ${b.rarityColor}40` }}>
              <img src={b.image} alt={b.name} className="w-full h-20 object-cover" />
              <div className="p-1.5 text-center">
                <div className="text-xs font-semibold truncate">{b.name}</div>
                <div className="text-xs" style={{ color: "#FFB800" }}>⚡{b.power}</div>
              </div>
            </div>
          ))}
          <div className="flex-shrink-0 rounded-xl flex items-center justify-center cursor-pointer transition-all hover:scale-105"
            style={{ width: "80px", background: "#1A1D2E", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="text-center">
              <div className="text-2xl mb-1">+{BRAWLERS.length - 4}</div>
              <div className="text-xs opacity-40">ещё</div>
            </div>
          </div>
        </div>
      </div>

      {/* New buffs system */}
      <div className="rounded-2xl p-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A0D2E, #0D0A1A)", border: "1px solid rgba(255,184,0,0.2)" }}>
        <div className="absolute -right-2 -bottom-2 text-7xl opacity-10">⚡</div>
        <div className="relative">
          <div className="font-oswald font-bold text-base mb-2" style={{ color: "#FFB800" }}>
            Система Баффов
          </div>
          <p className="text-xs opacity-60 mb-3">Три усиления для каждого бойца: гаджет, гиперзаряд и звёздная сила</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
              style={{ background: "rgba(255,184,0,0.2)", color: "#FFB800", border: "1px solid rgba(255,184,0,0.4)" }}>
              🪙 Торговый автомат
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
