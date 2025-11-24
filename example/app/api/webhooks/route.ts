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
      onGrantAccess: async (context) => {
        console.log("🎉 GRANT ACCESS", {
          reason: context.reason,
          customer: context.customer.email,
          product: context.product.name,
          subscriptionId: context.id,
          metadata: context.metadata,
        });

        // Your logic here:
        // - Update user role in database
        // - Send welcome email
        // - Enable features
        // Example: await db.user.update({ id: context.metadata?.referenceId, hasAccess: true })
      },

      onRevokeAccess: async (context) => {
        console.log("🚫 REVOKE ACCESS", {
          reason: context.reason,
          customer: context.customer.email,
          product: context.product.name,
          subscriptionId: context.id,
          metadata: context.metadata,
        });

        // Your logic here:
        // - Revoke user access in database
        // - Send notification email
        // - Disable features
        // Example: await db.user.update({ id: context.metadata?.referenceId, hasAccess: false })
      },

      // Individual event handlers (optional, in addition to onGrantAccess/onRevokeAccess)
      onCheckoutCompleted: async (data) => {
        console.log("✅ CHECKOUT COMPLETED", {
          webhookId: data.webhookId,
          customer: data.customer?.email,
          product: data.product.name,
          amount: data.order?.amount,
          subscription: data.subscription?.id,
          metadata: data.metadata,
        });

        // Your logic here:
        // - Send receipt email
        // - Track analytics
        // - Create user account if needed
      },

      onSubscriptionActive: async (data) => {
        console.log("📝 SUBSCRIPTION ACTIVE", {
          webhookId: data.webhookId,
          customer: data.customer.email,
          product: data.product.name,
          subscriptionId: data.id,
          status: data.status,
        });

        // Additional logic specific to active state
      },

      onSubscriptionTrialing: async (data) => {
        console.log("🆓 SUBSCRIPTION TRIALING", {
          webhookId: data.webhookId,
          customer: data.customer.email,
          product: data.product.name,
          subscriptionId: data.id,
        });

        // Additional logic specific to trial state
      },

      onSubscriptionPaid: async (data) => {
        console.log("💳 SUBSCRIPTION PAID", {
          webhookId: data.webhookId,
          customer: data.customer.email,
          product: data.product.name,
          subscriptionId: data.id,
          lastTransactionDate: data.lastTransactionDate,
          nextTransactionDate: data.nextTransactionDate,
        });

        // Additional logic for payment events
      },

      onSubscriptionCanceled: async (data) => {
        console.log("❌ SUBSCRIPTION CANCELED", {
          webhookId: data.webhookId,
          customer: data.customer.email,
          product: data.product.name,
          subscriptionId: data.id,
          canceledAt: data.canceledAt,
        });

        // Note: Access should still be valid until period ends
        // onRevokeAccess will be called separately when appropriate
      },

      onSubscriptionExpired: async (data) => {
        console.log("⏰ SUBSCRIPTION EXPIRED", {
          webhookId: data.webhookId,
          customer: data.customer.email,
          product: data.product.name,
          subscriptionId: data.id,
        });

        // Access will be revoked via onRevokeAccess
      },

      onSubscriptionPaused: async (data) => {
        console.log("⏸️ SUBSCRIPTION PAUSED", {
          webhookId: data.webhookId,
          customer: data.customer.email,
          product: data.product.name,
          subscriptionId: data.id,
        });

        // Access will be revoked via onRevokeAccess
      },

      onSubscriptionUnpaid: async (data) => {
        console.log("💸 SUBSCRIPTION UNPAID", {
          webhookId: data.webhookId,
          customer: data.customer.email,
          product: data.product.name,
          subscriptionId: data.id,
        });

        // Send payment reminder email
      },

      onSubscriptionUpdate: async (data) => {
        console.log("🔄 SUBSCRIPTION UPDATED", {
          webhookId: data.webhookId,
          customer: data.customer.email,
          product: data.product.name,
          subscriptionId: data.id,
        });

        // Handle subscription changes
      },

      onSubscriptionPastDue: async (data) => {
        console.log("⚠️ SUBSCRIPTION PAST DUE", {
          webhookId: data.webhookId,
          customer: data.customer.email,
          product: data.product.name,
          subscriptionId: data.id,
        });

        // Send urgent payment reminder
      },

      onRefundCreated: async (data) => {
        console.log("💰 REFUND CREATED", {
          webhookId: data.webhookId,
          refundAmount: data.refundAmount,
          reason: data.reason,
          customer: data.customer,
        });

        // Handle refund logic
      },

      onDisputeCreated: async (data) => {
        console.log("⚖️ DISPUTE CREATED", {
          webhookId: data.webhookId,
          amount: data.amount,
          customer: data.customer,
        });

        // Handle dispute notification
      },
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

