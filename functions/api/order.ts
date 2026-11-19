import { MENU_ITEMS, TAX_RATE, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "../../data/menuData";

interface OrderRequestItem {
  itemId: string;
  quantity: number;
}

interface OrderRequestBody {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  area?: string;
  city: string;
  postalCode?: string;
  notes?: string;
  items: OrderRequestItem[];
}

export async function onRequestPost(context: { request: Request }) {
  try {
    const body: OrderRequestBody = await context.request.json();

    if (!body.fullName || !body.email || !body.phone || !body.street || !body.city) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please fill in all required customer details.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Your order must contain at least one item.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

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
        total: Math.round(itemTotal),
      };
    });

    const subtotal = Math.round(
      populatedItems.reduce((acc, curr) => acc + curr.total, 0)
    );
    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const tax = Math.round(subtotal * TAX_RATE);
    const total = Math.round(subtotal + delivery + tax);

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
        currency: "BDT",
      },
      estimatedDeliveryMinutes: "25-35",
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order placed successfully!",
        order: orderPayload,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "An internal error occurred while processing order.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
