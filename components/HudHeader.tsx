import Image from "vinext/shims/image";

export function HudHeader() {
  return (
    <header className="hud fixed inset-0 z-[80] pointer-events-none [&>*]:pointer-events-auto">
      <div
        className=" absolute top-0 inset-x-0 h-[150px] w-full
    [mask:linear-gradient(to_bottom,rgba(0,0,0,0),#000,#000)] [backface-visibility:hidden] [backdrop-filter:blur(8px)] rotate-180
  "
      ></div>
      <a
        href="#top"
        className="hud-logo absolute top-[var(--pad)] left-[var(--pad)] flex items-center gap-[10px]"
        data-magnetic=""
      >
        <Image
          src="/assets/logo.png"
          alt="Infinitude Robotics"
          className="logo-mark w-[100px] h-auto object-contain drop-shadow-[0_0_8px_rgba(255,138,31,0.4)]"
          width={140}
          height={50}
        />
        <span className="logo-text font-display font-bold text-[14px] tracking-[0.12em] leading-none">
          INFINITUDE
          <small className="block font-mono font-medium text-[8px] tracking-[0.5em] text-amber mt-1">
            ROBOTICS
          </small>
        </span>
      </a>
      <nav
        className="hud-nav absolute top-[var(--pad)] right-[var(--pad)] flex items-center gap-1 font-mono font-normal text-[11px] tracking-[0.12em] uppercase p-[6px] border border-line rounded-full bg-[rgba(8,8,8,0.55)] backdrop-blur-[14px] max-[1100px]:[&>a:not(.hud-cta)]:hidden"
        aria-label="Primary section navigation"
      >
        <a
          href="#manifesto"
          className="px-[14px] py-[9px] rounded-full text-mute transition-colors duration-250"
        >
          <i className="not-italic text-amber mr-[6px] text-[9px]">01</i>Mind
        </a>
        <a
          href="#route"
          className="px-[14px] py-[9px] rounded-full text-mute transition-colors duration-250"
        >
          <i className="not-italic text-amber mr-[6px] text-[9px]">02</i>Route
        </a>
        <a
          href="#anatomy"
          className="px-[14px] py-[9px] rounded-full text-mute transition-colors duration-250"
        >
          <i className="not-italic text-amber mr-[6px] text-[9px]">03</i>X-Ray
        </a>
        <a
          href="#views"
          className="px-[14px] py-[9px] rounded-full text-mute transition-colors duration-250"
        >
          <i className="not-italic text-amber mr-[6px] text-[9px]">04</i>Orbit
        </a>
        <a
          href="#drive"
          className="px-[14px] py-[9px] rounded-full text-mute transition-colors duration-250"
        >
          <i className="not-italic text-amber mr-[6px] text-[9px]">05</i>Drive
        </a>
        <a
          href="#sectors"
          className="px-[14px] py-[9px] rounded-full text-mute transition-colors duration-250"
        >
          <i className="not-italic text-amber mr-[6px] text-[9px]">06</i>Sectors
        </a>
        <a
          href="#specs"
          className="px-[14px] py-[9px] rounded-full text-mute transition-colors duration-250"
        >
          <i className="not-italic text-amber mr-[6px] text-[9px]">07</i>
          Telemetry
        </a>
        <a
          href="#deploy"
          className="hud-cta px-[14px] py-[9px] rounded-full transition-colors duration-250"
          data-magnetic=""
        >
          Deploy&nbsp;→
        </a>
      </nav>
      <div
        className="hud-bl mono absolute bottom-[var(--pad)] left-[var(--pad)] flex gap-[18px] text-[10px] text-mute items-center max-[760px]:hidden"
        aria-hidden="true"
      >
        <span>
          X{" "}
          <b id="hx" className="text-ink font-normal">
            0000
          </b>
        </span>
        <span>
          Y{" "}
          <b id="hy" className="text-ink font-normal">
            0000
          </b>
        </span>
        <span>
          HDG{" "}
          <b id="hh" className="text-ink font-normal">
            000°
          </b>
        </span>
      </div>
      <div
        className="hud-br mono absolute bottom-[var(--pad)] right-[var(--pad)] flex gap-[18px] text-[10px] text-mute items-center"
        aria-hidden="true"
      >
        <span className="pulse-dot w-[7px] h-[7px] rounded-full bg-mint shadow-[0_0_0_0_rgba(110,231,168,0.6)] -mr-[10px]"></span>
        <span>SYS NOMINAL</span>
        <span>
          BATT{" "}
          <b id="hb" className="text-ink font-normal">
            100
          </b>
          %
        </span>
        <span>
          FPS{" "}
          <b id="hf" className="text-ink font-normal">
            60
          </b>
        </span>
      </div>
      <div
        className="hud-progress absolute top-0 inset-x-0 h-[2px]"
        aria-hidden="true"
      >
        <span
          id="hudProg"
          className="block h-full w-full bg-amber origin-left scale-x-0 shadow-[0_0_10px_var(--amber)]"
        ></span>
      </div>
      <i
        className="hud-corner c1 absolute w-[18px] h-[18px] border-line2 border-solid border-0 border-t border-l top-[10px] left-[10px] !pointer-events-none"
        aria-hidden="true"
      ></i>
      <i
        className="hud-corner c2 absolute w-[18px] h-[18px] border-line2 border-solid border-0 border-t border-r top-[10px] right-[10px] !pointer-events-none"
        aria-hidden="true"
      ></i>
      <i
        className="hud-corner c3 absolute w-[18px] h-[18px] border-line2 border-solid border-0 border-b border-l bottom-[10px] left-[10px] !pointer-events-none"
        aria-hidden="true"
      ></i>
      <i
        className="hud-corner c4 absolute w-[18px] h-[18px] border-line2 border-solid border-0 border-b border-r bottom-[10px] right-[10px] !pointer-events-none"
        aria-hidden="true"
      ></i>
    </header>
  );
}
