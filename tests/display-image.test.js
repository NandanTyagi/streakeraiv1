import assert from "node:assert/strict";
import { test } from "node:test";
import { displayDays, drawDisplay } from "../utils/displayImage";
import { decodeDisplayImage, newDisplayToken, displayImageUrl } from "../lib/display-image";

test("display fills days 1–14 initially then rolls forward", () => {
  for (const date of [new Date(2026, 9, 1), new Date(2026, 9, 13), new Date(2026, 9, 14), new Date(2026, 9, 15), new Date(2026, 9, 17), new Date(2026, 9, 31), new Date(2028, 1, 29)]) {
    const days = displayDays(date);
    assert.equal(days.length, 14);
    assert.equal(days[days.length - 1], Math.max(14, date.getDate()));
    assert.equal(days[0], Math.max(1, date.getDate() - 13));
    assert.ok(days.every((day, i) => day === days[0] + i));
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
test("rows retain size while today moves down then stays at the bottom", () => {
  for (const day of [1, 13, 14, 15, 17, 31]) {
    const rects = []; const highlights = [];
    const ctx = { fillRect(x,y,w,h){if(x === 12 && this.fillStyle === "black") highlights.push(y);}, strokeRect(x,y,w,h){rects.push({x,y,w,h});}, beginPath(){}, moveTo(){}, lineTo(){}, stroke(){}, measureText(t){return {width:t.length*7};}, fillText(){} };
    drawDisplay({getContext(){return ctx;}}, {goalToAchieve:"Goal",habitsNames:["Sleep"],habitsValues:["8h"],cells:[]}, new Date(2026,9,day));
    assert.equal(rects.length, 14);
    assert.ok(rects.every(rect => rect.h === 37));
    assert.equal(rects[0].y, 169);
    assert.deepEqual(highlights, [169 + Math.min(day - 1, 13) * 42]);
    assert.equal(rects.at(-1).y, 715);
    assert.ok(rects.every((rect,i) => i === 0 || rect.y - rects[i-1].y === 42));
  }
});


test("display renders the selected 1-5 columns at equal widths inside the image", () => {
  for (let count=1;count<=5;count++) {
    const rects=[];
    const ctx={fillRect(){},strokeRect(x,y,w,h){rects.push({x,y,w,h});},beginPath(){},moveTo(){},lineTo(){},stroke(){},measureText(t){return {width:t.length*7};},fillText(){}};
    drawDisplay({getContext(){return ctx;}},{goalToAchieve:'Routine',habitsNames:['Read','Write','Walk','Rest','Stretch'].slice(0,count),habitsValues:Array(count).fill('10 min'),cells:[]},new Date(2026,9,17));
    assert.equal(rects.length,count*14);
    assert.ok(rects.every(rect=>rect.x>=58 && rect.x+rect.w<=466.01));
    assert.ok(rects.every(rect=>rect.w===rects[0].w));
    assert.equal(rects.filter(rect=>rect.y===169).length,count);
  }
});
