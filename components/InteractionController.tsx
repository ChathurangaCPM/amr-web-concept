"use client";

import { useEffect } from "react";
import { initInteractions } from "@/lib/interactions";

export function InteractionController() {
  useEffect(() => {
    const cleanup = initInteractions();
    return cleanup;
  }, []);

  return null;
}

