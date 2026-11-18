"use client";

import React from "react";
import NavbarPillMenu from "@/components/NavbarPillMenu";
import FooterJuggleWordmark from "@/components/FooterJuggleWordmark";
import OrderForm from "@/components/order/OrderForm";
import { restaurantData } from "@/data/restaurantData";

export default function OrderPage() {
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

      {/* Main Order Content Section */}
      <div className="relative z-10 pt-[clamp(6rem,12vw,9rem)] pb-[var(--section-space)]">
        <OrderForm />
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
