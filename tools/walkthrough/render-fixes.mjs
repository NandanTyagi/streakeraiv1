import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const browserExecutable=process.env.RENDER_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const serveUrl=await bundle({entryPoint:path.resolve('index.jsx'),publicDir:path.resolve('public'),outDir:path.resolve('bundle-fixes')});
const composition=await selectComposition({serveUrl,id:'StreakerMobile',browserExecutable});
const timeline=JSON.parse(fs.readFileSync('timeline.json'));
for(const id of ['create','dashboard']){
 const c=timeline.chapters.find(c=>c.id===id);
 await renderMedia({serveUrl,composition,browserExecutable,codec:'h264',crf:22,pixelFormat:'yuv420p',muted:true,frameRange:[c.start,c.start+c.duration-1],outputLocation:`public/fix-${id}.mp4`,concurrency:2});
 console.log(`Corrected tap position: ${id}`);
}
