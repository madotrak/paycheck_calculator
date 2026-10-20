import { useEffect, useRef } from "react";
import { adsenseConfig } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

const { client, slot, enabled } = adsenseConfig();

export function AdsenseBanner() {
  const pushed = useRef(false);

  useEffect(() => {
    if (!enabled || pushed.current) return;
    pushed.current = true;

    const selector = 'script[data-adsense="true"]';
    if (!document.querySelector(selector)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
      script.crossOrigin = "anonymous";
      script.dataset.adsense = "true";
      document.head.appendChild(script);
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* A hot reload can push the same unit twice. AdSense throws; the first push stands. */
    }
  }, []);

  return (
    <aside aria-label="Advertisement" className="border-b border-line bg-card">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-3 sm:px-6">
        <p className="mb-1.5 text-xs font-medium text-faint">Advertisement</p>
        <div className="relative h-16 w-full max-w-3xl overflow-hidden rounded-lg border border-line bg-inset sm:h-24">
          {enabled ? (
            <ins
              className="adsbygoogle"
              style={{ display: "block", width: "100%", height: "100%" }}
              data-ad-client={client}
              data-ad-slot={slot}
              data-ad-format="horizontal"
              data-full-width-responsive="true"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-sm font-medium text-muted">AdSense banner</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
