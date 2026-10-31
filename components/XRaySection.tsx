import type { CSSProperties } from "react";

export function XRaySection() {
  return (
    <section
      className="xray relative h-[300vh]"
      id="anatomy"
      aria-labelledby="xray-heading"
    >
      <div className="xray-sticky sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden">
        <div className="xray-head absolute top-[12vh] left-[var(--pad)]">
          <p className="mono eyebrow">03 — X-RAY</p>
          <h2 id="xray-heading" className="mt-[14px]">
            Look <em>inside.</em>
          </h2>
        </div>

        <div
          className="xr-stage relative w-[min(1180px,88vw,230vh)] aspect-[398/147] mt-[22vh]"
          id="xrStage"
          style={{ "--p": 0 } as CSSProperties}
        >
          <img
            className="xr-photo absolute inset-0 w-full h-full object-cover"
            src="/assets/side.jpg"
            alt="NEXUS M2 side profile"
            loading="lazy"
          />
          <div className="xr-layer absolute inset-0">
            <img
              className="xr-photo xr-neg absolute inset-0 w-full h-full object-cover"
              src="/assets/side.jpg"
              alt=""
              aria-hidden="true"
              loading="lazy"
            />
            <svg
              className="xr-wire absolute inset-0 w-full h-full overflow-visible"
              viewBox="0 0 398 147"
              aria-hidden="true"
            >
              <g className="dim">
                <line x1="20" y1="10" x2="378" y2="10" />
                <line x1="20" y1="6" x2="20" y2="14" />
                <line x1="378" y1="6" x2="378" y2="14" />
                <text x="199" y="7" textAnchor="middle">
                  1200 mm
                </text>
              </g>
              <path d="M26 29 L372 29 Q378 29 378 36 L378 100 Q378 108 370 108 L28 108 Q20 108 20 100 L20 36 Q20 29 26 29 Z" />
              <line x1="20" y1="38" x2="378" y2="38" />
              <line x1="20" y1="96" x2="378" y2="96" />
              <g className="part">
                <rect x="58" y="48" width="96" height="40" rx="2" />
                <line x1="70" y1="48" x2="70" y2="88" />
                <line x1="82" y1="48" x2="82" y2="88" />
                <line x1="94" y1="48" x2="94" y2="88" />
                <line x1="106" y1="48" x2="106" y2="88" />
                <line x1="118" y1="48" x2="118" y2="88" />
                <line x1="130" y1="48" x2="130" y2="88" />
                <line x1="142" y1="48" x2="142" y2="88" />
              </g>
              <g className="part">
                <rect x="244" y="46" width="72" height="26" rx="2" />
                <rect x="268" y="51" width="24" height="16" />
                <line x1="250" y1="52" x2="262" y2="52" />
                <line x1="250" y1="58" x2="262" y2="58" />
                <line x1="250" y1="64" x2="262" y2="64" />
                <line x1="298" y1="52" x2="310" y2="52" />
                <line x1="298" y1="58" x2="310" y2="58" />
                <line x1="298" y1="64" x2="310" y2="64" />
              </g>
              <g className="part">
                <circle cx="197" cy="88" r="31" />
                <circle cx="197" cy="88" r="22" />
                <circle cx="197" cy="88" r="7" />
                <line x1="197" y1="57" x2="197" y2="119" />
                <line x1="166" y1="88" x2="228" y2="88" />
              </g>
              <g className="fan">
                <path d="M22 70 L-38 36 M22 70 L-38 104 M22 70 L-42 70" />
                <path d="M376 70 L436 36 M376 70 L436 104 M376 70 L440 70" />
              </g>
              <circle cx="46" cy="104" r="5" />
              <circle cx="352" cy="104" r="5" />
              <line
                className="part"
                x1="40"
                y1="31"
                x2="358"
                y2="31"
                strokeDasharray="3 3"
              />
            </svg>
          </div>
          <div
            className="xr-beam absolute -top-[12%] -bottom-[12%] left-[calc(var(--p)*1%)] w-[2px] -ml-px bg-amber shadow-[0_0_18px_3px_var(--amber),0_0_80px_10px_rgba(255,138,31,0.35)] z-[5]"
            aria-hidden="true"
          >
            <span
              className="mono absolute -top-[26px] left-1/2 -translate-x-1/2 text-[11px] text-amber"
              id="xrPct"
            >
              000
            </span>
          </div>

          <div
            className="xr-call up left absolute z-[6]"
            data-x="6"
            style={{ "--x": "6%", "--y": "48%" } as CSSProperties}
          >
            <i className="absolute w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-amber shadow-[0_0_0_5px_rgba(255,138,31,0.2)] scale-0 transition-transform duration-500 ease-expo"></i>
            <span className="ld absolute left-0 w-px bg-amber h-0 transition-[height] duration-600 ease-expo delay-100"></span>
            <div className="xr-label absolute left-1/2 w-[210px] max-[760px]:w-[110px] -translate-x-1/2 text-[14px] max-[760px]:text-[11px] leading-[1.3] opacity-0 translate-y-[10px] transition-[opacity,translate] duration-500 ease-expo delay-350">
              <b className="block font-mono font-semibold text-[10px] text-amber tracking-[0.2em] mb-1">
                01
              </b>
              Safety LiDAR — front
              <small className="block font-mono font-normal text-[10px] text-mute tracking-[0.08em] mt-1 uppercase max-[760px]:hidden">
                PL-d rated protective field
              </small>
            </div>
          </div>
          <div
            className="xr-call down absolute z-[6]"
            data-x="27"
            style={{ "--x": "27%", "--y": "46%" } as CSSProperties}
          >
            <i className="absolute w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-amber shadow-[0_0_0_5px_rgba(255,138,31,0.2)] scale-0 transition-transform duration-500 ease-expo"></i>
            <span className="ld absolute left-0 w-px bg-amber h-0 transition-[height] duration-600 ease-expo delay-100"></span>
            <div className="xr-label absolute left-1/2 w-[210px] max-[760px]:w-[110px] -translate-x-1/2 text-[14px] max-[760px]:text-[11px] leading-[1.3] opacity-0 translate-y-[10px] transition-[opacity,translate] duration-500 ease-expo delay-350">
              <b className="block font-mono font-semibold text-[10px] text-amber tracking-[0.2em] mb-1">
                02
              </b>
              LiFePO₄ power core
              <small className="block font-mono font-normal text-[10px] text-mute tracking-[0.08em] mt-1 uppercase max-[760px]:hidden">
                48 V · hot-swappable · 10 h
              </small>
            </div>
          </div>
          <div
            className="xr-call up absolute z-[6]"
            data-x="40"
            style={{ "--x": "40%", "--y": "21%" } as CSSProperties}
          >
            <i className="absolute w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-amber shadow-[0_0_0_5px_rgba(255,138,31,0.2)] scale-0 transition-transform duration-500 ease-expo"></i>
            <span className="ld absolute left-0 w-px bg-amber h-0 transition-[height] duration-600 ease-expo delay-100"></span>
            <div className="xr-label absolute left-1/2 w-[210px] max-[760px]:w-[110px] -translate-x-1/2 text-[14px] max-[760px]:text-[11px] leading-[1.3] opacity-0 translate-y-[10px] transition-[opacity,translate] duration-500 ease-expo delay-350">
              <b className="block font-mono font-semibold text-[10px] text-amber tracking-[0.2em] mb-1">
                03
              </b>
              Universal top deck
              <small className="block font-mono font-normal text-[10px] text-mute tracking-[0.08em] mt-1 uppercase max-[760px]:hidden">
                M8 bolt grid · module bus
              </small>
            </div>
          </div>
          <div
            className="xr-call down absolute z-[6]"
            data-x="50"
            style={{ "--x": "49.5%", "--y": "60%" } as CSSProperties}
          >
            <i className="absolute w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-amber shadow-[0_0_0_5px_rgba(255,138,31,0.2)] scale-0 transition-transform duration-500 ease-expo"></i>
            <span className="ld absolute left-0 w-px bg-amber h-0 transition-[height] duration-600 ease-expo delay-100"></span>
            <div className="xr-label absolute left-1/2 w-[210px] max-[760px]:w-[110px] -translate-x-1/2 text-[14px] max-[760px]:text-[11px] leading-[1.3] opacity-0 translate-y-[10px] transition-[opacity,translate] duration-500 ease-expo delay-350">
              <b className="block font-mono font-semibold text-[10px] text-amber tracking-[0.2em] mb-1">
                04
              </b>
              Differential hub drive
              <small className="block font-mono font-normal text-[10px] text-mute tracking-[0.08em] mt-1 uppercase max-[760px]:hidden">
                Dual brushless · 2.0 m/s
              </small>
            </div>
          </div>
          <div
            className="xr-call up absolute z-[6]"
            data-x="70"
            style={{ "--x": "70%", "--y": "40%" } as CSSProperties}
          >
            <i className="absolute w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-amber shadow-[0_0_0_5px_rgba(255,138,31,0.2)] scale-0 transition-transform duration-500 ease-expo"></i>
            <span className="ld absolute left-0 w-px bg-amber h-0 transition-[height] duration-600 ease-expo delay-100"></span>
            <div className="xr-label absolute left-1/2 w-[210px] max-[760px]:w-[110px] -translate-x-1/2 text-[14px] max-[760px]:text-[11px] leading-[1.3] opacity-0 translate-y-[10px] transition-[opacity,translate] duration-500 ease-expo delay-350">
              <b className="block font-mono font-semibold text-[10px] text-amber tracking-[0.2em] mb-1">
                05
              </b>
              Edge AI brain
              <small className="block font-mono font-normal text-[10px] text-mute tracking-[0.08em] mt-1 uppercase max-[760px]:hidden">
                On-board path planning
              </small>
            </div>
          </div>
          <div
            className="xr-call down right absolute z-[6]"
            data-x="94"
            style={{ "--x": "94%", "--y": "48%" } as CSSProperties}
          >
            <i className="absolute w-[10px] h-[10px] -mt-[5px] -ml-[5px] rounded-full bg-amber shadow-[0_0_0_5px_rgba(255,138,31,0.2)] scale-0 transition-transform duration-500 ease-expo"></i>
            <span className="ld absolute left-0 w-px bg-amber h-0 transition-[height] duration-600 ease-expo delay-100"></span>
            <div className="xr-label absolute left-1/2 w-[210px] max-[760px]:w-[110px] -translate-x-1/2 text-[14px] max-[760px]:text-[11px] leading-[1.3] opacity-0 translate-y-[10px] transition-[opacity,translate] duration-500 ease-expo delay-350">
              <b className="block font-mono font-semibold text-[10px] text-amber tracking-[0.2em] mb-1">
                06
              </b>
              Safety LiDAR — rear
              <small className="block font-mono font-normal text-[10px] text-mute tracking-[0.08em] mt-1 uppercase max-[760px]:hidden">
                Full 360° coverage
              </small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
