import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const ffmpeg=process.env.FFMPEG || 'C:/Users/nanda/LocalWebDev/Embla/repos/embla-audio-worker/node_modules/ffmpeg-static/ffmpeg.exe';
const timeline=JSON.parse(fs.readFileSync('timeline.json'));
const create=timeline.chapters.find(c=>c.id==='create');
const dashboard=timeline.chapters.find(c=>c.id==='dashboard');
const source='../../public/videos/streaker-mobile-walkthrough.mp4';
const output='../../public/videos/streaker-mobile-walkthrough-final.mp4';
const filter=`[0:v]trim=start_frame=0:end_frame=${create.start},setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[0:v]trim=start_frame=${create.start+create.duration}:end_frame=${dashboard.start},setpts=PTS-STARTPTS[c];[2:v]setpts=PTS-STARTPTS[d];[0:v]trim=start_frame=${dashboard.start+dashboard.duration},setpts=PTS-STARTPTS[e];[a][b][c][d][e]concat=n=5:v=1:a=0[v]`;
const result=spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',source,'-i','public/fix-create.mp4','-i','public/fix-dashboard.mp4','-filter_complex',filter,'-map','[v]','-map','0:a','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',output],{stdio:'inherit'});
if(result.status!==0)throw new Error('Video assembly failed');
const check=spawnSync(ffmpeg,['-v','error','-i',output,'-f','null','-'],{stdio:'inherit'});
if(check.status!==0)throw new Error('Video decode verification failed');
fs.copyFileSync(output,source);
try { fs.unlinkSync(output); } catch { console.log("Temporary assembly file retained; final video is ready."); }
console.log('Final video assembled and fully decoded without errors.');
