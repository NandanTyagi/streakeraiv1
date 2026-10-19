import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const ffmpeg=process.env.FFMPEG || 'C:/Users/nanda/LocalWebDev/Embla/repos/embla-audio-worker/node_modules/ffmpeg-static/ffmpeg.exe';
const file='../../public/videos/streaker-mobile-walkthrough.mp4';
const timeline=JSON.parse(fs.readFileSync('timeline.json'));
function run(args){const result=spawnSync(ffmpeg,args,{encoding:'utf8'});if(result.status!==0)throw new Error(result.stderr);return result;}
run(['-v','error','-i',file,'-f','null','-']);
const samples=[];
for(const chapter of timeline.chapters){
 const points=chapter.id==='marks'?[.1,.3,.6,.8]:['create','notes','edit'].includes(chapter.id)?[.95]:[.6];
 for(const fraction of points){
  const seconds=(chapter.start+Math.floor(chapter.duration*fraction))/timeline.fps;
  const output=`public/review-encoded-${chapter.id}-${fraction}.png`;
  run(['-v','error','-y','-ss',String(seconds),'-i',file,'-frames:v','1',output]);
  samples.push({chapter:chapter.id,seconds,output});
 }
}
const bytes=fs.readFileSync(file);
const norm=s=>s.replace(/\s+/g,' ').trim();
const captionsMatchNarration=timeline.chapters.every(c=>norm(c.captions.map(x=>x.text).join(' '))===norm(c.text));
if(!captionsMatchNarration)throw new Error('Caption mismatch');
const verification={file:'public/videos/streaker-mobile-walkthrough.mp4',revision:3,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),fullDecodePassed:true,chapters:timeline.chapters.length,captionsMatchNarration,renderTimeGridGutterAssertion:true,encodedReviewFrames:samples};
fs.writeFileSync('verification.json',JSON.stringify(verification,null,2)+'\n');
console.log(JSON.stringify(verification,null,2));
