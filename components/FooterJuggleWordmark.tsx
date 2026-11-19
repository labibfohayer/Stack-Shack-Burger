"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useAnimate,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Media from "./primitives/Media";
import PopWords from "./primitives/PopWords";
import { MediaItem, FooterLink } from "@/data/restaurantData";

const JUGGLE_SLOTS = [
  {
    left: "17%",
    size: "w-[11vw] max-md:w-[20vw]",
    minX: -1.5,
    maxX: 2.5,
  },
  {
    left: "36%",
    size: "w-[9vw] max-md:w-[17vw]",
    minX: -2,
    maxX: 2,
  },
  {
    left: "58%",
    size: "w-[12vw] max-md:w-[21vw]",
    minX: -2,
    maxX: 2,
  },
  {
    left: "81%",
    size: "w-[13vw] max-md:w-[22vw]",
    minX: -2.5,
    maxX: 1,
  },
];

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface JuggleItemProps {
  item: MediaItem;
  index: number;
  active: boolean;
}

const JuggleItem: React.FC<JuggleItemProps> = ({ item, index, active }) => {
  const [scope, animate] = useAnimate();
  const slot = JUGGLE_SLOTS[index % JUGGLE_SLOTS.length];

  useEffect(() => {
    if (!active) return;
    let isRunning = true;
    let currentAnim: any = null;

    (async () => {
      // Stagger initial launch so they jump independently
      await sleep(index * 550 + randomBetween(0, 300));

      while (isRunning && scope.current) {
        const upDuration = randomBetween(0.95, 1.35);
        const totalDuration = upDuration + upDuration * randomBetween(1.15, 1.45);
        const startX = randomBetween(-1, 1);
        const endX = randomBetween(slot.minX, slot.maxX);
        const totalRotate = randomBetween(200, 480) * (Math.random() > 0.5 ? 1 : -1);

        const el = scope.current;
        const parentH = el.parentElement?.parentElement?.clientHeight ?? 0;
        const elH = el.offsetHeight || 180;
        // Keep at least 30px clearance from the top of the footer so it is never clipped
        const maxRise = Math.max(elH * 0.5, parentH - elH - 30);
        const targetRise = Math.max(
          elH * 0.45,
          Math.min(window.innerHeight * randomBetween(0.35, 0.52), maxRise)
        );
        const startY = Math.min(window.innerHeight * 0.22, 220);

        currentAnim = animate(
          el,
          {
            y: [startY, -targetRise, startY],
            x: [`${startX}vw`, `${endX}vw`],
            rotate: [0, totalRotate],
            scale: [0.92, 1, 0.96],
            opacity: [0, 1, 1, 0],
          },
          {
            duration: totalDuration,
            scale: {
              duration: totalDuration,
              times: [0, 0.18 / totalDuration, 1],
              ease: [0.25, 0.46, 0.45, 0.94],
            },
            y: {
              duration: totalDuration,
              times: [0, upDuration / totalDuration, 1],
              ease: [
                [0.215, 0.61, 0.355, 1],
                [0.55, 0.055, 0.675, 0.19],
              ],
            },
            x: { duration: totalDuration, ease: "easeInOut" },
            rotate: { duration: totalDuration, ease: "linear" },
            opacity: {
              duration: totalDuration,
              times: [0, 0.18 / totalDuration, 1 - 0.25 / totalDuration, 1],
              ease: "linear",
            },
          }
        );

        await currentAnim;
        if (!isRunning) return;
        await sleep(randomBetween(250, 750));
      }
    })();

    return () => {
      isRunning = false;
      currentAnim?.stop();
    };
  }, [active, animate, index, scope, slot]);

  return (
    <div
      style={{ left: slot.left }}
      className={cn(
        "pointer-events-none absolute bottom-0 aspect-square -translate-x-1/2",
        slot.size
      )}
    >
      <div
        ref={scope}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="size-full"
      >
        {item.cutout ? (
          <Media
            src={item.imageSrc}
            alt=""
            decoding="async"
            className="size-full object-contain"
          />
        ) : (
          <div className="size-full overflow-hidden rounded-full shadow-[0_0_0_0.4vw_var(--title-stroke-color,#ffffff)]">
            <Media
              src={item.imageSrc}
              alt=""
              decoding="async"
              className="size-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const FooterLinkItem: React.FC<{ text: string; href: string }> = ({
  text,
  href,
}) => {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent) => {
    if (href === "/" && pathname === "/") {
      e.preventDefault();
      if (typeof window !== "undefined") {
        if ((window as any).__lenis) {
          (window as any).__lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
  };

  const content = (
    <div className="relative overflow-hidden">
      <div className="transition-transform duration-300 group-hover:-translate-y-full">
        {text}
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-full text-primary transition-transform duration-300 group-hover:-translate-y-full"
      >
        {text}
      </div>
    </div>
  );

  const className =
    "group block whitespace-nowrap font-[family-name:var(--font-heading)] text-[length:max(1.5rem,calc(var(--text-h3)*0.75))] leading-[1.05] uppercase";

  if (href.startsWith("/")) {
    return (
      <Link href={href} onClick={handleClick} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {content}
    </a>
  );
};

export interface FooterJuggleWordmarkProps {
  brand?: string;
  links: FooterLink[];
  copyright?: string;
  tagline?: string;
  items?: MediaItem[];
  ariaLabel?: string;
  className?: string;
}

export const FooterJuggleWordmark: React.FC<FooterJuggleWordmarkProps> = ({
  brand = "Stack Shack",
  links,
  copyright,
  tagline,
  items = [],
  ariaLabel,
  className,
}) => {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkBoxRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const inView = useInView(footerRef, { margin: "0px 0px 50px 0px" });
  const [wordmarkFontSize, setWordmarkFontSize] = useState<number | null>(null);

  useEffect(() => {
    const el = wordmarkBoxRef.current;
    if (!el) return;

    const measureFit = () => {
      const child = el.firstElementChild as HTMLElement;
      if (!child) return;
      const fs = parseFloat(getComputedStyle(child).fontSize);
      const sw = child.scrollWidth;
      if (!sw || !fs) return;
      setWordmarkFontSize(
        Math.min((fs * el.clientWidth) / sw, window.innerWidth * 0.35)
      );
    };

    measureFit();
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(measureFit);
    }
    const ro = new ResizeObserver(measureFit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [brand]);

  return (
    <footer
      ref={footerRef}
      aria-label={ariaLabel || `${brand} footer`}
      className={cn(
        "relative isolate overflow-hidden pt-[var(--section-space)] text-foreground",
        className
      )}
    >
      <div className="relative z-20 mx-auto w-[var(--container)]">
        {/* Navigation and Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-x-[calc(var(--gap)*3)] gap-y-[var(--gap)]">
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-4 sm:gap-x-[calc(var(--gap)*2)] gap-y-[0.4em]"
          >
            {links.map((link, idx) => (
              <FooterLinkItem key={idx} text={link.text} href={link.href} />
            ))}
          </nav>

          {copyright && (
            <p className="font-[family-name:var(--font-heading)] text-[length:max(1.3rem,calc(var(--text-h3)*0.75))] leading-[1.05] uppercase text-muted-foreground">
              {copyright}
            </p>
          )}
        </div>

        {/* Animated Expanding Divider */}
        <motion.div
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 0.9, ease: [0.165, 0.84, 0.44, 1], delay: 0.25 }}
          className="mt-[calc(var(--gap)*1.5)] h-[2px] origin-left bg-border"
        />

        {tagline && (
          <p className="mt-[calc(var(--gap)*1.5)] font-[family-name:var(--font-heading)] text-[length:max(1.5rem,calc(var(--text-h3)*0.75))] leading-[1.05] uppercase text-muted-foreground">
            {tagline}
          </p>
        )}
      </div>

      {/* Floating Circles in Background */}
      <div className="pointer-events-none absolute inset-0 z-[15] hidden sm:block">
        {items.slice(0, JUGGLE_SLOTS.length).map((item, idx) => (
          <JuggleItem
            key={idx}
            item={item}
            index={idx}
            active={inView && !shouldReduceMotion}
          />
        ))}
      </div>

      {/* Giant Bottom Wordmark */}
      <div
        ref={wordmarkBoxRef}
        className="relative z-10 mx-auto mt-[8vw] w-[var(--container)] -mb-[0.26em]"
        style={wordmarkFontSize ? { fontSize: `${wordmarkFontSize}px` } : undefined}
      >
        <PopWords
          text={brand}
          tag="p"
          split="chars"
          overshoot={2.6}
          duration={0.75}
          margin="0px"
          className={cn(
            "mx-auto w-max whitespace-nowrap text-center font-[family-name:var(--font-display,var(--font-heading))] uppercase text-primary [-webkit-text-stroke:calc(var(--title-stroke,0em)*1)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]",
            wordmarkFontSize ? "text-[length:1em]" : "text-[length:var(--text-display)]"
          )}
        />
      </div>
    </footer>
  );
};

export default FooterJuggleWordmark;
