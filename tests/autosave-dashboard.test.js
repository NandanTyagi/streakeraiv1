import assert from "node:assert/strict";
import { test } from "node:test";
import { calculateHabitStats } from "../utils/habitStats";
import { createAutosaveQueue } from "../utils/autosaveQueue";
import { buildMonthlyGridView } from "../src-v3/application/projections/builders";
const pause = () => new Promise(resolve => setTimeout(resolve, 20));
const cell = (rowNr, isDone, isClear = false) => ({ rowNr, colNr: 1, isDone, isClear });
test("monthly statistics break streaks on unreviewed days and exclude the future", () => {
  const [stats] = calculateHabitStats({ habitsNames: ["Sleep"], cells: [cell(1,true),cell(2,true),cell(3,false,true),cell(4,true),cell(5,false),cell(13,true),cell(14,true)] }, new Date(2026,9,13));
  assert.deepEqual([stats.isDone,stats.missed,stats.unreviewed,stats.longestStreak,stats.hitRate], [4,1,8,2,"80%"]);
  assert.equal(stats.trend.length,13); assert.equal(stats.trend[2],null);
  const [empty] = calculateHabitStats({ habitsNames:["Meditate"], cells:[] }, new Date(2026,9,13));
  assert.equal(empty.longestStreak,0); assert.equal(empty.hitRate,"—");
});
test("historical statistics use the selected month and clear wins over stale done", () => {
 const [stats] = calculateHabitStats({year:"2024",month:"February",habitsNames:["Sleep"],cells:[cell(29,true),cell(1,true,true)]},new Date(2026,9,13));
 assert.equal(stats.isDone,1); assert.equal(stats.unreviewed,28); assert.equal(stats.longestStreak,1);
});
test("autosave coalesces edits and serializes edits arriving during a save", async () => {
 const writes=[], images=[], states=[]; let release;
 const q=createAutosaveQueue({delay:1,save:async b=>{writes.push(b.n); if(b.n===2) await new Promise(r=>release=r);},publish:async b=>images.push(b.n),onSaved(){},onState:s=>states.push(s)});
 q.enqueue({n:1}); q.enqueue({n:2}); await pause(); q.enqueue({n:3}); await pause();
 assert.deepEqual(writes,[2]); release(); await pause(); await pause();
 assert.deepEqual(writes,[2,3]); assert.deepEqual(images,[3]); assert.equal(states.at(-1),"saved"); q.dispose();
});
test("failed saves stay pending until retry and never publish unsaved cells",async()=>{
 let failing=true; const images=[], states=[];
 const q=createAutosaveQueue({delay:1,save:async()=>{if(failing)throw Error();},publish:async b=>images.push(b.n),onSaved(){},onState:s=>states.push(s)});
 q.enqueue({n:1}); await pause(); assert.equal(states.at(-1),"error"); assert.deepEqual(images,[]);
 failing=false; await q.retry(); assert.equal(states.at(-1),"saved"); assert.deepEqual(images,[1]); q.dispose();
});
test("display failure remains retryable after successful persistence",async()=>{
 let failing=true; const states=[];
 const q=createAutosaveQueue({delay:1,save:async()=>{},publish:async()=>{if(failing)throw Object.assign(Error(),{display:true});},onSaved(){},onState:s=>states.push(s)});
 q.enqueue({n:1}); await pause(); assert.equal(states.at(-1),"display-error"); failing=false; await q.retry(); assert.equal(states.at(-1),"saved"); q.dispose();
});
test("cleared v3 cells project as unreviewed",()=>{
 const grid=buildMonthlyGridView({habits:[{id:"h"}],dayStates:[{habitId:"h",date:"2026-10-13",status:"unreviewed"}]},"2026-10","2026-10-13");
 assert.equal(grid.cells.find(c=>c.date==="2026-10-13").status,"unreviewed");
});
import { saveBoardToV3 } from "../utils/v3/saveBoardToV3";
test("v3 autosave skips unchanged old marks, writes sequentially and persists clearing", async () => {
 const originalFetch=globalThis.fetch; const writes=[]; let active=0;
 globalThis.window={location:{origin:"http://localhost"}};
 const today=new Date().getDate(), month=new Date().toISOString().slice(0,7);
 globalThis.fetch=async(url,options)=>{
  if(url.startsWith('/api/v3/goals'))return Response.json([{id:'g',title:'Goal'}]);
  if(url.startsWith('/api/v3/habits'))return Response.json([{id:'h1',name:'A',target:'',order:0},{id:'h2',name:'B',target:'',order:1}]);
  if(url.startsWith('/api/v3/day-states'))return Response.json({cells:[{habitId:'h1',date:`${month}-01`,status:'done'},{habitId:'h1',date:`${month}-${String(today).padStart(2,'0')}`,status:'done'}]});
  active++; assert.equal(active,1); writes.push(JSON.parse(options.body)); await pause(); active--; return Response.json({});
 };
 try {
  await saveBoardToV3({board:{_id:'g',goalToAchieve:'Goal',habitsNames:['A','B'],habitsValues:['',''],cells:[cell(1,true),{rowNr:today,colNr:2,isDone:true,isClear:false}]},userId:'test',tz:'UTC'});
  assert.equal(writes.length,2); assert.equal(writes[0].status,'unreviewed'); assert.equal(writes[1].status,'done');
 } finally {globalThis.fetch=originalFetch;delete globalThis.window;}
});
