export function RouteSection() {
  return (
    <section
      className="route relative h-[600vh]"
      id="route"
      aria-labelledby="route-heading"
    >
      <div className="route-sticky sticky top-0 h-screen overflow-hidden">
        <div
          className="route-track absolute top-0 left-0 h-full will-change-transform"
          id="routeTrack"
        >
          <div
            className="route-floor absolute inset-0"
            aria-hidden="true"
          ></div>
          <svg
            className="route-svg absolute inset-0 w-full h-full overflow-visible"
            id="routeSvg"
            aria-hidden="true"
          >
            <g id="routeRacks"></g>
            <path
              id="routeBase"
              className="route-base fill-none stroke-white/14 stroke-2 [stroke-dasharray:2_10] [stroke-linecap:round]"
            />
            <path
              id="routeLive"
              className="route-live fill-none stroke-amber stroke-[3] drop-shadow-[0_0_8px_var(--amber)] [stroke-linecap:round]"
            />
          </svg>

          <div className="wp absolute left-0 top-0 z-[4]" data-wp="1">
            <i
              className="wp-dot absolute w-[14px] h-[14px] -mt-[7px] -ml-[7px] rounded-full border border-line2 bg-bg transition-all duration-500 ease-expo"
              aria-hidden="true"
            ></i>
            <div className="wp-card absolute left-[30px] w-[340px] max-[760px]:w-[250px] p-[26px_26px_22px] max-[760px]:p-[18px] border border-line bg-[rgba(10,10,10,0.72)] backdrop-blur-[10px] opacity-[0.18] translate-y-[20px] blur-[2px] transition-all duration-800 ease-expo">
              <span className="mono wp-num text-[10px] text-amber">
                WAYPOINT 01
              </span>
              <h3 className="font-display font-bold text-[44px] max-[760px]:text-[32px] leading-none tracking-[-0.04em] mt-3 mb-[14px] uppercase">
                Perceive.
              </h3>
              <p className="text-[#bdbab5] leading-[1.5] text-[15px] max-[760px]:text-[13px]">
                Dual safety LiDARs and four depth cameras merge into one living
                3D picture of the floor. Nothing sneaks up on it.
              </p>
              <span className="mono wp-stat inline-block mt-[18px] text-[11px] px-[10px] py-[6px] border border-amber/35 text-amber2">
                360° · 20 Hz · 30 m range
              </span>
            </div>
          </div>
          <div className="wp absolute left-0 top-0 z-[4]" data-wp="2">
            <i
              className="wp-dot absolute w-[14px] h-[14px] -mt-[7px] -ml-[7px] rounded-full border border-line2 bg-bg transition-all duration-500 ease-expo"
              aria-hidden="true"
            ></i>
            <div className="wp-card absolute left-[30px] w-[340px] max-[760px]:w-[250px] p-[26px_26px_22px] max-[760px]:p-[18px] border border-line bg-[rgba(10,10,10,0.72)] backdrop-blur-[10px] opacity-[0.18] translate-y-[20px] blur-[2px] transition-all duration-800 ease-expo">
              <span className="mono wp-num text-[10px] text-amber">
                WAYPOINT 02
              </span>
              <h3 className="font-display font-bold text-[44px] max-[760px]:text-[32px] leading-none tracking-[-0.04em] mt-3 mb-[14px] uppercase">
                Map.
              </h3>
              <p className="text-[#bdbab5] leading-[1.5] text-[15px] max-[760px]:text-[13px]">
                Natural-feature SLAM. No magnetic tape, no QR stickers, no floor
                surgery. Drive it once — it remembers forever.
              </p>
              <span className="mono wp-stat inline-block mt-[18px] text-[11px] px-[10px] py-[6px] border border-amber/35 text-amber2">
                ±5 mm docking accuracy
              </span>
            </div>
          </div>
          <div className="wp absolute left-0 top-0 z-[4]" data-wp="3">
            <i
              className="wp-dot absolute w-[14px] h-[14px] -mt-[7px] -ml-[7px] rounded-full border border-line2 bg-bg transition-all duration-500 ease-expo"
              aria-hidden="true"
            ></i>
            <div className="wp-card absolute left-[30px] w-[340px] max-[760px]:w-[250px] p-[26px_26px_22px] max-[760px]:p-[18px] border border-line bg-[rgba(10,10,10,0.72)] backdrop-blur-[10px] opacity-[0.18] translate-y-[20px] blur-[2px] transition-all duration-800 ease-expo">
              <span className="mono wp-num text-[10px] text-amber">
                WAYPOINT 03
              </span>
              <h3 className="font-display font-bold text-[44px] max-[760px]:text-[32px] leading-none tracking-[-0.04em] mt-3 mb-[14px] uppercase">
                Lift.
              </h3>
              <p className="text-[#bdbab5] leading-[1.5] text-[15px] max-[760px]:text-[13px]">
                A flat, bolt-ready deck takes rollers, lifts, conveyors or
                racks. Low profile, heavy heart.
              </p>
              <span className="mono wp-stat inline-block mt-[18px] text-[11px] px-[10px] py-[6px] border border-amber/35 text-amber2">
                1,000 kg payload
              </span>
            </div>
          </div>
          <div className="wp absolute left-0 top-0 z-[4]" data-wp="4">
            <i
              className="wp-dot absolute w-[14px] h-[14px] -mt-[7px] -ml-[7px] rounded-full border border-line2 bg-bg transition-all duration-500 ease-expo"
              aria-hidden="true"
            ></i>
            <div className="wp-card absolute left-[30px] w-[340px] max-[760px]:w-[250px] p-[26px_26px_22px] max-[760px]:p-[18px] border border-line bg-[rgba(10,10,10,0.72)] backdrop-blur-[10px] opacity-[0.18] translate-y-[20px] blur-[2px] transition-all duration-800 ease-expo">
              <span className="mono wp-num text-[10px] text-amber">
                WAYPOINT 04
              </span>
              <h3 className="font-display font-bold text-[44px] max-[760px]:text-[32px] leading-none tracking-[-0.04em] mt-3 mb-[14px] uppercase">
                Flow.
              </h3>
              <p className="text-[#bdbab5] leading-[1.5] text-[15px] max-[760px]:text-[13px]">
                One robot is a tool. A hundred is choreography. Fleet
                orchestration routes every unit around every other — live.
              </p>
              <span className="mono wp-stat inline-block mt-[18px] text-[11px] px-[10px] py-[6px] border border-amber/35 text-amber2">
                100+ units per site
              </span>
            </div>
          </div>
          <div className="wp absolute left-0 top-0 z-[4]" data-wp="5">
            <i
              className="wp-dot absolute w-[14px] h-[14px] -mt-[7px] -ml-[7px] rounded-full border border-line2 bg-bg transition-all duration-500 ease-expo"
              aria-hidden="true"
            ></i>
            <div className="wp-card absolute left-[30px] w-[340px] max-[760px]:w-[250px] p-[26px_26px_22px] max-[760px]:p-[18px] border border-line bg-[rgba(10,10,10,0.72)] backdrop-blur-[10px] opacity-[0.18] translate-y-[20px] blur-[2px] transition-all duration-800 ease-expo">
              <span className="mono wp-num text-[10px] text-amber">
                WAYPOINT 05
              </span>
              <h3 className="font-display font-bold text-[44px] max-[760px]:text-[32px] leading-none tracking-[-0.04em] mt-3 mb-[14px] uppercase">
                Recharge.
              </h3>
              <p className="text-[#bdbab5] leading-[1.5] text-[15px] max-[760px]:text-[13px]">
                It knows when it&apos;s tired. It docks itself between missions
                and is back before anyone notices it left.
              </p>
              <span className="mono wp-stat inline-block mt-[18px] text-[11px] px-[10px] py-[6px] border border-amber/35 text-amber2">
                0 → 80% in 45 min
              </span>
            </div>
          </div>

          <div
            className="route-bot absolute left-0 top-0 w-0 h-0 z-[5] will-change-transform max-[760px]:scale-70"
            id="routeBot"
          >
            <div
              className="rb-orient absolute left-0 top-0 w-0 h-0"
              id="rbOrient"
            >
              <div
                className="rb-sweep absolute left-0 top-0 w-[360px] h-[360px] -mt-[180px] -ml-[180px] rounded-full"
                aria-hidden="true"
              ></div>
              <div
                className="rb-ring absolute left-0 top-0 w-[300px] h-[300px] -mt-[150px] -ml-[150px] rounded-full border border-amber/28"
                aria-hidden="true"
              ></div>
              <div
                className="rb-ring r2 absolute left-0 top-0 w-[300px] h-[300px] -mt-[150px] -ml-[150px] rounded-full border border-amber/28"
                aria-hidden="true"
              ></div>
              <div
                className="rb-beam absolute left-[82px] top-0 w-[300px] h-[150px] -mt-[75px]"
                aria-hidden="true"
              ></div>
              <svg
                className="rb-svg absolute -left-[84px] -top-[58px] w-[168px] h-[116px] overflow-visible"
                viewBox="0 0 168 116"
                role="img"
                aria-label="NEXUS M2 seen from above"
              >
                <defs>
                  <linearGradient id="rbRim" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f4f1ec" />
                    <stop offset=".5" stopColor="#d9d5ce" />
                    <stop offset="1" stopColor="#a9a49c" />
                  </linearGradient>
                  <linearGradient id="rbDeck" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#262626" />
                    <stop offset=".55" stopColor="#141414" />
                    <stop offset="1" stopColor="#0c0c0c" />
                  </linearGradient>
                  <filter
                    id="rbGlow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="2.2" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter
                    id="rbShadow"
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                  >
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>
                <rect
                  x="10"
                  y="14"
                  width="152"
                  height="96"
                  rx="16"
                  fill="#000"
                  opacity=".75"
                  filter="url(#rbShadow)"
                />
                <rect
                  x="68"
                  y="2"
                  width="32"
                  height="8"
                  rx="3"
                  fill="#1c1c1c"
                />
                <rect
                  x="68"
                  y="106"
                  width="32"
                  height="8"
                  rx="3"
                  fill="#1c1c1c"
                />
                <rect
                  x="6"
                  y="6"
                  width="156"
                  height="104"
                  rx="15"
                  fill="url(#rbRim)"
                />
                <rect
                  x="155"
                  y="30"
                  width="6"
                  height="56"
                  rx="2"
                  fill="#0b0b0b"
                />
                <rect
                  x="157.5"
                  y="38"
                  width="1.4"
                  height="40"
                  rx=".7"
                  fill="#ff8a1f"
                  opacity=".7"
                />
                <rect
                  x="7"
                  y="34"
                  width="5"
                  height="48"
                  rx="2"
                  fill="#0b0b0b"
                />
                <rect
                  x="11"
                  y="10"
                  width="146"
                  height="96"
                  rx="12"
                  fill="url(#rbDeck)"
                />
                <rect
                  x="11.5"
                  y="10.5"
                  width="145"
                  height="95"
                  rx="11.5"
                  fill="none"
                  stroke="rgba(255,255,255,.09)"
                />
                <path d="M84 16 V100" stroke="rgba(255,255,255,.05)" />
                <rect
                  x="30"
                  y="28"
                  width="108"
                  height="60"
                  rx="5"
                  fill="none"
                  stroke="rgba(255,255,255,.05)"
                />
                <g
                  fill="#050505"
                  stroke="rgba(255,255,255,.14)"
                  strokeWidth=".8"
                >
                  <rect x="22" y="20" width="6" height="6" rx="1" />
                  <rect x="140" y="20" width="6" height="6" rx="1" />
                  <rect x="22" y="90" width="6" height="6" rx="1" />
                  <rect x="140" y="90" width="6" height="6" rx="1" />
                  <circle cx="84" cy="20" r="2" />
                  <circle cx="84" cy="96" r="2" />
                </g>
                <rect
                  x="54"
                  y="41"
                  width="60"
                  height="34"
                  rx="4"
                  fill="#0b0c0f"
                  stroke="rgba(255,138,31,.35)"
                  strokeWidth=".9"
                />
                <image
                  href="/assets/logo.png"
                  x="60"
                  y="45"
                  width="48"
                  height="26"
                  preserveAspectRatio="xMidYMid meet"
                  filter="url(#rbGlow)"
                />
                <g
                  fill="none"
                  stroke="#ffa340"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  filter="url(#rbGlow)"
                >
                  <path d="M12 30 V20 Q12 11 21 11 H32" />
                  <path d="M136 11 H147 Q156 11 156 20 V30" />
                  <path d="M156 86 V96 Q156 105 147 105 H136" />
                  <path d="M32 105 H21 Q12 105 12 96 V86" />
                </g>
                <g fill="#fff" filter="url(#rbGlow)">
                  <rect x="159" y="18" width="3" height="9" rx="1.5" />
                  <rect x="159" y="89" width="3" height="9" rx="1.5" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <div className="route-hud absolute left-[var(--pad)] top-[15vh] z-[6] pointer-events-none">
          <p className="mono eyebrow">02 — THE ROUTE</p>
          <h2
            id="route-heading"
            className="route-title text-[clamp(36px,5vw,80px)] mt-4"
          >
            Follow
            <br />
            the machine.
          </h2>
        </div>
        <div
          className="route-readout mono absolute right-[var(--pad)] top-[15vh] z-[6] flex gap-10 text-right max-[760px]:hidden"
          aria-hidden="true"
        >
          <div className="">
            <small className="block text-[10px] text-mute mb-[6px]">
              WAYPOINT
            </small>
            <b
              id="wpCount"
              className="font-display font-light text-[48px] leading-none tracking-[-0.03em]"
            >
              00
            </b>
            <span className="text-mute text-[12px] ml-1">/05</span>
          </div>
          <div className="w-[150px]">
            <small className="block text-[10px] text-mute mb-[6px]">
              ODOMETER
            </small>
            <b
              id="wpDist"
              className="font-display font-light text-[48px] leading-none tracking-[-0.03em]"
            >
              0.0
            </b>
            <span className="text-mute text-[12px] ml-1">m</span>
          </div>
        </div>
      </div>
    </section>
  );
}
