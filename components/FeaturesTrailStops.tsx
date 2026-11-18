"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import clsx from "clsx";
import Media from "./primitives/Media";
import MaskedLineReveal from "./primitives/MaskedLineReveal";
import NudgeOnLeave from "./primitives/NudgeOnLeave";
import { backEase } from "./primitives/PopWords";
import WaveEdge from "./primitives/WaveEdge";
import { LocationItem } from "@/data/restaurantData";

const ROTATIONS = [-8, 6, -10, 12, -6, 9];
const MARGIN_CLASSES = [
  "lg:ml-[68%]",
  "lg:ml-[30%]",
  "lg:ml-[56%]",
  "lg:ml-[10%]",
  "lg:ml-[72%]",
  "lg:ml-[38%]",
];

interface Point {
  x: number;
  y: number;
}

const buildSplineCurve = (points: Point[]): string => {
  if (points.length < 2) return "";
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const prev = points[i - 1] ?? points[i];
    const curr = points[i];
    const next = points[i + 1];
    const after = points[i + 2] ?? next;
    const cp1 = {
      x: curr.x + (next.x - prev.x) / 6,
      y: curr.y + (next.y - prev.y) / 6,
    };
    const cp2 = {
      x: next.x - (after.x - curr.x) / 6,
      y: next.y - (after.y - curr.y) / 6,
    };
    d += ` C${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${next.x},${next.y}`;
  }
  return d;
};

interface TrailStopCardProps {
  item: LocationItem;
  index: number;
  isShown: boolean;
}

const TrailStopCard: React.FC<TrailStopCardProps> = ({
  item,
  index,
  isShown,
}) => {
  const rot = ROTATIONS[index % ROTATIONS.length];
  const maxTitleWord = Math.max(
    5,
    ...item.title.split(/\s+/).map((w) => w.length)
  );

  return (
    <div
      data-stop={true}
      className={clsx(
        "relative z-10 flex w-[46vw] flex-col items-center [container-type:inline-size] lg:w-[clamp(11rem,14vw,16rem)]",
        MARGIN_CLASSES[index % MARGIN_CLASSES.length],
        index % 2 ? "self-end lg:self-auto" : "self-start lg:self-auto"
      )}
    >
      <NudgeOnLeave rotate={rot * 0.5} className="flex w-full flex-col items-center">
        <motion.div
          initial={false}
          animate={
            isShown
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 0, scale: 0.8, rotate: rot * 2 }
          }
          transition={{ duration: 0.45, ease: backEase(2.2), delay: 0 }}
          className="w-full"
        >
          <div
            data-stop-photo={true}
            className="aspect-[14/17] w-full overflow-hidden rounded-[var(--radius)]"
          >
            <Media
              src={item.imageSrc}
              alt={item.imageAlt || ""}
              aria-hidden={!item.imageAlt}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="size-full object-cover"
            />
          </div>
        </motion.div>

        <motion.h3
          initial={false}
          animate={
            isShown
              ? { opacity: 1, scale: 1, rotate: rot * 0.5 }
              : { opacity: 0, scale: 0.6, rotate: rot * 2 }
          }
          transition={{ duration: 0.45, ease: backEase(2.2), delay: 0.08 }}
          style={{
            fontSize: `min(calc(var(--text-h3)*0.8), ${(
              100 /
              (maxTitleWord * 0.72 + 0.9)
            ).toFixed(2)}cqw)`,
          }}
          className="-mt-[0.9em] max-w-full text-center font-[family-name:var(--font-display,var(--font-heading))] leading-[0.9] uppercase text-primary [-webkit-text-stroke:calc(var(--title-stroke,0.067em)*2)_var(--title-stroke-color,var(--card))] [paint-order:stroke_fill] [overflow-wrap:anywhere]"
        >
          {item.title}
        </motion.h3>
      </NudgeOnLeave>

      {item.description && (
        <motion.p
          initial={false}
          animate={isShown ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
          className="mt-[0.5em] text-center text-[length:var(--text-body)] leading-[1.2] lg:hidden"
        >
          {item.description}
        </motion.p>
      )}
    </div>
  );
};

