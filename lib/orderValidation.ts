import { MENU_ITEMS } from "@/data/menuData";

export interface OrderItemInput {
  itemId: string;
  quantity: number;
}

export interface OrderFormValues {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  area?: string;
  city: string;
  postalCode?: string;
  notes?: string;
  items: OrderItemInput[];
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  items?: string;
  general?: string;
}

export function validateOrderForm(values: OrderFormValues): {
  isValid: boolean;
  errors: ValidationErrors;
} {
  const errors: ValidationErrors = {};

  // Full Name
  if (!values.fullName || values.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name (at least 2 characters).";
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!values.email || !emailRegex.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // Phone
  const phoneClean = (values.phone || "").replace(/[\s\-\(\)\.]/g, "");
  if (!values.phone || phoneClean.length < 7) {
    errors.phone = "Please enter a valid phone number (at least 7 digits).";
  }

  // Street
  if (!values.street || values.street.trim().length < 3) {
    errors.street = "Please enter your street address / house number.";
  }

  // City
  if (!values.city || values.city.trim().length < 2) {
    errors.city = "Please enter your city.";
  }

  // Items
  if (!values.items || values.items.length === 0) {
    errors.items = "Please add at least one item to your order.";
  } else {
    const validItems = values.items.filter((item) => {
      const exists = MENU_ITEMS.some((m) => m.id === item.itemId);
      return exists && item.quantity > 0;
    });
    if (validItems.length === 0) {
      errors.items = "Please select a valid menu item with quantity at least 1.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
