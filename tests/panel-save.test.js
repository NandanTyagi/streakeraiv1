import assert from "node:assert/strict";
import { test, afterEach } from "node:test";
import savePanelToDb from "../utils/v2/savePanelToDb";
import getCurrentUserBoardFromDb from "../utils/getCurrentUserBoardFromDb";
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
process.env.NEXT_PUBLIC_USE_V3_ENGINE = "false";
const panel = { goalToAchieve: "Goal", days: 31, habitsNames: ["Sleep"], habitsValues: ["8h"], cells: [], history: [] };
test("new panel returns persisted ID and sends actual history", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "/api/v2/panels/create");
    const body = JSON.parse(options.body);
    assert.equal(body.history.length, 1);
    return Response.json({ ...body, _id: "stored-id" }, { status: 201 });
  };
  const result = await savePanelToDb(panel, "test@example.com");
  assert.equal(result.saved, true);
  assert.equal(result.panel._id, "stored-id");
  assert.deepEqual(panel.history, []);
});
test("existing panel updates directly and returns a boolean success", async () => {
  let calls = 0;
  globalThis.fetch = async (url) => {
    calls++;
    assert.equal(url, "/api/v2/panels/update");
    return Response.json({ ...panel, _id: "stored-id" }, { status: 201 });
  };
  assert.equal((await savePanelToDb({ ...panel, _id: "stored-id" }, "test@example.com")).saved, true);
  assert.equal(calls, 1);
});
test("HTTP and network failures never report a successful save", async () => {
  for (const status of [401, 404, 500]) {
    globalThis.fetch = async () => Response.json({ error: "Error" }, { status });
    assert.equal((await savePanelToDb({ ...panel, _id: "id" }, "test@example.com")).saved, false);
    assert.equal((await savePanelToDb(panel, "test@example.com")).saved, false);
  }
  globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
  assert.equal((await savePanelToDb(panel, "test@example.com")).saved, false);
});
test("database failure is not treated as a missing board", async () => {
  globalThis.fetch = async () => Response.json({ error: "Error" }, { status: 500 });
  await assert.rejects(getCurrentUserBoardFromDb("test@example.com"));
  globalThis.fetch = async () => Response.json({ error: "User has no panels" }, { status: 404 });
  assert.equal(await getCurrentUserBoardFromDb("test@example.com"), null);
});
import { fetchV3Goals } from "../utils/v3/api";
test("v3 uses same-origin HTTPS even with a stale public API domain", async () => {
  process.env.NEXT_PUBLIC_API_DOMAIN = "http://stale.example/api";
  globalThis.window = { location: { origin: "https://streaker-v1.vercel.app" } };
  globalThis.fetch = async (url) => {
    assert.equal(url, "/api/v3/goals?userId=test%40example.com&tz=UTC");
    return Response.json([]);
  };
  try { await fetchV3Goals({ userId: "test@example.com", tz: "UTC" }); }
  finally { delete globalThis.window; delete process.env.NEXT_PUBLIC_API_DOMAIN; }
});