export interface FeaturesTrailStopsProps {
  label?: string;
  title: string;
  description?: string;
  items: LocationItem[];
  edges?: "both" | "top" | "bottom";
  topColor?: string;
  ariaLabel?: string;
  className?: string;
}

export const FeaturesTrailStops: React.FC<FeaturesTrailStopsProps> = ({
  label,
  title,
  description,
  items,
  edges = "both",
  topColor = "var(--background)",
  ariaLabel,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const stopProgressThresholds = useRef<number[]>([]);
  const pathTotalLength = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  const [pathData, setPathData] = useState({ d: "", w: 0, h: 0 });
  const [unlockedStops, setUnlockedStops] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [[0, 0.4], [1, 0.6]],
  });

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  });

  const hasTop = edges === "both" || edges === "top";
  const hasBottom = edges === "both" || edges === "bottom";

  // Build path between stop photos
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measureAndBuild = () => {
      const containerRect = el.getBoundingClientRect();
      const photoEls = Array.from(
        el.querySelectorAll<HTMLElement>("[data-stop-photo]")
      );
      const points: Point[] = photoEls.map((p) => {
        const r = p.getBoundingClientRect();
        return {
          x: r.left - containerRect.left + r.width / 2,
          y: r.top - containerRect.top + r.height / 2,
        };
      });

      if (!points.length) return;

      const startPt = { x: containerRect.width * 0.5, y: 0 };
      const lastPt = points[points.length - 1];
      const endPt = {
        x: lastPt.x > containerRect.width / 2 ? containerRect.width * 0.2 : containerRect.width * 0.8,
        y: containerRect.height,
      };

      setPathData({
        d: buildSplineCurve([startPt, ...points, endPt]),
        w: containerRect.width,
        h: containerRect.height,
      });
    };

    measureAndBuild();
    const ro = new ResizeObserver(measureAndBuild);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  const updateMarker = (p: number) => {
    const path = pathRef.current;
    const marker = markerRef.current;
    if (!path || !marker || !pathData.d) return;

    const totalLen = pathTotalLength.current || path.getTotalLength();
    const currentDist = p * totalLen;
    const pt = path.getPointAtLength(currentDist);
    const ahead = path.getPointAtLength(Math.min(totalLen, currentDist + 2));
    const behind = path.getPointAtLength(Math.max(0, currentDist - 2));
    const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;

    marker.style.transform = `translate(${pt.x}px, ${pt.y}px) translate(-50%, -50%) rotate(${angle}deg)`;
    marker.style.opacity = shouldReduceMotion || p < 0.005 || p > 0.995 ? "0" : "1";

    const passedCount = stopProgressThresholds.current.filter((th) => p >= th).length;
    setUnlockedStops((prev) => Math.max(prev, passedCount));
  };

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;
    if (!path || !container || !pathData.d) return;

    const totalLen = path.getTotalLength();
    pathTotalLength.current = totalLen;

    const samples = Array.from({ length: 241 }, (_, i) =>
      path.getPointAtLength((i / 240) * totalLen)
    );

    const cRect = container.getBoundingClientRect();
    const photoEls = Array.from(
      container.querySelectorAll<HTMLElement>("[data-stop-photo]")
    );

    stopProgressThresholds.current = photoEls.map((photo) => {
      const pRect = photo.getBoundingClientRect();
      const targetX = pRect.left - cRect.left + pRect.width / 2;
      const targetY = pRect.top - cRect.top + pRect.height / 2;

      let bestIdx = 0;
      let minDistance = Infinity;

      samples.forEach((sample, sIdx) => {
        const distSq = (sample.x - targetX) ** 2 + (sample.y - targetY) ** 2;
        if (distSq < minDistance) {
          minDistance = distSq;
          bestIdx = sIdx;
        }
      });

      return Math.max(0, bestIdx / 240 - 0.04);
    });

    updateMarker(springProgress.get());
  }, [pathData.d]);

  useMotionValueEvent(springProgress, "change", updateMarker);

  const shownCount = shouldReduceMotion ? items.length : unlockedStops;

  return (
    <section
      aria-label={ariaLabel || title}
      data-scene={true}
      className={clsx(
        "relative isolate z-[1] overflow-x-clip bg-secondary text-secondary-foreground [--wave-h:clamp(5rem,16vw,18.75rem)]",
        hasBottom && "mb-[calc(var(--wave-h)*0.55)]",
        className
      )}
    >
      {hasTop && <WaveEdge side="top" inside={true} color={topColor} />}
      {hasBottom && <WaveEdge side="bottom" className="text-secondary" />}

      <div
        className={clsx(
          "relative mx-auto w-[var(--container)] pb-[var(--section-space)]",
          hasTop
            ? "pt-[calc(var(--section-space)+var(--wave-h)*0.6)]"
            : "pt-[var(--section-space)]"
        )}
      >
        {/* Section Header */}
        <div className="relative z-20 flex max-w-[80vw] flex-col items-start max-md:max-w-full">
          {label && (
            <p className="relative z-10 mb-[0.5em] w-fit max-w-full -rotate-[7deg] font-[family-name:var(--font-display,var(--font-heading))] text-[length:var(--text-h3)] leading-[0.9] uppercase text-accent [-webkit-text-stroke:calc(var(--title-stroke,0.067em)*3)_var(--title-stroke-color,var(--card))] [paint-order:stroke_fill]">
              {label}
            </p>
          )}

          <h2 className="w-full text-balance font-[family-name:var(--font-heading)] text-[length:var(--text-h1)] font-[var(--heading-weight)] leading-[var(--heading-leading)] tracking-[var(--heading-tracking)] uppercase text-[color:var(--title-stroke-color,var(--card))] [-webkit-text-stroke:var(--title-stroke,0.067em)_color-mix(in_srgb,var(--accent)_30%,transparent)] [paint-order:stroke_fill] [overflow-wrap:break-word]">
            {title}
          </h2>

          {description && (
            <MaskedLineReveal
              text={description}
              tag="p"
              delay={0.25}
              duration={1.4}
              stagger={0.15}
              from="100%"
              ease={[0.23, 1, 0.32, 1]}
              margin="0px 0px -15% 0px"
              className="mt-[calc(var(--gap)*2)] w-full max-w-[34rem] text-[length:var(--text-body-lg)] leading-[1.2]"
            />
          )}
        </div>

        {/* Trail Stops & Path */}
        <div
          ref={containerRef}
          className="relative mt-[calc(var(--section-space)*0.6)] pt-[calc(var(--section-space)*0.6)] pb-[calc(var(--section-space)*0.6)]"
        >
          {/* Animated SVG Path Line */}
          <svg
            aria-hidden="true"
            width={pathData.w}
            height={pathData.h}
            className="pointer-events-none absolute inset-0 overflow-visible text-accent"
          >
            <path
              ref={pathRef}
              d={pathData.d}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.5}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray="42 42"
            />
          </svg>

          {/* Traveling Plane Marker */}
          <div
            ref={markerRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-[5] opacity-0"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[clamp(4rem,9vw,8rem)] rotate-90 overflow-visible text-primary"
            >
              <path
                d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
                fill="currentColor"
                stroke="var(--title-stroke-color, var(--card))"
                strokeWidth={1.2}
                strokeLinejoin="round"
                paintOrder="stroke fill"
              />
            </svg>
          </div>

          {/* Stop Cards List */}
          <div className="relative flex flex-col gap-[calc(var(--gap)*4)] lg:gap-[4vw]">
            {items.map((item, idx) => (
              <TrailStopCard
                key={idx}
                item={item}
                index={idx}
                isShown={idx < shownCount}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesTrailStops;
