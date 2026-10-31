export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="infGrad" x1="0" x2="1">
          <stop offset="0" stopColor="#ff8a1f" />
          <stop offset=".55" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <symbol id="inf" viewBox="0 0 38 18">
          <image
            href="/assets/logo.png"
            width="38"
            height="18"
            preserveAspectRatio="xMidYMid meet"
          />
        </symbol>
      </defs>
    </svg>
  );
}
