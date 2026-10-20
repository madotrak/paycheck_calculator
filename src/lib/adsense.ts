/**
 * AdSense leaderboard. Paste the publisher id and ad unit slot from
 * AdSense → Ads → By ad unit. Leave both blank to keep the reserved banner.
 */
export const ADSENSE_CLIENT = "";
export const ADSENSE_SLOT = "";

export function adsenseConfig(): { client: string; slot: string; enabled: boolean } {
  const client = ADSENSE_CLIENT.trim();
  const slot = ADSENSE_SLOT.trim();
  return {
    client,
    slot,
    enabled: /^ca-pub-\d{10,16}$/.test(client) && /^\d{6,12}$/.test(slot),
  };
}
