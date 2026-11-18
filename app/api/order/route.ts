import { NextResponse } from "next/server";
import { validateOrderForm, OrderFormValues } from "@/lib/orderValidation";
import { MENU_ITEMS, TAX_RATE, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/data/menuData";

export async function POST(request: Request) {
  try {
    const body: OrderFormValues = await request.json();

    // 1. Server-side validation
    const { isValid, errors } = validateOrderForm(body);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please correct the errors.",
          errors,
        },
        { status: 400 }
      );
    }

    // 2. Resolve items, prices, and calculate financial breakdown
    const populatedItems = body.items.map((item) => {
      const menuItem = MENU_ITEMS.find((m) => m.id === item.itemId);
      const unitPrice = menuItem ? menuItem.price : 0;
      const itemTotal = unitPrice * item.quantity;
      return {
        id: item.itemId,
        name: menuItem ? menuItem.name : "Unknown Item",
        category: menuItem ? menuItem.category : "Fast Food",
        unitPrice,
        quantity: item.quantity,
        total: Math.round(itemTotal * 100) / 100,
      };
    });

    const subtotal = Math.round(
      populatedItems.reduce((acc, curr) => acc + curr.total, 0) * 100
    ) / 100;
    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + delivery + tax) * 100) / 100;

    // 3. Generate a human-readable order ID and timestamp
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `SHACK-${new Date().getFullYear()}-${randomSuffix}`;
    const createdAt = new Date().toISOString();

    const orderPayload = {
      orderId,
      createdAt,
      status: "CONFIRMED",
      customer: {
        fullName: body.fullName.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        address: {
          street: body.street.trim(),
          area: body.area?.trim() || "",
          city: body.city.trim(),
          postalCode: body.postalCode?.trim() || "",
        },
        notes: body.notes?.trim() || "",
      },
      items: populatedItems,
      pricing: {
        subtotal,
        delivery,
        tax,
        total,
        currency: "USD",
      },
      estimatedDeliveryMinutes: "25-35",
    };

    // 4. Log the order for transparent auditing
    console.log("========================================");
    console.log(`[STACK SHACK ORDER RECIEVED] ID: ${orderId}`);
    console.log(`Customer: ${orderPayload.customer.fullName} (${orderPayload.customer.phone})`);
    console.log(`Address: ${orderPayload.customer.address.street}, ${orderPayload.customer.address.city}`);
    console.log(`Items: ${populatedItems.length} line item(s), Total: $${total.toFixed(2)}`);
    console.log("========================================");

    // 5. Extensibility hooks: Webhook / Database / Email / WhatsApp integration
    // If webhook URL or email service is configured in environment variables:
    const webhookUrl = process.env.ORDER_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
      } catch (webhookErr) {
        console.error("[ORDER WEBHOOK ERROR]:", webhookErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order: orderPayload,
    });
  } catch (error) {
    console.error("[ORDER API ERROR]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred while processing your order.",
      },
      { status: 500 }
    );
  }
}
