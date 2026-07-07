export type ProfileTab = {
  headline: string;
  body: string;
  metrics: Array<{ k: string; v: string; delta?: string; tone?: "up" | "down" }>;
};

export type Region = {
  id: string;
  name: string;
  country: string;
  lon: number;
  lat: number;
  tone: "gold" | "forest";
  tagline: string;
  restorationScore: number;
  population: string;
  riskIndex: string;
  riskTone: "accent" | "primary" | "destructive";
  profile: Record<
    "population" | "water" | "forests" | "food" | "climate" | "economy" | "health" | "infrastructure" | "projects",
    ProfileTab
  >;
};

export const REGIONS: Region[] = [
  {
    id: "nakuru",
    name: "Nakuru",
    country: "Kenya",
    lon: 36.8,
    lat: -0.3,
    tone: "gold",
    tagline: "A rift-valley county balancing rapid growth with a fragile watershed.",
    restorationScore: 84,
    population: "2.16M",
    riskIndex: "Moderate",
    riskTone: "accent",
    profile: {
      population: {
        headline: "Growth outpacing services in the southern belt.",
        body: "Urban centers absorb 68% of migration flows. Peri-urban settlements need water, health, and schooling investment to keep pace.",
        metrics: [
          { k: "Total", v: "2.16M" },
          { k: "Urban share", v: "48%", delta: "+3.1%", tone: "up" },
          { k: "Under 25", v: "62%" },
          { k: "Density", v: "294 / km²" },
        ],
      },
      water: {
        headline: "Watershed under stress; two rivers below seasonal median.",
        body: "Rainfall variability and upstream deforestation are shrinking baseflow. Aquifer recharge has fallen 12% since 2018.",
        metrics: [
          { k: "Rainfall (YTD)", v: "612 mm", delta: "-8%", tone: "down" },
          { k: "Aquifer recharge", v: "-12%", tone: "down" },
          { k: "Access to safe water", v: "71%" },
          { k: "Rivers monitored", v: "14" },
        ],
      },
      forests: {
        headline: "Forest cover down 2.3% this quarter.",
        body: "Loss is concentrated on the escarpment above the watershed — the highest-value zone for stewardship intervention.",
        metrics: [
          { k: "Canopy", v: "18.4%", delta: "-2.3%", tone: "down" },
          { k: "Restoration sites", v: "23" },
          { k: "Seedlings planted", v: "412K", delta: "+21%", tone: "up" },
          { k: "Protected area", v: "9.1%" },
        ],
      },
      food: {
        headline: "Smallholder maize yield stable; horticulture rising.",
        body: "Diversification into avocado and greens buffers climate shocks. Cold-chain logistics remain the weakest link.",
        metrics: [
          { k: "Cropland", v: "38%" },
          { k: "Yield index", v: "0.94" },
          { k: "Food insecurity", v: "17%", delta: "-2%", tone: "up" },
          { k: "Irrigation", v: "6%" },
        ],
      },
      climate: {
        headline: "Warmer, drier long-rain seasons projected through 2035.",
        body: "Median annual temperature rises 0.9°C. Drought frequency doubles in the southern lowlands.",
        metrics: [
          { k: "Δ Temp (2035)", v: "+0.9°C", tone: "down" },
          { k: "Drought risk", v: "High" },
          { k: "Flood risk", v: "Moderate" },
          { k: "Emissions", v: "1.4 tCO₂e/cap" },
        ],
      },
      economy: {
        headline: "Diversifying beyond agriculture into tourism and logistics.",
        body: "The Nairobi-Nakuru corridor is drawing manufacturing. Informal sector still 54% of employment.",
        metrics: [
          { k: "GDP growth", v: "5.2%", delta: "+0.4", tone: "up" },
          { k: "Unemployment", v: "9.8%" },
          { k: "Poverty rate", v: "29%", delta: "-3%", tone: "up" },
          { k: "Tourism revenue", v: "$210M" },
        ],
      },
      health: {
        headline: "Under-5 mortality falling; NCDs rising in urban centers.",
        body: "Primary care coverage strong. Cardiovascular disease and diabetes now leading causes of adult mortality.",
        metrics: [
          { k: "Life expectancy", v: "68.1 yr" },
          { k: "Under-5 mortality", v: "34 / 1k", delta: "-6", tone: "up" },
          { k: "Immunization", v: "89%" },
          { k: "Doctors / 10k", v: "2.1" },
        ],
      },
      infrastructure: {
        headline: "Grid reliable in cities, patchy in the highlands.",
        body: "Solar micro-grids extending last-mile access. Road quality remains a bottleneck for markets.",
        metrics: [
          { k: "Electricity access", v: "76%", delta: "+4%", tone: "up" },
          { k: "Paved roads", v: "31%" },
          { k: "Broadband", v: "42%" },
          { k: "Sanitation", v: "58%" },
        ],
      },
      projects: {
        headline: "23 stewardship projects underway.",
        body: "Watershed restoration, solar micro-grids, and youth reforestation dominate the pipeline.",
        metrics: [
          { k: "Active", v: "23" },
          { k: "Funded", v: "$18.4M" },
          { k: "Beneficiaries", v: "412K" },
          { k: "Completion (avg)", v: "63%" },
        ],
      },
    },
  },
  {
    id: "amazonia",
    name: "Amazonia",
    country: "Brazil",
    lon: -60, lat: -3,
    tone: "forest",
    tagline: "The lungs of the planet — a decisive decade for the basin.",
    restorationScore: 71,
    population: "28M",
    riskIndex: "High",
    riskTone: "destructive",
    profile: fakeProfile("Rainforest under pressure; conservation gains uneven."),
  },
  {
    id: "deccan",
    name: "Deccan",
    country: "India",
    lon: 78, lat: 20,
    tone: "gold",
    tagline: "A vast plateau juggling drought, cities, and rapid solar buildout.",
    restorationScore: 66,
    population: "180M",
    riskIndex: "Elevated",
    riskTone: "accent",
    profile: fakeProfile("Water stress meets renewable ambition on the plateau."),
  },
  {
    id: "alpine",
    name: "Alpine Arc",
    country: "Europe",
    lon: 8, lat: 46,
    tone: "forest",
    tagline: "Cryosphere retreating faster than any model predicted.",
    restorationScore: 79,
    population: "14M",
    riskIndex: "Rising",
    riskTone: "accent",
    profile: fakeProfile("Glaciers, rivers, and mountain economies in transition."),
  },
];

