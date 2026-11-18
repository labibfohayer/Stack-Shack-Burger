"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SPOTS_DATA, SpotItem } from "@/data/spotsData";
import { cn } from "@/lib/utils";
import Media from "@/components/primitives/Media";
import TextRoll from "@/components/primitives/TextRoll";

export const SpotsList: React.FC = () => {
  return (
    <div className="mx-auto w-[var(--container)] space-y-16">
      {SPOTS_DATA.map((spot, idx) => {
        const isEven = idx % 2 === 1; // Alternating layout
        const tiltAngle = idx % 2 === 0 ? -2 : 2;

        return (
          <motion.article
            key={spot.id}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{
              duration: 0.65,
              ease: [0.165, 0.84, 0.44, 1],
              delay: idx * 0.1,
            }}
            className="group relative overflow-hidden rounded-[var(--radius-card)] border-2 border-white bg-card/95 p-[clamp(1.5rem,3.5vw,3rem)] shadow-xl backdrop-blur-sm"
          >
            <div
              className={cn(
                "grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12",
                isEven && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
              )}
            >
              {/* IMAGE COLUMN (5 cols on lg) */}
              <div className="relative mx-auto w-full max-w-lg lg:col-span-5">
                <div
                  style={{ transform: `rotate(${tiltAngle}deg)` }}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius-card)] shadow-[0_0_0_clamp(4px,0.4vw,7px)_#ffffff] transition-all duration-300 group-hover:rotate-0 group-hover:scale-105"
                >
                  <Media
                    src={spot.imageSrc}
                    alt={spot.imageAlt}
                    loading="lazy"
                    className="size-full object-cover"
                  />

                  {/* Location Area Pill Tag */}
                  <div className="absolute top-3 left-3 rounded-full bg-primary/95 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_0_0_2px_#ffffff] backdrop-blur-sm">
                    {spot.locationArea}
                  </div>
                </div>
              </div>

              {/* DETAILS COLUMN (7 cols on lg) */}
              <div className="space-y-4 lg:col-span-7">
                {/* Branch Number & Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-[family-name:var(--font-heading)] text-xl font-bold uppercase text-accent">
                    SPOT #{idx + 1}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex flex-wrap gap-1.5">
                    {spot.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Big Branch Heading */}
                <h2 className="font-[family-name:var(--font-heading)] text-[length:clamp(2.5rem,5vw,4.5rem)] font-bold uppercase leading-[0.9] text-primary [-webkit-text-stroke:calc(var(--title-stroke,0em)*2)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]">
                  {spot.name}
                </h2>

                {/* Fun Description */}
                <p className="text-[length:var(--text-body)] text-foreground/85 leading-relaxed">
                  {spot.description}
                </p>

                {/* Info Card: Address, Hours, Phone */}
                <div className="rounded-2xl border border-border/40 bg-background/50 p-4 space-y-2.5 text-sm">
                  {/* Address */}
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-base" aria-hidden="true">📍</span>
                    <div>
                      <strong className="block uppercase text-xs tracking-wider text-muted-foreground">Address (Demo)</strong>
                      <span className="font-medium text-foreground">{spot.address}</span>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="flex items-start gap-2.5 border-t border-border/20 pt-2">
                    <span className="mt-0.5 text-base" aria-hidden="true">🕒</span>
                    <div>
                      <strong className="block uppercase text-xs tracking-wider text-muted-foreground">Opening Hours</strong>
                      <span className="block font-medium text-foreground">{spot.hours.weekdays}</span>
                      <span className="block text-xs text-muted-foreground">{spot.hours.friday}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-2.5 border-t border-border/20 pt-2">
                    <span className="mt-0.5 text-base" aria-hidden="true">📞</span>
                    <div>
                      <strong className="block uppercase text-xs tracking-wider text-muted-foreground">Contact Phone</strong>
                      <span className="font-mono font-bold text-foreground">{spot.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Get Directions & Order Now */}
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  {/* GET DIRECTIONS: External Search Link to Google Maps (new tab) */}
                  <a
                    href={spot.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary group min-h-0 px-6 py-2.5 text-base font-bold shadow-[0_0_0_2px_#ffffff]"
                  >
                    <span>GET DIRECTIONS ↗</span>
                  </a>

                  {/* ORDER NOW: Internal Link to /order (same tab) */}
                  <Link
                    href="/order"
                    className="btn-primary group min-h-0 px-7 py-2.5 text-base font-bold shadow-[0_0_0_2px_#ffffff]"
                  >
                    <TextRoll text="ORDER NOW" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>
        );
      })}

      {/* Fun Bottom Callout Box */}
      <div className="mt-16 rounded-[var(--radius-card)] border-2 border-white bg-primary p-8 text-center text-primary-foreground shadow-xl">
        <p className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-wider">
          More Dhaka Spots Sizzling Soon!
        </p>
        <p className="mx-auto mt-2 max-w-xl text-base opacity-90">
          We are expanding across the city. Can't make it to a shack? Order delivery straight to your doorstep in 25-35 minutes!
        </p>
        <div className="mt-6">
          <Link
            href="/order"
            className="btn-secondary inline-flex px-8 py-3 text-lg font-bold shadow-[0_0_0_2px_#ffffff]"
          >
            ORDER ONLINE NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpotsList;
