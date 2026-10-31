export function Cursor() {
  return (
    <>
      <div
        className="cursor-ring fixed top-0 left-0 z-[300] pointer-events-none w-[42px] h-[42px] -mt-[21px] -ml-[21px] border border-white/35 rounded-full transition-[width,height,margin,background-color,border-color] duration-350 ease-expo"
        id="cursorRing"
        aria-hidden="true"
      >
        <span
          className="cursor-label absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono font-semibold text-[9px] tracking-[0.14em] text-black whitespace-nowrap opacity-0 transition-opacity duration-200"
          id="cursorLabel"
        ></span>
      </div>
      <div
        className="cursor-dot fixed top-0 left-0 z-[300] pointer-events-none w-[6px] h-[6px] -mt-[3px] -ml-[3px] bg-amber rounded-full"
        id="cursorDot"
        aria-hidden="true"
      ></div>
    </>
  );
}
