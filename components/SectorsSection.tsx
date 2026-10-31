const SECTORS = [
  {
    id: 0,
    num: "01",
    name: "Logistics & 3PL",
    tag: "HIGH-BAY",
    desc: "Autonomous pallet-to-dock and rack-to-pack movement across 24/7 fulfillment centers with zero floor modifications.",
    metrics: [
      { label: "THROUGHPUT", val: "+340%" },
      { label: "TOP MODULE", val: "PALLET LIFT" },
      { label: "FLEET", val: "50–200 UNITS" },
    ],
    img: "/assets/ind-logistics.jpg",
    alt: "NEXUS M2 in Logistics and 3PL Fulfillment Warehouse",
    thumbLabel: "01 · LOGISTICS",
    thumbAlt: "Logistics thumbnail",
    reticles: [
      { left: "24%", top: "28%", text: "RACK BAY A-14 · 14.2m" },
      { left: "51%", top: "62%", text: "NEXUS M2 · 920 kg PALLET" },
      { left: "78%", top: "42%", text: "AISLE CLEAR · 2.0 m/s" },
    ],
  },
  {
    id: 1,
    num: "02",
    name: "Automotive & EV",
    tag: "HEAVY DUTY",
    desc: "Just-in-sequence delivery of EV battery packs, sub-frames and powertrains directly to robotic welding and assembly cells.",
    metrics: [
      { label: "PAYLOAD", val: "1,000 KG" },
      { label: "TOP MODULE", val: "HEAVY CRADLE" },
      { label: "SYNC", val: "PLC / MES LIVE" },
    ],
    img: "/assets/ind-auto.jpg",
    alt: "NEXUS M2 in Automotive and EV Gigafactory",
    thumbLabel: "02 · AUTOMOTIVE",
    thumbAlt: "Automotive thumbnail",
    reticles: [
      { left: "22%", top: "36%", text: "WELD CELL 04 · SYNCED" },
      { left: "52%", top: "64%", text: "EV POWERTRAIN · 980 kg" },
      { left: "82%", top: "38%", text: "BIW STATION · ±3mm" },
    ],
  },
  {
    id: 2,
    num: "03",
    name: "Semiconductor Fab",
    tag: "ISO CLASS 5",
    desc: "Ultra-low-vibration, non-shedding motion across ESD anti-static cleanroom floors for wafer pods and precision optics.",
    metrics: [
      { label: "VIBRATION", val: "<0.02 G" },
      { label: "TOP MODULE", val: "FOUP CONVEYOR" },
      { label: "FLOOR", val: "ESD SAFE" },
    ],
    img: "/assets/ind-semi.jpg",
    alt: "NEXUS M2 in Semiconductor Cleanroom Fab",
    thumbLabel: "03 · SEMICONDUCTOR",
    thumbAlt: "Semiconductor thumbnail",
    reticles: [
      { left: "20%", top: "34%", text: "LITHO BAY · ISO-5" },
      { left: "54%", top: "63%", text: "VIBRATION DAMPED · 0.01G" },
      { left: "84%", top: "44%", text: "HUMAN DETECTED · SAFE SLOW" },
    ],
  },
  {
    id: 3,
    num: "04",
    name: "Pharma & Bio-Lab",
    tag: "GMP STERILE",
    desc: "Contamination-free transport between bioreactors, sterile fill-finish suites and cold-chain vaults with full audit traceability.",
    metrics: [
      { label: "COMPLIANCE", val: "21 CFR PT 11" },
      { label: "TOP MODULE", val: "STERILE ENCLOSURE" },
      { label: "TEMP", val: "−10° TO +45°C" },
    ],
    img: "/assets/ind-pharma.jpg",
    alt: "NEXUS M2 in Pharmaceutical and Biotech Facility",
    thumbLabel: "04 · PHARMA",
    thumbAlt: "Pharma thumbnail",
    reticles: [
      { left: "24%", top: "35%", text: "BIOREACTOR TANK · GMP" },
      { left: "52%", top: "64%", text: "SEALED CHASSIS · IP54" },
      { left: "68%", top: "36%", text: "COLD VAULT · +4.0°C" },
    ],
  },
  {
    id: 4,
    num: "05",
    name: "Aerospace & CNC",
    tag: "PRECISION",
    desc: "Moves titanium billets, turbine assemblies and heavy fixture plates between 5-axis machining centers with ±5 mm docking.",
    metrics: [
      { label: "DOCKING", val: "±5 MM" },
      { label: "TOP MODULE", val: "TWIN ROLLER DECK" },
      { label: "SHIFT", val: "24/7 AUTONOMOUS" },
    ],
    img: "/assets/ind-aero.jpg",
    alt: "NEXUS M2 in Aerospace and Heavy CNC Manufacturing",
    thumbLabel: "05 · AEROSPACE",
    thumbAlt: "Aerospace thumbnail",
    reticles: [
      { left: "22%", top: "34%", text: "5-AXIS CNC · DOCK READY" },
      { left: "52%", top: "64%", text: "TURBINE SPOOL · 860 kg" },
      { left: "70%", top: "42%", text: "FUSELAGE JIG · CLEAR" },
    ],
  },
];

