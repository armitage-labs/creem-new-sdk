import { NextResponse } from "next/server";
import { creem } from "@/app/lib/creem";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");
  const method = searchParams.get("method");
  const body = await request.json();

  try {
    let result;

    console.log("endpoint", endpoint);
    console.log("method", method);
    console.log("body", body);

    // Dynamic dispatch based on endpoint and method
    // This is a simplified dispatcher for testing purposes
    switch (endpoint) {
      case "products":
        if (method === "list") result = await creem.products.list(body);
        if (method === "get") result = await creem.products.get(body);
        if (method === "create") result = await creem.products.create(body);
        break;
      case "checkouts":
        if (method === "get") result = await creem.checkouts.get(body);
        if (method === "create") result = await creem.checkouts.create(body);
        break;
      case "customers":
        if (method === "list") result = await creem.customers.list(body);
        if (method === "get") result = await creem.customers.get(body);
        if (method === "createPortal")
          result = await creem.customers.createPortal(body);
        break;
      case "subscriptions":
        if (method === "get") result = await creem.subscriptions.get(body);
        if (method === "cancel")
          result = await creem.subscriptions.cancel(body);
        if (method === "update")
          result = await creem.subscriptions.update(body);
        if (method === "upgrade")
          result = await creem.subscriptions.upgrade(body);
        break;
      case "transactions":
        if (method === "list") result = await creem.transactions.list(body);
        if (method === "get") result = await creem.transactions.get(body);
        break;
      case "licenses":
        if (method === "activate") result = await creem.licenses.activate(body);
        if (method === "validate") result = await creem.licenses.validate(body);
        if (method === "deactivate")
          result = await creem.licenses.deactivate(body);
        break;
      case "discounts":
        if (method === "get") result = await creem.discounts.get(body);
        if (method === "create") result = await creem.discounts.create(body);
        if (method === "delete") result = await creem.discounts.delete(body);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid endpoint" },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("SDK Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal SDK Error" },
      { status: 500 }
    );
  }
}
