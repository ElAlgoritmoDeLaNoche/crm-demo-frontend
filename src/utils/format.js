export const money = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
export const compact = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
export const date = (value) =>
  value
    ? new Date(value).toLocaleDateString("es-MX", {
        month: "short",
        day: "numeric",
      })
    : "—";
export const initials = (name) =>
  name
    ?.split(" ")
    .slice(0, 2)
    .map((x) => x[0])
    .join("") || "AE";
