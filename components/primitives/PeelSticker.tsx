"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  useInView,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Media from "./Media";
import { backEase } from "./PopWords";

const STROKE_COLOR = "var(--title-stroke-color, var(--card))";
const STROKE_DROP = `drop-shadow(0.35vw 0 0 ${STROKE_COLOR}) drop-shadow(-0.35vw 0 0 ${STROKE_COLOR}) drop-shadow(0 0.35vw 0 ${STROKE_COLOR}) drop-shadow(0 -0.35vw 0 ${STROKE_COLOR})`;
const SHADOW_DROP = "drop-shadow(0 0.6vw 0.8vw color-mix(in srgb, var(--foreground) 28%, transparent))";

export interface PeelStickerProps {
  imageSrc: string;
  imageAlt?: string;
  rotate?: number;
  delay?: number;
  cutout?: boolean;
  scrub?: [number, number];
  className?: string;
}

const RoundSticker: React.FC<PeelStickerProps> = ({
  imageSrc,
  imageAlt = "",
  rotate = 0,
  delay = 0,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const inView = useInView(containerRef, { once: true, margin: "0px 0px -5% 0px" });

  return (
    <div
      ref={containerRef}
      role={imageAlt ? "img" : undefined}
      aria-label={imageAlt || undefined}
      aria-hidden={imageAlt ? undefined : true}
      className={cn("relative select-none", className)}
    >
      <motion.div
        initial={shouldReduceMotion ? false : { scale: 0, rotate: rotate + 18, opacity: 0 }}
        animate={
          inView || shouldReduceMotion
            ? { scale: 1, rotate, opacity: 1 }
            : { scale: 0, rotate: rotate + 18, opacity: 0 }
        }
        transition={{
          duration: 0.6,
          delay,
          ease: backEase(2.35),
          opacity: { duration: 0.2, delay },
        }}
        className="size-full overflow-hidden rounded-full shadow-[0_0_0_0.6vw_var(--title-stroke-color,var(--card))]"
      >
        <Media src={imageSrc} alt="" draggable={false} className="size-full object-cover" />
      </motion.div>
    </div>
  );
};

const CutoutSticker: React.FC<PeelStickerProps> = ({
  imageSrc,
  imageAlt = "",
  rotate = 0,
  delay = 0,
  scrub,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const progressVal = useMotionValue(1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [[scrub?.[0] ?? 0, 0.5], [scrub?.[1] ?? 1, 0.5]],
  });

  const springProgress = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 0]),
    { stiffness: 120, damping: 30 }
  );

  const activeProgress = scrub && !shouldReduceMotion ? springProgress : progressVal;
  const inView = useInView(containerRef, { once: true, margin: "0px 0px -30% 0px" });

  const clipTop = useTransform(activeProgress, (v) => `inset(${v * 100}% -30% -30% -30%)`);
  const clipBottom = useTransform(activeProgress, (v) => `inset(-30% -30% ${100 - v * 100}% -30%)`);
  const originY = useTransform(activeProgress, (v) => v / 2);
  const scale = useTransform(activeProgress, [0, 1], [1, 1.06]);

  useEffect(() => {
    if (shouldReduceMotion) {
      progressVal.set(0);
      return;
    }
    if (!inView || scrub) return;
    const anim = animate(progressVal, 0, {
      duration: 0.8,
      delay,
      ease: [0.33, 1, 0.68, 1],
    });
    return () => anim.stop();
  }, [inView, shouldReduceMotion, delay, progressVal, scrub]);

  const stickerImg = (
    <Media
      src={imageSrc}
      alt=""
      draggable={false}
      style={{ filter: STROKE_DROP }}
      className="size-full object-contain"
    />
  );

  return (
    <motion.div
      ref={containerRef}
      role={imageAlt ? "img" : undefined}
      aria-label={imageAlt || undefined}
      aria-hidden={imageAlt ? undefined : true}
      style={{ rotate, scale }}
      className={cn("relative select-none", className)}
    >
      <motion.div style={{ clipPath: clipTop, filter: SHADOW_DROP }} className="absolute inset-0">
        {stickerImg}
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{
          clipPath: clipBottom,
          scaleY: -1,
          originY,
          filter: `brightness(0) invert(0.7) ${SHADOW_DROP}`,
        }}
        className="pointer-events-none absolute inset-0"
      >
        {stickerImg}
      </motion.div>
    </motion.div>
  );
};

export const PeelSticker: React.FC<PeelStickerProps> = (props) => {
  return props.cutout ? <CutoutSticker {...props} /> : <RoundSticker {...props} />;
};

export default PeelSticker;