export function SectorsSection() {
  return (
    <section
      className="sectors relative py-[14vh] px-[var(--pad)]"
      id="sectors"
      aria-labelledby="sectors-heading"
    >
      <div className="sec-head grid grid-cols-[1.25fr_1fr] max-[760px]:grid-cols-1 gap-10 items-end mb-14">
        <div>
          <p className="mono eyebrow" data-scramble="">
            06 — DEPLOYED SECTORS
          </p>
          <h2 id="sectors-heading" className="mt-4">
            Built for <em>every</em>
            <br />
            hostile floor.
          </h2>
        </div>
        <p className="sec-intro text-[#bdbab5] text-[17px] leading-[1.55] max-w-[480px]">
          From high-bay distribution hubs to ISO-5 wafer cleanrooms, NEXUS M2
          adapts its perception profile, speed envelope and top-deck tooling to
          the industry it serves.
        </p>
      </div>

      <div className="sec-grid grid grid-cols-[420px_1fr] max-[1100px]:grid-cols-1 gap-9 items-start">
        {/* Left: Interactive Sector Selector */}
        <div
          className="sec-list flex flex-col border-t border-line"
          id="secList"
          role="tablist"
          aria-label="Industrial sectors"
        >
          {SECTORS.map((sec, idx) => (
            <article
              key={sec.id}
              className={`sec-item relative border-b border-line py-5 px-[18px] cursor-pointer bg-transparent hover:bg-[rgba(255,138,31,0.03)] transition-[background,border-color] duration-350 ${
                idx === 0 ? "active" : ""
              }`}
              data-sec={sec.id}
              role="tab"
              aria-selected={idx === 0 ? "true" : "false"}
              tabIndex={0}
            >
              <div className="sec-row flex items-center gap-3.5">
                <span className="mono sec-num text-[11px] text-mute transition-colors duration-300">
                  {sec.num}
                </span>
                <h3 className="sec-name font-display font-bold text-[clamp(14px,1.15vw,18px)] leading-[1.2] tracking-[-0.02em] uppercase text-balance text-mute transition-colors duration-300 flex-1">
                  {sec.name}
                </h3>
                <span className="mono sec-tag text-[9px] py-[3px] px-[7px] border border-line2 text-mute tracking-[0.16em] transition-all duration-300">
                  {sec.tag}
                </span>
              </div>
              <div className="sec-body max-h-0 opacity-0 overflow-hidden transition-[max-height,opacity,margin-top] duration-550 ease-[var(--ease)]">
                <p className="text-[#bdbab5] text-[14px] leading-[1.55] mb-3.5">
                  {sec.desc}
                </p>
                <div className="sec-metrics mono flex flex-wrap gap-y-2.5 gap-x-4 text-[10px] text-ink">
                  {sec.metrics.map((m) => (
                    <span
                      key={m.label}
                      className="bg-[rgba(255,255,255,0.03)] border border-line py-1 px-2"
                    >
                      <b className="text-amber font-normal mr-1">{m.label}</b>{" "}
                      {m.val}
                    </span>
                  ))}
                </div>
                <div className="sec-prog relative h-[2px] bg-line mt-4 overflow-hidden">
                  <i className="sec-bar block h-full w-full bg-amber scale-x-0 origin-left"></i>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Right: Live Machine-POV Visual Stage */}
        <div
          className="sec-stage flex flex-col gap-3.5"
          id="secStage"
          data-cursor="INSPECT"
        >
          <div
            className="sec-viewport relative aspect-video w-full bg-[#070707] border border-line2 overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,138,31,0.06)]"
            id="secViewport"
          >
            <div className="sec-slides absolute inset-0">
              {SECTORS.map((sec, idx) => (
                <figure
                  key={sec.id}
                  className={`sec-slide absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-750 ease-[var(--ease)] ${
                    idx === 0 ? "active" : ""
                  }`}
                  data-sec={sec.id}
                >
                  <img
                    src={sec.img}
                    alt={sec.alt}
                    loading="lazy"
                    fetchPriority={idx === 0 ? undefined : "low"}
                    className="w-full h-full object-cover transition-transform duration-1200 ease-[var(--ease)] contrast-105 brightness-96"
                  />
                  {sec.reticles.map((ret) => (
                    <div
                      key={ret.text}
                      className="sec-reticle absolute z-[3] flex items-center gap-2 -translate-x-3 -translate-y-3 opacity-0 translate-y-2 transition-[opacity,translate] duration-500 ease-[var(--ease)] delay-250"
                      style={{ left: ret.left, top: ret.top }}
                    >
                      <i className="relative w-[22px] h-[22px] border border-amber rounded-full shrink-0 bg-[rgba(255,138,31,0.12)] shadow-[0_0_16px_rgba(255,138,31,0.45)]"></i>
                      <span className="mono text-[10px] max-[760px]:text-[8px] text-ink bg-[rgba(8,8,8,0.82)] border border-[rgba(255,138,31,0.4)] py-1 px-[9px] max-[760px]:py-[3px] max-[760px]:px-1.5 backdrop-blur-[6px] whitespace-nowrap tracking-[0.12em]">
                        {ret.text}
                      </span>
                    </div>
                  ))}
                </figure>
              ))}
            </div>

            {/* Machine HUD Overlay inside Viewport */}
            <div
              className="sec-scanline absolute left-0 right-0 -top-[10%] h-[2px] z-[4] bg-[linear-gradient(90deg,transparent,var(--amber),#fff,var(--amber),transparent)] shadow-[0_0_24px_4px_var(--amber)] opacity-0 pointer-events-none"
              aria-hidden="true"
            ></div>
            <div className="sec-hud-top mono absolute top-3.5 left-[18px] right-[18px] z-[4] flex justify-between items-center text-[10px] text-mute pointer-events-none">
              <span className="sec-live-badge inline-flex items-center gap-[7px] text-amber bg-[rgba(8,8,8,0.78)] py-1 px-2.5 border border-[rgba(255,138,31,0.35)]">
                <i className="w-1.5 h-1.5 rounded-full bg-amber shadow-[0_0_8px_var(--amber)]"></i>
                CAM_01 // SCENE LOCK
              </span>
              <span
                id="secEnvCode"
                className="bg-[rgba(8,8,8,0.78)] py-1 px-2.5 border border-line text-ink"
              >
                ENV // LOGISTICS_3PL_01
              </span>
            </div>
            <div className="sec-hud-bot mono absolute left-[18px] right-[18px] bottom-3.5 z-[4] grid grid-cols-4 gap-px bg-line border border-line text-[10px] pointer-events-none max-[760px]:hidden">
              <div className="bg-[rgba(8,8,8,0.86)] py-[9px] px-3 backdrop-blur-[6px]">
                <small className="block text-mute mb-[3px] text-[9px]">
                  SECTOR
                </small>
                <b id="secHudName" className="text-ink font-normal">
                  LOGISTICS &amp; 3PL
                </b>
              </div>
              <div className="bg-[rgba(8,8,8,0.86)] py-[9px] px-3 backdrop-blur-[6px]">
                <small className="block text-mute mb-[3px] text-[9px]">
                  SURFACE
                </small>
                <b id="secHudFloor" className="text-ink font-normal">
                  POLISHED EPOXY
                </b>
              </div>
              <div className="bg-[rgba(8,8,8,0.86)] py-[9px] px-3 backdrop-blur-[6px]">
                <small className="block text-mute mb-[3px] text-[9px]">
                  NAV PROFILE
                </small>
                <b id="secHudNav" className="text-ink font-normal">
                  DYNAMIC SLAM 20Hz
                </b>
              </div>
              <div className="bg-[rgba(8,8,8,0.86)] py-[9px] px-3 backdrop-blur-[6px]">
                <small className="block text-mute mb-[3px] text-[9px]">
                  SAFETY
                </small>
                <b className="text-ink font-normal">ISO 3691-4 PL-d</b>
              </div>
            </div>
            <i
              className="sec-corner sc1 absolute w-3 h-3 border-[1.5px] border-amber z-[4] pointer-events-none top-2 left-2 border-r-0 border-b-0"
              aria-hidden="true"
            ></i>
            <i
              className="sec-corner sc2 absolute w-3 h-3 border-[1.5px] border-amber z-[4] pointer-events-none top-2 right-2 border-l-0 border-b-0"
              aria-hidden="true"
            ></i>
            <i
              className="sec-corner sc3 absolute w-3 h-3 border-[1.5px] border-amber z-[4] pointer-events-none bottom-2 left-2 border-r-0 border-t-0"
              aria-hidden="true"
            ></i>
            <i
              className="sec-corner sc4 absolute w-3 h-3 border-[1.5px] border-amber z-[4] pointer-events-none bottom-2 right-2 border-l-0 border-t-0"
              aria-hidden="true"
            ></i>
          </div>

          {/* Thumbnail Strip */}
          <div
            className="sec-thumbs grid grid-cols-5 max-[760px]:grid-cols-3 gap-2.5"
            id="secThumbs"
          >
            {SECTORS.map((sec, idx) => (
              <button
                key={sec.id}
                type="button"
                className={`sec-thumb relative p-0 border border-line bg-[#090909] aspect-[16/10] overflow-hidden cursor-pointer text-left transition-[border-color,transform] duration-300 ${
                  idx === 0 ? "active" : ""
                }`}
                data-sec={sec.id}
              >
                <img
                  src={sec.img}
                  alt={sec.thumbAlt}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-45 grayscale-50 transition-[opacity,transform,filter] duration-350 ease-[var(--ease)]"
                />
                <span className="mono absolute left-1.5 right-1.5 bottom-[5px] text-[9px] text-ink bg-[rgba(6,6,6,0.82)] py-[3px] px-1.5 tracking-[0.1em] whitespace-nowrap overflow-hidden text-ellipsis">
                  {sec.thumbLabel}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
