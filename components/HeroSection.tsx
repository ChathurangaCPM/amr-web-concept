import { Hero3DCanvas } from "./Hero3DCanvas";

const HERO_CAPABILITIES = [
  {
    idx: 0,
    tag: "[ 01 · 1,000 KG PAYLOAD LIFT ]",
    short: "SCISSOR ACTUATOR +140 MM",
  },
  {
    idx: 1,
    tag: "[ 02 · AUTONOMOUS SLAM NAV ]",
    short: "DYNAMIC OBSTACLE BYPASS",
  },
  {
    idx: 2,
    tag: "[ 03 · 360° SAFETY & ±5MM DOCK ]",
    short: "ISO PL-d · 48V FAST CHARGE",
  },
  {
    idx: 3,
    tag: "[ 04 · INTERNAL ARCHITECTURE ]",
    short: "13-MODULE X-RAY EXPLODE",
  },
];

export function HeroSection() {
  return (
    <section
      className="hero relative h-screen min-h-[640px] w-full overflow-hidden grid place-items-center"
      id="top"
      aria-labelledby="hero-heading"
    >
      <canvas
        id="cloud"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      ></canvas>
      <div
        className="hero-vignette absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_60%_at_50%_55%,transparent_30%,rgba(6,6,6,0.85)_100%)]"
        aria-hidden="true"
      ></div>

      <div
        className="hero-word absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 font-display font-extrabold text-[clamp(120px,27vw,480px)] leading-[0.8] tracking-[-0.06em] whitespace-nowrap pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="hw-stroke block">NEXUS</span>
        <span className="hw-fill absolute inset-0 block text-ink" id="hwFill">
          NEXUS
        </span>
      </div>

      {/* Full-viewport 3D stage (no clipping box) */}
      <div className="hero-bot-wrap absolute inset-0 w-full h-full z-[3]">
        <div className="hero-bot relative w-full h-full" id="heroBot">
          <div
            className="hero-glow pointer-events-none absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[min(900px,80vw)] h-[min(520px,55vh)] blur-[50px] opacity-55 z-[1]"
            aria-hidden="true"
          ></div>
          <Hero3DCanvas />
        </div>
      </div>

      {/* Live 3D Capability Readout Badge */}
      <div
        className="hero-cap-hud absolute left-1/2 bottom-[11.5vh] -translate-x-1/2 z-[5] w-[min(520px,90vw)] bg-[rgba(8,8,10,0.78)] border border-line2 backdrop-blur-[12px] px-4 py-2.5 pointer-events-none shadow-[0_18px_50px_rgba(0,0,0,0.65)] max-[960px]:hidden"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-3 mono text-[9px]">
          <span className="inline-flex items-center gap-1.5 text-amber">
            <i className="w-1.5 h-1.5 rounded-full bg-amber shadow-[0_0_8px_var(--amber)] animate-pulse"></i>
            <b id="heroCapCode" className="font-normal">
              CAPABILITY 01 // ACTIVE PAYLOAD LIFT
            </b>
          </span>
          <span
            id="heroCapMetric"
            className="text-mint border border-[rgba(110,231,168,0.3)] bg-[rgba(110,231,168,0.08)] px-2 py-0.5"
          >
            1,000 KG · +140 MM LIFT
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between gap-3">
          <strong
            id="heroCapTitle"
            className="font-display font-bold text-[12px] uppercase tracking-[-0.01em] text-ink shrink-0"
          >
            1,000 KG Scissor-Lift Deck
          </strong>
          <p
            id="heroCapSub"
            className="text-[11px] text-[#bdbab5] truncate"
          >
            Ball-screw actuator lifts palletized loads +140 mm with 4-cell
            weight stabilization.
          </p>
        </div>
      </div>

      <h1 id="hero-heading" className="sr-only">
        NEXUS M2 — Autonomous Mobile Robot by Infinitude Robotics
      </h1>
      <div
        className="hero-m2 pointer-events-none absolute right-[calc(var(--pad)+2vw)] bottom-[13vh] max-[760px]:bottom-auto max-[760px]:top-[18vh] z-[4] font-display font-extrabold text-[clamp(70px,12vw,200px)] leading-[0.8] tracking-[-0.05em] bg-[linear-gradient(180deg,var(--amber2),var(--amber)_60%,#a54a00)] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,138,31,0.35)]"
        aria-hidden="true"
      >
        M2
      </div>

      <div className="hero-meta pointer-events-none absolute left-[var(--pad)] bottom-[14vh] max-[760px]:bottom-[18vh] z-[4] max-w-[380px]">
        <p className="mono eyebrow" data-scramble="">
          AUTONOMOUS MOBILE ROBOT
        </p>
        <p className="hero-lede mt-[14px] text-[clamp(17px,1.5vw,22px)] leading-[1.35] font-light">
          It doesn&apos;t follow lines on the floor.
          <br />
          It reads the whole room.
        </p>
      </div>

      <div
        className="hero-tags mono absolute left-[var(--pad)] top-[18vh] flex flex-col gap-2 text-[10px] text-mute z-[4] max-[760px]:hidden"
        role="group"
        aria-label="Interactive 3D AMR capability demonstrations"
      >
        <span className="text-[9px] text-amber tracking-[0.22em] mb-1">
          LIVE 3D CAPABILITIES // CLICK TO INSPECT
        </span>
        {HERO_CAPABILITIES.map((cap, i) => (
          <button
            key={cap.idx}
            type="button"
            data-hero-mode={cap.idx}
            aria-pressed={i === 0 ? "true" : "false"}
            className={`hero-cap-btn group relative text-left px-3 py-2 border border-line bg-[rgba(8,8,10,0.65)] backdrop-blur-[8px] transition-all duration-300 hover:border-amber hover:text-ink ${
              i === 0 ? "active" : ""
            }`}
          >
            <span className="block text-[10px] tracking-[0.1em] transition-colors">
              {cap.tag}
            </span>
            <small className="block text-[8px] text-dim group-hover:text-mute mt-0.5 tracking-[0.14em]">
              {cap.short}
            </small>
            <span className="block h-[1.5px] w-full bg-line mt-1.5 overflow-hidden">
              <i className="hc-bar block h-full w-full bg-amber origin-left scale-x-0 transition-transform duration-150"></i>
            </span>
          </button>
        ))}
      </div>

      <a
        href="#manifesto"
        className="scroll-cue mono absolute left-1/2 bottom-[calc(var(--pad)+4px)] -translate-x-1/2 z-[5] flex flex-col items-center gap-3 text-[10px] text-mute"
        data-cursor="DESCEND"
      >
        <span>SCROLL TO ENGAGE</span>
        <i
          className="w-px h-[46px] bg-gradient-to-b from-amber to-transparent relative overflow-hidden"
          aria-hidden="true"
        ></i>
      </a>
    </section>
  );
}
