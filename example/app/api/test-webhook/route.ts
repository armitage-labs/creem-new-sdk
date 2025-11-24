/**
 * Test Webhook Endpoint
 * 
 * This endpoint generates a mock webhook payload with a valid signature
 * and sends it to your webhook handler for testing.
 * 
 * Usage:
 * 1. Start your dev server: npm run dev
 * 2. Visit: http://localhost:3000/api/test-webhook
 * 3. Check your console for webhook handler output
 */

import crypto from "crypto";

export async function GET() {
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return Response.json(
      {
        error: "CREEM_WEBHOOK_SECRET not configured",
        message: "Add CREEM_WEBHOOK_SECRET to your .env file",
      },
      { status: 500 }
    );
  }

  // Create a mock subscription.active event
  const mockEvent = {
    id: "evt_test_" + Date.now(),
    eventType: "subscription.active",
    created_at: Math.floor(Date.now() / 1000),
    object: {
      id: "sub_test_123",
      mode: "test",
      object: "subscription",
      status: "active",
      collection_method: "charge_automatically",
      current_period_start_date: new Date().toISOString(),
      current_period_end_date: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      next_transaction_date: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      canceled_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {
        referenceId: "user_test_123",
        testMode: "true",
      },
      product: {
        id: "prod_test_123",
        mode: "test",
        object: "product",
        name: "Pro Plan",
        description: "Professional subscription plan",
        price: 2900,
        currency: "USD",
        billing_type: "recurring",
        billing_period: "every-month",
        status: "active",
        tax_mode: "exclusive",
        tax_category: "saas",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      customer: {
        id: "cust_test_123",
        mode: "test",
        object: "customer",
        email: "test@example.com",
        name: "Test User",
        country: "US",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  };

  const payload = JSON.stringify(mockEvent);

  // Generate signature
  const signature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  // Get the base URL
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = process.env.VERCEL_URL || "localhost:3000";
  const webhookUrl = `${protocol}://${host}/api/webhooks`;

  try {
    // Send to webhook handler
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "creem-signature": signature,
      },
      body: payload,
    });

    const result = await response.text();

    return Response.json({
      success: response.ok,
      status: response.status,
      message: "Webhook test completed",
      webhookResponse: result,
      event: {
        type: mockEvent.eventType,
        id: mockEvent.id,
        customer: mockEvent.object.customer.email,
        product: mockEvent.object.product.name,
      },
      note: "Check your server console for detailed webhook handler output",
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to send test webhook",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Alternative: Send a checkout.completed event
 */
export async function POST() {
  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return Response.json(
      { error: "CREEM_WEBHOOK_SECRET not configured" },
      { status: 500 }
    );
  }

  // Create a mock checkout.completed event
  const mockEvent = {
    id: "evt_test_checkout_" + Date.now(),
    eventType: "checkout.completed",
    created_at: Math.floor(Date.now() / 1000),
    object: {
      id: "chk_test_123",
      mode: "test",
      object: "checkout",
      status: "completed",
      request_id: "req_test_123",
      units: 1,
      checkout_url: "https://checkout.creem.io/test",
      success_url: "https://example.com/success",
      created_at: new Date().toISOString(),
      metadata: {
        referenceId: "user_test_456",
      },
      product: {
        id: "prod_test_456",
        mode: "test",
        object: "product",
        name: "Starter Plan",
        description: "One-time purchase",
        price: 4900,
        currency: "USD",
        billing_type: "one-time",
        billing_period: "once",
        status: "active",
        tax_mode: "exclusive",
        tax_category: "digital-goods-service",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      customer: {
        id: "cust_test_456",
        mode: "test",
        object: "customer",
        email: "checkout-test@example.com",
        name: "Checkout Test User",
        country: "US",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      order: {
        id: "ord_test_456",
        mode: "test",
        object: "order",
        customer: "cust_test_456",
        product: "prod_test_456",
        amount: 4900,
        sub_total: 4200,
        tax_amount: 700,
        currency: "USD",
        status: "paid",
        type: "onetime",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  };

  const payload = JSON.stringify(mockEvent);

  // Generate signature
  const signature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  // Get the base URL
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = process.env.VERCEL_URL || "localhost:3000";
  const webhookUrl = `${protocol}://${host}/api/webhooks`;

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "creem-signature": signature,
      },
      body: payload,
    });

    const result = await response.text();

    return Response.json({
      success: response.ok,
      status: response.status,
      message: "Checkout webhook test completed",
      webhookResponse: result,
      event: {
        type: mockEvent.eventType,
        id: mockEvent.id,
        customer: mockEvent.object.customer.email,
        product: mockEvent.object.product.name,
        amount: mockEvent.object.order.amount,
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to send test webhook",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

