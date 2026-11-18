"use client";

import React from "react";
import { motion } from "framer-motion";
import NavbarPillMenu from "@/components/NavbarPillMenu";
import FooterJuggleWordmark from "@/components/FooterJuggleWordmark";
import ContactCard from "@/components/contact/ContactCard";
import { restaurantData } from "@/data/restaurantData";
import { contactData } from "@/data/contactData";

export default function ContactPage() {
  return (
    <main
      className="relative min-h-screen bg-background text-foreground"
      data-button="blob"
      data-card="panel"
      data-pattern="none"
    >
      {/* Background ambient pattern */}
      <div className="kit-pattern" aria-hidden="true" />

      {/* Reusable Pill Navigation Header */}
      <NavbarPillMenu
        brand={restaurantData.navbar.brand}
        brandHref={restaurantData.navbar.brandHref}
        navItems={restaurantData.navbar.navItems}
        cta={restaurantData.navbar.cta}
        menuLabel={restaurantData.navbar.menuLabel}
        closeLabel={restaurantData.navbar.closeLabel}
        note={restaurantData.navbar.note}
      />

      {/* Header Section */}
      <div className="relative z-10 pt-[clamp(6rem,12vw,9rem)] pb-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mb-2 inline-block -rotate-6 font-[family-name:var(--font-display,var(--font-heading))] text-[length:var(--text-h3)] uppercase text-accent [-webkit-text-stroke:calc(var(--title-stroke,0em)*3)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]"
        >
          {contactData.badge}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
          className="font-[family-name:var(--font-heading)] text-[length:clamp(3.5rem,8vw,7.5rem)] font-bold uppercase leading-[0.88] text-primary [-webkit-text-stroke:calc(var(--title-stroke,0em)*2.5)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]"
        >
          {contactData.title}
        </motion.h1>
        <p className="mx-auto mt-4 max-w-xl text-[length:var(--text-body-lg)] text-foreground">
          {contactData.subtitle}
        </p>
      </div>

      {/* Main Contact Card Section */}
      <div className="relative z-10 pb-[var(--section-space)]">
        <ContactCard />
      </div>

      {/* Reusable Footer Section */}
      <div id="contact" data-section="footer">
        <FooterJuggleWordmark
          brand={restaurantData.footer.brand}
          links={restaurantData.footer.links}
          copyright={restaurantData.footer.copyright}
          tagline={restaurantData.footer.tagline}
          items={restaurantData.footer.items}
        />
      </div>
    </main>
  );
}
