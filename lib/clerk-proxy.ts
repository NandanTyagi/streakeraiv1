// Clerk Core 2 / Next 14 equivalent of the newer SDK's Frontend API proxy.
// https://clerk.com/docs/guides/dashboard/dns-domains/proxy-fapi
export async function proxyClerkRequest(request: Request, fetcher: typeof fetch = fetch) {
  const proxyUrl = process.env.NEXT_PUBLIC_CLERK_PROXY_URL;
  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!proxyUrl || !secretKey) return new Response("Clerk proxy is not configured", { status: 503 });

  const incoming = new URL(request.url);
  const prefix = new URL(proxyUrl).pathname.replace(/\/$/, "");
  if (incoming.pathname !== prefix && !incoming.pathname.startsWith(`${prefix}/`)) {
    return new Response("Not found", { status: 404 });
  }
  // Assign the path separately: a //path must never change the upstream host.
  const upstream = new URL("https://frontend-api.clerk.dev");
  upstream.pathname = incoming.pathname.slice(prefix.length) || "/";
  upstream.search = incoming.search;
  const headers = new Headers(request.headers);
  for (const name of ["host", "connection", "content-length", "transfer-encoding", "accept-encoding"]) headers.delete(name);
  headers.set("Clerk-Proxy-Url", proxyUrl);
  headers.set("Clerk-Secret-Key", secretKey);
  // Vercel overwrites this header with the actual client IP at its edge.
  headers.set("X-Forwarded-For", process.env.VERCEL === "1" ? request.headers.get("x-forwarded-for") || "" : "");
  try {
    const response = await fetcher(upstream, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      redirect: "manual", // Never forward the secret key to a redirect destination.
      cache: "no-store",
    });
    const responseHeaders = new Headers(response.headers);
    // fetch decompresses bodies; do not preserve the upstream wire encoding/size.
    for (const name of ["content-encoding", "content-length", "transfer-encoding", "connection", "clerk-secret-key"]) responseHeaders.delete(name);
    responseHeaders.set("Cache-Control", "no-store");
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch {
    return new Response("Clerk is temporarily unavailable", { status: 502 });
  }
}
