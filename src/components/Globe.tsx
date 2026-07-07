import { useEffect, useRef, useState } from "react";

export type Marker = { lon: number; lat: number; label: string; tone?: "gold" | "forest"; id?: string };
export type Hotspot = { lon: number; lat: number; intensity: number; label?: string };

interface GlobeProps {
  markers?: Marker[];
  onMarkerClick?: (m: Marker) => void;
  activeLayer?: string;
  hotspots?: Hotspot[];
  focusLon?: number | null;
  focusLat?: number | null;
  /** -1 = deep past, 0 = present, 1 = 2035 projection */
  timePhase?: number;
  autoRotate?: boolean;
  highlightId?: string;
}

export function Globe({
  markers = [],
  onMarkerClick,
  activeLayer = "nature",
  hotspots = [],
  focusLon = null,
  focusLat = null,
  timePhase = 0,
  autoRotate = true,
  highlightId,
}: GlobeProps) {
  const [rot, setRot] = useState(20);
  const [tilt, setTilt] = useState(-18);
  const dragging = useRef<{ x: number; y: number; r: number; t: number } | null>(null);
  const focusTarget = useRef<{ lon: number | null; lat: number | null }>({ lon: null, lat: null });

  useEffect(() => { focusTarget.current = { lon: focusLon, lat: focusLat }; }, [focusLon, focusLat]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      const target = focusTarget.current;
      if (target.lon != null) {
        setRot((r) => {
          // shortest angular path
          let delta = ((target.lon! - r + 540) % 360) - 180;
          return r + delta * Math.min(1, dt * 1.6);
        });
        if (target.lat != null) {
          setTilt((tt) => tt + (-target.lat! - tt) * Math.min(1, dt * 1.6));
        }
      } else if (autoRotate && !dragging.current) {
        setRot((r) => r + dt * 3);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate]);

  const R = 240;
  const size = 560;
  const c = size / 2;

  const project = (lon: number, lat: number) => {
    const l = ((lon - rot) * Math.PI) / 180;
    const p = (lat * Math.PI) / 180;
    const tR = (tilt * Math.PI) / 180;
    const x = Math.cos(p) * Math.sin(l);
    const y = Math.sin(p);
    const z = Math.cos(p) * Math.cos(l);
    const y2 = y * Math.cos(tR) - z * Math.sin(tR);
    const z2 = y * Math.sin(tR) + z * Math.cos(tR);
    return { x: x * R, y: y2 * R, z: z2, visible: z2 > 0 };
  };

  const meridians: string[] = [];
  for (let lon = -180; lon < 180; lon += 20) {
    const pts: string[] = [];
    for (let lat = -90; lat <= 90; lat += 4) {
      const p = project(lon, lat);
      if (p.visible) pts.push(`${c + p.x},${c - p.y}`);
      else if (pts.length) { meridians.push(pts.join(" ")); pts.length = 0; }
    }
    if (pts.length) meridians.push(pts.join(" "));
  }
  const parallels: string[] = [];
  for (let lat = -80; lat <= 80; lat += 20) {
    const pts: string[] = [];
    for (let lon = -180; lon <= 180; lon += 4) {
      const p = project(lon, lat);
      if (p.visible) pts.push(`${c + p.x},${c - p.y}`);
      else if (pts.length) { parallels.push(pts.join(" ")); pts.length = 0; }
    }
    if (pts.length) parallels.push(pts.join(" "));
  }

  const continents: Array<Array<[number, number]>> = [
    [[-15,35],[10,32],[30,32],[35,22],[42,15],[50,10],[45,-5],[38,-18],[28,-32],[18,-34],[10,-25],[8,-10],[-5,5],[-15,15],[-15,35]],
    [[-10,58],[5,58],[20,60],[35,55],[38,45],[28,38],[10,40],[-5,42],[-10,50],[-10,58]],
    [[35,55],[55,60],[80,65],[110,70],[140,65],[150,55],[145,40],[125,25],[105,15],[92,20],[75,28],[60,35],[45,40],[38,45],[35,55]],
    [[-165,65],[-140,70],[-100,72],[-70,60],[-55,50],[-65,35],[-85,25],[-105,20],[-115,32],[-125,45],[-140,55],[-165,65]],
    [[-80,10],[-60,8],[-45,0],[-38,-10],[-42,-25],[-58,-40],[-70,-52],[-75,-40],[-78,-20],[-80,-5],[-80,10]],
    [[115,-12],[135,-13],[150,-20],[152,-32],[140,-38],[120,-35],[115,-25],[115,-12]],
    [[-160,-72],[-80,-75],[0,-72],[80,-75],[160,-72],[160,-85],[-160,-85],[-160,-72]],
  ];

  const landPaths = continents.map((poly) => {
    const segs: string[] = [];
    let cur: string[] = [];
    for (const [lon, lat] of poly) {
      const p = project(lon, lat);
      if (p.visible) cur.push(`${c + p.x},${c - p.y}`);
      else if (cur.length) { segs.push(cur.join(" L ")); cur = []; }
    }
    if (cur.length) segs.push(cur.join(" L "));
    return segs.map((s) => `M ${s}`).join(" ");
  });

  const layerColorMap: Record<string, string> = {
    nature: "var(--color-forest)",
    water: "oklch(0.65 0.15 220)",
    cities: "var(--color-gold)",
    people: "oklch(0.7 0.15 30)",
    health: "oklch(0.7 0.18 10)",
    infrastructure: "oklch(0.75 0.1 60)",
  };
  const layerColor = layerColorMap[activeLayer] ?? "var(--color-forest)";

  // time-phase: past = cooler/desat, future = warmer with parched tones
  const desat = timePhase < 0 ? 0.25 : 0;
  const warmth = timePhase > 0 ? timePhase : 0;

  const onDown = (e: React.PointerEvent) => {
    focusTarget.current = { lon: null, lat: null };
    dragging.current = { x: e.clientX, y: e.clientY, r: rot, t: tilt };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setRot(dragging.current.r + (e.clientX - dragging.current.x) * 0.3);
    setTilt(Math.max(-70, Math.min(70, dragging.current.t + (e.clientY - dragging.current.y) * 0.2)));
  };
  const onUp = () => { dragging.current = null; };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full breathe"
          style={{
            width: size * 1.15, height: size * 1.15,
            background: warmth > 0
              ? `radial-gradient(circle, color-mix(in oklab, oklch(0.7 0.2 30) ${25 + warmth * 25}%, transparent) 0%, transparent 55%)`
              : `radial-gradient(circle, color-mix(in oklab, var(--color-gold) 25%, transparent) 0%, transparent 55%)`,
            filter: "blur(20px)",
            transition: "background 1.2s ease",
          }}
        />
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="relative w-full h-full max-w-[min(90vh,780px)] cursor-grab active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{ filter: `saturate(${1 - desat}) contrast(${1 + warmth * 0.1})`, transition: "filter 1s ease" }}
      >
        <defs>
          <radialGradient id="oceanGrad" cx="35%" cy="35%">
            <stop offset="0%" stopColor="oklch(0.4 0.09 230)" />
            <stop offset="60%" stopColor="oklch(0.22 0.08 250)" />
            <stop offset="100%" stopColor="oklch(0.1 0.05 260)" />
          </radialGradient>
          <radialGradient id="atmos" cx="50%" cy="50%">
            <stop offset="85%" stopColor="transparent" />
            <stop offset="95%" stopColor="color-mix(in oklab, var(--color-gold) 40%, transparent)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="hotspotGrad">
            <stop offset="0%" stopColor="oklch(0.75 0.24 25)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="oklch(0.7 0.22 40)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <circle cx={c} cy={c} r={R + 12} fill="url(#atmos)" />
        <circle cx={c} cy={c} r={R} fill="url(#oceanGrad)" />

        <g fill="none" stroke="oklch(0.98 0.02 90 / 0.08)" strokeWidth="0.6">
          {meridians.map((d, i) => <polyline key={`m${i}`} points={d} />)}
          {parallels.map((d, i) => <polyline key={`p${i}`} points={d} />)}
        </g>

        {/* landmasses — crossfade layers via key-based opacity transitions */}
        <g style={{ transition: "opacity 800ms ease" }}>
          {landPaths.map((d, i) => (
            <path
              key={`${activeLayer}-${i}`}
              d={d}
              fill={layerColor}
              fillOpacity={0.55}
              stroke={layerColor}
              strokeOpacity={0.9}
              strokeWidth={1.1}
              style={{ animation: "float-in 0.9s ease-out both" }}
            />
          ))}
        </g>

        {/* future warmth wash */}
        {warmth > 0 && (
          <circle cx={c} cy={c} r={R} fill="oklch(0.7 0.2 30)" fillOpacity={0.18 * warmth}
            style={{ mixBlendMode: "screen", transition: "fill-opacity 1s ease" }} />
        )}

        <circle cx={c} cy={c} r={R} fill="oklch(0.05 0.02 260)" fillOpacity={0.22}
          style={{ mixBlendMode: "multiply" }} />

        {/* Hotspots (drought risk, Ask Atlas result) */}
        {hotspots.map((h, i) => {
          const p = project(h.lon, h.lat);
          if (!p.visible) return null;
          const r = 14 + h.intensity * 22;
          return (
            <g key={`h${i}`} transform={`translate(${c + p.x} ${c - p.y})`} style={{ animation: "float-in 0.8s ease-out both" }}>
              <circle r={r} fill="url(#hotspotGrad)" className="breathe" />
              <circle r={3} fill="oklch(0.8 0.2 30)" />
            </g>
          );
        })}

        {/* markers */}
        {markers.map((m, i) => {
          const p = project(m.lon, m.lat);
          if (!p.visible) return null;
          const color = m.tone === "forest" ? "var(--color-forest)" : "var(--color-gold)";
          const isHi = highlightId && m.id === highlightId;
          return (
            <g
              key={i}
              transform={`translate(${c + p.x} ${c - p.y})`}
              className="cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onMarkerClick?.(m); }}
            >
              {isHi && <circle r={22} fill="none" stroke={color} strokeOpacity={0.6} className="breathe" />}
              <circle r={10} fill={color} opacity={0.15} className="breathe" />
              <circle r={4} fill={color} />
              <text y={-12} textAnchor="middle" fill="var(--color-foreground)" fontSize="11"
                style={{ fontFamily: "var(--font-sans)", opacity: 0.85 }}>
                {m.label}
              </text>
            </g>
          );
        })}

        <circle cx={c} cy={c} r={R} fill="none" stroke="color-mix(in oklab, var(--color-gold) 40%, transparent)" strokeWidth={0.8} />
      </svg>
    </div>
  );
}
