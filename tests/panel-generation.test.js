import assert from 'node:assert/strict';
import { test } from 'node:test';
import { generatePanelDraft } from '../lib/generate-panel-draft';
import { panelGenerationFailure } from '../lib/panel-generation-error';

test('draft failures distinguish quota, rate limits and credentials without exposing provider messages', async () => {
  for (const [status, code, type, expected, http] of [
    [429, 'insufficient_quota', 'insufficient_quota', 'ai_quota_unavailable', 503],
    [429, 'project_spend_limit_exceeded', 'insufficient_quota', 'ai_quota_unavailable', 503],
    [429, 'rate_limit_exceeded', 'rate_limit_error', 'ai_rate_limited', 429],
    [401, 'invalid_api_key', 'invalid_request_error', 'ai_credentials_unavailable', 503],
    [500, 'server_error', 'server_error', 'ai_generation_failed', 502],
  ]) {
    await assert.rejects(generatePanelDraft('Build a reading habit', async () => Response.json(
      { error: { code, type, message: 'secret provider content' } },
      { status, headers: { 'x-request-id': 'req_test' } },
    )), error => {
      assert.equal(error.requestId, 'req_test');
      assert.equal(error.code, code);
      const failure = panelGenerationFailure(error);
      assert.equal(failure.code, expected);
      assert.equal(failure.status, http);
      assert.equal(JSON.stringify(error).includes('secret provider content'), false);
      assert.equal(failure.error.includes('secret provider content'), false);
      return true;
    });
  }
});

test('non-JSON provider failures retain HTTP status', async () => {
  await assert.rejects(generatePanelDraft('Read every day', async () => new Response('Bad gateway', { status: 502 })), error => {
    assert.equal(error.status, 502);
    assert.equal(panelGenerationFailure(error).code, 'ai_generation_failed');
    return true;
  });
});

import { habitDraftSchema, identifySchema, generatedHabitDraftSchema } from '../lib/panel-schema';
import { createPanel } from '../src-v3/application/use-cases/create-panel';
import { createEmptyState, replayEvents } from '../src-v3/domain/replay';
import { buildBoardFromV3 } from '../utils/v3/boardAdapter';
import { buildMonthlyGridView } from '../src-v3/application/projections/builders';

const names = ['Read', 'Write', 'Walk', 'Rest', 'Stretch'];
const draftFor = count => ({ title: 'A steady daily routine', habits: names.slice(0,count).map(name=>({name,target:'10 min'})), explanation: 'Small steps each day.' });

test('AI generates exactly the requested 1-5 practices and the request defaults to five', async () => {
  assert.equal(identifySchema.parse({goal:'Build a reading habit'}).practiceCount,5);
  for (let count=1;count<=5;count++) {
    const draft = draftFor(count);
    const result = await generatePanelDraft('Build a steady daily routine', async (_, options) => {
      const body=JSON.parse(options.body);
      assert.ok(body.messages[0].content.includes(`exactly ${count}`));
      return Response.json({ choices:[{finish_reason:'stop',message:{content:JSON.stringify(draft)}}] });
    },count);
    assert.equal(result.habits.length,count);
    assert.ok(habitDraftSchema.safeParse(draft).success);
  }
  for (const count of [0,6,1.5,'2',null]) assert.equal(identifySchema.safeParse({goal:'Read every day',practiceCount:count}).success,false);
});

test('generated labels reject long words, whitespace, punctuation, duplicates and wrong counts while manual names remain compatible', () => {
  for (const name of ['Meditation','Morning Stretch','Read-more','Read1','']) {
    assert.equal(generatedHabitDraftSchema(1).safeParse({...draftFor(1),habits:[{name,target:'10 min'}]}).success,false);
  }
  assert.equal(generatedHabitDraftSchema(1).safeParse({...draftFor(1),habits:[{name:'Återhämta',target:'10 min'}]}).success,false);
  assert.equal(generatedHabitDraftSchema(1).safeParse({...draftFor(1),habits:[{name:'Läsa',target:'10 min'}]}).success,true);
  assert.equal(generatedHabitDraftSchema(1).safeParse(draftFor(2)).success,false);
  assert.equal(generatedHabitDraftSchema(2).safeParse({...draftFor(2),habits:[{name:'Read',target:'10 min'},{name:'read',target:'5 min'}]}).success,false);
  assert.ok(habitDraftSchema.safeParse({...draftFor(1),habits:[{name:'Morning Stretch',target:'5 minutes daily'}]}).success);
  assert.equal(habitDraftSchema.safeParse({...draftFor(1),habits:[]}).success,false);
  assert.equal(habitDraftSchema.safeParse({...draftFor(5),habits:[...draftFor(5).habits,{name:'Extra',target:'1 min'}]}).success,false);
});

test('each panel size survives event replay and produces matching grid columns without altering other panels', () => {
  let id=0, state=createEmptyState(), events=[];
  const ctx={generateId:()=>`size-${++id}`,clock:{now:()=>new Date(2026,9,17,12,0,id).toISOString(),today:()=> '2026-10-17'},timezoneService:{toDateKey:d=>d.slice(0,10)},config:{allowReversal:true,backdateWindowDays:36500}};
  for(let count=1;count<=5;count++) {
    const result=createPanel(state,{...draftFor(count),title:`Panel ${count}`,userId:'u',tz:'UTC',draftId:`draft-${count}`},ctx);
    state=result.state; events.push(...result.events);
  }
  const loaded=replayEvents(events,'2026-10-17');
  assert.equal(loaded.goals.length,5);
  assert.equal(loaded.habits.length,15);
  loaded.goals.forEach((goal,index)=>{
    const habits=loaded.habits.filter(h=>h.goalId===goal.id);
    const board=buildBoardFromV3({goal,habits,grid:buildMonthlyGridView(loaded,'2026-10','2026-10-17'),month:'2026-10',userId:'u'});
    assert.equal(board.habitsNames.length,index+1);
    assert.equal(board.cells.length,31*(index+1));
  });
});
