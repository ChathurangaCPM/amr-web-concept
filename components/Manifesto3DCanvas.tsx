"use client";

import { useEffect, useRef } from "react";

export function Manifesto3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    import("@/lib/manifesto3d").then(({ initManifesto3D }) => {
      if (cancelled || !containerRef.current) return;
      cleanup = initManifesto3D(containerRef.current);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="mf-3d-container"
      className="relative z-[1] w-full h-full cursor-grab active:cursor-grabbing"
      role="img"
      aria-label="Interactive Three.js 3D robotics mechanism simulation"
    />
  );
}

