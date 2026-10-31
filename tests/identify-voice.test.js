import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleIdentifyRealtime } from '../lib/identify-realtime-server';
import { IdentifyVoiceSession } from '../lib/identify-voice-session';
import { identifySessionConfig, parseConversationDraft } from '../lib/identify-conversation';
const sdp = 'v=0\r\nm=audio 9 UDP/TLS/RTP/SAVPF 111\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel';
const proposal = { title: 'Read more often', habits: [{name:'Read',target:'5 pages'}], explanation:'Start small.' };
const req = (body=sdp, headers={}) => new Request('https://streaker.test/api/identify/realtime',{method:'POST',headers:{Origin:'https://streaker.test','Content-Type':'application/sdp',...headers},body});
const deps = (extra={}) => ({getUser:async()=>({id:'user-private',email:'verified@example.com'}),reserve:async()=>({allowed:true,retryAfter:0}),apiKey:'secret-test-key',request:async()=>new Response(sdp),...extra});
test('voice endpoint rejects cross-origin, anonymous, unverified, disabled and invalid SDP before provider calls', async()=>{
 let calls=0; const d=deps({request:async()=>{calls++;return new Response(sdp);}});
 for(const [request,overrides,status] of [[req(sdp,{Origin:'https://other.test'}),{},403],[req(),{getUser:async()=>null},401],[req(),{getUser:async()=>({id:'u',email:null})},401],[req(),{enabled:false},503],[req('bad'),{},400],[req('x'.repeat(65537)),{},400],[req(sdp,{'Content-Type':'text/plain'}),{},415]]) assert.equal((await handleIdentifyRealtime(request,{...d,...overrides})).status,status);
 assert.equal(calls,0);
});
test('shared budget denial prevents a provider request and gives Retry-After', async()=>{
 const r=await handleIdentifyRealtime(req(),deps({reserve:async()=>({allowed:false,retryAfter:10}),request:async()=>{throw Error('must not call');}}));
 assert.equal(r.status,429);assert.equal(r.headers.get('retry-after'),'10');
});
test('provider receives server config and pseudonymous identity; client receives only SDP',async()=>{
 const r=await handleIdentifyRealtime(req(),deps({request:async(url,init)=>{
 assert.equal(url,'https://api.openai.com/v1/realtime/calls');assert.equal(init.headers.Authorization,'Bearer secret-test-key');assert.equal(init.headers['OpenAI-Safety-Identifier'].length,64);
 const config=JSON.parse(init.body.get('session'));assert.equal(config.type,'realtime');assert.equal(config.tools[0].name,'propose_panel');assert.equal(init.body.get('sdp'),sdp);return new Response(sdp);
 }}));assert.equal(r.status,200);assert.equal(await r.text(),sdp);assert.equal(r.headers.get('cache-control'),'no-store');
});
test('provider errors and invalid responses never leak provider content',async()=>{
 for(const status of [401,403,429,500]){const r=await handleIdentifyRealtime(req(),deps({request:async()=>new Response('secret-provider-content',{status})}));assert.equal(r.status,status===429?429:status===500?502:503);assert.ok(!(await r.text()).includes('secret-provider-content'));}
 assert.equal((await handleIdentifyRealtime(req(),deps({request:async()=>new Response('not SDP')}))).status,502);
});
test('proposal validation rejects duplicate or invalid names and more than five practices',()=>{
 assert.deepEqual(parseConversationDraft(proposal),proposal);
 for(const habits of [[{name:'Two words',target:'5 min'}],Array(6).fill(proposal.habits[0]),[...proposal.habits,...proposal.habits]])assert.throws(()=>parseConversationDraft({...proposal,habits}));
 assert.equal(identifySessionConfig().audio.input.turn_detection.interrupt_response,true);
});
function harness(overrides={}){
 const sent=[], phases=[], errors=[], drafts=[], messages=[];let tracksStopped=0,peerClosed=0,micCalls=0;
 const track={stop(){tracksStopped++;},onended:null};const stream={getTracks:()=>[track]};
 const dc={readyState:'open',send:v=>sent.push(JSON.parse(v)),close(){this.readyState='closed';}};
 const pc={createDataChannel:()=>dc,createOffer:async()=>({type:'offer',sdp}),setLocalDescription:async()=>{},setRemoteDescription:async()=>{},addTrack(){},addTransceiver(){},close(){peerClosed++;}};
 const audio={play:async()=>{},pause(){},srcObject:null};
 const session=new IdentifyVoiceSession({phase:p=>phases.push(p),message:m=>messages.push(m),draft:d=>drafts.push(d),error:e=>errors.push(e),playbackBlocked(){}},{microphone:async()=>{micCalls++;return stream;},peer:()=>pc,audio:()=>audio,request:async()=>new Response(sdp),...overrides});
 return {session,dc,pc,sent,phases,errors,drafts,messages,stream,stats:()=>({tracksStopped,peerClosed,micCalls})};
}
test('closing during microphone permission stops a late stream without opening a connection',async()=>{
 let resolve;const h=harness({microphone:()=>new Promise(r=>resolve=r)});const pending=h.session.start(true);h.session.stop();resolve(h.stream);await pending;assert.equal(h.stats().tracksStopped,1);assert.equal(h.stats().peerClosed,1);assert.equal(h.sent.length,0);
});
test('typing works without requesting a microphone; stop clears transport and playback',async()=>{
 const h=harness();try{await h.session.start(false);h.dc.onopen();assert.equal(h.stats().micCalls,0);h.session.receive({type:'response.done',response:{status:'completed',output:[]}});assert.equal(h.session.sendText('I want to read'),true);assert.equal(h.messages[0].text,'I want to read');assert.equal(h.session.sendText('second simultaneous message'),false);}finally{h.session.stop();}assert.equal(h.stats().peerClosed,1);assert.equal(h.session.sendText('after close'),false);
});
test('tools produce validated proposals once, never save, and malformed tools are acknowledged',async()=>{
 const h=harness();try{await h.session.start(false);h.dc.onopen();const response={type:'response.done',response:{status:'completed',output:[{type:'function_call',call_id:'one',name:'propose_panel',arguments:JSON.stringify(proposal)}]}};h.session.receive(response);h.session.receive(response);assert.equal(h.drafts.length,1);h.session.receive({...response,response:{...response.response,output:[{...response.response.output[0],call_id:'two',arguments:'bad json'}]}});assert.equal(h.drafts.length,1);const outputs=h.sent.filter(x=>x.item?.type==='function_call_output');assert.equal(outputs.length,2);assert.equal(JSON.parse(outputs[1].item.output).ok,false);}finally{h.session.stop();}
});
test('permission denial recovers to an actionable error and releases connection',async()=>{
 const h=harness({microphone:async()=>{throw new DOMException('Denied','NotAllowedError');}});await h.session.start(true);assert.equal(h.phases.at(-1),'error');assert.match(h.errors.at(-1),/Type instead/);assert.equal(h.stats().peerClosed,1);
});
