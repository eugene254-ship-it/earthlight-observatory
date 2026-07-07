import { useState } from "react";
import { Globe as GlobeIcon, Radio, Brain, Heart, Settings, Search, Sparkles, TreePine, Building2, Users, Droplets, HeartPulse, Zap, ChevronRight } from "lucide-react";
import { Globe } from "@/components/Globe";

type LayerKey = "nature" | "cities" | "people" | "water" | "health" | "infrastructure";

const LAYERS: { key: LayerKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "nature", label: "Nature", icon: TreePine },
  { key: "cities", label: "Cities", icon: Building2 },
  { key: "people", label: "People", icon: Users },
  { key: "water", label: "Water", icon: Droplets },
  { key: "health", label: "Health", icon: HeartPulse },
  { key: "infrastructure", label: "Infrastructure", icon: Zap },
];

const MARKERS = [
  { lon: 36.8, lat: -0.3, label: "Nakuru", tone: "gold" as const, region: "Kenya" },
  { lon: -60, lat: -3, label: "Amazonia", tone: "forest" as const, region: "Brazil" },
  { lon: 78, lat: 20, label: "Deccan", tone: "gold" as const, region: "India" },
  { lon: 8, lat: 46, label: "Alpine Arc", tone: "forest" as const, region: "Europe" },
];

const MISSIONS = [
  { title: "Restore Nakuru Watershed", stars: 4, impact: "High", time: "18 months", funding: "$2M" },
  { title: "Reforest Coastal Ridge", stars: 5, impact: "Very High", time: "36 months", funding: "$4.8M" },
  { title: "Solar Microgrid Network", stars: 3, impact: "Medium", time: "12 months", funding: "$900K" },
];

const NAV = [
  { key: "earth", label: "Earth", icon: GlobeIcon },
  { key: "observe", label: "Observe", icon: Radio },
  { key: "intel", label: "Intelligence", icon: Brain },
  { key: "steward", label: "Stewardship", icon: Heart },
  { key: "settings", label: "Settings", icon: Settings },
];

