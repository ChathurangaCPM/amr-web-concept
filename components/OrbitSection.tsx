"use client";

import { useEffect, useRef, useState } from "react";

interface Hotspot {
  id: string;
  x: string;
  y: string;
  label: string;
  detail: string;
}

interface OrbitAngle {
  id: string;
  code: string;
  name: string;
  shortName: string;
  deg: string;
  compassDeg: number;
  elevation: string;
  img: string;
  alt: string;
  headline: string;
  summary: string;
  metrics: Array<{ label: string; value: string }>;
  hotspots: Hotspot[];
}

const ORBIT_ANGLES: OrbitAngle[] = [
  {
    id: "front",
    code: "VIEW 01 // 000° AZIMUTH",
    name: "FRONT PERCEPTION ARRAY",
    shortName: "FRONT",
    deg: "000°",
    compassDeg: 0,
    elevation: "00° HORIZON",
    img: "/assets/front.jpg",
    alt: "Front view of NEXUS M2 autonomous mobile robot",
    headline: "Forward LiDAR slot, stereo 3D depth vision & 48V docking receiver.",
    summary:
      "The low-profile front fascia houses the primary SICK safety laser scanner, dual Intel RealSense D455 RGB-D cameras, and gold-plated 48V fast-charge contact pads.",
    metrics: [
      { label: "PRIMARY LIDAR", value: "270° · 40m" },
      { label: "DEPTH FOV", value: "120° × 75° 3D" },
      { label: "DOCK ACCURACY", value: "±5.0 mm" },
    ],
    hotspots: [
      {
        id: "01",
        x: "34%",
        y: "62%",
        label: "SICK NANOSCAN3 LIDAR",
        detail: "270° safety laser scanner (ISO 13849-1 PL-d)",
      },
      {
        id: "02",
        x: "48%",
        y: "52%",
        label: "STEREO 3D RGB-D CAMERAS",
        detail: "Detects overhanging forklift tines & suspended loads",
      },
      {
        id: "03",
        x: "58%",
        y: "42%",
        label: "AMBER CORNER LED EYEBROWS",
        detail: "360° high-visibility turn, brake & mission state signaling",
      },
    ],
  },
  {
    id: "port",
    code: "VIEW 02 // 090° AZIMUTH",
    name: "PORT SIDE PROFILE",
    shortName: "PORT",
    deg: "090°",
    compassDeg: 90,
    elevation: "00° HORIZON",
    img: "/assets/side.jpg",
    alt: "Port side view of NEXUS M2 autonomous mobile robot",
    headline: "Ultra-low 290 mm deck height with center differential traction.",
    summary:
      "Engineered to underride standard industrial racks, carts, and conveyor stands with a 290 mm lowered profile and zero-turn-radius center drive wheel geometry.",
    metrics: [
      { label: "CHASSIS LENGTH", value: "1,420 mm" },
      { label: "DECK HEIGHT", value: "290 mm LOW" },
      { label: "MAX SPEED", value: "2.0 m/s" },
    ],
    hotspots: [
      {
        id: "01",
        x: "50%",
        y: "58%",
        label: "BRUSHLESS HUB DRIVE WHEEL",
        detail: "200 mm polyurethane traction wheel with 17-bit encoder",
      },
      {
        id: "02",
        x: "26%",
        y: "45%",
        label: "CHAMFERED COMPOSITE FAIRING",
        detail: "6061-T6 aluminum substructure with impact-resistant shell",
      },
      {
        id: "03",
        x: "74%",
        y: "38%",
        label: "SIDE TOF PROXIMITY SENSOR",
        detail: "Continuous lateral clearance monitoring in narrow 1.4m aisles",
      },
    ],
  },
  {
    id: "rear",
    code: "VIEW 03 // 180° AZIMUTH",
    name: "REAR DIAGNOSTIC & SAFETY BAY",
    shortName: "REAR",
    deg: "180°",
    compassDeg: 180,
    elevation: "00° HORIZON",
    img: "/assets/rear.jpg",
    alt: "Rear view of NEXUS M2 autonomous mobile robot",
    headline: "Opposing rear safety LiDAR, E-stop loop & service I/O bay.",
    summary:
      "Completes the 360° zero-blind-spot laser halo with the diagonal rear SICK scanner, dual-channel hardwired E-stop button, and quick-swap 48V LiFePO4 battery access.",
    metrics: [
      { label: "REAR COVERAGE", value: "270° OVERLAP" },
      { label: "BATTERY SWAP", value: "< 120 SEC" },
      { label: "SAFETY RATING", value: "SIL-3 / PL-d" },
    ],
    hotspots: [
      {
        id: "01",
        x: "64%",
        y: "62%",
        label: "REAR OPPOSING LIDAR",
        detail: "Eliminates rear blind spots during bidirectional maneuvers",
      },
      {
        id: "02",
        x: "46%",
        y: "52%",
        label: "SERVICE & DIAGNOSTIC BAY",
        detail: "Gigabit Ethernet, USB-C debug & manual brake release",
      },
      {
        id: "03",
        x: "32%",
        y: "42%",
        label: "DUAL-CHANNEL E-STOP",
        detail: "Hardwired safe-torque-off (STO) emergency stop circuit",
      },
    ],
  },
  {
    id: "starboard",
    code: "VIEW 04 // 270° AZIMUTH",
    name: "STARBOARD DRIVE PROFILE",
    shortName: "STARBOARD",
    deg: "270°",
    compassDeg: 270,
    elevation: "00° HORIZON",
    img: "/assets/side2.jpg",
    alt: "Starboard side view of NEXUS M2 autonomous mobile robot",
    headline: "Symmetrical rocker-bogie suspension & sealed IP54 side armor.",
    summary:
      "Independent spring-damped caster suspension keeps both drive wheels planted across expansion joints, dock plates, and 8% warehouse grades under a full 1,000 kg load.",
    metrics: [
      { label: "GRADEABILITY", value: "8% LOADED" },
      { label: "INGRESS SEAL", value: "IP54 RATED" },
      { label: "TURN RADIUS", value: "0 mm PIVOT" },
    ],
    hotspots: [
      {
        id: "01",
        x: "50%",
        y: "58%",
        label: "STARBOARD SERVO TRACTION",
        detail: "Closed-loop FOC torque vectoring with regenerative braking",
      },
      {
        id: "02",
        x: "30%",
        y: "64%",
        label: "WRAP-AROUND SAFETY BUMPER",
        detail: "Pressure-sensitive tactile skirt for secondary contact stop",
      },
      {
        id: "03",
        x: "68%",
        y: "46%",
        label: "HOT-SWAP BATTERY DRAWER",
        detail: "48V 60Ah LiFePO4 pack rated for 4,000+ charge cycles",
      },
    ],
  },
  {
    id: "zenith",
    code: "VIEW 05 // +90° ZENITH",
    name: "TOP LIFT DECK & LOAD CELLS",
    shortName: "ZENITH",
    deg: "+90°",
    compassDeg: 45,
    elevation: "+90° TOP-DOWN",
    img: "/assets/top.jpg",
    alt: "Top view of NEXUS M2 autonomous mobile robot",
    headline: "1,000 kg electro-mechanical scissor deck with 4-corner load sensing.",
    summary:
      "Hard-anodized non-slip top plate with four integrated strain-gauge load cells that verify payload weight and center-of-gravity before every lift and transit.",
    metrics: [
      { label: "RATED PAYLOAD", value: "1,000 KG" },
      { label: "LIFT STROKE", value: "+140 mm" },
      { label: "DECK FOOTPRINT", value: "1,420 × 920 mm" },
    ],
    hotspots: [
      {
        id: "01",
        x: "50%",
        y: "50%",
        label: "BALL-SCREW LIFT PLATFORM",
        detail: "Raises 1,000 kg pallets +140 mm in 2.4 seconds",
      },
      {
        id: "02",
        x: "34%",
        y: "34%",
        label: "4× STRAIN-GAUGE LOAD CELLS",
        detail: "Real-time payload weighing & center-of-mass verification",
      },
      {
        id: "03",
        x: "68%",
        y: "66%",
        label: "UNIVERSAL TOP-MODULE MOUNT",
        detail: "ISObolt pattern for conveyors, cobot arms or rack pins",
      },
    ],
  },
  {
    id: "nadir",
    code: "VIEW 06 // −90° NADIR",
    name: "UNDERBODY DRIVETRAIN & CASTERS",
    shortName: "NADIR",
    deg: "−90°",
    compassDeg: 225,
    elevation: "−90° UNDERSIDE",
    img: "/assets/bottom.jpg",
    alt: "Underside view of NEXUS M2 autonomous mobile robot",
    headline: "Twin center differential drive modules & 4 corner swivel casters.",
    summary:
      "A fully sealed flat aluminum belly pan protects the motor controllers and wiring harness while four forged twin-wheel casters distribute 1-ton loads evenly across epoxy floors.",
    metrics: [
      { label: "FLOOR CLEARANCE", value: "28 mm" },
      { label: "CASTER LAYOUT", value: "4× SWIVEL" },
      { label: "UNDERBODY", value: "SEALED 6061-T6" },
    ],
    hotspots: [
      {
        id: "01",
        x: "50%",
        y: "32%",
        label: "OPPOSED DIFFERENTIAL DRIVE",
        detail: "360° on-the-spot spin with zero lateral tire scrub",
      },
      {
        id: "02",
        x: "26%",
        y: "35%",
        label: "HEAVY-DUTY SWIVEL CASTERS",
        detail: "Spring-loaded polyurethane casters for uneven floor joints",
      },
      {
        id: "03",
        x: "54%",
        y: "54%",
        label: "SEALED ALUMINUM BELLY PAN",
        detail: "Protects battery & power electronics from floor debris",
      },
    ],
  },
];

