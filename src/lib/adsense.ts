/**
 * AdSense paycheck banner. Publisher id and slot are public; they ship in the page.
 */
export const ADSENSE_CLIENT = "ca-pub-9069566302664336";
export const ADSENSE_SLOT = "6638467983";

export function adsenseConfig(): { client: string; slot: string; enabled: boolean } {
  const client = ADSENSE_CLIENT.trim();
  const slot = ADSENSE_SLOT.trim();
  return {
    client,
    slot,
    enabled: /^ca-pub-\d{10,16}$/.test(client) && /^\d{6,12}$/.test(slot),
  };
}
