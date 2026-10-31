export function BootSequence() {
  return (
    <div
      id="boot"
      aria-hidden="true"
      className="fixed inset-0 z-[200] grid place-items-center font-mono pointer-events-auto"
    >
      <div className="shutter top absolute inset-x-0 top-0 h-[50.5%] bg-[#050505] transition-transform duration-[1100ms] ease-expo"></div>
      <div className="shutter bottom absolute inset-x-0 bottom-0 h-[50.5%] bg-[#050505] transition-transform duration-[1100ms] ease-expo"></div>
      <div className="boot-line absolute inset-x-0 top-1/2 h-px bg-amber shadow-[0_0_20px_2px_var(--amber)] scale-x-0 transition-[transform,opacity] duration-500 ease-expo"></div>
      <div className="boot-inner relative w-[min(560px,88vw)] transition-[opacity,transform] duration-500 ease-expo">
        <div className="boot-head flex items-center gap-3 text-[12px] tracking-[0.3em] text-ink mb-7">
          <img
            src="/assets/logo.png"
            alt=""
            className="logo-mark w-[38px] h-auto object-contain drop-shadow-[0_0_8px_rgba(255,138,31,0.4)]"
          />
          <span>INFINITUDE&nbsp;OS</span>
        </div>
        <div
          className="boot-term h-[210px] overflow-hidden text-[12px] leading-[1.75] text-mute"
          id="bootTerm"
        ></div>
        <div className="boot-foot flex items-center gap-[18px] mt-6">
          <div className="boot-bar flex-1 h-[2px] bg-line overflow-hidden">
            <span
              id="bootFill"
              className="block h-full w-0 bg-amber shadow-[0_0_12px_var(--amber)]"
            ></span>
          </div>
          <div
            className="boot-pct text-[34px] font-display font-light text-ink min-w-[3ch] text-right"
            id="bootPct"
          >
            000
          </div>
        </div>
      </div>
    </div>
  );
}
