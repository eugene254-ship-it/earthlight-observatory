import { useState } from "react";
import { X, Users, Droplets, TreePine, Wheat, CloudSun, Briefcase, HeartPulse, Zap, FolderKanban } from "lucide-react";
import type { Region } from "./data";

interface Props {
  region: Region | null;
  onClose: () => void;
}

const TABS = [
  { key: "population", label: "Population", icon: Users },
  { key: "water", label: "Water", icon: Droplets },
  { key: "forests", label: "Forests", icon: TreePine },
  { key: "food", label: "Food", icon: Wheat },
  { key: "climate", label: "Climate", icon: CloudSun },
  { key: "economy", label: "Economy", icon: Briefcase },
  { key: "health", label: "Health", icon: HeartPulse },
  { key: "infrastructure", label: "Infra", icon: Zap },
  { key: "projects", label: "Projects", icon: FolderKanban },
] as const;

export function RegionProfile({ region, onClose }: Props) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("population");
  const open = !!region;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-abyss/50 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-20 top-0 bottom-0 z-50 w-[440px] glass-panel border-r border-border/60 transition-transform duration-700 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {region && (
          <div className="h-full flex flex-col">
            <header className="p-6 pb-4 border-b border-border/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">{region.country}</p>
                  <h2 className="font-display text-4xl gold-text leading-tight mt-1">{region.name}</h2>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{region.tagline}</p>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2 -mt-2 -mr-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Stat label="Restoration" value={region.restorationScore.toString()} tone="primary" />
                <Stat label="Population" value={region.population} />
                <Stat label="Risk Index" value={region.riskIndex} tone={region.riskTone} />
              </div>
            </header>

            <nav className="px-4 pt-3 flex gap-1 overflow-x-auto border-b border-border/50 scrollbar-none">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`shrink-0 px-3 pb-3 pt-2 text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
                      active ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {t.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex-1 overflow-y-auto p-6 space-y-6" key={tab}>
              <div className="float-in space-y-5">
                <ProfileSection data={region.profile[tab]} />
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "primary" | "accent" | "destructive" }) {
  const c = tone === "primary" ? "text-primary" : tone === "accent" ? "text-accent" : tone === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <div>
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`font-display text-2xl ${c}`}>{value}</p>
    </div>
  );
}

function ProfileSection({ data }: { data: { headline: string; body: string; metrics: Array<{ k: string; v: string; delta?: string; tone?: "up" | "down" }> } }) {
  return (
    <>
      <div>
        <h3 className="font-display text-xl leading-snug">{data.headline}</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{data.body}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {data.metrics.map((m) => (
          <div key={m.k} className="rounded-xl border border-border/60 p-4 bg-secondary/30">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{m.k}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-2xl">{m.v}</span>
              {m.delta && (
                <span className={`text-xs ${m.tone === "up" ? "text-accent" : "text-destructive"}`}>{m.delta}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
