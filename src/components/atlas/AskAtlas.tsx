import { Sparkles, X, Send } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onAsk: (q: string) => void;
  result: AskResult | null;
  loading: boolean;
}

export type AskResult = {
  query: string;
  headline: string;
  confidence: number;
  drivers: Array<{ label: string; weight: number }>;
  actions: string[];
  regions: string[];
};

const SUGGESTIONS = [
  "Show areas at drought risk.",
  "Where is forest cover shrinking fastest?",
  "Highlight water-stressed cities.",
];

export function AskAtlas({ open, onClose, onAsk, result, loading }: Props) {
  const [q, setQ] = useState("");

  useEffect(() => { if (open) setQ(""); }, [open]);

  const submit = (text: string) => {
    if (!text.trim()) return;
    onAsk(text.trim());
  };

  return (
    <div
      className={`fixed bottom-24 right-[380px] z-40 w-[420px] transition-all duration-500 ${
        open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="glass-panel rounded-2xl p-5 border border-primary/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-primary/50 flex items-center justify-center text-primary breathe">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted-foreground uppercase">Ask Atlas</p>
              <p className="text-xs text-foreground">Sanctum Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); submit(q); }}
          className="relative"
        >
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='"Show areas at drought risk."'
            className="w-full h-11 pl-4 pr-11 rounded-full bg-input/40 border border-border text-sm focus:outline-none focus:border-primary/60"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
            disabled={!q.trim() || loading}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {!result && !loading && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => { setQ(s); submit(s); }}
                className="text-[11px] px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="mt-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Consulting the observatory…
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary/70 animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="mt-5 space-y-4 float-in">
            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted-foreground uppercase">Result</p>
              <p className="font-display text-lg leading-snug mt-1">{result.headline}</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                <span>Confidence</span>
                <span className="text-primary">{result.confidence}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-1000" style={{ width: `${result.confidence}%` }} />
              </div>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted-foreground uppercase mb-2">Top drivers</p>
              <div className="space-y-1.5">
                {result.drivers.map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-foreground">{d.label}</span>
                      <span className="text-muted-foreground">{Math.round(d.weight * 100)}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-primary/80 transition-all duration-1000"
                        style={{ width: `${d.weight * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] tracking-[0.4em] text-muted-foreground uppercase mb-2">Recommended actions</p>
              <ul className="space-y-1.5">
                {result.actions.map((a) => (
                  <li key={a} className="text-xs text-foreground pl-4 relative leading-relaxed">
                    <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[10px] tracking-widest text-muted-foreground uppercase pt-2 border-t border-border/50">
              {result.regions.length} regions highlighted on the globe
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
