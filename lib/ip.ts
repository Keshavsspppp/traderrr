export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp =
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    headers.get("x-client-ip");

  return realIp?.trim() || "unknown";
}
