import { resolveApiBase } from "./apiConfig.js";

const base = resolveApiBase(import.meta.env.VITE_API_URL, import.meta.env.PROD);
export const mediaUrl = (url) =>
  url?.startsWith("/uploads/") ? base.replace(/\/api\/?$/, "") + url : url;
export async function api(path, { token, method = "GET", body } = {}) {
  const form = body instanceof FormData;
  let response;
  try {
    response = await fetch(base + path, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(!form && body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? (form ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error(
      "No se puede conectar con la API. Comprueba que el servidor esté activo.",
    );
  }
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) {
    const e = new Error(data.message || "La solicitud falló");
    e.status = response.status;
    throw e;
  }
  return data;
}
export const publicPdfUrl = (id) =>
  base + `/public/properties/${encodeURIComponent(id)}/pdf`;
