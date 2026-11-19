"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import clsx from "clsx";
import Media from "./primitives/Media";
import MaskedLineReveal from "./primitives/MaskedLineReveal";
import { MediaItem } from "@/data/restaurantData";

const LAYER_CONFIGS = [
  {
    place: "left-[5vw] top-[5vw] w-[24vw] max-md:left-0 max-md:top-0 max-md:w-[30vw] z-10",
    factor: -0.06,
  },
  {
    place: "right-[5vw] top-[18vw] w-[18vw] max-md:right-0 max-md:top-[22%] max-md:w-[26vw] z-10",
    factor: -0.07,
  },
  {
    place: "left-[4vw] top-[37vw] w-[23vw] max-md:left-0 max-md:top-[55%] max-md:w-[28vw] z-10",
    factor: -0.05,
  },
  {
    place: "right-[6vw] bottom-[-4vw] w-[20vw] max-md:right-0 max-md:bottom-0 max-md:w-[26vw] z-10",
    factor: -0.09,
  },
];

interface FloatingLayerItemProps {
  item: MediaItem;
  index: number;
  progress: MotionValue<number>;
  sectionRef: React.RefObject<HTMLElement | null>;
}

const FloatingLayerItem: React.FC<FloatingLayerItemProps> = ({
  item,
  index,
  progress,
  sectionRef,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const config = LAYER_CONFIGS[index % LAYER_CONFIGS.length];

  const yVal = useTransform(progress, (p) => {
    const sectionH = sectionRef.current?.offsetHeight ?? 0;
    const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
    return p * config.factor * (sectionH + windowH);
  });

  return (
    <motion.div
      style={shouldReduceMotion ? undefined : { y: yVal }}
      className={clsx(
        "pointer-events-none absolute aspect-square",
        config.place,
        !item.cutout && "z-[5]"
      )}
    >
      {item.cutout ? (
        <Media
          src={item.imageSrc}
          alt={item.imageAlt || ""}
          aria-hidden={!item.imageAlt}
          loading="lazy"
          decoding="async"
          className="size-full object-contain"
        />
      ) : (
        <div className="size-full overflow-hidden rounded-full shadow-[0_0_0_0.5vw_var(--title-stroke-color,var(--card))]">
          <Media
            src={item.imageSrc}
            alt={item.imageAlt || ""}
            aria-hidden={!item.imageAlt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </div>
      )}
    </motion.div>
  );
};

export interface StatementCutoutLayersProps {
  label?: string;
  titleLines: string[];
  items?: MediaItem[];
  ariaLabel?: string;
  className?: string;
}

export const StatementCutoutLayers: React.FC<StatementCutoutLayersProps> = ({
  label,
  titleLines,
  items = [],
  ariaLabel,
  className,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const maxLineLen = Math.max(
    6,
    ...titleLines.flatMap((line) => line.split(/\s+/).map((w) => w.length))
  );

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel || titleLines.join(" ")}
      className={clsx(
        "relative isolate overflow-x-clip py-[var(--section-space)] text-foreground",
        className
      )}
    >
      <div className="mx-auto flex w-[var(--container)] flex-col items-center text-center">
        {label && (
          <p className="relative z-50 mb-[0.5em] w-fit max-w-full -rotate-[7deg] font-[family-name:var(--font-display,var(--font-heading))] text-[length:var(--text-h3)] leading-[0.9] uppercase text-primary [-webkit-text-stroke:calc(var(--title-stroke,0em)*3)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]">
            {label}
          </p>
        )}

        <div className="relative w-full md:min-h-[54vw]">
          <div
            style={
              {
                "--fit": `${(100 / (maxLineLen * 0.56)).toFixed(2)}cqw`,
              } as React.CSSProperties
            }
            className="relative z-[30] mx-auto w-full max-w-[60vw] [container-type:inline-size] max-md:max-w-full"
          >
            <MaskedLineReveal
              text={titleLines.join(" ")}
              tag="h2"
              duration={1.4}
              stagger={0.15}
              from="100%"
              ease={[0.23, 1, 0.32, 1]}
              margin="0px 0px -15% 0px"
              className="w-full font-[family-name:var(--font-heading)] text-[length:min(var(--text-h1),var(--fit))] font-[var(--heading-weight)] leading-[var(--heading-leading)] tracking-[var(--heading-tracking)] [&>div]:-mt-[0.3em] [&>div]:pt-[0.3em] uppercase text-primary [-webkit-text-stroke:var(--title-stroke,0em)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill] [overflow-wrap:break-word]"
            />
          </div>

          {items.slice(0, 4).map((item, idx) => (
            <FloatingLayerItem
              key={idx}
              item={item}
              index={idx}
              progress={scrollYProgress}
              sectionRef={sectionRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatementCutoutLayers;
