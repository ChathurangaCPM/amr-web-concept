export function DriveSection() {
  return (
    <section
      className="drive py-[14vh] px-[var(--pad)]"
      id="drive"
      aria-labelledby="drive-heading"
    >
      <div className="drive-head grid grid-cols-[1.3fr_1fr] max-[760px]:grid-cols-1 gap-10 items-end mb-12">
        <div>
          <p className="mono eyebrow" data-scramble="">
            05 — TAKE THE WHEEL
          </p>
          <h2 id="drive-heading" className="mt-4">
            Don&apos;t watch it.
            <br />
            <em>Command</em> it.
          </h2>
        </div>
        <p className="drive-copy text-[#bdbab5] text-[17px] leading-[1.55] max-w-[460px]">
          This is a live simulation. Click anywhere on the floor — NEXUS plans a
          route, scans for obstacles and builds its map as it goes. Leave it
          alone and it patrols on its own.
        </p>
      </div>
      <div
        className="drive-wrap relative h-[78vh] min-h-[520px] border border-line bg-[#080808] overflow-hidden"
        data-cursor="SET TARGET"
      >
        <canvas
          id="driveCanvas"
          className="block w-full h-full"
          aria-label="Interactive NEXUS M2 autonomous navigation and SLAM simulation floor"
        ></canvas>
        <div className="drive-hud mono absolute right-4 top-[14px] grid grid-cols-4 max-[1100px]:grid-cols-2 max-[760px]:hidden gap-px bg-line border border-line text-[10px]">
          <div className="bg-[rgba(8,8,8,0.9)] py-[10px] px-[14px] min-w-[110px]">
            <small className="block text-mute mb-1">MODE</small>
            <b id="dMode" className="text-ink font-normal">
              AUTO PATROL
            </b>
          </div>
          <div className="bg-[rgba(8,8,8,0.9)] py-[10px] px-[14px] min-w-[110px]">
            <small className="block text-mute mb-1">SPEED</small>
            <b id="dSpeed" className="text-ink font-normal">
              0.00
            </b>{" "}
            m/s
          </div>
          <div className="bg-[rgba(8,8,8,0.9)] py-[10px] px-[14px] min-w-[110px]">
            <small className="block text-mute mb-1">ROUTE</small>
            <b id="dRoute" className="text-ink font-normal">
              —
            </b>
          </div>
          <div className="bg-[rgba(8,8,8,0.9)] py-[10px] px-[14px] min-w-[110px]">
            <small className="block text-mute mb-1">MAPPED</small>
            <b id="dMap" className="text-ink font-normal">
              0
            </b>{" "}
            pts
          </div>
        </div>
        <button
          type="button"
          className="drive-btn mono absolute left-4 bottom-4 py-3 px-[18px] bg-transparent text-ink border border-line2 text-[11px] transition-colors duration-300 hover:bg-amber hover:text-black hover:border-amber"
          id="driveShuffle"
          data-magnetic=""
        >
          ↻ NEW FLOOR
        </button>
      </div>
    </section>
  );
}
