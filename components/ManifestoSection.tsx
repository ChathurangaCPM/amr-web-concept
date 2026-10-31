import { Manifesto3DCanvas } from "./Manifesto3DCanvas";

export function ManifestoSection() {
  return (
    <section
      className="manifesto relative h-[340vh]"
      id="manifesto"
      aria-label="Mind of the Machine"
    >
      <div className="mf-sticky sticky top-0 h-screen flex flex-col justify-center px-[var(--pad)] max-w-[1520px] mx-auto overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-8 max-[960px]:mb-5">
          <p className="mono eyebrow mf-eyebrow">01 — MIND OF THE MACHINE</p>
          <span className="mono text-[10px] text-mute hidden sm:inline-flex items-center gap-2 border border-line px-3 py-1 bg-[rgba(255,255,255,0.02)]">
            <i className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse"></i>
            SCROLL, CLICK STEPS OR DRAG 3D SCENE TO INSPECT
          </span>
        </div>

        <div className="grid grid-cols-[1fr_1.08fr] max-[1024px]:grid-cols-1 gap-10 max-[1024px]:gap-6 items-center">
          {/* LEFT: Active Manifesto Statement */}
          <div
            className="mf-stage relative h-[clamp(240px,38vh,380px)] max-[1024px]:h-[210px]"
            id="mfStage"
          >
            <article className="mf-slide on absolute inset-0 flex flex-col justify-center opacity-0 translate-y-[60px] blur-[8px] transition-[opacity,transform,filter] duration-700 ease-expo pointer-events-none isolate">
              <span
                className="mf-ghost absolute right-4 top-1/2 -translate-y-1/2 font-display font-extrabold text-[clamp(120px,18vw,280px)] leading-[0.8] tracking-[-0.06em] -z-10 opacity-45"
                aria-hidden="true"
              >
                01
              </span>
              <span className="mono text-[10px] text-amber tracking-[0.22em] mb-3">
                [ 01 // INFRASTRUCTURE-FREE SLAM ]
              </span>
              <h2 className="mf-title text-[clamp(44px,6.8vw,118px)] leading-[0.95]">
                No <em>tracks.</em>
              </h2>
              <p className="mf-sub mt-6 max-w-[500px] text-[clamp(16px,1.35vw,21px)] leading-[1.5] text-[#bdbab5] font-light">
                No tape, magnets or QR codes on the floor. It locks onto natural
                walls, racks and columns to find its own way.
              </p>
            </article>

            <article className="mf-slide absolute inset-0 flex flex-col justify-center opacity-0 translate-y-[60px] blur-[8px] transition-[opacity,transform,filter] duration-700 ease-expo pointer-events-none isolate">
              <span
                className="mf-ghost absolute right-4 top-1/2 -translate-y-1/2 font-display font-extrabold text-[clamp(120px,18vw,280px)] leading-[0.8] tracking-[-0.06em] -z-10 opacity-45"
                aria-hidden="true"
              >
                02
              </span>
              <span className="mono text-[10px] text-amber tracking-[0.22em] mb-3">
                [ 02 // 360° MULTI-SENSOR FUSION ]
              </span>
              <h2 className="mf-title text-[clamp(44px,6.8vw,118px)] leading-[0.95]">
                No <em>blind spots.</em>
              </h2>
              <p className="mf-sub mt-6 max-w-[500px] text-[clamp(16px,1.35vw,21px)] leading-[1.5] text-[#bdbab5] font-light">
                It sees every shelf, person and pallet around it — fusing dual
                safety LiDARs and 4× stereo 3D depth cameras into a full 360°
                field.
              </p>
            </article>

            <article className="mf-slide absolute inset-0 flex flex-col justify-center opacity-0 translate-y-[60px] blur-[8px] transition-[opacity,transform,filter] duration-700 ease-expo pointer-events-none isolate">
              <span
                className="mf-ghost absolute right-4 top-1/2 -translate-y-1/2 font-display font-extrabold text-[clamp(120px,18vw,280px)] leading-[0.8] tracking-[-0.06em] -z-10 opacity-45"
                aria-hidden="true"
              >
                03
              </span>
              <span className="mono text-[10px] text-amber tracking-[0.22em] mb-3">
                [ 03 // SUB-5MS DYNAMIC RE-PLANNING ]
              </span>
              <h2 className="mf-title text-[clamp(44px,6.8vw,118px)] leading-[0.95]">
                No <em>waiting.</em>
              </h2>
              <p className="mf-sub mt-6 max-w-[500px] text-[clamp(16px,1.35vw,21px)] leading-[1.5] text-[#bdbab5] font-light">
                It picks the best route in milliseconds and computes a smooth
                collision-free bypass on the fly if the aisle is blocked.
              </p>
            </article>

            <article className="mf-slide absolute inset-0 flex flex-col justify-center opacity-0 translate-y-[60px] blur-[8px] transition-[opacity,transform,filter] duration-700 ease-expo pointer-events-none isolate">
              <span
                className="mf-ghost absolute right-4 top-1/2 -translate-y-1/2 font-display font-extrabold text-[clamp(120px,18vw,280px)] leading-[0.8] tracking-[-0.06em] -z-10 opacity-45"
                aria-hidden="true"
              >
                04
              </span>
              <span className="mono text-[10px] text-amber tracking-[0.22em] mb-3">
                [ 04 // 24/7 AUTONOMOUS DUTY CYCLE ]
              </span>
              <h2 className="mf-title text-[clamp(44px,6.8vw,118px)] leading-[0.95]">
                Just <em>motion.</em>
              </h2>
              <p className="mf-sub mt-6 max-w-[500px] text-[clamp(16px,1.35vw,21px)] leading-[1.5] text-[#bdbab5] font-light">
                Day and night, it lifts 1,000 kg loads, coordinates with your
                fleet and self-docks for 48V fast charging between runs.
              </p>
            </article>
          </div>

          {/* RIGHT: Interactive Three.js 3D Mechanism Visualizer + Synchronized Card HUDs */}
          <div
            className="mf-visual-panel relative h-[clamp(350px,48vh,460px)] max-[1024px]:h-[350px] border border-line2 bg-[#090a0d] shadow-[0_30px_90px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,138,31,0.06)] overflow-hidden"
            id="mfVisualStage"
            data-cursor="DRAG 3D"
          >
            {/* Corner HUD Brackets */}
            <i
              className="absolute top-2 left-2 w-3 h-3 border-t-[1.5px] border-l-[1.5px] border-amber z-10 pointer-events-none"
              aria-hidden="true"
            ></i>
            <i
              className="absolute top-2 right-2 w-3 h-3 border-t-[1.5px] border-r-[1.5px] border-amber z-10 pointer-events-none"
              aria-hidden="true"
            ></i>
            <i
              className="absolute bottom-2 left-2 w-3 h-3 border-b-[1.5px] border-l-[1.5px] border-amber z-10 pointer-events-none"
              aria-hidden="true"
            ></i>
            <i
              className="absolute bottom-2 right-2 w-3 h-3 border-b-[1.5px] border-r-[1.5px] border-amber z-10 pointer-events-none"
              aria-hidden="true"
            ></i>

            {/* Shared Live Three.js 3D Viewport */}
            <div className="absolute inset-x-0 top-[46px] bottom-[68px] z-[1] bg-[radial-gradient(circle_at_50%_50%,rgba(255,138,31,0.09),transparent_72%)]">
              <Manifesto3DCanvas />
            </div>

            {/* ==================== CARD HUD 01: NO TRACKS (NATURAL-FEATURE 3D vSLAM) ==================== */}
            <div
              className="mf-vis-card on absolute inset-0 z-[4] flex flex-col justify-between p-5 opacity-0 translate-y-4 pointer-events-none transition-all duration-500 ease-expo"
              data-mf-vis="0"
            >
              <div className="flex items-center justify-between gap-2 border-b border-line pb-3 mono text-[10px] bg-[rgba(9,10,13,0.82)] backdrop-blur-sm">
                <span className="text-amber flex items-center gap-2">
                  <i className="w-1.5 h-1.5 rounded-full bg-amber animate-ping"></i>
                  3D SIMULATION // 01 · NATURAL-FEATURE vSLAM
                </span>
                <span className="text-mint bg-[rgba(110,231,168,0.08)] border border-[rgba(110,231,168,0.3)] px-2 py-0.5 text-[9px]">
                  FLOOR MODS: 0 · POSE ±2.1mm
                </span>
              </div>

              <div className="relative flex-1 my-2">
                <div className="absolute top-1 left-1 flex flex-col gap-1 mono text-[9px]">
                  <span className="px-2 py-0.5 bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.35)] text-[#f87171] line-through">
                    MAGNETIC FLOOR TAPE
                  </span>
                  <span className="px-2 py-0.5 bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.35)] text-[#f87171] line-through">
                    FLOOR QR FIDUCIAL GRID
                  </span>
                </div>
                <div className="absolute top-1 right-1 mono text-[9px] text-right bg-[rgba(9,10,13,0.75)] px-2 py-1 border border-line">
                  <span className="block text-ink">3D LANDMARK TRIANGULATION</span>
                  <span className="text-amber">20 Hz GRAPH-SLAM LOCK</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line mono text-[9px] bg-[rgba(9,10,13,0.86)] backdrop-blur-sm">
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">01 · READ ROOM</span>
                  <span className="text-mute">Scans 3D walls, columns & racks</span>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">02 · GRAPH SLAM</span>
                  <span className="text-mute">Triangulates X, Y, θ at 20 Hz</span>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">03 · FREE NAV</span>
                  <span className="text-mute">Zero floor tape or QR codes</span>
                </div>
              </div>
            </div>

            {/* ==================== CARD HUD 02: NO BLIND SPOTS (360° 3D SENSOR FUSION) ==================== */}
            <div
              className="mf-vis-card absolute inset-0 z-[4] flex flex-col justify-between p-5 opacity-0 translate-y-4 pointer-events-none transition-all duration-500 ease-expo"
              data-mf-vis="1"
            >
              <div className="flex items-center justify-between gap-2 border-b border-line pb-3 mono text-[10px] bg-[rgba(9,10,13,0.82)] backdrop-blur-sm">
                <span className="text-amber flex items-center gap-2">
                  <i className="w-1.5 h-1.5 rounded-full bg-amber animate-ping"></i>
                  3D SIMULATION // 02 · 360° MULTI-SENSOR FUSION
                </span>
                <span className="text-mint bg-[rgba(110,231,168,0.08)] border border-[rgba(110,231,168,0.3)] px-2 py-0.5 text-[9px]">
                  BLIND ZONES: 0.0° · 40m RANGE
                </span>
              </div>

              <div className="relative flex-1 my-2">
                <div className="absolute top-1 left-1 mono text-[9px] bg-[rgba(9,10,13,0.75)] px-2 py-1 border border-line space-y-0.5">
                  <span className="block text-amber">
                    ● 2× OPPOSING 270° SAFETY LIDARS
                  </span>
                  <span className="block text-mint">
                    ● 4× STEREO 3D DEPTH CONES
                  </span>
                </div>
                <div className="absolute top-1 right-1 mono text-[9px] text-right bg-[rgba(9,10,13,0.75)] px-2 py-1 border border-line">
                  <span className="block text-ink">ISO 3691-4 PL-d</span>
                  <span className="text-mint">3D BOUNDING BOX LOCK</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line mono text-[9px] bg-[rgba(9,10,13,0.86)] backdrop-blur-sm">
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">2× SICK LIDARS</span>
                  <span className="text-mute">270°×2 overlapping laser halo</span>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">4× RGB-D CAMERAS</span>
                  <span className="text-mute">Sees overhanging forks in 3D</span>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">ADAPTIVE ZONES</span>
                  <span className="text-mute">Slows or stops near humans</span>
                </div>
              </div>
            </div>

            {/* ==================== CARD HUD 03: NO WAITING (3D DYNAMIC RE-ROUTING) ==================== */}
            <div
              className="mf-vis-card absolute inset-0 z-[4] flex flex-col justify-between p-5 opacity-0 translate-y-4 pointer-events-none transition-all duration-500 ease-expo"
              data-mf-vis="2"
            >
              <div className="flex items-center justify-between gap-2 border-b border-line pb-3 mono text-[10px] bg-[rgba(9,10,13,0.82)] backdrop-blur-sm">
                <span className="text-amber flex items-center gap-2">
                  <i className="w-1.5 h-1.5 rounded-full bg-amber animate-ping"></i>
                  3D SIMULATION // 03 · SUB-5ms DYNAMIC RE-PLANNER
                </span>
                <span className="text-mint bg-[rgba(110,231,168,0.08)] border border-[rgba(110,231,168,0.3)] px-2 py-0.5 text-[9px]">
                  SOLVE TIME: 3.2 ms · ZERO HALT
                </span>
              </div>

              <div className="relative flex-1 my-2">
                <div className="absolute top-1 left-1 mono text-[9px] bg-[rgba(9,10,13,0.75)] px-2 py-1 border border-line space-y-0.5">
                  <span className="block text-[#f87171]">
                    ━━━ BLOCKED AISLE PALLET
                  </span>
                  <span className="block text-amber">
                    ━━━ 3D SMOOTH S-CURVE BYPASS
                  </span>
                </div>
                <div className="absolute top-1 right-1 mono text-[9px] text-right bg-[rgba(9,10,13,0.75)] px-2 py-1 border border-line">
                  <span className="block text-ink">64 CANDIDATE ARCS</span>
                  <span className="text-amber">EVALUATED AT 40 Hz</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line mono text-[9px] bg-[rgba(9,10,13,0.86)] backdrop-blur-sm">
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">01 · DETECT</span>
                  <span className="text-mute">Spots aisle blockage 8m ahead</span>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">02 · RE-SOLVE</span>
                  <span className="text-mute">A* + DWA solver in 3.2 ms</span>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">03 · NO WAITING</span>
                  <span className="text-mute">Smooth bypass without stopping</span>
                </div>
              </div>
            </div>

            {/* ==================== CARD HUD 04: JUST MOTION (24/7 3D FLEET & AUTO-CHARGE LOOP) ==================== */}
            <div
              className="mf-vis-card absolute inset-0 z-[4] flex flex-col justify-between p-5 opacity-0 translate-y-4 pointer-events-none transition-all duration-500 ease-expo"
              data-mf-vis="3"
            >
              <div className="flex items-center justify-between gap-2 border-b border-line pb-3 mono text-[10px] bg-[rgba(9,10,13,0.82)] backdrop-blur-sm">
                <span className="text-amber flex items-center gap-2">
                  <i className="w-1.5 h-1.5 rounded-full bg-amber animate-ping"></i>
                  3D SIMULATION // 04 · 24/7 CONTINUOUS AUTONOMY
                </span>
                <span className="text-mint bg-[rgba(110,231,168,0.08)] border border-[rgba(110,231,168,0.3)] px-2 py-0.5 text-[9px]">
                  10h RUN · 45m FAST CHARGE
                </span>
              </div>

              <div className="relative flex-1 my-2">
                <div className="absolute top-1 left-1 mono text-[9px] bg-[rgba(9,10,13,0.75)] px-2 py-1 border border-line space-y-0.5">
                  <span className="block text-amber">
                    ● ACTIVE 1,000 KG SCISSOR LIFT
                  </span>
                  <span className="block text-mint">
                    ● VDA 5050 MULTI-AMR LOOP
                  </span>
                </div>
                <div className="absolute top-1 right-1 mono text-[9px] text-right bg-[rgba(9,10,13,0.75)] px-2 py-1 border border-line">
                  <span className="block text-ink">99.4% FLEET UPTIME</span>
                  <span className="text-mint">48V ±5mm AUTO-DOCK</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line mono text-[9px] bg-[rgba(9,10,13,0.86)] backdrop-blur-sm">
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">1,000 KG LIFT</span>
                  <span className="text-mute">Auto pallet pick & drop</span>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">48V FAST DOCK</span>
                  <span className="text-mute">Self-charges between tasks</span>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-line p-2">
                  <span className="text-amber block">FLEET-READY</span>
                  <span className="text-mute">Scales from 1 to 200+ units</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Rail + Interactive Step Selector */}
        <div className="mf-rail mono flex flex-wrap items-center justify-between gap-5 mt-9 text-[11px] text-mute">
          <div className="flex items-center gap-5 flex-1 min-w-[260px] max-w-[440px]">
            <span className="mf-count">
              <b id="mfIdx" className="text-ink font-normal">
                01
              </b>{" "}
              / 04
            </span>
            <span className="mf-bar flex-1 h-[2px] bg-line overflow-hidden">
              <i
                id="mfBar"
                className="block h-full bg-amber origin-left scale-x-0 shadow-[0_0_10px_var(--amber)]"
              ></i>
            </span>
          </div>

          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Mind of the Machine steps"
          >
            {[
              { idx: 0, label: "01 · NO TRACKS" },
              { idx: 1, label: "02 · NO BLIND SPOTS" },
              { idx: 2, label: "03 · NO WAITING" },
              { idx: 3, label: "04 · JUST MOTION" },
            ].map((step, i) => (
              <button
                key={step.idx}
                type="button"
                data-mf-step={step.idx}
                role="tab"
                aria-selected={i === 0 ? "true" : "false"}
                className={`mf-step-btn px-3 py-1.5 text-[10px] border border-line bg-[rgba(255,255,255,0.02)] text-mute transition-all duration-300 hover:border-amber hover:text-ink ${
                  i === 0 ? "on" : ""
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
