"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import clsx from "clsx";

export const backEase = (overshoot: number) => (t: number) => {
  const n = t - 1;
  return n * n * ((overshoot + 1) * n + overshoot) + 1;
};

const pseudoRandom = (i: number, salt: number) => {
  const n = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

export interface PopWordsProps {
  text?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  split?: "words" | "chars";
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  overshoot?: number;
  immediate?: boolean;
  margin?: string;
  size?: string;
}

export const PopWords: React.FC<PopWordsProps> = ({
  text = "Design that ships",
  tag: Tag = "h2",
  split = "words",
  className,
  delay = 0,
  stagger,
  duration = 0.72,
  overshoot = 2.35,
  immediate = false,
  margin = "0px 0px -12% 0px",
  size,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !size) return;

    let rafId = 0;
    const updateSize = () => {
      const clientW = el.clientWidth;
      const wordEls = Array.from(el.querySelectorAll<HTMLElement>("[data-pop-word]"));
      const maxWordW = Math.max(0, ...wordEls.map((w) => w.offsetWidth));
      if (!clientW || !maxWordW) return;
      setScaleFactor((prev) => {
        const next = Math.min(1, (prev * clientW) / maxWordW);
        return Math.abs(next - prev) > 0.01 ? Math.max(0.3, next * 0.99) : prev;
      });
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateSize);
    };

    let active = true;
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => active && scheduleUpdate());
    }

    const ro = new ResizeObserver(scheduleUpdate);
    ro.observe(el);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [text, size]);

  // @ts-expect-error - framer-motion margin type
  const inView = useInView(containerRef, { once: true, margin });
  const active = immediate || inView;

  const words = text.split(/\s+/).filter(Boolean);
  const stepStagger = stagger ?? (split === "chars" ? 0.03 : 0.055);
  const easeCurve = backEase(overshoot);

  let globalIndex = 0;

  const renderItem = (charOrWord: string, key: string, isWord = false) => {
    const i = globalIndex++;
    const initialPos = {
      opacity: 0,
      scale: 0,
      y: 18 + pseudoRandom(i, 1) * 22,
      rotate: -16 + pseudoRandom(i, 2) * 32,
    };

    return (
      <motion.span
        key={key}
        aria-hidden="true"
        data-pop-word={isWord ? true : undefined}
        className="inline-block origin-[50%_90%] will-change-transform"
        initial={shouldReduceMotion ? { opacity: 0 } : initialPos}
        animate={
          active
            ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
            : shouldReduceMotion
            ? { opacity: 0 }
            : initialPos
        }
        transition={
          shouldReduceMotion
            ? { duration: 0.4, delay }
            : {
                duration,
                ease: easeCurve,
                delay: delay + i * stepStagger,
                opacity: { duration: duration * 0.4, delay: delay + i * stepStagger },
              }
        }
      >
        {charOrWord}
      </motion.span>
    );
  };

  const Component = Tag as any;

  return (
    <Component
      ref={containerRef}
      aria-label={text}
      style={size ? { fontSize: `calc(${size} * ${scaleFactor})` } : undefined}
      className={clsx(className)}
    >
      {words.map((word, wIdx) => (
        <React.Fragment key={wIdx}>
          {split === "chars" ? (
            <span aria-hidden="true" data-pop-word={true} className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, cIdx) => renderItem(char, `${wIdx}-${cIdx}`))}
            </span>
          ) : (
            renderItem(word, `${wIdx}`, true)
          )}
          {wIdx < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </Component>
  );
};

export default PopWords;
