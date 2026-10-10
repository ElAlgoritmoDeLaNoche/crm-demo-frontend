const productionBackend = "https://crm-demo-backend-production-9526.up.railway.app";

export function resolveApiBase(configuredUrl, production = false) {
  const base = configuredUrl?.trim() ||
    (production ? productionBackend : "http://localhost:4000");
  return `${base.replace(/\/+$/, "").replace(/\/api$/, "")}/api`;
}
