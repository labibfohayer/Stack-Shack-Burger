"use client";

import React from "react";
import clsx from "clsx";
import Media from "./primitives/Media";
import MaskedLineReveal from "./primitives/MaskedLineReveal";
import PopWords from "./primitives/PopWords";
import PeelSticker from "./primitives/PeelSticker";
import WaveEdge from "./primitives/WaveEdge";
import { MediaItem } from "@/data/restaurantData";

export interface FeaturesMascotClaimsProps {
  label?: string;
  title: string;
  imageSrc: string;
  imageAlt?: string;
  cutout?: boolean;
  claimsLeft: string[];
  claimsRight: string[];
  badge?: string;
  stickers?: MediaItem[];
  edges?: "both" | "top" | "bottom";
  topColor?: string;
  ariaLabel?: string;
  className?: string;
}

export const FeaturesMascotClaims: React.FC<FeaturesMascotClaimsProps> = ({
  label,
  title,
  imageSrc,
  imageAlt = "",
  cutout = false,
  claimsLeft = [],
  claimsRight = [],
  badge,
  stickers = [],
  edges = "both",
  topColor = "var(--background)",
  ariaLabel,
  className,
}) => {
  const hasTopWave = edges === "both" || edges === "top";
  const hasBottomWave = edges === "both" || edges === "bottom";
  const [stickerLeft, stickerRight] = stickers;

  return (
    <section
      aria-label={ariaLabel || title}
      data-nav-theme="light"
      className={clsx(
        "relative isolate z-[1] overflow-x-clip bg-deep text-deep-foreground [--wave-h:clamp(5rem,16vw,18.75rem)]",
        hasBottomWave && "mb-[calc(var(--wave-h)*0.55)]",
        className
      )}
    >
      {hasTopWave && <WaveEdge side="top" inside={true} color={topColor} />}
      {hasBottomWave && <WaveEdge side="bottom" className="text-deep" />}

      <div
        className={clsx(
          "relative mx-auto w-[var(--container)]",
          hasBottomWave
            ? "pb-[calc(var(--section-space)+var(--wave-h)*0.8)]"
            : "pb-[var(--section-space)]",
          hasTopWave
            ? "pt-[calc(var(--section-space)+var(--wave-h)*0.6)]"
            : "pt-[var(--section-space)]"
        )}
      >
        {/* Floating stickers */}
        {stickerLeft && (
          <PeelSticker
            imageSrc={stickerLeft.imageSrc}
            imageAlt={stickerLeft.imageAlt}
            cutout={stickerLeft.cutout}
            className={clsx(
              "absolute left-[2vw] z-10 aspect-square w-[14vw] max-md:w-[22vw]",
              hasTopWave
                ? "top-[calc(var(--wave-h)*0.9)]"
                : "top-[var(--section-space)]"
            )}
          />
        )}

        {stickerRight && (
          <PeelSticker
            imageSrc={stickerRight.imageSrc}
            imageAlt={stickerRight.imageAlt}
            cutout={stickerRight.cutout}
            delay={0.15}
            className={clsx(
              "absolute right-0 z-10 aspect-square w-[16vw] max-md:w-[22vw]",
              hasTopWave
                ? "top-[calc(var(--wave-h)*1.9)] max-md:top-[calc(var(--wave-h)*0.9)]"
                : "top-[calc(var(--section-space)*2)]"
            )}
          />
        )}

        {/* Section Heading */}
        <div className="relative flex flex-col items-center text-center max-md:pt-[16vw]">
          {label && (
            <p className="relative z-0 mb-[calc(var(--text-h3)*0.9)] w-fit max-w-full -rotate-[8deg] font-[family-name:var(--font-display,var(--font-heading))] text-[length:var(--text-h3)] leading-[0.9] uppercase text-deep opacity-[0.65] [-webkit-text-stroke:calc(var(--title-stroke,0.067em)*3)_var(--title-stroke-color,var(--card))] [paint-order:stroke_fill]">
              {label}
            </p>
          )}

          <PopWords
            text={title}
            tag="h2"
            size="var(--text-h1)"
            className="relative z-10 w-full max-w-[75vw] max-md:max-w-full font-[family-name:var(--font-heading)] font-[var(--heading-weight)] leading-[var(--heading-leading)] tracking-[var(--heading-tracking)] uppercase text-balance [overflow-wrap:break-word]"
          />
        </div>

        {/* Center Burger & Claims */}
        <div className="relative mt-[calc(var(--section-space)*0.5)] grid grid-cols-2 gap-x-[var(--gap)] gap-y-[calc(var(--gap)*2)] lg:block">
          {/* Main Burger Visual */}
          <div
            className={clsx(
              "relative col-span-2 mx-auto max-w-none",
              cutout ? "w-full lg:w-[80vw]" : "w-[78%] lg:w-[46vw]"
            )}
          >
            {cutout ? (
              <Media
                src={imageSrc}
                alt={imageAlt}
                aria-hidden={!imageAlt}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-contain"
              />
            ) : (
              <div className="aspect-square w-full overflow-hidden rounded-full shadow-[0_0_0_0.6vw_var(--title-stroke-color,var(--card))]">
                <Media
                  src={imageSrc}
                  alt={imageAlt}
                  aria-hidden={!imageAlt}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>
            )}

            {/* Twice Smashed Badge */}
            {badge && (
              <p className="absolute bottom-[12%] right-[10%] w-min max-w-[40%] rotate-[15deg] text-center font-[family-name:var(--font-display,var(--font-heading))] text-[length:var(--text-h3)] leading-[0.85] uppercase text-accent [-webkit-text-stroke:calc(var(--title-stroke,0.067em)*3)_var(--title-stroke-color,var(--card))] [paint-order:stroke_fill] [overflow-wrap:break-word]">
                {badge}
              </p>
            )}
          </div>

          {/* Left Claims */}
          <div className="z-10 flex min-w-0 flex-col lg:absolute lg:bottom-[14%] lg:left-0">
            {claimsLeft.map((claim, idx) => (
              <MaskedLineReveal
                key={idx}
                text={claim}
                tag="p"
                delay={idx * 0.15}
                duration={1.4}
                from="100%"
                ease={[0.23, 1, 0.32, 1]}
                margin="0px 0px -15% 0px"
                className="font-[family-name:var(--font-heading)] text-[length:var(--text-body-lg)] leading-[1.1] uppercase whitespace-normal [overflow-wrap:anywhere] lg:whitespace-nowrap lg:[overflow-wrap:normal]"
              />
            ))}
          </div>

          {/* Right Claims */}
          <div className="z-10 flex min-w-0 flex-col text-right lg:absolute lg:bottom-[14%] lg:right-0">
            {claimsRight.map((claim, idx) => (
              <MaskedLineReveal
                key={idx}
                text={claim}
                tag="p"
                delay={idx * 0.15}
                duration={1.4}
                from="100%"
                ease={[0.23, 1, 0.32, 1]}
                margin="0px 0px -15% 0px"
                className="font-[family-name:var(--font-heading)] text-[length:var(--text-body-lg)] leading-[1.1] uppercase whitespace-normal [overflow-wrap:anywhere] lg:whitespace-nowrap lg:[overflow-wrap:normal]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesMascotClaims;
