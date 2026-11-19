"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BURGERS_DATA,
  BURGER_CATEGORIES,
  BurgerCategory,
  BurgerItem,
} from "@/data/burgersData";
import { cn } from "@/lib/utils";
import Media from "@/components/primitives/Media";
import TextRoll from "@/components/primitives/TextRoll";

export const BurgersList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<BurgerCategory>("All Burgers");

  const filteredBurgers =
    selectedCategory === "All Burgers"
      ? BURGERS_DATA
      : BURGERS_DATA.filter((b) => b.category === selectedCategory);

  return (
    <div className="mx-auto w-[var(--container)]">
      {/* Category Filter Pills */}
      <div className="mb-8 sm:mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {BURGER_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "rounded-full px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base font-bold uppercase tracking-wider transition-all duration-300",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-[0_0_0_2px_#ffffff] scale-105"
                  : "bg-white/80 text-foreground hover:bg-white hover:text-primary shadow-sm"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Burgers Count Subtitle */}
      <div className="mb-8 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-3">
        <p className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl uppercase tracking-wider text-muted-foreground">
          Showing <span className="font-bold text-primary">{filteredBurgers.length}</span> Smashed Burgers
        </p>
        <span className="text-xs sm:text-sm font-bold uppercase text-accent-foreground">
          SMASHED TO ORDER ON THE GRILL, EST. 2024
        </span>
      </div>

      {/* Responsive Grid with Alternating Playful Aesthetics */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredBurgers.map((burger, idx) => {
            // Alternating playful tilt angles
            const tilts = [-1.5, 1.5, -2, 2, -1, 1];
            const tiltAngle = tilts[idx % tilts.length];

            return (
              <motion.article
                key={burger.id}
                layout
                initial={{ opacity: 0, y: 25, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.45,
                  delay: (idx % 6) * 0.06,
                  ease: [0.165, 0.84, 0.44, 1],
                }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border-2 border-white bg-card/95 p-5 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-2xl"
              >
                {/* Burger Card Content */}
                <div>
                  {/* Photo with thick white border and playful tilt */}
                  <div
                    style={{ transform: `rotate(${tiltAngle}deg)` }}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] shadow-[0_0_0_clamp(3px,0.3vw,5px)_#ffffff] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105"
                  >
                    <Media
                      src={burger.imageSrc}
                      alt={burger.imageAlt}
                      loading="lazy"
                      className="size-full object-cover"
                    />

                    {/* Price Badge */}
                    <div className="absolute bottom-2 right-2 rounded-full bg-primary px-3.5 py-1 font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-primary-foreground shadow-[0_0_0_2px_#ffffff]">
                      ৳{burger.price}
                    </div>
                  </div>

                  {/* Tags */}
                  {burger.tags && burger.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {burger.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
                            tag.includes("Spicy")
                              ? "bg-destructive/15 text-destructive border border-destructive/30"
                              : tag.includes("Veg")
                              ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                              : "bg-accent/20 text-accent-foreground border border-accent/40"
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Burger Name */}
                  <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold uppercase leading-none tracking-tight text-primary">
                    {burger.name}
                  </h3>

                  {/* Caption / Description */}
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/80 leading-snug">
                    {burger.description}
                  </p>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-6 border-t border-border/20 pt-4 flex items-center justify-between">
                  <span className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground">
                    ৳{burger.price}
                  </span>

                  <Link
                    href={`/order?item=${burger.orderId || burger.id}`}
                    className="btn-primary group min-h-0 px-5 py-2 text-base font-bold shadow-[0_0_0_2px_#ffffff]"
                  >
                    <TextRoll text="ORDER NOW" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Fun Bottom Banner */}
      <div className="mt-12 sm:mt-16 rounded-[var(--radius-card)] border-2 border-white bg-primary p-6 sm:p-8 text-center text-primary-foreground shadow-xl">
        <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl uppercase tracking-wider">
          Can't decide which burger to get?
        </p>
        <p className="mx-auto mt-2 max-w-xl text-sm sm:text-base opacity-90">
          Try "The Double Smashed" — our legendary recipe with double thin patties pressed hard on a hot griddle, pickles & secret Shack sauce!
        </p>
        <div className="mt-5 sm:mt-6">
          <Link
            href="/order?item=the-double"
            className="btn-secondary inline-flex px-6 py-2.5 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow-[0_0_0_2px_#ffffff]"
          >
            ORDER YOUR STACK NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BurgersList;
