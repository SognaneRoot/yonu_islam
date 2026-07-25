"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // pas grave si ça échoue (ex. navigateur non compatible) — le site reste utilisable
      });
    }
  }, []);

  return null;
}
