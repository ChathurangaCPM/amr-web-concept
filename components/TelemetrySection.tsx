export function TelemetrySection() {
  return (
    <section
      className="specs py-[14vh] px-[var(--pad)]"
      id="specs"
      aria-labelledby="specs-heading"
    >
      <div className="specs-head">
        <p className="mono eyebrow" data-scramble="">
          07 — TELEMETRY
        </p>
        <h2 id="specs-heading" className="mt-4">
          The numbers
          <br />
          don&apos;t blink.
        </h2>
      </div>
      <div className="spec-grid grid grid-cols-4 max-[1100px]:grid-cols-2 gap-px bg-line border border-line mt-[60px]">
        <div className="spec rv big col-span-2 row-span-2 max-[760px]:col-span-2 relative bg-bg hover:bg-[#0f0d0b] pt-[30px] px-[26px] pb-[28px] min-h-[220px] flex flex-col overflow-hidden transition-colors duration-400 opacity-0 translate-y-10">
          <small className="mono text-[10px] text-amber">PAYLOAD</small>
          <b className="block mt-auto font-display font-light text-[clamp(80px,10vw,180px)] leading-none tracking-[-0.05em]">
            <span data-count="1000">1,000</span>
            <u className="no-underline text-[0.32em] text-mute ml-1.5 tracking-normal">
              kg
            </u>
          </b>
          <p className="mt-3 text-mute text-[14px]">
            Rated top load on the universal deck.
          </p>
          <canvas
            className="spark absolute left-0 right-0 top-[30%] w-full h-[40%] opacity-70 pointer-events-none"
            aria-hidden="true"
          ></canvas>
        </div>
        <div className="spec rv relative bg-bg hover:bg-[#0f0d0b] pt-[30px] px-[26px] pb-[28px] min-h-[220px] flex flex-col overflow-hidden transition-colors duration-400 opacity-0 translate-y-10">
          <small className="mono text-[10px] text-amber">TOP SPEED</small>
          <b className="block mt-auto font-display font-light text-[clamp(44px,4.6vw,76px)] leading-none tracking-[-0.05em]">
            <span data-count="2.0" data-dec="1">
              2.0
            </span>
            <u className="no-underline text-[0.32em] text-mute ml-1.5 tracking-normal">
              m/s
            </u>
          </b>
          <p className="mt-3 text-mute text-[14px]">
            Adaptive speed near people.
          </p>
        </div>
        <div className="spec rv relative bg-bg hover:bg-[#0f0d0b] pt-[30px] px-[26px] pb-[28px] min-h-[220px] flex flex-col overflow-hidden transition-colors duration-400 opacity-0 translate-y-10">
          <small className="mono text-[10px] text-amber">RUNTIME</small>
          <b className="block mt-auto font-display font-light text-[clamp(44px,4.6vw,76px)] leading-none tracking-[-0.05em]">
            <span data-count="10">10</span>
            <u className="no-underline text-[0.32em] text-mute ml-1.5 tracking-normal">
              h
            </u>
          </b>
          <p className="mt-3 text-mute text-[14px]">
            Per charge, typical duty cycle.
          </p>
        </div>
        <div className="spec rv relative bg-bg hover:bg-[#0f0d0b] pt-[30px] px-[26px] pb-[28px] min-h-[220px] flex flex-col overflow-hidden transition-colors duration-400 opacity-0 translate-y-10">
          <small className="mono text-[10px] text-amber">POSITIONING</small>
          <b className="block mt-auto font-display font-light text-[clamp(44px,4.6vw,76px)] leading-none tracking-[-0.05em]">
            ±<span data-count="5">5</span>
            <u className="no-underline text-[0.32em] text-mute ml-1.5 tracking-normal">
              mm
            </u>
          </b>
          <p className="mt-3 text-mute text-[14px]">
            Repeatable docking accuracy.
          </p>
        </div>
        <div className="spec rv relative bg-bg hover:bg-[#0f0d0b] pt-[30px] px-[26px] pb-[28px] min-h-[220px] flex flex-col overflow-hidden transition-colors duration-400 opacity-0 translate-y-10">
          <small className="mono text-[10px] text-amber">PERCEPTION</small>
          <b className="block mt-auto font-display font-light text-[clamp(44px,4.6vw,76px)] leading-none tracking-[-0.05em]">
            <span data-count="360">360</span>
            <u className="no-underline text-[0.32em] text-mute ml-1.5 tracking-normal">
              °
            </u>
          </b>
          <p className="mt-3 text-mute text-[14px]">
            LiDAR + 3D depth fusion.
          </p>
        </div>
        <div className="spec rv relative bg-bg hover:bg-[#0f0d0b] pt-[30px] px-[26px] pb-[28px] min-h-[220px] flex flex-col overflow-hidden transition-colors duration-400 opacity-0 translate-y-10">
          <small className="mono text-[10px] text-amber">FOOTPRINT</small>
          <b className="block mt-auto font-display font-light text-[clamp(44px,4.6vw,76px)] leading-none tracking-[-0.05em]">
            <span data-count="1200">1,200</span>
            <u className="no-underline text-[0.32em] text-mute ml-1.5 tracking-normal">
              ×800
            </u>
          </b>
          <p className="mt-3 text-mute text-[14px]">
            mm · pallet-native, 280 mm tall.
          </p>
        </div>
        <div className="spec rv relative bg-bg hover:bg-[#0f0d0b] pt-[30px] px-[26px] pb-[28px] min-h-[220px] flex flex-col overflow-hidden transition-colors duration-400 opacity-0 translate-y-10">
          <small className="mono text-[10px] text-amber">FAST CHARGE</small>
          <b className="block mt-auto font-display font-light text-[clamp(44px,4.6vw,76px)] leading-none tracking-[-0.05em]">
            <span data-count="45">45</span>
            <u className="no-underline text-[0.32em] text-mute ml-1.5 tracking-normal">
              min
            </u>
          </b>
          <p className="mt-3 text-mute text-[14px]">
            0 → 80% autonomous docking.
          </p>
        </div>
        <div className="spec rv wide col-span-2 relative bg-bg hover:bg-[#0f0d0b] pt-[30px] px-[26px] pb-[28px] min-h-[220px] flex flex-col overflow-hidden transition-colors duration-400 opacity-0 translate-y-10">
          <small className="mono text-[10px] text-amber">
            LIVE SIGNAL // DRIVE BUS
          </small>
          <canvas
            id="scope"
            aria-hidden="true"
            className="w-full h-[140px] mt-3.5 block"
          ></canvas>
        </div>
      </div>
      <p className="spec-note mono mt-4 text-[10px] text-dim">
        * Illustrative figures. Final specifications subject to configuration.
      </p>
    </section>
  );
}
