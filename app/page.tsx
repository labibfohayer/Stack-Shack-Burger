"use client";

import React from "react";
import { restaurantData } from "@/data/restaurantData";
import LoaderStackLayers from "@/components/LoaderStackLayers";
import NavbarPillMenu from "@/components/NavbarPillMenu";
import HeroPopTrio from "@/components/HeroPopTrio";
import FeaturesMascotClaims from "@/components/FeaturesMascotClaims";
import StatementWavePhoto from "@/components/StatementWavePhoto";
import StatementCutoutLayers from "@/components/StatementCutoutLayers";
import FeaturesTrailStops from "@/components/FeaturesTrailStops";
import StatementStickerCta from "@/components/StatementStickerCta";
import FooterJuggleWordmark from "@/components/FooterJuggleWordmark";

export default function Home() {
  return (
    <main
      className="relative bg-background text-foreground"
      data-button="blob"
      data-card="panel"
      data-pattern="none"
    >
      {/* Pattern element */}
      <div className="kit-pattern" aria-hidden="true" />

      {/* Interactive Page Loader */}
      <LoaderStackLayers label={restaurantData.loader.label} />

      {/* Pill Navigation Header */}
      <NavbarPillMenu
        brand={restaurantData.navbar.brand}
        brandHref={restaurantData.navbar.brandHref}
        navItems={restaurantData.navbar.navItems}
        cta={restaurantData.navbar.cta}
        menuLabel={restaurantData.navbar.menuLabel}
        closeLabel={restaurantData.navbar.closeLabel}
        note={restaurantData.navbar.note}
      />

      {/* Hero Section */}
      <div id="menu" data-section="hero">
        <HeroPopTrio
          label={restaurantData.hero.label}
          title={restaurantData.hero.title}
          description={restaurantData.hero.description}
          cta={restaurantData.hero.cta}
          introDelay={restaurantData.hero.introDelay}
          items={restaurantData.hero.items}
          sticker={restaurantData.hero.sticker}
        />
      </div>

      {/* Mascot & Claims Section */}
      <div data-section="mascot">
        <FeaturesMascotClaims
          label={restaurantData.mascotClaims.label}
          title={restaurantData.mascotClaims.title}
          imageSrc={restaurantData.mascotClaims.imageSrc}
          imageAlt={restaurantData.mascotClaims.imageAlt}
          claimsLeft={restaurantData.mascotClaims.claimsLeft}
          claimsRight={restaurantData.mascotClaims.claimsRight}
          badge={restaurantData.mascotClaims.badge}
          stickers={restaurantData.mascotClaims.stickers}
          edges={restaurantData.mascotClaims.edges}
        />
      </div>

      {/* Photo Band Section */}
      <div data-section="photo-band">
        <StatementWavePhoto
          imageSrc={restaurantData.photoBand.imageSrc}
          imageAlt={restaurantData.photoBand.imageAlt}
          label={restaurantData.photoBand.label}
        />
      </div>

      {/* Cutout Layers Section */}
      <div data-section="layers">
        <StatementCutoutLayers
          label={restaurantData.cutoutLayers.label}
          titleLines={restaurantData.cutoutLayers.titleLines}
          items={restaurantData.cutoutLayers.items}
        />
      </div>

      {/* Locations / Trail Stops Section */}
      <div id="locations" data-section="locations">
        <FeaturesTrailStops
          label={restaurantData.locations.label}
          title={restaurantData.locations.title}
          description={restaurantData.locations.description}
          items={restaurantData.locations.items}
        />
      </div>

      {/* Conversion CTA Section */}
      <div id="order" data-section="cta">
        <StatementStickerCta
          label={restaurantData.ctaSection.label}
          title={restaurantData.ctaSection.title}
          description={restaurantData.ctaSection.description}
          cta={restaurantData.ctaSection.cta}
          imageSrc={restaurantData.ctaSection.imageSrc}
          imageAlt={restaurantData.ctaSection.imageAlt}
          sticker={restaurantData.ctaSection.sticker}
        />
      </div>

      {/* Footer Section */}
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
