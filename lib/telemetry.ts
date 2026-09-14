"use client";

// Action weight multipliers for Recommender learning
export const ACTION_WEIGHTS = {
  VIEW: 1.0,
  CLICK: 1.5,
  SEARCH_SELECT: 2.0,
  CART_ADD: 4.0,
  LIKE: 3.0,
  PURCHASE: 5.0,
} as const;

export type InteractionActionType = keyof typeof ACTION_WEIGHTS;

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  let sessionId = localStorage.getItem("ee_session_id");
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
    localStorage.setItem("ee_session_id", sessionId);
  }
  return sessionId;
}

export function getStoredScentPreference(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ee_scent_preference");
}

export function saveScentPreference(preference: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("ee_scent_preference", preference);
}

export async function trackInteraction(
  productId: string,
  action: InteractionActionType,
  dwellTimeMs?: number
): Promise<void> {
  if (!productId || typeof window === "undefined") return;

  try {
    const sessionId = getOrCreateSessionId();
    const weight = ACTION_WEIGHTS[action] || 1.0;

    // Use sendBeacon if available for non-blocking telemetry on page unloads, else fetch
    const payload = JSON.stringify({
      sessionId,
      productId,
      action,
      dwellTimeMs,
      weight,
    });

    if (navigator.sendBeacon && (action === "VIEW" || dwellTimeMs)) {
      navigator.sendBeacon("/api/interactions", payload);
    } else {
      fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch((e) => console.warn("Telemetry ping failed:", e));
    }
  } catch (err) {
    // Non-intrusive: Never crash UI on telemetry failure
    console.warn("Telemetry error:", err);
  }
}
