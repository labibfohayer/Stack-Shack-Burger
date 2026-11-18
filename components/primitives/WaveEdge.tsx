"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useTime,
  useReducedMotion,
} from "framer-motion";
import clsx from "clsx";

const PERIOD = 2.4;
const PHASES = [
  { delay: 0, duration: 1, from: [135, 65, 155], to: [155, 45, 175] },
  { delay: 0.3, duration: 2, from: [105, 137], to: [85, 160] },
  { delay: 0.6, duration: 1.8, from: [105, 105], to: [130, 80] },
];

const cosineEase = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export const computeWavePoints = (timeSec: number): number[] => {
  const modTime = timeSec % (PERIOD * 2);
  const mirroredTime = modTime > PERIOD ? PERIOD * 2 - modTime : modTime;

  return PHASES.flatMap((phase) => {
    const rawProgress = Math.min(1, Math.max(0, (mirroredTime - phase.delay) / phase.duration));
    const eased = cosineEase(rawProgress);
    return phase.from.map((fromVal, idx) => fromVal + (phase.to[idx] - fromVal) * eased);
  });
};

export const generateWaveSvgPath = (
  coords: number[],
  side: "top" | "bottom",
  width = 1536,
  height = 300,
  scale = 1,
  offsetY = 0
): string => {
  const [p0, p1, p2, p3, p4, p5, p6] = coords.map((v) => (v / 300) * height * scale);
  const scaleX = width / 1536;
  const mapY = (val: number) => offsetY + (side === "bottom" ? val : height - val);
  const baselineY = offsetY + (side === "bottom" ? 0 : height);

  return `M${width},${baselineY} H${-1 * scaleX} V${mapY(p0)} S${184.32 * scaleX},${mapY(
    p1
  )} ${460.8 * scaleX},${mapY(p2)} S${860.16 * scaleX},${mapY(p3)} ${1121.28 * scaleX},${mapY(
    p4
  )} S${1413.12 * scaleX},${mapY(p5)} ${width},${mapY(p6)} V${baselineY} Z`;
};

export interface WaveEdgeProps {
  side?: "top" | "bottom";
  inside?: boolean;
  color?: string;
  className?: string;
}

export const WaveEdge: React.FC<WaveEdgeProps> = ({
  side = "bottom",
  inside = false,
  color,
  className,
}) => {
  const edgeRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const time = useTime();

  const wavePoints = useTransform(time, (t) =>
    computeWavePoints(shouldReduceMotion ? 0 : t / 1000)
  );

  const effectiveSide = inside ? (side === "top" ? "bottom" : "top") : side;
  const pathData = useTransform(wavePoints, (pts) =>
    generateWaveSvgPath(pts, effectiveSide)
  );

  const { scrollYProgress } = useScroll({
    target: edgeRef,
    offset: ["start 0.9", "end 0.1"],
  });

  const springScale = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 1.5]),
    { stiffness: 120, damping: 30 }
  );

  return (
    <motion.div
      ref={edgeRef}
      aria-hidden="true"
      style={{
        scaleY: shouldReduceMotion ? 1 : springScale,
        originY: effectiveSide === "bottom" ? 0 : 1,
        color,
      }}
      className={clsx(
        "pointer-events-none absolute inset-x-0 z-10 h-[var(--wave-h,clamp(5rem,16vw,18.75rem))]",
        inside
          ? side === "top"
            ? "-top-px"
            : "-bottom-px"
          : side === "top"
          ? "bottom-[calc(100%-1px)]"
          : "top-[calc(100%-1px)]",
        className
      )}
    >
      <svg
        viewBox="0 0 1536 300"
        preserveAspectRatio="none"
        className="block size-full"
      >
        <motion.path d={pathData} fill="currentColor" />
      </svg>
    </motion.div>
  );
};

export default WaveEdge;
