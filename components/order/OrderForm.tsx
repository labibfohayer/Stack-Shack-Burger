"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MENU_ITEMS,
  MenuItem,
  TAX_RATE,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
} from "@/data/menuData";
import {
  validateOrderForm,
  OrderFormValues,
  ValidationErrors,
} from "@/lib/orderValidation";
import { cn } from "@/lib/utils";

interface SelectedOrderItem {
  itemId: string;
  quantity: number;
}

// Helper to resolve URL query item to a valid burger id
const resolveBurgerId = (rawSlug: string | null): string => {
  if (!rawSlug) return "the-double";
  const clean = rawSlug.trim().toLowerCase();
  const direct = MENU_ITEMS.find((m) => m.id === clean);
  if (direct) return direct.id;
  if (clean.includes("double")) return "the-double";
  if (clean.includes("classic") || clean.includes("single")) return "classic-shack";
  if (clean.includes("bacon")) return "bacon-griddle";
  if (clean.includes("jalapeno") || clean.includes("heatwave")) return "jalapeno-heatwave";
  if (clean.includes("chicken")) return "crispy-chicken-burger";
  if (clean.includes("triple") || clean.includes("beast")) return "triple-griddle-beast";
  return "the-double";
};

export const OrderForm: React.FC = () => {
  const searchParams = useSearchParams();
  const queryItem = searchParams.get("item") || searchParams.get("burger");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Austin");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  // Order items state (initialized with query param or default "the-double")
  const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([
    { itemId: resolveBurgerId(queryItem), quantity: 1 },
  ]);

  // Synchronize when query param changes
  useEffect(() => {
    if (queryItem) {
      const resolved = resolveBurgerId(queryItem);
      setSelectedItems((prev) => {
        if (prev.length > 0 && prev[0].itemId === resolved) return prev;
        return [{ itemId: resolved, quantity: 1 }];
      });
    }
  }, [queryItem]);

  // UI status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // Handle changing item in a row
  const handleItemChange = (index: number, newItemId: string) => {
    setSelectedItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], itemId: newItemId };
      return next;
    });
    if (errors.items) {
      setErrors((e) => ({ ...e, items: undefined }));
    }
  };

  // Handle quantity stepper
  const handleQuantityChange = (index: number, delta: number) => {
    setSelectedItems((prev) => {
      const next = [...prev];
      const newQty = Math.max(1, next[index].quantity + delta);
      next[index] = { ...next[index], quantity: newQty };
      return next;
    });
  };

  // Add another item
  const handleAddItem = () => {
    // Pick an unselected item or default to first
    const unselected = MENU_ITEMS.find(
      (m) => !selectedItems.some((si) => si.itemId === m.id)
    );
    const defaultId = unselected ? unselected.id : MENU_ITEMS[0].id;
    setSelectedItems((prev) => [...prev, { itemId: defaultId, quantity: 1 }]);
    if (errors.items) {
      setErrors((e) => ({ ...e, items: undefined }));
    }
  };

  // Remove an item
  const handleRemoveItem = (index: number) => {
    if (selectedItems.length <= 1) return;
    setSelectedItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Calculations
  const lineItems = selectedItems.map((si) => {
    const menuItem = MENU_ITEMS.find((m) => m.id === si.itemId);
    const unitPrice = menuItem ? menuItem.price : 0;
    return {
      ...si,
      menuItem,
      total: unitPrice * si.quantity,
    };
  });

  const subtotal = Math.round(
    lineItems.reduce((acc, curr) => acc + curr.total, 0) * 100
  ) / 100;
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + delivery + tax) * 100) / 100;

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const values: OrderFormValues = {
      fullName,
      email,
      phone,
      street,
      area,
      city,
      postalCode,
      notes,
      items: selectedItems,
    };

    const { isValid, errors: validationErrors } = validateOrderForm(values);
    if (!isValid) {
      setErrors(validationErrors);
      // Scroll to first error on mobile
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.message || "Failed to place order. Please try again." });
        }
      } else {
        setSuccessOrder(data.order);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error("Order submission failed:", err);
      setErrors({ general: "Network error occurred. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION STATE
  if (successOrder) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
        className="mx-auto w-[var(--container)] max-w-3xl rounded-[var(--radius-card)] border-2 border-white bg-card/95 p-[clamp(1.5rem,4vw,3rem)] shadow-2xl backdrop-blur-md"
      >
        <div className="text-center">
          <div className="inline-block -rotate-6 font-[family-name:var(--font-display)] text-[length:clamp(1.5rem,3vw,2.5rem)] uppercase text-accent [-webkit-text-stroke:calc(var(--title-stroke,0em)*2)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]">
            Hot Off The Griddle!
          </div>
          <h2 className="mt-2 font-[family-name:var(--font-display,var(--font-heading))] text-[length:clamp(2.5rem,6vw,4.5rem)] font-bold uppercase leading-tight text-primary [-webkit-text-stroke:calc(var(--title-stroke,0em)*3)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]">
            ORDER PLACED!
          </h2>
          <p className="mt-2 text-[length:var(--text-body-lg)] text-foreground">
            Thank you, <span className="font-bold text-primary">{successOrder.customer.fullName}</span>! Your patties just hit the griddle.
          </p>
          <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-6 py-2 text-primary font-bold">
            <span>ORDER NUMBER:</span>
            <span className="font-mono text-lg font-black tracking-wider text-primary">{successOrder.orderId}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Estimated Delivery Time: <strong className="text-foreground">{successOrder.estimatedDeliveryMinutes} minutes</strong>
          </p>
        </div>

        {/* Order Details Breakdown */}
        <div className="mt-8 rounded-2xl border border-border/40 bg-background/40 p-6">
          <h3 className="border-b border-border/40 pb-3 font-[family-name:var(--font-heading)] text-2xl uppercase tracking-wider text-primary">
            Order Summary
          </h3>
          <ul className="divide-y divide-border/20 pt-2">
            {successOrder.items?.map((it: any, i: number) => (
              <li key={i} className="flex items-center justify-between py-3 text-[length:var(--text-body)]">
                <div>
                  <span className="font-bold text-primary">{it.quantity}x</span>{" "}
                  <span className="font-medium text-foreground">{it.name}</span>
                </div>
                <span className="font-bold text-foreground">
                  ৳{(it.total ?? (it.unitPrice ? it.unitPrice * it.quantity : 0)).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t-2 border-border/60 pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>৳{(successOrder.pricing?.subtotal ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>
                {successOrder.pricing?.delivery === 0
                  ? "FREE"
                  : `৳${(successOrder.pricing?.delivery ?? DELIVERY_FEE).toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>VAT / Tax (5%)</span>
              <span>৳{(successOrder.pricing?.tax ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border/40 text-xl font-bold text-primary">
              <span>Total Paid</span>
              <span>৳{(successOrder.pricing?.total ?? total).toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-4 border-t border-border/40 pt-3 text-xs text-muted-foreground">
            <p><strong>Delivery To:</strong> {successOrder.customer.address.street}, {successOrder.customer.address.city}</p>
            <p><strong>Contact:</strong> {successOrder.customer.phone} | {successOrder.customer.email}</p>
            {successOrder.customer.notes && <p><strong>Notes:</strong> {successOrder.customer.notes}</p>}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="btn-primary inline-flex text-[length:var(--text-body-lg)]"
          >
            BACK TO HOME
          </Link>
        </div>
      </motion.div>
    );
  }

  // ORDER FORM INTERACTION
  return (
    <div className="mx-auto w-[var(--container)]">
      {/* Title Header */}
      <div className="mb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mb-2 inline-block -rotate-6 font-[family-name:var(--font-display,var(--font-heading))] text-[length:var(--text-h3)] uppercase text-accent [-webkit-text-stroke:calc(var(--title-stroke,0em)*3)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]"
        >
          Smashed To Order
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
          className="font-[family-name:var(--font-heading)] text-[length:clamp(3.5rem,8vw,7rem)] font-bold uppercase leading-[0.88] text-primary [-webkit-text-stroke:calc(var(--title-stroke,0em)*2.5)_var(--title-stroke-color,transparent)] [paint-order:stroke_fill]"
        >
          PLACE YOUR ORDER
        </motion.h1>
        <p className="mx-auto mt-4 max-w-xl text-[length:var(--text-body-lg)] text-foreground">
          Fill in your details below and choose your favorite burgers. We will fire up the griddle and have it delivered smoking hot!
        </p>
      </div>

      {errors.general && (
        <div className="mb-6 rounded-2xl border-2 border-destructive bg-destructive/10 p-4 text-center font-bold text-destructive">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* LEFT COLUMN: Customer Information & Item Selection (7 cols) */}
        <div className="space-y-8 lg:col-span-7">
          {/* Section: Customer Details */}
          <div className="rounded-[var(--radius-card)] border-2 border-white bg-card/90 p-[clamp(1.25rem,2.5vw,2rem)] shadow-lg backdrop-blur-sm">
            <h2 className="mb-4 font-[family-name:var(--font-heading)] text-3xl uppercase tracking-wider text-primary">
              1. Customer Information
            </h2>

            <div className="space-y-4">
              {/* Full Name */}
              <div id="field-fullName">
                <label className="mb-1 block text-sm font-bold uppercase tracking-wider text-foreground">
                  Full Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                  }}
                  className={cn(
                    "w-full rounded-full border bg-white px-5 py-3 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
                    errors.fullName ? "border-destructive bg-destructive/5" : "border-border/40"
                  )}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm font-semibold text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div id="field-email">
                  <label className="mb-1 block text-sm font-bold uppercase tracking-wider text-foreground">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={cn(
                      "w-full rounded-full border bg-white px-5 py-3 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
                      errors.email ? "border-destructive bg-destructive/5" : "border-border/40"
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm font-semibold text-destructive">{errors.email}</p>
                  )}
                </div>

                <div id="field-phone">
                  <label className="mb-1 block text-sm font-bold uppercase tracking-wider text-foreground">
                    Phone Number <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(512) 555-0199"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    className={cn(
                      "w-full rounded-full border bg-white px-5 py-3 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
                      errors.phone ? "border-destructive bg-destructive/5" : "border-border/40"
                    )}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm font-semibold text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Address Street */}
              <div id="field-street">
                <label className="mb-1 block text-sm font-bold uppercase tracking-wider text-foreground">
                  Street Address & House / Apt <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1104 E 6th St, Apt 2B"
                  value={street}
                  onChange={(e) => {
                    setStreet(e.target.value);
                    if (errors.street) setErrors((prev) => ({ ...prev, street: undefined }));
                  }}
                  className={cn(
                    "w-full rounded-full border bg-white px-5 py-3 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
                    errors.street ? "border-destructive bg-destructive/5" : "border-border/40"
                  )}
                />
                {errors.street && (
                  <p className="mt-1 text-sm font-semibold text-destructive">{errors.street}</p>
                )}
              </div>

              {/* Area, City, Postal Code */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-bold uppercase tracking-wider text-foreground">
                    Area / Neighborhood
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. East Austin"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full rounded-full border border-border/40 bg-white px-5 py-3 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div id="field-city">
                  <label className="mb-1 block text-sm font-bold uppercase tracking-wider text-foreground">
                    City <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Austin"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                    }}
                    className={cn(
                      "w-full rounded-full border bg-white px-5 py-3 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
                      errors.city ? "border-destructive bg-destructive/5" : "border-border/40"
                    )}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm font-semibold text-destructive">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold uppercase tracking-wider text-foreground">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    placeholder="78702"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full rounded-full border border-border/40 bg-white px-5 py-3 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="mb-1 block text-sm font-bold uppercase tracking-wider text-foreground">
                  Special Notes / Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Extra Shack sauce, gate code, leave at door..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-2xl border border-border/40 bg-white px-5 py-3 text-base text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          </div>

          {/* Section: Food Item Selection */}
          <div className="rounded-[var(--radius-card)] border-2 border-white bg-card/90 p-[clamp(1.25rem,2.5vw,2rem)] shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border/40">
              <h2 className="font-[family-name:var(--font-heading)] text-3xl uppercase tracking-wider text-primary">
                2. Select Your Burgers
              </h2>
              <span className="text-sm font-bold text-muted-foreground">
                {selectedItems.length} burger(s) selected
              </span>
            </div>

            {errors.items && (
              <p className="mt-3 text-sm font-bold text-destructive">{errors.items}</p>
            )}

            <div className="mt-6 space-y-4">
              <AnimatePresence initial={false}>
                {selectedItems.map((item, index) => {
                  const currentItem = MENU_ITEMS.find((m) => m.id === item.itemId);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col gap-3 rounded-2xl border border-border/30 bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      {/* Clean Flat Burger Dropdown */}
                      <div className="flex-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Burger #{index + 1}
                        </label>
                        <select
                          value={item.itemId}
                          onChange={(e) => handleItemChange(index, e.target.value)}
                          className="w-full cursor-pointer rounded-full border border-border/50 bg-white px-4 py-2.5 text-base font-bold text-foreground shadow-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                          {MENU_ITEMS.map((m) => (
                            <option key={m.id} value={m.id} className="py-2 text-foreground font-medium">
                              {m.name} — ৳{m.price}
                            </option>
                          ))}
                        </select>
                        {currentItem && (
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                            {currentItem.description}
                          </p>
                        )}
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center justify-between gap-4 pt-2 sm:pt-0">
                        {/* Stepper */}
                        <div className="flex items-center rounded-full border border-border/40 bg-white shadow-sm p-1">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(index, -1)}
                            disabled={item.quantity <= 1}
                            className="flex size-8 items-center justify-center rounded-full text-lg font-bold text-primary transition-colors hover:bg-primary/10 disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-bold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(index, 1)}
                            className="flex size-8 items-center justify-center rounded-full text-lg font-bold text-primary transition-colors hover:bg-primary/10"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="min-w-[4.5rem] text-right font-[family-name:var(--font-heading)] text-2xl font-bold text-primary">
                          ৳{((currentItem ? currentItem.price : 0) * item.quantity).toLocaleString()}
                        </div>

                        {/* Remove button */}
                        {selectedItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Add Another Item Button */}
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-primary/50 bg-primary/5 px-6 py-2.5 text-base font-bold uppercase tracking-wider text-primary transition-colors hover:bg-primary/10"
              >
                <span>＋ Add Another Burger</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Order Summary Card (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            <div className="rounded-[var(--radius-card)] border-2 border-white bg-card/95 p-[clamp(1.5rem,3vw,2.5rem)] shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <h3 className="font-[family-name:var(--font-heading)] text-3xl uppercase tracking-wider text-primary">
                  Order Summary
                </h3>
                <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
                  Austin Express
                </span>
              </div>

              {/* Selected Items List */}
              <div className="divide-y divide-border/20 pt-4 max-h-72 overflow-y-auto pr-1">
                {lineItems.map((li, idx) => (
                  <div key={idx} className="flex items-start justify-between py-2.5 text-sm">
                    <div className="pr-2">
                      <p className="font-bold text-foreground">
                        {li.quantity}x {li.menuItem?.name || "Custom Item"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ৳{li.menuItem?.price} each
                      </p>
                    </div>
                    <span className="font-bold text-foreground">
                      ৳{li.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 border-t-2 border-border/50 pt-4 space-y-2 text-base">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-bold text-foreground">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>
                    Delivery Fee{" "}
                    {subtotal >= FREE_DELIVERY_THRESHOLD && (
                      <span className="text-xs font-bold text-emerald-600">(FREE over ৳999)</span>
                    )}
                  </span>
                  <span className="font-bold text-foreground">
                    {delivery === 0 ? "FREE" : `৳${delivery}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>VAT / Tax (5%)</span>
                  <span className="font-bold text-foreground">৳{tax.toLocaleString()}</span>
                </div>
                <div className="flex items-baseline justify-between border-t-2 border-border/60 pt-3 text-primary">
                  <span className="font-[family-name:var(--font-heading)] text-2xl uppercase font-bold">
                    Total
                  </span>
                  <span className="font-[family-name:var(--font-heading)] text-4xl font-extrabold tracking-tight">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "btn-primary mt-6 w-full text-center text-xl font-bold tracking-wider transition-all",
                  isSubmitting && "cursor-not-allowed opacity-75"
                )}
              >
                {isSubmitting ? "PROCESSING ORDER..." : "PLACE ORDER NOW"}
              </button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                🔒 Safe & secure order transmission. Cash or card at delivery.
              </p>
            </div>

            {/* Fun Brand Highlight Box */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="font-[family-name:var(--font-display)] text-lg uppercase text-primary">
                100% Texas Beef • Griddled Hot Daily
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Free hand-cut fries included on all orders over ৳999!
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
