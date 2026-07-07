import { X, ChevronRight, Sparkles } from "lucide-react";
import type { Mission } from "./data";

interface Props {
  mission: Mission | null;
  onClose: () => void;
  onLaunch: (m: Mission) => void;
}

export function MissionDetail({ mission, onClose, onLaunch }: Props) {
  const open = !!mission;
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-abyss/60 backdrop-blur-md transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none`}
      >
        {mission && (
          <div
            className={`pointer-events-auto w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-panel rounded-3xl border border-border/60 transition-all duration-700 ${
              open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
            }`}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase">{mission.region}</p>
                  <h2 className="font-display text-4xl gold-text mt-1 leading-tight">{mission.title}</h2>
                  <div className="flex items-center gap-1 text-primary mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < mission.stars ? "" : "opacity-25"}>★</span>
                    ))}
                  </div>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-base text-muted-foreground leading-relaxed mb-6">{mission.summary}</p>

              <div className="grid grid-cols-4 gap-3 mb-8">
                <MetricTile label="Impact" value={mission.impact} tone="primary" />
                <MetricTile label="Time" value={mission.time} />
                <MetricTile label="Funding" value={mission.funding} />
                <MetricTile label="Confidence" value="88%" tone="accent" />
              </div>

              <section className="mb-8">
                <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-4">Step-by-step journey</p>
                <ol className="space-y-3">
                  {mission.steps.map((s, i) => (
                    <li
                      key={i}
                      className="relative pl-14 pr-4 py-4 rounded-xl border border-border/60 bg-secondary/20 float-in"
                      style={{ animationDelay: `${i * 90}ms` }}
                    >
                      <span className="absolute left-4 top-4 w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center text-primary font-display">
                        {i + 1}
                      </span>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-display text-lg leading-snug">{s.title}</p>
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.detail}</p>
                        </div>
                        <span className="text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap mt-1">
                          Wk {s.weeks}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mb-8">
                <p className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-4">Metrics</p>
                <div className="grid grid-cols-4 gap-3">
                  {mission.metrics.map((m) => (
                    <div key={m.k} className="rounded-xl border border-border/60 p-4 bg-secondary/20">
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{m.k}</p>
                      <p className="font-display text-2xl mt-1">{m.v}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 mb-6">
                <p className="text-[10px] tracking-[0.4em] text-primary uppercase mb-2">Impact summary</p>
                <p className="font-display text-xl leading-snug">{mission.impactStatement}</p>
              </section>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onLaunch(mission)}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all tracking-[0.2em] text-xs uppercase"
                >
                  <Sparkles className="w-4 h-4" /> Fly to Site <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>
                <button onClick={onClose} className="px-6 py-3 rounded-full border border-border text-muted-foreground hover:text-foreground text-xs uppercase tracking-[0.2em]">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function MetricTile({ label, value, tone }: { label: string; value: string; tone?: "primary" | "accent" }) {
  const c = tone === "primary" ? "text-primary" : tone === "accent" ? "text-accent" : "";
  return (
    <div className="rounded-xl border border-border/60 p-4 bg-secondary/30">
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`font-display text-xl mt-1 ${c}`}>{value}</p>
    </div>
  );
}
