"use client";

import React, { useRef, useState, useEffect } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import clsx from "clsx";

export interface MaskedLineRevealProps {
  lines?: string[];
  text?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  immediate?: boolean;
  ease?: number[];
  from?: string;
  margin?: string;
  rotate?: number;
  fade?: boolean;
  separateLines?: boolean;
}

export const MaskedLineReveal: React.FC<MaskedLineRevealProps> = ({
  lines,
  text = "Design that ships and is built for the long run",
  tag: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.1,
  duration = 0.9,
  immediate = false,
  ease = [0.19, 1, 0.22, 1],
  from = "110%",
  margin,
  rotate = 0,
  fade = false,
  separateLines = false,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [calculatedLines, setCalculatedLines] = useState<string[] | null>(null);
  // @ts-expect-error - framer-motion margin type
  const inView = useInView(containerRef, margin ? { once: true, margin } : { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();
  const shouldTrigger = Boolean(lines || calculatedLines) && (immediate || inView);

  const [hasAnimated, setHasAnimated] = useState(false);
  const isRevealed = shouldTrigger && hasAnimated;

  useEffect(() => {
    if (!shouldTrigger) return;
    let r1 = 0;
    let r2 = 0;
    r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setHasAnimated(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [shouldTrigger]);

  const rawWords = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    if (lines || !measureRef.current) return;
    const el = measureRef.current;
    let rafId = 0;

    const measure = () => {
      const childDivs = Array.from(el.children) as HTMLElement[];
      const lineArray: string[] = [];
      let currentTop = NaN;
      let prevEndedWithSpace = false;

      childDivs.forEach((child) => {
        const raw = child.dataset.raw ?? child.textContent ?? "";
        if (!lineArray.length || Math.abs(child.offsetTop - currentTop) > 2) {
          lineArray.push(raw);
          currentTop = child.offsetTop;
        } else {
          lineArray[lineArray.length - 1] += (prevEndedWithSpace ? " " : "") + raw;
        }
        prevEndedWithSpace = child.dataset.space === "true";
      });

      setCalculatedLines((prev) =>
        prev && prev.join("\n") === lineArray.join("\n") ? prev : lineArray
      );
    };

    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measure);
    };

    let active = true;
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => active && schedule());
      document.fonts.addEventListener("loadingdone", schedule);
    }

    const ro = new ResizeObserver(() => active && schedule());
    ro.observe(el);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.removeEventListener("loadingdone", schedule);
      }
    };
  }, [lines, text]);

  const effectiveLines = lines ?? calculatedLines ?? [text];
  const fullText = lines ? lines.join(" ") : text;
  const cubicBezierStr = `cubic-bezier(${ease.join(",")})`;

  const Component = Tag as any;

  return (
    <Component
      ref={containerRef}
      aria-label={separateLines ? undefined : fullText}
      className={clsx(
        "relative",
        !/(^|\s)(md:|lg:)?w-/.test(className) && "w-full",
        className,
        !/(^|\s)leading-/.test(className) && "leading-[1.1]"
      )}
    >
      {!lines && (
        <div
          ref={measureRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute inset-x-0 top-0 [padding-inline:inherit]"
        >
          {rawWords.map((word, idx) => (
            <React.Fragment key={idx}>
              <div
                data-space="true"
                data-raw={word}
                className="inline-block indent-0"
              >
                {word}
              </div>
              {idx < rawWords.length - 1 ? " " : null}
            </React.Fragment>
          ))}
        </div>
      )}

      {effectiveLines.map((line, lIdx) => (
        <div
          key={lIdx}
          aria-hidden={separateLines ? undefined : true}
          className={clsx(
            "block overflow-hidden pb-[0.12em] -mb-[0.12em]",
            lIdx > 0 && "indent-0"
          )}
        >
          <div
            className={clsx("block", !lines && calculatedLines && "whitespace-nowrap")}
            style={{
              transformOrigin: rotate ? "0 50%" : undefined,
              transform:
                shouldReduceMotion || isRevealed
                  ? "translateY(0%) rotate(0deg)"
                  : `translateY(${from}) rotate(${rotate}deg)`,
              opacity: fade && !(shouldReduceMotion || isRevealed) ? 0 : 1,
              transition: shouldReduceMotion
                ? "none"
                : `transform ${duration}s ${cubicBezierStr} ${delay + lIdx * stagger}s${
                    fade ? `, opacity ${duration}s ${cubicBezierStr} ${delay + lIdx * stagger}s` : ""
                  }`,
            }}
          >
            {line}
          </div>
        </div>
      ))}
    </Component>
  );
};

export default MaskedLineReveal;
