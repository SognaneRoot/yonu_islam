/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // firebase-admin (et dans une moindre mesure web-push) ne supportent pas bien d'être
  // empaquetés par webpack dans le bundle serverless — les laisser en dépendance Node
  // externe évite des crashs 500 muets sur les routes API qui les utilisent.
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin", "web-push"],
  },
};

export default nextConfig;
