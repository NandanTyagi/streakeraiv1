import assert from "node:assert/strict";
import {test} from "node:test";
import {createPanel} from "../src-v3/application/use-cases/create-panel";
import {createEmptyState,replayEvents} from "../src-v3/domain/replay";
import {buildMonthlyGridView} from "../src-v3/application/projections/builders";
import {buildBoardFromV3,buildHistoryItemsFromEvents} from "../utils/v3/boardAdapter";
import {ensureGoalAndHabits} from "../utils/v3/saveBoardToV3";
import {generatePanelDraft} from "../lib/generate-panel-draft";
import {createAutosaveQueue} from "../utils/autosaveQueue";
const habits=Array.from({length:5},(_,i)=>({name:`Habit ${i}`,target:'10 min'}));
let counter=0;
const ctx={generateId:()=>`id-${++counter}`,clock:{now:()=>new Date(2026,9,13,12,0,counter).toISOString(),today:()=>"2026-10-13"},timezoneService:{toDateKey:d=>d.slice(0,10)},config:{allowReversal:true,backdateWindowDays:36500}};
test("creating a second panel preserves the first and separates its habits and marks",()=>{
 const first=createPanel(createEmptyState(),{userId:'u',tz:'UTC',draftId:'a',title:'Original',habits},ctx);
 first.state.dayStates.push({habitId:first.state.habits[0].id,date:'2026-10-13',status:'done'});
 const second=createPanel(first.state,{userId:'u',tz:'UTC',draftId:'b',title:'Reading',habits},ctx);
 assert.equal(second.state.goals.length,2);assert.equal(second.state.habits.length,10);assert.equal(second.state.goals[0].title,'Original');assert.equal(second.state.dayStates[0].status,'done');
 const loaded=replayEvents([...first.events,...second.events],'2026-10-13');assert.equal(loaded.goals.length,2);assert.equal(loaded.habits.length,10);
 const grid=buildMonthlyGridView(second.state,'2026-10','2026-10-13');
 const board=buildBoardFromV3({goal:second.state.goals[1],habits:second.state.habits.filter(h=>h.goalId===second.goalId),grid,month:'2026-10',userId:'u'});
 assert.equal(board.cells.some(c=>c.isDone),false);assert.equal(board.v3.goalId,second.goalId);
 const events=[{type:'DAY_STATE_UPSERTED',payload:{habitId:first.state.habits[0].id,date:'2026-09-01'}}];
 assert.equal(buildHistoryItemsFromEvents({events,goal:second.state.goals[1],habits:second.state.habits}).length,0);
});
test("autosave selects the requested goal, never the first goal",async()=>{
 const original=globalThis.fetch;globalThis.window={location:{origin:'http://localhost'}};const calls=[];
 globalThis.fetch=async(url,options)=>{calls.push([url,options]);if(url.startsWith('/api/v3/goals'))return Response.json([{id:'first',title:'Original'},{id:'second',title:'Reading'}]);return Response.json(habits.map((h,i)=>({...h,id:`h${i}`,order:i})));};
 try{await ensureGoalAndHabits({board:{_id:'second',goalToAchieve:'Reading',habitsNames:habits.map(h=>h.name),habitsValues:habits.map(h=>h.target)},userId:'u',tz:'UTC'});assert.ok(calls.some(([url])=>url.includes('goalId=second')));assert.equal(calls.some(([,options])=>options?.method==='PATCH'),false);await assert.rejects(ensureGoalAndHabits({board:{_id:'missing'},userId:'u',tz:'UTC'}));}finally{globalThis.fetch=original;delete globalThis.window;}
});
test("Identify validates complete structured output and surfaces upstream failures",async()=>{
 const valid={title:'Reading',habits,explanation:'Daily reading'};
 const data=await generatePanelDraft('Read each day',async(url,options)=>{assert.equal(url,'https://api.openai.com/v1/chat/completions');assert.equal(JSON.parse(options.body).response_format.type,'json_schema');return Response.json({choices:[{finish_reason:'stop',message:{content:JSON.stringify(valid)}}]});});assert.equal(data.habits.length,5);
 for(const response of [{choices:[{finish_reason:'length',message:{content:'{}'}}]},{choices:[{finish_reason:'stop',message:{refusal:'No'}}]},{choices:[{finish_reason:'stop',message:{content:JSON.stringify({...valid,habits:[]})}}]}])await assert.rejects(generatePanelDraft('Read',async()=>Response.json(response)));
 await assert.rejects(generatePanelDraft('Read',async()=>new Response('',{status:401})),error=>error.status===401);
});
test("switching panels waits for all queued edits and reports failed saves",async()=>{
 let release;const saved=[];const queue=createAutosaveQueue({delay:0,save:async b=>{if(b.id===1)await new Promise(r=>release=r);saved.push(b.id)},onState(){},onSaved(){}});
 queue.enqueue({id:1});const first=queue.retry();queue.enqueue({id:2});const drained=queue.drain();release();await first;await drained;assert.deepEqual(saved,[1,2]);queue.dispose();
 const broken=createAutosaveQueue({save:async()=>{throw Error()},onState(){},onSaved(){}});broken.enqueue({id:1});await assert.rejects(broken.drain());broken.dispose();
});

test("history reconstructs latest reviews, notes and month lengths for only the selected panel",()=>{
 const goal={id:'one',title:'Original'};
 const selected=[{id:'h1',goalId:'one',name:'Sleep',target:'8 hrs',order:0},{id:'h2',goalId:'one',name:'Read',target:'10 min',order:1}];
 const event=(habitId,date,status,note='')=>({type:'DAY_STATE_UPSERTED',payload:{habitId,date,status,note}});
 const items=buildHistoryItemsFromEvents({goal,habits:[...selected,{id:'other',goalId:'two',name:'Other',order:0}],events:[
   event('h1','2024-02-29','done'),event('h1','2024-02-29','missed','Away'),
   event('h2','2024-02-29','done'),event('h1','2025-10-01','done'),
   event('other','2026-01-01','done'),
 ]});
 assert.deepEqual(items.map(i=>[i.year,i.month]),[['2025','October'],['2024','February']]);
 assert.equal(items[1].cells.length,58);
 assert.equal(items[1].habitsNames.length,2);
 assert.equal(items[1].cells.filter(c=>c.isDone).length,1);
 assert.equal(items[1].cells.filter(c=>!c.isDone&&!c.isClear).length,1);
 assert.equal(items[1].cells.find(c=>c.id==='29-1').comment,'Away');
});
