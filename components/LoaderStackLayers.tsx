"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";
import clsx from "clsx";

const LAYERS = [
  { shape: "h-[18%] w-[92%] rounded-full bg-accent", rest: 0 },
  { shape: "h-[18%] w-[78%] rounded-full bg-card", rest: -4 },
  { shape: "h-[18%] w-[100%] rounded-full bg-secondary", rest: 3 },
  { shape: "h-[18%] w-[70%] rounded-full bg-background", rest: -2 },
  { shape: "h-[18%] w-[86%] rounded-full bg-accent", rest: 5 },
];

const CURTAIN_COLORS = ["text-secondary", "text-accent", "text-primary"];
const LIFT_AT = 0.7;
const DONE_AT = 1.6;

interface CurtainWaveProps {
  delay: number;
  className: string;
}

const CurtainWave: React.FC<CurtainWaveProps> = ({ delay, className }) => {
  const nVal = useMotionValue(101);
  const sVal = useMotionValue(101);
  const cVal = useMotionValue(101);

  const pathData = useTransform(
    [nVal, sVal, cVal],
    ([n, s, c]) => `M -1 -1 L 101 -1 L 101 ${s} Q 50 ${c} -1 ${n} Z`
  );

  useEffect(() => {
    const commonTransition = {
      duration: 0.55,
      delay,
      ease: [0.645, 0.045, 0.355, 1],
    };

    const animN = animate(nVal, -1, commonTransition as any);
    const animS = animate(sVal, -1, commonTransition as any);
    const animC = animate(cVal, -12, {
      duration: 0.72,
      delay,
      ease: [0.86, 0, 0.07, 1],
    });

    return () => {
      animN.stop();
      animS.stop();
      animC.stop();
    };
  }, [delay, nVal, sVal, cVal]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={clsx("absolute inset-0 size-full", className)}
    >
      <motion.path d={pathData} fill="currentColor" />
    </svg>
  );
};

export interface LoaderStackLayersProps {
  label?: string;
  onComplete?: () => void;
}

export const LoaderStackLayers: React.FC<LoaderStackLayersProps> = ({
  label = "Smashing the patties",
  onComplete,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [curtainsLifting, setCurtainsLifting] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsVisible(false);
      onCompleteRef.current?.();
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Jiggle stack on drops
    LAYERS.forEach((_, idx) => {
      timers.push(
        setTimeout(() => {
          if (stackRef.current) {
            animate(
              stackRef.current,
              {
                scaleY: [1, 0.88, 1.03, 1],
                scaleX: [1, 1.06, 0.98, 1],
              },
              { duration: 0.26, times: [0, 0.23, 0.54, 1] }
            );
          }
        }, (idx * 0.09 + 0.28) * 1000)
      );
    });

    // Curtain lift trigger
    timers.push(
      setTimeout(() => {
        setCurtainsLifting(true);
      }, LIFT_AT * 1000)
    );

    // Done trigger
    timers.push(
      setTimeout(() => {
        setIsVisible(false);
        onCompleteRef.current?.();
      }, DONE_AT * 1000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [shouldReduceMotion]);

  if (!isVisible || shouldReduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100000] overflow-hidden"
    >
      {curtainsLifting ? (
        <>
          <CurtainWave delay={0.16} className={CURTAIN_COLORS[0]} />
          <CurtainWave delay={0.08} className={CURTAIN_COLORS[1]} />
          <CurtainWave delay={0} className={CURTAIN_COLORS[2]} />
        </>
      ) : (
        <div className="absolute inset-0 bg-primary" />
      )}

      <motion.div
        animate={
          curtainsLifting
            ? { y: "-70vh", scale: 0.9, opacity: 0 }
            : { y: 0 }
        }
        transition={{ duration: 0.4, ease: [0.55, 0.055, 0.675, 0.19] }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-[1.5rem]"
      >
        <div
          ref={stackRef}
          className="flex aspect-[1/0.9] w-[min(46vw,15rem)] origin-bottom flex-col-reverse items-center"
        >
          {LAYERS.map((layer, idx) => (
            <motion.div
              key={idx}
              initial={{
                y: "-80vh",
                scale: 0.8,
                opacity: 0,
                rotate: layer.rest + 12,
              }}
              animate={{
                y: 0,
                scale: 1,
                opacity: 1,
                rotate: layer.rest,
              }}
              transition={{
                y: {
                  duration: 0.28,
                  delay: idx * 0.09,
                  ease: [0.55, 0.085, 0.68, 0.53],
                },
                scale: { duration: 0.28, delay: idx * 0.09 },
                opacity: { duration: 0.12, delay: idx * 0.09 },
                rotate: {
                  duration: 0.45,
                  delay: idx * 0.09 + 0.28,
                  ease: [0.34, 1.9, 0.64, 1],
                },
              }}
              className={clsx(
                "shrink-0 shadow-[0_0_0_3px_var(--primary)]",
                layer.shape
              )}
            />
          ))}
        </div>

        {label && (
          <p className="px-[var(--gutter)] text-center font-[family-name:var(--font-heading)] text-[length:max(1.5rem,var(--text-h3))] leading-[1] uppercase text-primary-foreground">
            {label}
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default LoaderStackLayers;
