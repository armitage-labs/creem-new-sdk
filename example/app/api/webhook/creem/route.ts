import { creem } from "@/app/lib/creem";

/**
 * Creem Webhook Handler
 *
 * This route handles all webhook events from Creem.
 * It's framework-agnostic and demonstrates the full webhook handling capability.
 */
export async function POST(req: Request) {
  try {
    // IMPORTANT: Get raw body as text (do NOT use req.json())
    const payload = await req.text();

    // Get signature from headers
    const signature = req.headers.get("creem-signature");

    if (!signature) {
      return Response.json(
        { error: "Missing signature header" },
        { status: 400 }
      );
    }

    // Handle all webhook events
    await creem.webhooks.handleEvents(payload, signature, {
      // Special handlers for access control
      onGrantAccess: async ({ customer, product, metadata }) => {},

      onRevokeAccess: async ({ customer, product, metadata }) => {},

      onCheckoutCompleted: async ({ order, product, customer }) => {},
    });

    // Return success response
    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Webhook processing failed:", error);

    // Return error response
    if (error instanceof Error && error.message.includes("signature")) {
      return Response.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    return Response.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
