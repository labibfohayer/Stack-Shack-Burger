"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { contactData } from "@/data/contactData";
import TextRoll from "@/components/primitives/TextRoll";

export const ContactCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(contactData.demoEmail);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = contactData.demoEmail;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  return (
    <div className="mx-auto w-[var(--container)] max-w-3xl">
      <motion.article
        initial={shouldReduceMotion ? false : { opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
        className="relative overflow-hidden rounded-[var(--radius-card)] border-2 border-white bg-card/95 p-[clamp(2rem,5vw,4rem)] text-center shadow-xl backdrop-blur-sm"
      >
        {/* Decorative Badge */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 font-[family-name:var(--font-heading)] text-sm font-bold uppercase tracking-wider text-primary">
            {contactData.cardBadge}
          </span>
        </div>

        {/* Card Title */}
        <h2 className="font-[family-name:var(--font-heading)] text-[length:clamp(2.5rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.95] text-primary [-webkit-text-stroke:calc(var(--title-stroke,0em)*2)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]">
          {contactData.cardTitle}
        </h2>

        {/* Card Description */}
        <p className="mx-auto mt-4 max-w-xl text-[length:var(--text-body)] text-foreground/85 leading-relaxed">
          {contactData.cardDescription}
        </p>

        {/* Highlighted Email Box */}
        <div className="my-8">
          <a
            href={`mailto:${contactData.demoEmail}`}
            data-testid="contact-email-link"
            className="group relative inline-flex max-w-full items-center justify-center gap-2 sm:gap-3 rounded-2xl border-2 border-white bg-background/80 px-4 sm:px-6 py-3 sm:py-4 shadow-[0_4px_16px_color-mix(in_srgb,var(--foreground)_6%,transparent)] transition-all duration-300 hover:scale-[1.02] hover:bg-background"
            aria-label={`Send email to ${contactData.demoEmail}`}
          >
            <span className="text-xl sm:text-2xl" aria-hidden="true">
              ✉️
            </span>
            <span className="break-all sm:break-normal font-[family-name:var(--font-heading)] text-[length:clamp(1.25rem,4.5vw,2.5rem)] tracking-wider text-primary transition-colors group-hover:text-accent">
              {contactData.demoEmail}
            </span>
          </a>
        </div>

        {/* Action Buttons: Email Us & Copy Email */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* EMAIL US (mailto link) */}
          <a
            href={`mailto:${contactData.demoEmail}`}
            className="btn-primary group min-h-0 px-8 py-3 text-lg font-bold shadow-[0_0_0_2px_#ffffff]"
            data-testid="email-us-btn"
          >
            <TextRoll text={contactData.emailButtonText} />
          </a>

          {/* COPY EMAIL BUTTON */}
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary group min-h-0 px-8 py-3 text-lg font-bold shadow-[0_0_0_2px_#ffffff] transition-all"
            aria-label="Copy email address to clipboard"
            data-testid="copy-email-btn"
          >
            <span>{copied ? contactData.copiedText : contactData.copyButtonText}</span>
          </button>
        </div>

        {/* Extra Note / Response Time */}
        <p className="mt-8 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {contactData.extraNote}
        </p>
      </motion.article>
    </div>
  );
};

export default ContactCard;