function fakeProfile(headline: string): Region["profile"] {
  const p: Region["profile"] = {} as Region["profile"];
  const tabs: Array<keyof Region["profile"]> = ["population","water","forests","food","climate","economy","health","infrastructure","projects"];
  for (const t of tabs) {
    p[t] = {
      headline,
      body: "Data is currently a demonstration snapshot — this pane wires into Sanctum Intelligence layers when connected.",
      metrics: [
        { k: "Signal A", v: "—" },
        { k: "Signal B", v: "—" },
        { k: "Signal C", v: "—" },
        { k: "Signal D", v: "—" },
      ],
    };
  }
  return p;
}

export const MISSIONS = [
  {
    id: "watershed",
    title: "Restore Nakuru Watershed",
    region: "Nakuru, Kenya",
    lon: 36.8, lat: -0.3,
    stars: 4,
    impact: "High",
    time: "18 months",
    funding: "$2M",
    summary: "Protect and regenerate the escarpment forest above Lake Nakuru to stabilize baseflow, aquifer recharge, and lake ecology.",
    steps: [
      { title: "Baseline & community consent", detail: "Map degraded zones, sign co-stewardship agreements with 14 community forest associations.", weeks: "0–6" },
      { title: "Nursery buildout", detail: "Establish 6 indigenous-species nurseries with 1.2M seedling annual capacity.", weeks: "6–20" },
      { title: "Assisted regeneration", detail: "Plant 1,850 ha along critical recharge corridors; exclude grazing zones.", weeks: "20–52" },
      { title: "Livelihoods & monitoring", detail: "Beekeeping, agroforestry payments; remote-sensing verification quarterly.", weeks: "52–78" },
    ],
    metrics: [
      { k: "Hectares", v: "1,850" },
      { k: "Beneficiaries", v: "48,000" },
      { k: "CO₂ / yr", v: "62,000 t" },
      { k: "Water regained", v: "+9%" },
    ],
    impactStatement:
      "Within five years, baseflow returns to 2015 medians, lake salinity stabilizes, and 48,000 people gain year-round water access.",
  },
  {
    id: "coast",
    title: "Reforest Coastal Ridge",
    region: "Amazonia, Brazil",
    lon: -60, lat: -3,
    stars: 5,
    impact: "Very High",
    time: "36 months",
    funding: "$4.8M",
    summary: "Recover 12,000 ha of secondary coastal forest to stabilize sediment flow, restore fisheries, and buffer storm surge.",
    steps: [
      { title: "Land tenure & rights-holder mapping", detail: "Confirm indigenous and quilombola stewardship agreements.", weeks: "0–12" },
      { title: "Species selection", detail: "Prioritize native pioneer + climax species mosaics for resilience.", weeks: "12–24" },
      { title: "Planting waves", detail: "Three planting seasons across 22 sub-basins; 8.4M seedlings.", weeks: "24–108" },
      { title: "Fisheries & tourism uplift", detail: "Community cooperatives for sustainable extraction and eco-tourism.", weeks: "80–156" },
    ],
    metrics: [
      { k: "Hectares", v: "12,000" },
      { k: "Species", v: "84 native" },
      { k: "CO₂ / yr", v: "480,000 t" },
      { k: "Villages", v: "38" },
    ],
    impactStatement:
      "Coastal fisheries rebound 34%. 38 villages formalize stewardship income. Storm-surge risk falls one full category.",
  },
  {
    id: "solar",
    title: "Solar Microgrid Network",
    region: "Deccan, India",
    lon: 78, lat: 20,
    stars: 3,
    impact: "Medium",
    time: "12 months",
    funding: "$900K",
    summary: "Deploy 42 village-scale solar microgrids across water-stressed districts, coupled with efficient irrigation pumps.",
    steps: [
      { title: "Site selection", detail: "Prioritize villages with unreliable grid and >6 hrs solar potential.", weeks: "0–4" },
      { title: "Community operator training", detail: "Train 84 local technicians, half of them women.", weeks: "4–12" },
      { title: "Installation", detail: "Roll out 42 systems totaling 3.1 MW across 9 districts.", weeks: "12–44" },
      { title: "Metering & maintenance", detail: "Prepaid metering + regional service contracts.", weeks: "44–52" },
    ],
    metrics: [
      { k: "Villages", v: "42" },
      { k: "Capacity", v: "3.1 MW" },
      { k: "Pumps", v: "610" },
      { k: "People", v: "68,000" },
    ],
    impactStatement:
      "68,000 people gain 24/7 clean power. Irrigation efficiency rises 40%. Diesel displaced: 720,000 L / yr.",
  },
];

export type Mission = (typeof MISSIONS)[number];

export const DROUGHT_HOTSPOTS = [
  { lon: 36, lat: 4, intensity: 0.9, label: "Horn of Africa" },
  { lon: 24, lat: -20, intensity: 0.7, label: "Southern Africa" },
  { lon: 76, lat: 22, intensity: 0.85, label: "Deccan Plateau" },
  { lon: -105, lat: 34, intensity: 0.8, label: "US Southwest" },
  { lon: 133, lat: -25, intensity: 0.75, label: "Central Australia" },
  { lon: -60, lat: -8, intensity: 0.6, label: "Southern Amazonia" },
  { lon: 45, lat: 32, intensity: 0.65, label: "Fertile Crescent" },
];
