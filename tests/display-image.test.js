import assert from "node:assert/strict";
import { test } from "node:test";
import { displayDays, drawDisplay } from "../utils/displayImage";
import { decodeDisplayImage, newDisplayToken, displayImageUrl } from "../lib/display-image";

test("display date window stays inside the month and includes today", () => {
  for (const date of [new Date(2026, 9, 1), new Date(2026, 9, 13), new Date(2026, 9, 31), new Date(2028, 1, 29)]) {
    const days = displayDays(date);
    assert.equal(days.length, 14);
    assert.ok(days.includes(date.getDate()));
    assert.ok(days[0] >= 1);
    assert.ok(days[13] <= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
  }
});
test("native renderer uses 480x800 and omits interactive controls", () => {
  const labels = [];
  const ctx = { fillRect(){}, strokeRect(){}, beginPath(){}, moveTo(){}, lineTo(){}, stroke(){}, measureText(t){return {width:t.length*7};}, fillText(t){labels.push(t);} };
  const canvas = { getContext(){return ctx;} };
  drawDisplay(canvas, { goalToAchieve:"My intention", habitsNames:["Sleep"], habitsValues:["8h"], cells:[{rowNr:13,colNr:1,isClear:false,isDone:true}] }, new Date(2026,9,13));
  assert.equal(canvas.width,480); assert.equal(canvas.height,800);
  assert.ok(labels.includes("Sleep"));
  assert.ok(!labels.includes("Save")); assert.ok(!labels.includes("Reset"));
});
test("uploads reject invalid types, sizes and dimensions", () => {
  for (const value of [null, "data:image/svg+xml;base64,abc", "data:image/png;base64,abc", "x".repeat(2800001)]) assert.throws(() => decodeDisplayImage(value));
  const png = Buffer.alloc(33);
  Buffer.from("89504e470d0a1a0a", "hex").copy(png); png.write("IHDR",12); png.writeUInt32BE(480,16); png.writeUInt32BE(800,20);
  assert.equal(decodeDisplayImage(`data:image/png;base64,${png.toString("base64")}`).length,33);
  png.writeUInt32BE(1000,16);
  assert.throws(() => decodeDisplayImage(`data:image/png;base64,${png.toString("base64")}`));
});
test("display URLs use unguessable independent tokens", () => {
  const a=newDisplayToken(), b=newDisplayToken();
  assert.match(a,/^[a-f0-9]{48}$/); assert.notEqual(a,b);
  assert.equal(displayImageUrl(a),`/api/display/${a}`);
});
