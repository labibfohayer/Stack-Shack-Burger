"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";
import TextRoll from "./primitives/TextRoll";
import { backEase } from "./primitives/PopWords";
import { NavItem, CtaButton } from "@/data/restaurantData";

export interface NavbarPillMenuProps {
  brand?: string;
  brandHref?: string;
  navItems: NavItem[];
  cta?: CtaButton;
  menuLabel?: string;
  closeLabel?: string;
  note?: string;
  className?: string;
}

export const NavbarPillMenu: React.FC<NavbarPillMenuProps> = ({
  brand = "Stack Shack",
  brandHref = "#",
  navItems,
  cta,
  menuLabel = "Menu",
  closeLabel = "Close",
  note,
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const checkTheme = () => {
    const probeY = window.innerHeight * 0.05;
    const lightEls = Array.from(
      document.querySelectorAll('[data-nav-theme="light"]')
    );
    const inLight = lightEls.some((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top <= probeY && rect.bottom >= probeY;
    });
    setIsLightSection(inLight);
  };

  useEffect(() => {
    checkTheme();
    window.addEventListener("resize", checkTheme);
    return () => window.removeEventListener("resize", checkTheme);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScrollY.current;
    lastScrollY.current = latest;
    checkTheme();

    if (latest < 10 || delta < -6) {
      setIsVisible(true);
    } else if (delta > 6 && !isOpen) {
      setIsVisible(false);
    }
  });

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const burgerLineTransition = {
    duration: 0.35,
    ease: [0.77, 0, 0.175, 1],
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.215, 0.61, 0.355, 1] }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[998] bg-primary/30 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={false}
        animate={{ y: isVisible || isOpen ? 0 : "calc(-100% - 12px)" }}
        transition={{ duration: 0.35, ease: [0.165, 0.84, 0.44, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-[999] py-[clamp(0.75rem,1vw,1.25rem)]",
          className
        )}
      >
        <div className="mx-auto flex w-[var(--container)] items-center justify-between gap-[var(--gap)]">
          {/* Brand Logo */}
          <a
            href={brandHref}
            className="min-w-0 whitespace-nowrap px-[0.1em] py-[0.05em] font-[family-name:var(--font-display,var(--font-heading))] text-[length:clamp(2.25rem,4vw,3.75rem)] leading-[1] uppercase text-primary transition-transform duration-300 hover:scale-105 [-webkit-text-stroke:calc(var(--title-stroke,0em)*2.4)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]"
          >
            {brand}
          </a>

          {/* Nav Controls */}
          <div className="relative flex shrink-0 items-center gap-[clamp(0.4rem,0.6vw,0.75rem)]">
            {cta && (
              <a
                href={cta.href}
                className="btn-primary group min-h-0 px-[1.1em] py-[0.3em] text-[length:1.5rem] max-sm:hidden"
              >
                <TextRoll text={cta.text} />
              </a>
            )}

            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                "btn-secondary group min-h-0 px-[0.9em] py-[0.3em] text-[length:1.5rem] transition-colors duration-300",
                isOpen
                  ? "bg-primary text-primary-foreground shadow-none hover:bg-primary hover:text-primary-foreground"
                  : isLightSection
                  ? "bg-transparent text-deep-foreground shadow-[inset_0_0_0_clamp(1.5px,0.15vw,2px)_color-mix(in_srgb,var(--deep-foreground)_20%,transparent)]"
                  : "bg-background/70 text-foreground"
              )}
            >
              <TextRoll text={isOpen ? closeLabel : menuLabel} />

              {/* Animated Hamburger Icon */}
              <div aria-hidden="true" className="relative ml-[0.15em] h-[0.6em] w-[0.75em]">
                <motion.div
                  animate={
                    isOpen
                      ? { top: "50%", rotate: 45 }
                      : { top: "0%", rotate: 0 }
                  }
                  transition={burgerLineTransition}
                  className="absolute left-0 h-[2px] w-full -translate-y-1/2 rounded-full bg-current"
                />
                <motion.div
                  animate={isOpen ? { scaleX: 0 } : { scaleX: 1 }}
                  transition={burgerLineTransition}
                  className="absolute left-0 top-1/2 h-[2px] w-[70%] origin-left -translate-y-1/2 rounded-full bg-current"
                />
                <motion.div
                  animate={
                    isOpen
                      ? { top: "50%", rotate: -45 }
                      : { top: "100%", rotate: 0 }
                  }
                  transition={burgerLineTransition}
                  className="absolute left-0 h-[2px] w-full -translate-y-1/2 rounded-full bg-current"
                />
              </div>
            </button>

            {/* Dropdown Menu Panel */}
            <AnimatePresence>
              {isOpen && (
                <motion.nav
                  ref={navRef}
                  aria-label="Main"
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.3 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.3 }
                  }
                  transition={{
                    duration: 0.5,
                    ease: backEase(2.5),
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute right-0 top-[calc(100%+0.75rem)] w-[clamp(15rem,18vw,21rem)] origin-top-right rounded-[var(--radius-card)] bg-primary p-[clamp(1.25rem,2vw,2rem)] text-primary-foreground shadow-[0_1vw_3vw_color-mix(in_srgb,var(--foreground)_25%,transparent)]"
                >
                  <ul className="flex flex-col gap-[0.3em]">
                    {navItems.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={
                          shouldReduceMotion ? false : { opacity: 0, y: 18 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.38,
                          ease: [0.165, 0.84, 0.44, 1],
                          delay: 0.14 + idx * 0.06,
                        }}
                      >
                        <a
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-block origin-left font-[family-name:var(--font-display,var(--font-heading))] text-[length:clamp(1.75rem,2.4vw,2.4rem)] leading-[1] uppercase transition-transform duration-300 hover:scale-105 [overflow-wrap:anywhere]"
                        >
                          {item.name}
                        </a>
                      </motion.li>
                    ))}
                  </ul>

                  {note && (
                    <p className="mt-[1.25em] border-t border-primary-foreground/20 pt-[0.9em] text-[length:1.2rem] font-bold uppercase leading-[1.2] tracking-[var(--label-tracking)] text-primary-foreground">
                      {note}
                    </p>
                  )}
                </motion.nav>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default NavbarPillMenu;
