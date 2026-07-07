import { Globe } from "@/components/Globe";

export function Landing({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      <div className="starfield" />
      <div className="absolute inset-0 opacity-70">
        <Globe />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background/70" />

      <div className="relative z-10 text-center px-6 float-in">
        <p className="text-xs tracking-[0.5em] text-muted-foreground uppercase mb-6">Atlas Sanctum</p>
        <h1 className="font-display text-6xl md:text-8xl font-light tracking-tight gold-text mb-6">
          Steward the World.
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-base md:text-lg mb-12 leading-relaxed">
          One Earth. One Map. Infinite Wisdom. A living observatory where geography,
          intelligence, and stewardship converge.
        </p>
        <button
          onClick={onEnter}
          className="group relative px-10 py-4 rounded-full border border-primary/40 text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-500 tracking-[0.3em] text-sm uppercase"
        >
          <span className="relative z-10">Enter</span>
          <span className="absolute inset-0 rounded-full blur-xl bg-primary/30 group-hover:bg-primary/60 transition-all duration-500" />
        </button>
      </div>

      <div className="absolute bottom-8 text-xs text-muted-foreground/60 tracking-widest">
        AN OBSERVATORY FOR THE PLANET
      </div>
    </div>
  );
}
