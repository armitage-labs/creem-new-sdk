/**
 * Creem Webhook Types
 *
 * This file contains all TypeScript types needed to work with Creem webhooks.
 * It's designed to be framework-agnostic and fully type-safe.
 *
 * No external dependencies required - just TypeScript!
 */

import type {
  Checkout,
  NestedSubscriptionInCheckout,
  NormalizedCheckout,
} from "./checkout";
import type { Customer } from "./customer";
import type { Product } from "./products";
import type { NormalizedSubscription, Subscription } from "./subscriptions";
import type { Transaction } from "./transactions";

// Re-export types for convenience
export type {
  Checkout,
  Customer,
  NestedSubscriptionInCheckout,
  NormalizedCheckout,
  NormalizedSubscription,
  Product,
  Subscription,
  Transaction,
};

// ============================================================================
// WEBHOOK EVENT TYPES
// ============================================================================

/**
 * Base webhook event structure (as received from API with snake_case)
 */
export interface WebhookEvent<TType extends string = string, TData = unknown> {
  /** Unique webhook event ID */
  id: string;
  /** Webhook event type */
  eventType: TType;
  /** Webhook event creation timestamp (snake_case from API) */
  created_at: number;
  /** The webhook event data */
  object: TData;
}

/**
 * Checkout completed event callback parameter.
 * All properties are at the top level for easy destructuring.
 */
export type CheckoutCompletedEvent = {
  /** Webhook event type identifier */
  webhookEventType: "checkout.completed";
  /** Unique webhook event ID */
  webhookId: string;
  /** Webhook event creation timestamp */
  webhookCreatedAt: number;
} & NormalizedCheckout;

/**
 * Subscription event callback parameter.
 */
export type SubscriptionEvent<T extends string> = {
  /** Webhook event type identifier */
  webhookEventType: T;
  /** Unique webhook event ID */
  webhookId: string;
  /** Webhook event creation timestamp */
  webhookCreatedAt: number;
} & NormalizedSubscription;

// ============================================================================
// ACCESS CONTROL TYPES
// ============================================================================

/**
 * Reasons for granting access
 */
export type GrantAccessReason =
  | "subscription_active"
  | "subscription_trialing"
  | "subscription_paid";

/**
 * Reasons for revoking access
 */
export type RevokeAccessReason = "subscription_paused" | "subscription_expired";

/**
 * Context passed to onGrantAccess callback.
 * All subscription properties are flattened for easy destructuring.
 */
export type GrantAccessContext = {
  /** The reason for granting access */
  reason: GrantAccessReason;
} & NormalizedSubscription;

/**
 * Context passed to onRevokeAccess callback.
 * All subscription properties are flattened for easy destructuring.
 */
export type RevokeAccessContext = {
  /** The reason for revoking access */
  reason: RevokeAccessReason;
} & NormalizedSubscription;

// ============================================================================
// WEBHOOK HANDLER TYPES
// ============================================================================

/**
 * Webhook configuration options
 */
export interface WebhookOptions {
  /**
   * Creem Webhook Secret (for signature verification)
   * @required
   */
  webhookSecret: string;

  /**
   * Called when a checkout is completed.
   * All properties are flattened for easy destructuring.
   *
   * @example
   * onCheckoutCompleted: async ({ webhookEventType, product, customer, order, subscription }) => {
   *   console.log(`Checkout completed: ${customer?.email} purchased ${product.name}`);
   * }
   */
  onCheckoutCompleted?: (data: CheckoutCompletedEvent) => void | Promise<void>;

  /**
   * Called when a subscription becomes active.
   *
   * @example
   * onSubscriptionActive: async ({ product, customer, status }) => {
   *   console.log(`${customer.email} subscribed to ${product.name}`);
   * }
   */
  onSubscriptionActive?: (
    data: SubscriptionEvent<"subscription.active">
  ) => void | Promise<void>;

  /**
   * Called when a subscription is in trialing state.
   */
  onSubscriptionTrialing?: (
    data: SubscriptionEvent<"subscription.trialing">
  ) => void | Promise<void>;

  /**
   * Called when a subscription is canceled.
   */
  onSubscriptionCanceled?: (
    data: SubscriptionEvent<"subscription.canceled">
  ) => void | Promise<void>;

  /**
   * Called when a subscription is paid.
   */
  onSubscriptionPaid?: (
    data: SubscriptionEvent<"subscription.paid">
  ) => void | Promise<void>;

  /**
   * Called when a subscription has expired.
   */
  onSubscriptionExpired?: (
    data: SubscriptionEvent<"subscription.expired">
  ) => void | Promise<void>;

  /**
   * Called when a subscription is unpaid.
   */
  onSubscriptionUnpaid?: (
    data: SubscriptionEvent<"subscription.unpaid">
  ) => void | Promise<void>;

  /**
   * Called when a subscription is updated.
   */
  onSubscriptionUpdate?: (
    data: SubscriptionEvent<"subscription.update">
  ) => void | Promise<void>;

  /**
   * Called when a subscription is past due.
   */
  onSubscriptionPastDue?: (
    data: SubscriptionEvent<"subscription.past_due">
  ) => void | Promise<void>;

  /**
   * Called when a subscription is paused.
   */
  onSubscriptionPaused?: (
    data: SubscriptionEvent<"subscription.paused">
  ) => void | Promise<void>;

  /**
   * Called when a user should be granted access to the platform.
   * This is triggered for: active, trialing, and paid subscriptions.
   *
   * NOTE: This may be called multiple times for the same user/subscription.
   * Implement this as an idempotent operation (safe to call repeatedly).
   *
   * @example
   * onGrantAccess: async ({ reason, product, customer, metadata }) => {
   *   const userId = metadata?.referenceId as string;
   *   console.log(`Granting ${reason} to ${customer.email} for ${product.name}`);
   *   // Your database logic here
   * }
   */
  onGrantAccess?: (context: GrantAccessContext) => void | Promise<void>;

  /**
   * Called when a user's access should be revoked.
   * This is triggered for: paused, expired, and canceled (after period ends) subscriptions.
   *
   * NOTE: This may be called multiple times for the same user/subscription.
   * Implement this as an idempotent operation (safe to call repeatedly).
   *
   * @example
   * onRevokeAccess: async ({ reason, product, customer, metadata }) => {
   *   const userId = metadata?.referenceId as string;
   *   console.log(`Revoking access (${reason}) from ${customer.email}`);
   *   // Your database logic here
   * }
   */
  onRevokeAccess?: (context: RevokeAccessContext) => void | Promise<void>;
}
