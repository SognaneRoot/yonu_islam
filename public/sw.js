self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Un gestionnaire fetch (même minimal) est requis par certains navigateurs pour
// considérer le site comme "installable" (critère PWA) — ici simple passthrough réseau.
self.addEventListener("fetch", () => {});

self.addEventListener("push", (event) => {
  let data = { title: "Mon Chemin vers Allah", body: "Rappel" };
  try {
    if (event.data) data = event.data.json();
  } catch (e) {
    // corps non-JSON — on garde le message par défaut
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: data.tag || "mcva-reminder",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("/");
    })
  );
});