export function Workspace() {
  const [activeLayer, setActiveLayer] = useState<LayerKey>("nature");
  const [activeNav, setActiveNav] = useState("earth");
  const [selected, setSelected] = useState(MARKERS[0]);
  const [year, setYear] = useState(2025);
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <div className="starfield" />

      {/* Left rail */}
      <aside className="relative z-20 w-20 shrink-0 border-r border-border/60 flex flex-col items-center py-6 gap-1 glass-panel">
        <div className="mb-6 text-primary">
          <div className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center breathe">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        {NAV.map((n) => {
          const Icon = n.icon;
          const active = activeNav === n.key;
          return (
            <button
              key={n.key}
              onClick={() => setActiveNav(n.key)}
              className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
              title={n.label}
            >
              <Icon className="w-5 h-5" />
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r" />}
              <span className="absolute left-14 whitespace-nowrap px-2 py-1 rounded bg-popover text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {n.label}
              </span>
            </button>
          );
        })}
      </aside>

      {/* Main globe area */}
      <main className="relative flex-1 flex flex-col">
        {/* Top bar */}
        <header className="relative z-10 flex items-center justify-between px-8 py-5">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Sanctum</p>
            <h1 className="font-display text-2xl gold-text">Earth</h1>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Search a county, river, forest, hospital…"
                className="w-full h-11 pl-11 pr-4 rounded-full bg-input/40 border border-border/60 backdrop-blur text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/50 transition"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-widest">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            LIVE OBSERVATORY
          </div>
        </header>

        {/* Globe */}
        <div className="relative flex-1 min-h-0">
          <Globe
            markers={MARKERS}
            activeLayer={activeLayer}
            onMarkerClick={(m) => setSelected(m as typeof MARKERS[number])}
          />

          {/* Region readout */}
          <div className="absolute left-8 bottom-32 float-in">
            <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">{selected.region}</p>
            <h2 className="font-display text-4xl mb-3">{selected.label}</h2>
            <div className="flex items-baseline gap-3">
              <span className="text-xs tracking-widest text-muted-foreground uppercase">Restoration Score</span>
              <span className="font-display text-5xl gold-text">84</span>
            </div>
          </div>

          {/* Layer bar */}
          <div className="absolute right-8 top-4 flex flex-col gap-2">
            {LAYERS.map((l) => {
              const Icon = l.icon;
              const active = activeLayer === l.key;
              return (
                <button
                  key={l.key}
                  onClick={() => setActiveLayer(l.key)}
                  className={`group flex items-center gap-3 pl-3 pr-4 h-10 rounded-full border transition-all duration-500 ${
                    active
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs tracking-wider uppercase">{l.label}</span>
                </button>
              );
            })}
          </div>

          {/* Timeline */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-[min(720px,80%)] glass-panel rounded-full px-6 py-3 flex items-center gap-4">
            <span className="text-xs text-muted-foreground tracking-widest">2010</span>
            <input
              type="range" min={2010} max={2035} value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-xs text-primary tracking-widest">{year}{year >= 2026 ? " • projection" : ""}</span>
          </div>
        </div>
      </main>

      {/* Right panel — Intelligence + Stewardship + Missions */}
      <aside className="relative z-10 w-[360px] shrink-0 border-l border-border/60 glass-panel overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Stewardship gauge */}
          <section>
            <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-4">Stewardship</p>
            <StewardshipGauge value={78} />
          </section>

          {/* Insight */}
          <section>
            <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-3">Sanctum Intelligence</p>
            <div className="rounded-xl border border-border/60 p-5 bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-2">Current Insight</p>
              <p className="font-display text-lg leading-snug mb-4">
                Forest cover in the watershed declined <span className="text-destructive">2.3%</span> this quarter.
              </p>
              <dl className="space-y-2 text-sm">
                <Row k="AI Confidence" v="95%" tone="primary" />
                <Row k="Recommendation" v="Protect watershed" />
                <Row k="Impact" v="High" tone="accent" />
              </dl>
            </div>
          </section>

          {/* Missions */}
          <section>
            <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-3">Missions</p>
            <div className="space-y-3">
              {MISSIONS.map((m) => (
                <button
                  key={m.title}
                  className="w-full text-left rounded-xl border border-border/60 p-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-display text-base leading-tight pr-4">{m.title}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 mb-3 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < m.stars ? "opacity-100" : "opacity-25"}>★</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px]">
                    <Meta label="Impact" value={m.impact} />
                    <Meta label="Time" value={m.time} />
                    <Meta label="Funding" value={m.funding} />
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </aside>

      {/* AI Copilot orb */}
      <button
        onClick={() => setCopilotOpen((v) => !v)}
        className="fixed bottom-8 right-[380px] z-30 w-14 h-14 rounded-full border border-primary/40 bg-primary/10 backdrop-blur flex items-center justify-center text-primary hover:bg-primary/20 transition-all breathe"
        title="Ask Atlas"
      >
        <Sparkles className="w-5 h-5" />
      </button>
      {copilotOpen && (
        <div className="fixed bottom-28 right-[380px] z-30 w-80 glass-panel rounded-2xl p-4 float-in">
          <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-2">Ask Atlas</p>
          <input
            autoFocus
            placeholder='"Show areas at drought risk."'
            className="w-full h-10 px-3 rounded-lg bg-input/40 border border-border text-sm focus:outline-none focus:border-primary/50"
          />
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            The map will animate to reveal the answer. Speak in questions of stewardship.
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: "primary" | "accent" }) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-muted-foreground text-xs">{k}</dt>
      <dd className={tone === "primary" ? "text-primary" : tone === "accent" ? "text-accent" : ""}>{v}</dd>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground uppercase tracking-wider text-[9px]">{label}</p>
      <p className="text-foreground">{value}</p>
    </div>
  );
}

function StewardshipGauge({ value }: { value: number }) {
  const r = 70;
  const C = 2 * Math.PI * r;
  const dash = (value / 100) * C;
  return (
    <div className="relative w-full flex flex-col items-center">
      <svg viewBox="0 0 180 180" className="w-44 h-44">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-forest)" />
            <stop offset="100%" stopColor="var(--color-gold)" />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--color-border)" strokeWidth="6" />
        <circle
          cx="90" cy="90" r={r} fill="none"
          stroke="url(#gaugeGrad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${dash} ${C - dash}`}
          transform="rotate(-90 90 90)"
        />
        <text x="90" y="88" textAnchor="middle" className="font-display" fontSize="42" fill="var(--color-foreground)">
          {value}
        </text>
        <text x="90" y="112" textAnchor="middle" fontSize="10" fill="var(--color-primary)" letterSpacing="3">
          EXCELLENT
        </text>
      </svg>
      <p className="text-xs text-muted-foreground text-center max-w-[220px] leading-relaxed -mt-2">
        Ecosystem health, resilience, access to services, and governance — woven into one signal.
      </p>
    </div>
  );
}
