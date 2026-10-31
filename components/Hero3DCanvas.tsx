"use client";

import { useEffect, useRef } from "react";

export function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    import("@/lib/hero3d").then(({ initHero3D }) => {
      if (cancelled || !containerRef.current) return;
      cleanup = initHero3D(containerRef.current);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="hero-3d-container"
      className="hb-3d relative z-[2] w-full h-full"
      role="img"
      aria-label="NEXUS M2 autonomous mobile robot interactive 3D model"
    />
  );
}
