"use client";

import React from "react";
import clsx from "clsx";
import Media from "./primitives/Media";
import MaskedLineReveal from "./primitives/MaskedLineReveal";
import PopWords from "./primitives/PopWords";
import PeelSticker from "./primitives/PeelSticker";
import { MediaItem, CtaButton } from "@/data/restaurantData";

export interface StatementStickerCtaProps {
  label?: string;
  title: string;
  description?: string;
  cta?: CtaButton;
  imageSrc: string;
  imageAlt?: string;
  sticker?: MediaItem;
  ariaLabel?: string;
  className?: string;
}

export const StatementStickerCta: React.FC<StatementStickerCtaProps> = ({
  label,
  title,
  description,
  cta,
  imageSrc,
  imageAlt = "",
  sticker,
  ariaLabel,
  className,
}) => {
  return (
    <section
      aria-label={ariaLabel || title}
      className={clsx(
        "relative isolate overflow-x-clip pt-[var(--section-space)] pb-[calc(var(--section-space)*1.2)] text-foreground",
        className
      )}
    >
      <div className="relative mx-auto grid w-[var(--container)] items-center gap-[calc(var(--gap)*3)] md:grid-cols-[minmax(0,1fr)_auto]">
        {/* Left Column: Heading & CTA */}
        <div className="relative z-20 flex min-w-0 flex-col items-start">
          {label && (
            <PopWords
              text={label}
              tag="p"
              className="relative z-10 mb-[0.5em] w-fit max-w-full -rotate-[7deg] font-[family-name:var(--font-display,var(--font-heading))] text-[length:var(--text-h3)] leading-[0.9] uppercase text-primary [-webkit-text-stroke:calc(var(--title-stroke,0em)*3)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]"
            />
          )}

          <PopWords
            text={title}
            tag="h2"
            size="var(--text-h1)"
            className="w-full font-[family-name:var(--font-heading)] font-[var(--heading-weight)] leading-[var(--heading-leading)] tracking-[var(--heading-tracking)] uppercase text-primary [-webkit-text-stroke:var(--title-stroke,0em)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill] [overflow-wrap:break-word]"
          />

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
              className="mt-[calc(var(--gap)*2)] w-full max-w-[32rem] text-[length:var(--text-body-lg)] leading-[1.35]"
            />
          )}

          {cta && (
            <a href={cta.href} className="btn-primary mt-[calc(var(--gap)*2.5)]">
              {cta.text}
            </a>
          )}
        </div>

        {/* Right Column: Hero Image */}
        <div className="relative mx-auto aspect-[3/4] w-[45vw] max-w-full overflow-hidden rounded-[var(--radius-image)] max-md:w-[88%]">
          <Media
            src={imageSrc}
            alt={imageAlt}
            aria-hidden={!imageAlt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        </div>

        {/* Overlapping Sticker */}
        {sticker && (
          <PeelSticker
            imageSrc={sticker.imageSrc}
            imageAlt={sticker.imageAlt}
            cutout={sticker.cutout}
            rotate={sticker.cutout ? -45 : -8}
            scrub={[0, 0.5]}
            className={clsx(
              "absolute left-[50%] z-30 aspect-square -translate-x-1/2 max-md:left-[2%] max-md:translate-x-0",
              sticker.cutout
                ? "bottom-[-13vw] w-[35vw] max-md:bottom-[-14vw] max-md:w-[46vw]"
                : "bottom-[-4vw] w-[17vw] max-md:bottom-[-8vw] max-md:w-[34vw]"
            )}
          />
        )}
      </div>
    </section>
  );
};

export default StatementStickerCta;
