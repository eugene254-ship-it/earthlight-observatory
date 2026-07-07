import { useMemo, useState } from "react";
import { Globe as GlobeIcon, Radio, Brain, Heart, Settings, Search, Sparkles, TreePine, Building2, Users, Droplets, HeartPulse, Zap, ChevronRight } from "lucide-react";
import { Globe } from "@/components/Globe";
import { REGIONS, MISSIONS, DROUGHT_HOTSPOTS, type Region, type Mission } from "./data";
import { RegionProfile } from "./RegionProfile";
import { MissionDetail } from "./MissionDetail";
import { AskAtlas, type AskResult } from "./AskAtlas";
import type { Hotspot } from "@/components/Globe";

type LayerKey = "nature" | "cities" | "people" | "water" | "health" | "infrastructure";

const LAYERS: { key: LayerKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "nature", label: "Nature", icon: TreePine },
  { key: "cities", label: "Cities", icon: Building2 },
  { key: "people", label: "People", icon: Users },
  { key: "water", label: "Water", icon: Droplets },
  { key: "health", label: "Health", icon: HeartPulse },
  { key: "infrastructure", label: "Infrastructure", icon: Zap },
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
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [year, setYear] = useState(2025);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [askResult, setAskResult] = useState<AskResult | null>(null);
  const [askLoading, setAskLoading] = useState(false);
  const [hotspots, setHotspots] = useState<typeof DROUGHT_HOTSPOTS>([]);
  const [mission, setMission] = useState<Mission | null>(null);
  const [focus, setFocus] = useState<{ lon: number; lat: number } | null>(null);

  const timePhase = useMemo(() => (year - 2025) / 10, [year]);
  const era = year <= 2024 ? "Historical" : year === 2025 ? "Present" : year >= 2030 ? "Projection" : "Near-term";

  const markers = REGIONS.map((r) => ({ id: r.id, lon: r.lon, lat: r.lat, label: r.name, tone: r.tone }));

  const openRegion = (r: Region) => {
    setSelectedRegion(r);
    setFocus({ lon: r.lon, lat: r.lat });
    // release focus after animation so user can spin again
    setTimeout(() => setFocus(null), 2200);
  };

  const flyToMission = (m: Mission) => {
    setFocus({ lon: m.lon, lat: m.lat });
    setTimeout(() => setFocus(null), 2200);
    setMission(null);
  };

  const askAtlas = (query: string) => {
    setAskLoading(true);
    setAskResult(null);
    setHotspots([]);
    setTimeout(() => {
      // Simple query router — deterministic demo response
      const q = query.toLowerCase();
      if (q.includes("drought") || q.includes("water") || q.includes("dry")) {
        setHotspots(DROUGHT_HOTSPOTS);
        setActiveLayer("water");
        setAskResult({
          query,
          headline: "7 macro-regions face elevated to severe drought risk over the next decade.",
          confidence: 92,
          drivers: [
            { label: "Rainfall variability", weight: 0.88 },
            { label: "Aquifer depletion", weight: 0.74 },
            { label: "Land-use change", weight: 0.61 },
            { label: "Temperature anomaly", weight: 0.55 },
          ],
          actions: [
            "Prioritize watershed restoration in Horn of Africa and Deccan.",
            "Expand precision irrigation and rainwater harvesting incentives.",
            "Move drought-sensitive crops to climate-resilient varieties.",
            "Coordinate transboundary river-basin governance early.",
          ],
          regions: DROUGHT_HOTSPOTS.map((h) => h.label ?? ""),
        });
      } else if (q.includes("forest") || q.includes("tree") || q.includes("canopy")) {
        setActiveLayer("nature");
        setHotspots([
          { lon: -60, lat: -8, intensity: 0.9 }, { lon: 105, lat: -1, intensity: 0.7 },
          { lon: 25, lat: 0, intensity: 0.75 }, { lon: 36, lat: 0, intensity: 0.55 },
        ]);
        setAskResult({
          query,
          headline: "Tropical forest loss is concentrated across four canopy frontiers.",
          confidence: 89,
          drivers: [
            { label: "Agricultural expansion", weight: 0.82 },
            { label: "Illegal logging", weight: 0.66 },
            { label: "Fire regime shift", weight: 0.58 },
            { label: "Infrastructure corridors", weight: 0.44 },
          ],
          actions: [
            "Fund community forest concessions in Amazonia.",
            "Deploy real-time deforestation alerts to enforcement.",
            "Scale sustainable cocoa/coffee value chains.",
          ],
          regions: ["Amazonia", "Congo Basin", "Borneo", "East African montane"],
        });
      } else {
        setActiveLayer("cities");
        setHotspots([
          { lon: 77, lat: 28, intensity: 0.8 }, { lon: 121, lat: 31, intensity: 0.7 },
          { lon: -99, lat: 19, intensity: 0.6 }, { lon: 3, lat: 6, intensity: 0.75 },
        ]);
        setAskResult({
          query,
          headline: "Sanctum surfaces four megacity zones matching your query.",
          confidence: 78,
          drivers: [
            { label: "Population density", weight: 0.78 },
            { label: "Service gaps", weight: 0.62 },
            { label: "Climate exposure", weight: 0.5 },
          ],
          actions: ["Review the highlighted regions in the intelligence panel.", "Open a region profile to explore drivers in depth."],
          regions: ["Delhi", "Shanghai", "Mexico City", "Lagos"],
        });
      }
      setAskLoading(false);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      <div className="starfield" />

      {/* Left rail */}
      <aside className="relative z-30 w-20 shrink-0 border-r border-border/60 flex flex-col items-center py-6 gap-1 glass-panel">
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
            </button>
          );
        })}
      </aside>

      {/* Main */}
      <main className="relative flex-1 flex flex-col min-w-0">
        <header className="relative z-10 flex items-center justify-between px-8 py-5">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">Sanctum</p>
            <h1 className="font-display text-2xl gold-text">Earth · {era}</h1>
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
            <span className={`w-2 h-2 rounded-full ${timePhase > 0 ? "bg-destructive" : "bg-accent"} animate-pulse`} />
            {timePhase > 0 ? "PROJECTION" : "LIVE OBSERVATORY"}
          </div>
        </header>

        {/* Globe */}
        <div className="relative flex-1 min-h-0">
          <Globe
            markers={markers}
            activeLayer={activeLayer}
            hotspots={hotspots}
            focusLon={focus?.lon ?? null}
            focusLat={focus?.lat ?? null}
            timePhase={timePhase}
            highlightId={selectedRegion?.id}
            onMarkerClick={(m) => {
              const region = REGIONS.find((r) => r.id === m.id);
              if (region) openRegion(region);
            }}
          />

          {/* Layer bar */}
          <div className="absolute right-8 top-4 flex flex-col gap-2 z-10">
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
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 w-[min(720px,80%)] glass-panel rounded-full px-6 py-3 flex items-center gap-4 z-10">
            <span className="text-xs text-muted-foreground tracking-widest">2010</span>
            <div className="relative flex-1">
              <input
                type="range" min={2010} max={2035} value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full accent-primary"
              />
              {/* present marker */}
              <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${((2025 - 2010) / (2035 - 2010)) * 100}%` }}>
                <div className="w-px h-4 -translate-x-1/2 bg-accent" />
              </div>
            </div>
            <span className={`text-xs tracking-widest min-w-[6ch] text-right ${timePhase > 0 ? "text-destructive" : timePhase < 0 ? "text-muted-foreground" : "text-primary"}`}>
              {year}
            </span>
          </div>

          {/* projection watermark */}
          {timePhase > 0 && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.5em] text-destructive/70 uppercase pointer-events-none float-in">
              2035 Projection · Warmer · Drier
            </div>
          )}
          {timePhase < 0 && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.5em] text-muted-foreground/70 uppercase pointer-events-none float-in">
              Historical Reconstruction
            </div>
          )}
        </div>
      </main>

      {/* Right panel */}
      <aside className="relative z-10 w-[360px] shrink-0 border-l border-border/60 glass-panel overflow-y-auto">
        <div className="p-6 space-y-8">
          <section>
            <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-4">Stewardship</p>
            <StewardshipGauge value={78} />
          </section>

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

          <section>
            <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-3">Missions</p>
            <div className="space-y-3">
              {MISSIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMission(m)}
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

      {/* Ask Atlas orb + panel */}
      <button
        onClick={() => setCopilotOpen((v) => !v)}
        className="fixed bottom-8 right-[380px] z-40 w-14 h-14 rounded-full border border-primary/40 bg-primary/10 backdrop-blur flex items-center justify-center text-primary hover:bg-primary/20 transition-all breathe"
        title="Ask Atlas"
      >
        <Sparkles className="w-5 h-5" />
      </button>
      <AskAtlas
        open={copilotOpen}
        onClose={() => { setCopilotOpen(false); setHotspots([]); setAskResult(null); }}
        onAsk={askAtlas}
        result={askResult}
        loading={askLoading}
      />

      <RegionProfile region={selectedRegion} onClose={() => setSelectedRegion(null)} />
      <MissionDetail mission={mission} onClose={() => setMission(null)} onLaunch={flyToMission} />
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
        <text x="90" y="88" textAnchor="middle" className="font-display" fontSize="42" fill="var(--color-foreground)">{value}</text>
        <text x="90" y="112" textAnchor="middle" fontSize="10" fill="var(--color-primary)" letterSpacing="3">EXCELLENT</text>
      </svg>
      <p className="text-xs text-muted-foreground text-center max-w-[220px] leading-relaxed -mt-2">
        Ecosystem health, resilience, access to services, and governance — woven into one signal.
      </p>
    </div>
  );
}
