import assert from "node:assert/strict";
import { test } from "node:test";
import { proxyClerkRequest } from "../lib/clerk-proxy";

test("Clerk proxy preserves requests and sessions without leaking its key on redirects", async () => {
  process.env.NEXT_PUBLIC_CLERK_PROXY_URL = "https://app.example/__clerk";
  process.env.CLERK_SECRET_KEY = "test-secret";
  process.env.VERCEL = "1";
  const mockFetch = (async (url: URL, init: RequestInit) => {
    assert.equal(url.origin, "https://frontend-api.clerk.dev");
    assert.equal(url.pathname, "/v1/client/sign_ins");
    assert.equal(url.search, "?test=1");
    assert.equal(init.redirect, "manual");
    assert.equal(init.cache, "no-store");
    assert.equal(init.method, "POST");
    assert.equal(new TextDecoder().decode(init.body as ArrayBuffer), "payload");
    const headers = new Headers(init.headers);
    assert.equal(headers.get("clerk-secret-key"), "test-secret");
    assert.equal(headers.get("clerk-proxy-url"), "https://app.example/__clerk");
    assert.equal(headers.get("x-forwarded-for"), "203.0.113.1");
    assert.equal(headers.get("cookie"), "session=existing");
    assert.equal(headers.has("host"), false);
    return new Response(null, { status: 302, headers: { location: "https://accounts.google.com/", "set-cookie": "session=new; HttpOnly; Secure", "cache-control": "public", "content-encoding": "gzip" } });
  }) as typeof fetch;
  const response = await proxyClerkRequest(new Request("https://app.example/__clerk/v1/client/sign_ins?test=1", {
    method: "POST", body: "payload", headers: { "x-forwarded-for": "203.0.113.1", cookie: "session=existing", host: "app.example", "clerk-secret-key": "spoofed" },
  }), mockFetch);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get("location"), "https://accounts.google.com/");
  assert.equal(response.headers.get("set-cookie"), "session=new; HttpOnly; Secure");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.has("content-encoding"), false);
  assert.equal(response.headers.has("clerk-secret-key"), false);
});

test("a double-slash path cannot send the Clerk key to another host", async () => {
  const mockFetch = (async (url: URL) => {
    assert.equal(url.origin, "https://frontend-api.clerk.dev");
    return new Response("ok");
  }) as typeof fetch;
  const response = await proxyClerkRequest(new Request("https://app.example/__clerk//attacker.example/path"), mockFetch);
  assert.equal(response.status, 200);
});

test("proxy fails closed when unconfigured or upstream fails", async () => {
  const failure = (async () => { throw new Error("private upstream details"); }) as typeof fetch;
  const response = await proxyClerkRequest(new Request("https://app.example/__clerk/v1/client"), failure);
  assert.equal(response.status, 502);
  assert.equal(await response.text(), "Clerk is temporarily unavailable");
  delete process.env.CLERK_SECRET_KEY;
  assert.equal((await proxyClerkRequest(new Request("https://app.example/__clerk"), failure)).status, 503);
});
