import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const executable=process.env.RENDER_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const serveUrl=await bundle({entryPoint:path.resolve('index.jsx'),publicDir:path.resolve('public'),outDir:path.resolve('bundle')});
const settings={serveUrl,id:'StreakerMobile',browserExecutable:executable};
const composition=await selectComposition(settings);
const timeline=JSON.parse(fs.readFileSync('timeline.json'));
for(const chapter of (process.argv.includes('--stills')?timeline.chapters:[])){
 const points=['create','notes','edit','finish'].includes(chapter.id)?[.6,.95]:chapter.id==='marks'?[.1,.3,.6,.8]:[.6];
 for(const p of points) await renderStill({serveUrl,composition,browserExecutable:executable,frame:chapter.start+Math.floor(chapter.duration*p),output:`public/review-${chapter.id}-${p}.png`});
}
await renderStill({serveUrl,composition,browserExecutable:executable,frame:24,output:'../../public/videos/streaker-mobile-poster.png'});
if(process.argv.includes('--stills'))process.exit(0);
let last=-1;
await renderMedia({serveUrl,composition,browserExecutable:executable,codec:'h264',crf:22,audioBitrate:'128k',pixelFormat:'yuv420p',outputLocation:'../../public/videos/streaker-mobile-walkthrough.mp4',concurrency:2,onProgress:({progress})=>{const n=Math.floor(progress*10);if(n!==last){last=n;console.log(`Render ${n*10}%`);}}});
