import { useEffect, useRef, useState } from "react";

type Marker = { lon: number; lat: number; label: string; tone?: "gold" | "forest" };

interface GlobeProps {
  rotation?: number;
  markers?: Marker[];
  onMarkerClick?: (m: Marker) => void;
  activeLayer?: string;
}

/**
 * Lightweight SVG globe — orthographic projection with graticule + coastline
 * silhouettes. No WebGL dependency, ships small, animates smoothly.
 */
export function Globe({ rotation: rotProp, markers = [], onMarkerClick, activeLayer }: GlobeProps) {
  const [rot, setRot] = useState(rotProp ?? 20);
  const [tilt] = useState(-18);
  const dragging = useRef<{ x: number; r: number } | null>(null);

  useEffect(() => {
    if (rotProp !== undefined) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      setRot((r) => r + dt * 3); // gentle rotation
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotProp]);

  const project = (lon: number, lat: number, R: number) => {
    const l = ((lon - rot) * Math.PI) / 180;
    const p = (lat * Math.PI) / 180;
    const tR = (tilt * Math.PI) / 180;
    // rotate around y then x
    let x = Math.cos(p) * Math.sin(l);
    let y = Math.sin(p);
    let z = Math.cos(p) * Math.cos(l);
    const y2 = y * Math.cos(tR) - z * Math.sin(tR);
    const z2 = y * Math.sin(tR) + z * Math.cos(tR);
    return { x: x * R, y: y2 * R, z: z2, visible: z2 > 0 };
  };

  const R = 240;
  const size = 560;
  const c = size / 2;

  // graticule lines
  const meridians = [];
  for (let lon = -180; lon < 180; lon += 20) {
    const pts: string[] = [];
    for (let lat = -90; lat <= 90; lat += 4) {
      const p = project(lon, lat, R);
      if (p.visible) pts.push(`${c + p.x},${c - p.y}`);
      else if (pts.length) { meridians.push(pts.join(" ")); pts.length = 0; }
    }
    if (pts.length) meridians.push(pts.join(" "));
  }
  const parallels = [];
  for (let lat = -80; lat <= 80; lat += 20) {
    const pts: string[] = [];
    for (let lon = -180; lon <= 180; lon += 4) {
      const p = project(lon, lat, R);
      if (p.visible) pts.push(`${c + p.x},${c - p.y}`);
      else if (pts.length) { parallels.push(pts.join(" ")); pts.length = 0; }
    }
    if (pts.length) parallels.push(pts.join(" "));
  }

  // Stylized landmass blobs (rough continents — not geographic-precise, but readable)
  const continents: Array<Array<[number, number]>> = [
    // Africa
    [[-15,35],[10,32],[30,32],[35,22],[42,15],[50,10],[45,-5],[38,-18],[28,-32],[18,-34],[10,-25],[8,-10],[-5,5],[-15,15],[-15,35]],
    // Europe
    [[-10,58],[5,58],[20,60],[35,55],[38,45],[28,38],[10,40],[-5,42],[-10,50],[-10,58]],
    // Asia
    [[35,55],[55,60],[80,65],[110,70],[140,65],[150,55],[145,40],[125,25],[105,15],[92,20],[75,28],[60,35],[45,40],[38,45],[35,55]],
    // North America
    [[-165,65],[-140,70],[-100,72],[-70,60],[-55,50],[-65,35],[-85,25],[-105,20],[-115,32],[-125,45],[-140,55],[-165,65]],
    // South America
    [[-80,10],[-60,8],[-45,0],[-38,-10],[-42,-25],[-58,-40],[-70,-52],[-75,-40],[-78,-20],[-80,-5],[-80,10]],
    // Australia
    [[115,-12],[135,-13],[150,-20],[152,-32],[140,-38],[120,-35],[115,-25],[115,-12]],
    // Antarctica (band)
    [[-160,-72],[-80,-75],[0,-72],[80,-75],[160,-72],[160,-85],[-160,-85],[-160,-72]],
  ];

  const landPaths = continents.map((poly) => {
    const segs: string[] = [];
    let cur: string[] = [];
    for (const [lon, lat] of poly) {
      const p = project(lon, lat, R);
      if (p.visible) cur.push(`${c + p.x},${c - p.y}`);
      else if (cur.length) { segs.push(cur.join(" L ")); cur = []; }
    }
    if (cur.length) segs.push(cur.join(" L "));
    return segs.map((s) => `M ${s}`).join(" ");
  });

  const layerColor = activeLayer === "nature" ? "var(--color-forest)"
    : activeLayer === "water" ? "oklch(0.65 0.15 220)"
    : activeLayer === "cities" ? "var(--color-gold)"
    : activeLayer === "people" ? "oklch(0.7 0.15 30)"
    : activeLayer === "health" ? "oklch(0.7 0.18 10)"
    : activeLayer === "infrastructure" ? "oklch(0.75 0.1 60)"
    : "var(--color-forest)";

  const onDown = (e: React.PointerEvent) => {
    dragging.current = { x: e.clientX, r: rot };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setRot(dragging.current.r + (e.clientX - dragging.current.x) * 0.3);
  };
  const onUp = () => { dragging.current = null; };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* halo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="rounded-full breathe"
          style={{
            width: size * 1.15, height: size * 1.15,
            background: `radial-gradient(circle, color-mix(in oklab, var(--color-gold) 25%, transparent) 0%, transparent 55%)`,
            filter: "blur(20px)",
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
        </defs>

        {/* atmosphere */}
        <circle cx={c} cy={c} r={R + 12} fill="url(#atmos)" />
        {/* ocean sphere */}
        <circle cx={c} cy={c} r={R} fill="url(#oceanGrad)" />

        {/* graticule */}
        <g fill="none" stroke="oklch(0.98 0.02 90 / 0.08)" strokeWidth="0.6">
          {meridians.map((d, i) => <polyline key={`m${i}`} points={d} />)}
          {parallels.map((d, i) => <polyline key={`p${i}`} points={d} />)}
        </g>

        {/* landmasses */}
        <g>
          {landPaths.map((d, i) => (
            <path key={i} d={d} fill={layerColor} fillOpacity={0.55} stroke={layerColor} strokeOpacity={0.9} strokeWidth={1.1} />
          ))}
        </g>

        {/* terminator shading (right side darker) */}
        <circle cx={c} cy={c} r={R} fill="oklch(0.05 0.02 260)" fillOpacity={0.22}
          style={{ mixBlendMode: "multiply" }} />

        {/* markers */}
        {markers.map((m, i) => {
          const p = project(m.lon, m.lat, R);
          if (!p.visible) return null;
          const color = m.tone === "forest" ? "var(--color-forest)" : "var(--color-gold)";
          return (
            <g
              key={i}
              transform={`translate(${c + p.x} ${c - p.y})`}
              className="cursor-pointer"
              onClick={() => onMarkerClick?.(m)}
            >
              <circle r={10} fill={color} opacity={0.15} className="breathe" />
              <circle r={4} fill={color} />
              <text y={-12} textAnchor="middle" fill="var(--color-foreground)" fontSize="11"
                style={{ fontFamily: "var(--font-sans)", opacity: 0.85 }}>
                {m.label}
              </text>
            </g>
          );
        })}

        {/* rim */}
        <circle cx={c} cy={c} r={R} fill="none" stroke="color-mix(in oklab, var(--color-gold) 40%, transparent)" strokeWidth={0.8} />
      </svg>
    </div>
  );
}