const AUTO_CYCLE_MS = 6500;

export function OrbitSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string>("01");
  const [autoPlay, setAutoPlay] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [progress, setProgress] = useState(0);

  const dragStartX = useRef<number | null>(null);
  const current = ORBIT_ANGLES[activeIdx];

  const selectAngle = (idx: number, pauseAuto = false) => {
    const next = (idx + ORBIT_ANGLES.length) % ORBIT_ANGLES.length;
    setActiveIdx(next);
    setActiveHotspot("01");
    setProgress(0);
    if (pauseAuto) setAutoPlay(false);
  };

  useEffect(() => {
    if (!autoPlay) return;
    const stepMs = 50;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepMs / AUTO_CYCLE_MS;
        if (next >= 1) {
          setActiveIdx((i) => (i + 1) % ORBIT_ANGLES.length);
          setActiveHotspot("01");
          return 0;
        }
        return next;
      });
    }, stepMs);
    return () => clearInterval(timer);
  }, [autoPlay, activeIdx]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) > 40) {
      selectAngle(dx < 0 ? activeIdx + 1 : activeIdx - 1, true);
    }
  };

  return (
    <section
      className="orbit relative py-[14vh] px-[var(--pad)] overflow-hidden"
      id="views"
      aria-labelledby="orbit-heading"
    >
      <div className="max-w-[1520px] mx-auto">
        {/* Section Header + Top 360° Azimuth Pill Bar */}
        <div className="orbit-head flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="mono eyebrow" data-scramble="">
              04 — 360° STUDIO INSPECTION
            </p>
            <h2 id="orbit-heading" className="mt-4">
              Every angle
              <br />
              is the <em>right</em> angle.
            </h2>
          </div>

          {/* Interactive 360° Azimuth Degree Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex flex-wrap items-center bg-[#0b0c10] border border-line2 p-1 gap-1"
              role="tablist"
              aria-label="Select inspection angle"
            >
              {ORBIT_ANGLES.map((angle, i) => {
                const isActive = i === activeIdx;
                return (
                  <button
                    key={angle.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => selectAngle(i, true)}
                    className={`mono px-3 py-2 text-[10px] tracking-[0.14em] transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? "bg-amber text-black font-semibold shadow-[0_0_20px_rgba(255,138,31,0.35)]"
                        : "text-mute hover:text-ink hover:bg-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <span>{angle.shortName}</span>
                    <span
                      className={
                        isActive ? "text-black/75" : "text-amber/80"
                      }
                    >
                      {angle.deg}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setAutoPlay((p) => !p)}
              className={`mono px-3 py-2.5 text-[10px] border transition-colors ${
                autoPlay
                  ? "border-amber/60 bg-[rgba(255,138,31,0.1)] text-amber"
                  : "border-line2 bg-[#0b0c10] text-mute hover:text-ink"
              }`}
              title="Toggle automatic 360° angle rotation"
            >
              {autoPlay ? "● AUTO ORBIT" : "○ PAUSED"}
            </button>
          </div>
        </div>

        {/* Main UX-Friendly Split Inspection Layout */}
        <div className="grid grid-cols-[1.32fr_1fr] max-[1080px]:grid-cols-1 gap-7 items-stretch">
          {/* LEFT: High-Resolution Interactive Studio Viewport */}
          <div
            className="relative border border-line2 bg-[#08090c] overflow-hidden flex flex-col justify-between min-h-[480px] max-[640px]:min-h-[360px] select-none shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            data-cursor="SWIPE / INSPECT"
          >
            {/* Corner HUD Brackets */}
            <i
              className="absolute top-3 left-3 w-3.5 h-3.5 border-t-[1.5px] border-l-[1.5px] border-amber z-20 pointer-events-none"
              aria-hidden="true"
            />
            <i
              className="absolute top-3 right-3 w-3.5 h-3.5 border-t-[1.5px] border-r-[1.5px] border-amber z-20 pointer-events-none"
              aria-hidden="true"
            />
            <i
              className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-[1.5px] border-l-[1.5px] border-amber z-20 pointer-events-none"
              aria-hidden="true"
            />
            <i
              className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-[1.5px] border-r-[1.5px] border-amber z-20 pointer-events-none"
              aria-hidden="true"
            />

            {/* Top Viewport Telemetry Bar */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-line bg-[rgba(8,9,12,0.84)] backdrop-blur-md mono text-[10px]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 text-amber">
                  <i className="w-1.5 h-1.5 rounded-full bg-amber animate-ping" />
                  {current.code}
                </span>
                <span className="text-mute hidden sm:inline">|</span>
                <span className="text-ink hidden sm:inline">
                  {current.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-mint bg-[rgba(110,231,168,0.08)] border border-[rgba(110,231,168,0.3)] px-2 py-0.5 text-[9px]">
                  ELEVATION: {current.elevation}
                </span>
                <button
                  type="button"
                  onClick={() => setShowHotspots((s) => !s)}
                  className={`px-2.5 py-0.5 border text-[9px] transition-colors ${
                    showHotspots
                      ? "border-amber/60 bg-[rgba(255,138,31,0.14)] text-amber"
                      : "border-line text-mute hover:text-ink"
                  }`}
                >
                  {showHotspots ? "● CALLOUTS ON" : "○ CALLOUTS OFF"}
                </button>
              </div>
            </div>

            {/* Center Image Stage + Annotated Hardware Callout Pins */}
            <div className="relative flex-1 min-h-[340px] overflow-hidden bg-[#060709]">
              {ORBIT_ANGLES.map((angle, i) => {
                const isActive = i === activeIdx;
                return (
                  <img
                    key={angle.id}
                    src={angle.img}
                    alt={angle.alt}
                    draggable={false}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-expo ${
                      isActive
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-[1.04] pointer-events-none"
                    }`}
                  />
                );
              })}

              {/* Subtle radial vignette for HUD legibility */}
              <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_45%,rgba(5,6,8,0.65)_100%)] pointer-events-none"
                aria-hidden="true"
              />

              {/* Interactive Hardware Callout Pins on the Active View */}
              {showHotspots &&
                current.hotspots.map((spot) => {
                  const isSpotActive = activeHotspot === spot.id;
                  return (
                    <div
                      key={spot.id}
                      style={{ left: spot.x, top: spot.y }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveHotspot(spot.id);
                          setAutoPlay(false);
                        }}
                        onMouseEnter={() => setActiveHotspot(spot.id)}
                        className={`group relative flex items-center justify-center w-7 h-7 rounded-full mono text-[10px] font-bold transition-all duration-300 ${
                          isSpotActive
                            ? "bg-amber text-black scale-110 shadow-[0_0_20px_rgba(255,138,31,0.9)]"
                            : "bg-[rgba(10,12,16,0.88)] text-amber border border-amber/70 hover:bg-amber hover:text-black"
                        }`}
                        aria-label={`Inspect ${spot.label}`}
                      >
                        <span
                          className={`absolute inset-0 rounded-full border border-amber ${
                            isSpotActive ? "animate-ping opacity-60" : "opacity-0"
                          }`}
                        />
                        {spot.id}
                      </button>

                      {/* Floating Callout Tooltip on Active Hotspot */}
                      <div
                        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-9 w-[230px] p-2.5 bg-[rgba(9,10,14,0.94)] border border-amber/70 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                          isSpotActive
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-1.5"
                        }`}
                      >
                        <span className="mono text-[9px] text-amber block tracking-[0.12em]">
                          [{spot.id}] {spot.label}
                        </span>
                        <span className="text-[11px] text-[#d5d2cc] leading-tight block mt-1">
                          {spot.detail}
                        </span>
                      </div>
                    </div>
                  );
                })}

              {/* Bottom-Left Live 360° Azimuth Radar Compass Widget */}
              <div className="absolute left-5 bottom-5 z-20 flex items-center gap-3 bg-[rgba(8,9,13,0.86)] border border-line2 px-3.5 py-2.5 backdrop-blur-md">
                <svg
                  viewBox="0 0 48 48"
                  className="w-10 h-10 shrink-0"
                  aria-hidden="true"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="rgba(255,255,255,0.16)"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="13"
                    fill="rgba(255,138,31,0.08)"
                    stroke="rgba(255,138,31,0.35)"
                    strokeWidth="1"
                  />
                  <g
                    style={{
                      transform: `rotate(${current.compassDeg}deg)`,
                      transformOrigin: "24px 24px",
                      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <line
                      x1="24"
                      y1="24"
                      x2="24"
                      y2="5"
                      stroke="#ff8a1f"
                      strokeWidth="2"
                    />
                    <polygon points="24,3 20,10 28,10" fill="#ff8a1f" />
                  </g>
                  <circle cx="24" cy="24" r="3" fill="#f1eee8" />
                </svg>
                <div className="mono">
                  <span className="block text-[9px] text-mute">
                    CAMERA AZIMUTH
                  </span>
                  <b className="text-[15px] text-ink font-semibold">
                    {current.shortName}{" "}
                    <span className="text-amber">{current.deg}</span>
                  </b>
                </div>
              </div>

              {/* Bottom-Right Prev / Next Angle Controls */}
              <div className="absolute right-5 bottom-5 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => selectAngle(activeIdx - 1, true)}
                  className="mono px-3.5 py-2 bg-[rgba(8,9,13,0.88)] border border-line2 text-[11px] text-ink hover:border-amber hover:text-amber transition-colors"
                  aria-label="Previous angle"
                >
                  ← PREV
                </button>
                <button
                  type="button"
                  onClick={() => selectAngle(activeIdx + 1, true)}
                  className="mono px-3.5 py-2 bg-[rgba(8,9,13,0.88)] border border-line2 text-[11px] text-ink hover:border-amber hover:text-amber transition-colors"
                  aria-label="Next angle"
                >
                  NEXT →
                </button>
              </div>
            </div>

            {/* Bottom 3-Metric Strip Inside Viewport */}
            <div className="relative z-20 grid grid-cols-3 border-t border-line bg-[rgba(8,9,12,0.92)] mono">
              {current.metrics.map((m, idx) => (
                <div
                  key={m.label}
                  className={`px-5 py-3.5 ${
                    idx < 2 ? "border-r border-line" : ""
                  }`}
                >
                  <span className="block text-[9px] text-mute">{m.label}</span>
                  <b className="block text-[14px] text-ink font-medium mt-0.5">
                    {m.value}
                  </b>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Active Angle Dossier + 6-Angle Interactive Thumbnail Grid */}
          <div className="flex flex-col justify-between gap-6">
            {/* Active Angle Engineering Card */}
            <div className="border border-line2 bg-[#0a0b0f] p-6 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mono text-[10px] text-amber mb-2">
                <span>
                  [ ANGLE 0{activeIdx + 1} / 06 · {current.shortName}{" "}
                  {current.deg} ]
                </span>
                <span className="text-mute">{current.elevation}</span>
              </div>

              <h3 className="font-display font-bold text-[clamp(22px,2.2vw,30px)] text-ink leading-[1.15] tracking-[-0.02em]">
                {current.headline}
              </h3>

              <p className="text-[#b8b5af] text-[14.5px] leading-[1.6] mt-3">
                {current.summary}
              </p>

              {/* Interactive Callout List for Current Angle */}
              <div className="mt-5 pt-4 border-t border-line space-y-2">
                <span className="mono text-[9px] text-mute block mb-2">
                  VISIBLE SUBSYSTEM CALLOUTS (CLICK TO HIGHLIGHT ON VIEWPORT):
                </span>
                {current.hotspots.map((spot) => {
                  const isSpotOn = activeHotspot === spot.id;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => {
                        setActiveHotspot(spot.id);
                        setShowHotspots(true);
                        setAutoPlay(false);
                      }}
                      className={`w-full text-left p-2.5 border transition-all duration-200 flex items-start gap-3 ${
                        isSpotOn
                          ? "border-amber bg-[rgba(255,138,31,0.1)]"
                          : "border-line bg-[rgba(255,255,255,0.015)] hover:border-line2"
                      }`}
                    >
                      <span
                        className={`mono text-[10px] px-1.5 py-0.5 shrink-0 ${
                          isSpotOn
                            ? "bg-amber text-black font-bold"
                            : "bg-[rgba(255,138,31,0.15)] text-amber"
                        }`}
                      >
                        {spot.id}
                      </span>
                      <div>
                        <span className="mono text-[10px] text-ink block font-medium">
                          {spot.label}
                        </span>
                        <span className="text-[12px] text-mute block mt-0.5">
                          {spot.detail}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6-Angle Interactive Thumbnail Selector Grid */}
            <div>
              <div className="flex items-center justify-between mono text-[10px] text-mute mb-2.5">
                <span>ALL 6 ORTHOGRAPHIC & STUDIO PERSPECTIVES</span>
                <span className="text-amber">CLICK ANY VIEW TO INSPECT</span>
              </div>

              <div className="grid grid-cols-3 max-[520px]:grid-cols-2 gap-2.5">
                {ORBIT_ANGLES.map((angle, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <button
                      key={angle.id}
                      type="button"
                      onClick={() => selectAngle(i, true)}
                      className={`group relative text-left border overflow-hidden bg-[#090a0e] transition-all duration-300 ${
                        isActive
                          ? "border-amber shadow-[0_0_24px_rgba(255,138,31,0.22)]"
                          : "border-line2 opacity-75 hover:opacity-100 hover:border-white/30"
                      }`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-black">
                        <img
                          src={angle.img}
                          alt={angle.alt}
                          loading="lazy"
                          draggable={false}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span
                          className={`mono absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] ${
                            isActive
                              ? "bg-amber text-black font-bold"
                              : "bg-[rgba(8,9,12,0.85)] text-amber border border-line"
                          }`}
                        >
                          {angle.deg}
                        </span>
                      </div>

                      <div className="px-2.5 py-2 flex items-center justify-between mono text-[10px]">
                        <span
                          className={
                            isActive
                              ? "text-ink font-medium"
                              : "text-mute group-hover:text-ink"
                          }
                        >
                          {angle.shortName}
                        </span>
                        <span className="text-[9px] text-mute">
                          0{i + 1}/06
                        </span>
                      </div>

                      {/* Active Auto-Cycle Progress Bar */}
                      <div className="h-[2px] w-full bg-line overflow-hidden">
                        <div
                          className="h-full bg-amber origin-left transition-transform duration-75"
                          style={{
                            transform: `scaleX(${
                              isActive ? (autoPlay ? progress : 1) : 0
                            })`,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
