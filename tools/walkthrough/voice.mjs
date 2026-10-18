import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const dotenv=require('../../node_modules/dotenv');
const config=dotenv.parse(fs.readFileSync(process.argv[2]));
if(!config.ELEVENLABS_API_KEY) throw new Error('ElevenLabs key not configured');
const chapters=JSON.parse(fs.readFileSync('chapters.json','utf8'));
const fps=24; let start=0;
const timestamp=s=>new Date(Math.round(s*1000)).toISOString().slice(11,23);
let vtt='WEBVTT\n\n';
for (const chapter of chapters) {
 const jsonPath=`public/${chapter.id}.json`;
 let data;
 if(fs.existsSync(jsonPath)) data=JSON.parse(fs.readFileSync(jsonPath));
 else {
  const response=await fetch('https://api.elevenlabs.io/v1/text-to-speech/gc5LArFpEOmYx9nYmK9l/with-timestamps', {
   method:'POST',headers:{'xi-api-key':config.ELEVENLABS_API_KEY,'Content-Type':'application/json'},
   body:JSON.stringify({text:chapter.text,model_id:'eleven_v3',voice_settings:{stability:0.5,similarity_boost:0.7,style:0.15,speed:1.0}})
  });
  if(!response.ok) {const e=await response.json().catch(()=>({})); throw new Error(`Voice request failed (${response.status}): ${e.detail?.status || 'see provider account'}`);}
  data=await response.json();
  fs.writeFileSync(`public/${chapter.id}.mp3`,Buffer.from(data.audio_base64,'base64'));
  delete data.audio_base64;
  fs.writeFileSync(jsonPath,JSON.stringify(data));
 }
 const a=data.normalized_alignment || data.alignment;
 let text='',begin=0;const captions=[];
 for(let i=0;i<a.characters.length;i++){
  if(!text)begin=a.character_start_times_seconds[i];
  text+=a.characters[i];
  if((text.length>48 && /[ .?!,]/.test(a.characters[i])) || i===a.characters.length-1){
   const end=a.character_end_times_seconds[i];
   captions.push({text:text.trim(),start:begin+0.4,end:end+0.4});text='';
  }
 }
 const duration=Math.ceil((a.character_end_times_seconds.at(-1)+1.2)*fps);
 chapter.start=start;chapter.duration=duration;chapter.captions=captions;
 for(const c of captions) vtt+=`${timestamp(start/fps+c.start)} --> ${timestamp(start/fps+c.end)}\n${c.text}\n\n`;
 start+=duration;
 console.log(`${chapter.id}: ${(duration/fps).toFixed(1)} seconds`);
}
fs.writeFileSync('timeline.json',JSON.stringify({fps,duration:start,chapters},null,2));
fs.writeFileSync('../../lib/walkthrough.json',JSON.stringify(chapters.map(({id,title,text,start})=>({id,title,text,seconds:start/fps})),null,2));
fs.writeFileSync('../../public/videos/streaker-mobile-walkthrough.vtt',vtt);
console.log(`Total ${(start/fps).toFixed(1)} seconds`);
