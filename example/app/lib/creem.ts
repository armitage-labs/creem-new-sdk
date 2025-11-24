import { createCreem } from "@/@creem";

export const creem = createCreem({
  apiKey: process.env.CREEM_API_KEY!,
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET,
  testMode: true,
});

// await creem.webhooks.handleEvents(payload, signature, {
//   onAccessGranted: () => {
//     console.log("Access granted");
//   },
//   onAccessRevoked: () => {
//     console.log("Access revoked");
//   },
// })

/**
 * TODO:
 * - Implement webhook validation
 * - Implement hasAccessGranted and hasAccessRevoked
 * - Test
 */
