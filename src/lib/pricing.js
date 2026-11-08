// Single source of truth for booking pricing on the client.
// Must mirror the backend (SERVICE_FEE_RATE in bookingRoutes.js).
export const SERVICE_FEE_RATE = 0.08;
export const SERVICE_FEE_PCT = Math.round(SERVICE_FEE_RATE * 100); // 8

// The platform service fee on a subtotal, rounded to whole dollars.
export const serviceFee = (subtotal) => Math.round(subtotal * SERVICE_FEE_RATE);

// Plain-language explanation shown next to the fee so customers know what it's for.
export const SERVICE_FEE_NOTE =
  `The ${SERVICE_FEE_PCT}% service fee covers secure booking, 24/7 roadside concierge support, and insurance administration.`;
