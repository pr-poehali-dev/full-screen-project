import { BRAWLERS } from "@/data/gameData";
import Icon from "@/components/ui/icon";

type Brawler = (typeof BRAWLERS)[0];

interface Props {
  brawler: Brawler;
  onBack: () => void;
}

export default function BrawlerDetail({ brawler, onBack }: Props) {
  return (
    <div className="animate-fade-in" style={{ opacity: 0 }}>
      {/* Back */}
      <button onClick={onBack}
        className="flex items-center gap-2 mb-4 text-sm font-semibold opacity-70 hover:opacity-100 transition-opacity"
        style={{ color: "#FFB800" }}>
        <Icon name="ChevronLeft" size={18} />
        Все бравлеры
      </button>

      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl mb-4"
        style={{ border: `1px solid ${brawler.rarityColor}60` }}>
        <img src={brawler.image} alt={brawler.name}
          className="w-full h-52 object-cover" />
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(to top, #0A0B14 30%, transparent 70%)` }} />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="block text-xs font-bold mb-1" style={{ color: brawler.rarityColor }}>
                {brawler.rarity.toUpperCase()}
              </span>
              <h2 className="font-bebas text-4xl tracking-wider text-white" style={{ textShadow: `0 0 20px ${brawler.rarityColor}` }}>
                {brawler.name}
              </h2>
            </div>
            <div className="text-right">
              <div className="font-bebas text-2xl" style={{ color: "#FFB800" }}>⚡ {brawler.power}</div>
              <div className="text-sm opacity-70">Уровень силы</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "❤️ Здоровье", value: brawler.health.toLocaleString(), color: "#00E676" },
          { label: "⚔️ Урон", value: brawler.damage.toLocaleString(), color: "#FF1744" },
          { label: "🏆 Трофеи", value: brawler.trophies.toLocaleString(), color: "#FFB800" },
          { label: "🎨 Скины", value: brawler.skinCount.toString(), color: "#9C27B0" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-3"
            style={{ background: "#1A1D2E", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs opacity-60 mb-1">{stat.label}</div>
            <div className="font-oswald font-bold text-xl" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Trophy progress */}
      <div className="rounded-xl p-4 mb-4" style={{ background: "#1A1D2E", border: "1px solid rgba(255,184,0,0.15)" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">Трофейный прогресс</span>
          <span className="text-sm font-bold" style={{ color: "#FFB800" }}>{brawler.trophies} / {brawler.maxTrophies}</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="h-full progress-bar rounded-full" style={{ width: `${(brawler.trophies / brawler.maxTrophies) * 100}%` }} />
        </div>
      </div>

      {/* Gadgets */}
      <div className="mb-4">
        <h3 className="font-oswald text-sm font-semibold mb-2 opacity-70 uppercase tracking-wider">Гаджеты</h3>
        <div className="grid grid-cols-2 gap-2">
          {brawler.gadgets.map((g, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: "#1A1D2E", border: `1px solid ${brawler.buffs.gadget ? "#00E5FF40" : "rgba(255,255,255,0.06)"}` }}>
              <span className="text-lg">🔧</span>
              <span className="text-xs font-semibold">{g}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Star Powers */}
      <div className="mb-4">
        <h3 className="font-oswald text-sm font-semibold mb-2 opacity-70 uppercase tracking-wider">Звёздные силы</h3>
        <div className="grid grid-cols-2 gap-2">
          {brawler.starPowers.map((sp, i) => (
            <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: "#1A1D2E", border: `1px solid ${brawler.buffs.starPower ? "#FFB80040" : "rgba(255,255,255,0.06)"}` }}>
              <span className="text-lg">⭐</span>
              <span className="text-xs font-semibold">{sp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Buffs */}
      <div className="rounded-xl p-4" style={{ background: "#1A1D2E", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="font-oswald text-sm font-semibold mb-3 opacity-70 uppercase tracking-wider">Баффы</h3>
        <div className="flex gap-3">
          {[
            { label: "Гаджет", active: brawler.buffs.gadget, color: "#00E5FF", icon: "🔧" },
            { label: "Гиперзаряд", active: brawler.buffs.hypercharge, color: "#FF1744", icon: "⚡" },
            { label: "Звёздная сила", active: brawler.buffs.starPower, color: "#FFB800", icon: "⭐" },
          ].map((buff) => (
            <div key={buff.label} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl"
              style={{
                background: buff.active ? `${buff.color}20` : "rgba(255,255,255,0.03)",
                border: `1px solid ${buff.active ? `${buff.color}60` : "transparent"}`,
              }}>
              <span className="text-xl">{buff.icon}</span>
              <span className="text-xs text-center" style={{ color: buff.active ? buff.color : "rgba(255,255,255,0.3)" }}>
                {buff.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
