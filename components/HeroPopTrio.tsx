"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import Media from "./primitives/Media";
import MaskedLineReveal from "./primitives/MaskedLineReveal";
import NudgeOnLeave from "./primitives/NudgeOnLeave";
import PopWords, { backEase } from "./primitives/PopWords";
import PeelSticker from "./primitives/PeelSticker";
import { MediaItem, CtaButton } from "@/data/restaurantData";

const ITEM_POSITIONS = [
  { tilt: -7, place: "lg:left-[3vw] lg:top-[24%] lg:w-[16vw]" },
  { tilt: 6, place: "lg:right-[3vw] lg:top-[13%] lg:w-[15vw]" },
  { tilt: -4, place: "lg:right-[11vw] lg:bottom-[5%] lg:w-[12.5vw]" },
  { tilt: 5, place: "lg:left-[12vw] lg:bottom-[4%] lg:w-[11.5vw]" },
];

export interface HeroPopTrioProps {
  label?: string;
  title: string;
  description?: string;
  cta?: CtaButton;
  items: MediaItem[];
  sticker?: MediaItem;
  introDelay?: number;
  ariaLabel?: string;
  className?: string;
}

export const HeroPopTrio: React.FC<HeroPopTrioProps> = ({
  label,
  title,
  description,
  cta,
  items,
  sticker,
  introDelay = 0,
  ariaLabel,
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const visibleItems = items.slice(0, ITEM_POSITIONS.length);

  return (
    <section
      aria-label={ariaLabel || "Hero"}
      className={cn(
        "relative isolate overflow-x-clip pt-[calc(var(--section-space)*1.5)] pb-[var(--section-space)] text-foreground lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center",
        className
      )}
    >
      {/* Central Content */}
      <div className="relative z-10 mx-auto flex w-[var(--container)] flex-col items-center text-center">
        {label && (
          <PopWords
            text={label}
            tag="p"
            immediate={true}
            delay={introDelay}
            className="relative z-10 mb-[0.5em] w-fit max-w-full -rotate-[5deg] font-[family-name:var(--font-display,var(--font-heading))] text-[length:var(--text-h3)] leading-[0.9] uppercase text-primary [-webkit-text-stroke:calc(var(--title-stroke,0em)*3)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]"
          />
        )}

        <PopWords
          text={title}
          tag="h1"
          immediate={true}
          delay={introDelay + 0.15}
          size="var(--hero-size)"
          className="w-full max-w-full text-balance lg:max-w-[60vw] [--hero-size:min(var(--text-display),15vw)] lg:[--hero-size:min(var(--text-display),10.5vw)] font-[family-name:var(--font-heading)] font-[var(--heading-weight)] leading-[var(--heading-leading)] tracking-[var(--heading-tracking)] uppercase text-primary [-webkit-text-stroke:var(--title-stroke,0em)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill] [overflow-wrap:break-word]"
        />

        {description && (
          <MaskedLineReveal
            text={description}
            tag="p"
            immediate={true}
            delay={introDelay + 0.4}
            duration={1.4}
            stagger={0.15}
            from="100%"
            ease={[0.23, 1, 0.32, 1]}
            className="mt-[calc(var(--gap)*2)] w-full max-w-[38rem] text-[length:var(--text-body-lg)] leading-[1.35]"
          />
        )}

        {cta && (
          <Link href={cta.href} className="btn-primary mt-[calc(var(--gap)*2.5)]">
            {cta.text}
          </Link>
        )}
      </div>

      {/* Floating Surrounding Items */}
      <div className="relative mx-auto mt-[calc(var(--gap)*4)] flex w-[var(--container)] justify-center lg:pointer-events-none lg:absolute lg:inset-0 lg:mt-0 lg:w-full">
        {visibleItems.map((item, idx) => {
          const config = ITEM_POSITIONS[idx];
          return (
            <motion.div
              key={idx}
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, scale: 0.4, y: 40 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.7,
                ease: backEase(2.2),
                delay: introDelay + 0.45 + idx * 0.1,
                opacity: { duration: 0.25, delay: introDelay + 0.45 + idx * 0.1 },
              }}
              className={cn(
                "relative w-[30%] max-w-[15rem] lg:pointer-events-auto lg:absolute lg:max-w-none",
                idx % 2 ? "mt-[calc(var(--gap)*3)] -ml-[2%]" : "-ml-[2%] first:ml-0",
                "lg:m-0",
                config.place
              )}
            >
              <NudgeOnLeave
                rotate={config.tilt}
                className="aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-card)] shadow-[0_0_0_clamp(4px,0.45vw,7px)_var(--title-stroke-color,var(--card))]"
              >
                <Media
                  src={item.imageSrc}
                  alt={item.imageAlt || ""}
                  aria-hidden={!item.imageAlt}
                  draggable={false}
                  className="size-full object-cover"
                />
              </NudgeOnLeave>
            </motion.div>
          );
        })}

        {sticker && (
          <PeelSticker
            imageSrc={sticker.imageSrc}
            imageAlt={sticker.imageAlt}
            cutout={sticker.cutout}
            rotate={-8}
            delay={introDelay + 0.8}
            className={cn(
              "absolute -top-[6vw] left-[6%] z-10 aspect-square w-[18vw] max-w-[8rem] lg:pointer-events-auto lg:max-w-none",
              visibleItems.length < ITEM_POSITIONS.length
                ? "lg:top-auto lg:bottom-[9%] lg:left-[12vw] lg:w-[10.5vw]"
                : "lg:top-[16%] lg:left-[14.5vw] lg:w-[8vw]"
            )}
          />
        )}
      </div>
    </section>
  );
};

export default HeroPopTrio;
