"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export const SmoothScroll: React.FC = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      autoRaf: true,
    });

    if (typeof window !== "undefined") {
      (window as any).__lenis = lenis;
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).__lenis;
      }
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
