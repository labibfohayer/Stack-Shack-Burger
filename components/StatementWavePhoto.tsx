"use client";

import React, { useRef, useState, useEffect, useId } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useTime,
  useReducedMotion,
} from "framer-motion";
import clsx from "clsx";
import Media from "./primitives/Media";
import { computeWavePoints, generateWaveSvgPath } from "./primitives/WaveEdge";

export interface StatementWavePhotoProps {
  imageSrc: string;
  imageAlt?: string;
  label?: string;
  edges?: "both" | "top" | "bottom";
  bottomColor?: string;
  ariaLabel?: string;
  className?: string;
}

export const StatementWavePhoto: React.FC<StatementWavePhotoProps> = ({
  imageSrc,
  imageAlt = "",
  label,
  edges = "both",
  bottomColor,
  ariaLabel,
  className,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clipId = useId().replace(/:/g, "");
  const shouldReduceMotion = useReducedMotion();
  const time = useTime();

  const [dims, setDims] = useState({ w: 0, h: 0, wave: 0 });
  const [isReady, setIsReady] = useState(false);

  const hasTop = edges === "both" || edges === "top";
  const hasBottom = edges === "both" || edges === "bottom";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const waveScaleSpring = useSpring(
    useTransform(scrollYProgress, [0.1, 0.9], [1, 1.5]),
    { stiffness: 120, damping: 30 }
  );

  const wavePoints = useTransform(time, (t) =>
    computeWavePoints(shouldReduceMotion ? 0 : t / 1000)
  );

  const clipPathData = useTransform(() => {
    const pts = wavePoints.get();
    const scale = shouldReduceMotion ? 1 : waveScaleSpring.get();
    const { w, h, wave } = dims;
    if (!w || !h) return "M0,0 H0 V0 Z";

    const subPaths: string[] = [`M-2,-10 H${w + 2} V${h + 10} H-2 Z`];

    if (hasTop) {
      subPaths.push(generateWaveSvgPath(pts, "bottom", w, wave, scale, -10));
    }
    if (hasBottom) {
      subPaths.push(generateWaveSvgPath(pts, "top", w, wave, scale, h - wave + 10));
    }

    return subPaths.join(" ");
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const waveH = Math.min(300, Math.max(80, window.innerWidth * 0.16));
      setDims({ w: el.clientWidth, h: el.clientHeight, wave: waveH });
      setIsReady(true);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel || imageAlt || "Photo"}
      style={bottomColor ? { background: bottomColor } : undefined}
      className={clsx(
        "relative isolate h-[110vh] max-md:h-[85vh] [--wave-h:clamp(5rem,16vw,18.75rem)]",
        className
      )}
    >
      <div
        ref={containerRef}
        className={clsx(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10",
          hasTop ? "-top-[var(--wave-h)]" : "top-0"
        )}
      >
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0 block"
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <motion.path d={clipPathData} clipRule="evenodd" />
            </clipPath>
          </defs>
        </svg>

        <div
          style={{ clipPath: `url(#${clipId})` }}
          className={clsx(
            "absolute inset-0 overflow-hidden transition-opacity duration-300",
            !isReady && "opacity-0"
          )}
        >
          <motion.div
            style={shouldReduceMotion ? { scale: 1.06 } : { y: parallaxY, scale: 1.06 }}
            className="absolute inset-0 size-full"
          >
            <Media
              src={imageSrc}
              alt={imageAlt}
              aria-hidden={!imageAlt}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </motion.div>
        </div>
      </div>

      {label && (
        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 mx-auto flex w-[var(--container)] -translate-y-1/2 justify-center">
          <p className="pointer-events-auto max-w-full -rotate-[7deg] text-center font-[family-name:var(--font-display,var(--font-heading))] text-[length:calc(var(--text-h3)*1.6)] leading-[0.85] uppercase text-accent [-webkit-text-stroke:calc(var(--title-stroke,0.067em)*3)_var(--title-stroke-color,var(--card))] [paint-order:stroke_fill] [overflow-wrap:anywhere]">
            {label}
          </p>
        </div>
      )}
    </section>
  );
};

export default StatementWavePhoto;
