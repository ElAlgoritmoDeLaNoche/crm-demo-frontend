export function propertyShareUrl(
  id,
  origin = globalThis.location?.origin || "",
) {
  return `${origin}/?property=${encodeURIComponent(id)}`;
}
export function dateTimeInput(value = new Date()) {
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
export function linkedPayload(data) {
  return Object.fromEntries(
    Object.entries(data).map(([k, v]) => [
      k,
      /^(contactId|propertyId|dealId)$/.test(k) && !v ? null : v,
    ]),
  );
}
