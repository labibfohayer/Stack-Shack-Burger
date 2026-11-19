"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { contactData } from "@/data/contactData";
import TextRoll from "@/components/primitives/TextRoll";
import { cn } from "@/lib/utils";

export const ContactCard: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) newErrors.name = "Please enter your name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!message.trim()) newErrors.message = "Please write your message.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Construct pre-filled mailto URL
    const subject = encodeURIComponent(`Message from ${name.trim()} via Stack Shack Website`);
    const body = encodeURIComponent(
      `Hello Stack Shack Team,\n\n${message.trim()}\n\n---\nSender Name: ${name.trim()}\nReply-To Email: ${email.trim()}`
    );
    const mailtoUrl = `mailto:${contactData.demoEmail}?subject=${subject}&body=${body}`;

    setStatusMessage("Opening your email client with your message...");
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 200);
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

        {/* Direct Clickable Email Box */}
        <div className="my-6">
          <a
            href={`mailto:${contactData.demoEmail}`}
            data-testid="contact-email-link"
            className="group relative inline-flex max-w-full items-center justify-center gap-2 sm:gap-3 rounded-2xl border-2 border-white bg-background/80 px-4 sm:px-6 py-2.5 sm:py-3.5 shadow-[0_4px_16px_color-mix(in_srgb,var(--foreground)_6%,transparent)] transition-all duration-300 hover:scale-[1.02] hover:bg-background"
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

        {/* Contact Input Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left" noValidate>
          {/* Inputs Grid: Name & Email */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Name Box */}
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1.5 block font-[family-name:var(--font-heading)] text-base font-bold uppercase tracking-wider text-foreground"
              >
                {contactData.form.nameLabel} <span className="text-primary">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder={contactData.form.namePlaceholder}
                className={cn(
                  "w-full rounded-2xl border bg-white px-5 py-3.5 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
                  errors.name ? "border-destructive bg-destructive/5" : "border-border/40"
                )}
              />
              {errors.name && (
                <p className="mt-1 text-xs font-semibold text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email Box */}
            <div>
              <label
                htmlFor="contact-email"
                className="mb-1.5 block font-[family-name:var(--font-heading)] text-base font-bold uppercase tracking-wider text-foreground"
              >
                {contactData.form.emailLabel} <span className="text-primary">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder={contactData.form.emailPlaceholder}
                className={cn(
                  "w-full rounded-2xl border bg-white px-5 py-3.5 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
                  errors.email ? "border-destructive bg-destructive/5" : "border-border/40"
                )}
              />
              {errors.email && (
                <p className="mt-1 text-xs font-semibold text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Message Box */}
          <div>
            <label
              htmlFor="contact-message"
              className="mb-1.5 block font-[family-name:var(--font-heading)] text-base font-bold uppercase tracking-wider text-foreground"
            >
              {contactData.form.messageLabel} <span className="text-primary">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
              }}
              placeholder={contactData.form.messagePlaceholder}
              className={cn(
                "w-full resize-none rounded-2xl border bg-white px-5 py-3.5 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
                errors.message ? "border-destructive bg-destructive/5" : "border-border/40"
              )}
            />
            {errors.message && (
              <p className="mt-1 text-xs font-semibold text-destructive">{errors.message}</p>
            )}
          </div>

          {/* Feedback Status */}
          {statusMessage && (
            <div data-testid="contact-status-message" className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-center text-sm font-bold text-primary">
              {statusMessage}
            </div>
          )}

          {/* Action Buttons: COPY EMAIL on the left, EMAIL US on the right */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            {/* COPY EMAIL BUTTON (On the left as requested) */}
            <button
              type="button"
              onClick={handleCopy}
              className="btn-secondary group min-h-0 w-full sm:w-auto text-center justify-center px-7 py-3 text-base sm:text-lg font-bold shadow-[0_0_0_2px_#ffffff] transition-all"
              aria-label="Copy email address to clipboard"
              data-testid="copy-email-btn"
            >
              <span>{copied ? contactData.copiedText : contactData.copyButtonText}</span>
            </button>

            {/* EMAIL US BUTTON (Primary Submit CTA) */}
            <button
              type="submit"
              className="btn-primary group min-h-0 w-full sm:w-auto text-center justify-center px-8 py-3 text-base sm:text-lg font-bold shadow-[0_0_0_2px_#ffffff]"
              data-testid="email-us-btn"
            >
              <TextRoll text={contactData.emailButtonText} />
            </button>
          </div>
        </form>

        {/* Extra Note / Response Time */}
        <p className="mt-8 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {contactData.extraNote}
        </p>
      </motion.article>
    </div>
  );
};

export default ContactCard;
