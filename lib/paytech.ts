import crypto from "crypto";

export function isPaytechConfigured() {
  return !!(process.env.PAYTECH_API_KEY && process.env.PAYTECH_API_SECRET);
}

export function getPaytechHeaders() {
  return {
    "Content-Type": "application/json",
    API_KEY: process.env.PAYTECH_API_KEY!,
    API_SECRET: process.env.PAYTECH_API_SECRET!,
  };
}

// Documenté : message = `${final_item_price ?? item_price}|${ref_command}|${api_key}`,
// HMAC-SHA256 avec l'api_secret comme clé.
export function verifyPaytechHmac(hmacReceived: string, amount: string | number, refCommand: string) {
  const message = `${amount}|${refCommand}|${process.env.PAYTECH_API_KEY}`;
  const expected = crypto.createHmac("sha256", process.env.PAYTECH_API_SECRET!).update(message).digest("hex");
  return expected === hmacReceived;
}

// Repli documenté si hmac_compute est absent : hash SHA256 simple des clés.
export function verifyPaytechSha256(apiKeySha256: string, apiSecretSha256: string) {
  const expectedKey = crypto.createHash("sha256").update(process.env.PAYTECH_API_KEY!).digest("hex");
  const expectedSecret = crypto.createHash("sha256").update(process.env.PAYTECH_API_SECRET!).digest("hex");
  return expectedKey === apiKeySha256 && expectedSecret === apiSecretSha256;
}

// La doc PayTech encode parfois custom_field en Base64, parfois en JSON brut selon
// le type d'événement (incohérence de leur côté, gérée ici dans les deux sens.
export function decodeCustomField(raw: string): any {
  try {
    return JSON.parse(raw);
  } catch {
    try {
      return JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
    } catch {
      return null;
    }
  }
}