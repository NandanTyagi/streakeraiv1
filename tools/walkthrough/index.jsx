import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, Composition, Sequence, registerRoot, useCurrentFrame, interpolate, staticFile, Img} from 'remotion';
import {Audio} from '@remotion/media';
import {Menu, X, Check, CalendarDays, Save, Plus, MessageSquare, Copy, ExternalLink, RefreshCw, ChevronDown, ArrowLeft} from 'lucide-react';
import timeline from './timeline.json';
import './video.css';
const C={paper:'#fbf8f2',ink:'#1b1814',soft:'#5c554c',line:'#d8d1c7',green:'#2c6d5e',red:'#9c4b3f'};
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'};
function Tap({x,y,at=0,hold=0,t}) {
 const age=t-at;if(age<0 || age>Math.max(1,hold+.5))return null;
 const size=38+Math.min(age,.5)*18;
 return <div style={{position:'absolute',left:x-size/2,top:y-size/2,width:size,height:size,borderRadius:'50%',border:'3px solid #b78843',background:'#d5b47733',boxShadow:'0 0 0 6px #f4d9ac55',opacity:age>hold+.25?Math.max(0,1-(age-hold-.25)*2):1,zIndex:10}}/>;
}
function Header(){return <div className="header"><Img src={staticFile('logo.png')}/><b>Streaker</b><small>BETA</small><span className="avatar">S</span><Menu size={28}/></div>}
function Footer({draft=false}){return <div className="footer"><div className="footerActions">{[[CalendarDays,'Today'],[draft?Save:RefreshCw,draft?'Save panel':'Reset'],[draft?X:Check,draft?'Discard':'Make main'],[Plus,'New panel']].map(([Icon,label])=><div key={label}><Icon size={23}/><b>{label}</b></div>)}</div><small>{draft?'Draft - not saved':'Saved'}</small></div>}
function Ledger({mode,p,t}) {
 const ledgerRef=useRef(null);
 useLayoutEffect(()=>{
  const grid=ledgerRef.current.querySelector('.grid');
  const footer=ledgerRef.current.querySelector('.footer');
  const scale=grid.getBoundingClientRect().width/grid.offsetWidth;
  const lastCell=grid.lastElementChild.getBoundingClientRect();
  if(footer.getBoundingClientRect().top-lastCell.bottom < 15*scale) throw new Error('Walkthrough grid overlaps footer or lacks its safe gutter');
 });
 const draft=mode==='create' && p<.94;
 const note=mode==='notes' && p>.32 && p<.89;
 const edit=mode==='edit' && p>.2 && p<.9;
 const lastState=mode==='marks'?(p<.2?0:p<.46?1:p<.7?2:0):1;
 return <><div className="ledger" ref={ledgerRef}><div className="intention">A steady daily practice</div><div className="gridHead"><small>OCT</small>{['Sleep','Meditate',mode==='edit'&&p>.55?'Walk':'Train'].map((n,i)=><div key={i}><b>{n}</b><small>{['8 hours','10 min',mode==='edit'&&p>.7?'20 min':'30 min'][i]}</small></div>)}</div><div className="grid">{Array.from({length:12},(_,i)=>{const day=i+6;return <React.Fragment key={i}><div className="day"><b>{day}</b><small>{['Tue','Wed','Thu','Fri','Sat','Sun','Mon'][i%7]}</small></div>{[0,1,2].map(col=>{const state=draft?0:i===11?(col===1?lastState:0):(i+col)%5===0?2:1;return <div key={col} className={'cell '+(state===1?'done':state===2?'missed':'')+(i===11?' today':'')}>{state===1?<Check size={25}/>:state===2?<X size={25}/>:null}{mode==='notes'&&p>.88&&i===11&&col===1&&<MessageSquare className="noteMark" size={11}/>}</div>})}</React.Fragment>})}</div><Footer draft={draft}/></div>
 {mode==='notes'&&p<.32&&<div className="holdLabel">Press and hold for 2 seconds</div>}
 {note&&<div className="shade"><div className="dialog"><X className="close" size={18}/><h3>Add note</h3><p>Record a note for this day.</p><div className="textarea">{'Ten quiet minutes before breakfast.'.slice(0,Math.floor(Math.max(0,p-.36)*200))}</div><div className="dialogActions"><span>Cancel</span><strong>Done</strong></div></div></div>}
 {edit&&<div className="shade"><div className="dialog"><X className="close" size={18}/><h3>Edit activity: Train - 30 min</h3><p>Adjust the tracked activity here.</p><label>Activity</label><div className="input">{p>.55?'Walk':'Train'}</div><label>Value</label><div className="input">{p>.7?'20 min':'30 min'}</div></div></div>}
 </>;
}
function Create({p}) {return <div className="content"><div className="card"><h2>Start a new panel</h2><label>What intention are you holding?</label><div className="textarea">I want to sleep well, meditate, and train regularly.</div><label>Number of practices</label><div className="counts">{[1,2,3,4,5].map(n=><div key={n} className={n===3?'selected':''}>{n}</div>)}</div><p className="muted">One column per practice. This new panel will have 3.</p><p>Get short, one-word practice names and daily targets. Review your draft before saving it as a new panel.</p><div className="pill">Draft practices</div><div className="manual">Enter practices manually</div></div></div>}
function MenuScreen({selected}){return <div className="menu"><small className="logout">Log out</small><div className="card"><b>Switch panel</b><div className="input">A steady daily practice <ChevronDown size={16}/></div></div>{['Profile & settings','About','Identify','Track','Dashboard','My History'].map(n=><div key={n} className={'pill '+(selected===n?'highlight':'')}>{n}</div>)}</div>}
function Dashboard({p}){return <div className="content dashboard"><h2><ArrowLeft size={18}/> Dashboard</h2><div className="card"><h3>Meditate</h3><div className="stats">{[['8','Done'],['2','Missed'],['7','Unreviewed'],['80%','Hit rate'],['3','Current streak'],['5','Best streak']].map(([n,l],i)=><div key={l} style={{background:i===0?'#e8f0ec':i===1?'#f2e7e4':'#f5f1ea'}}><b>{n}</b><small>{l}</small></div>)}</div><div className="accordion">Charts <ChevronDown size={16}/></div><div className="accordion">Notes <ChevronDown size={16}/></div>{p>.65&&<p className="noteText"><b>17 Oct:</b> Ten quiet minutes before breakfast.</p>}</div><h3>Activity Overview</h3><div className="chart"><div style={{height:110}}/><div style={{height:80}}/><div style={{height:130}}/></div><div className="chartLabels">Sleep <span>Meditate</span> Train</div><h3>Streak Trends</h3><svg width="330" height="80"><polyline points="0,70 40,60 80,65 120,40 160,35 200,50 240,25 280,28 330,10" stroke={C.green} fill="none" strokeWidth="3"/></svg></div>}
function Profile({p,finish=false}){return <div className="content profile" style={{transform:`translateY(${-interpolate(p,[.72,.9],[0,150],clamp)}px)`}}><h2>Profile & settings</h2><p>Your account, panels, and display in one place.</p><div className="card"><h3>Your display link</h3><p>A permanent image link for your main panel. It updates as you track your practices. Anyone with this link can view the image.</p><label>Display URL</label><div className="input url">Your personal display URL</div><div className="row"><div className={'pill '+(p>.45?'highlight':'')}><Copy size={15}/>Copy link</div><div className="pill"><ExternalLink size={15}/>Open display</div></div>{p>.55&&<small className="green">Display link copied.</small>}<p><b>Main panel:</b> A steady daily practice</p><div className={'pill '+(finish?'highlight':'')}><RefreshCw size={16}/>Update display</div></div><div className="card"><h3>Panels</h3><div className="input">A steady daily practice<ChevronDown size={15}/></div><p>Choose a saved panel to use on your display.</p><div className="pill">Use selected panel on display</div></div></div>}
function Display(){return <div className="display"><div className="browserbar">Your personal display URL</div><div className="displayTitle">A steady daily practice</div><div className="displayGrid"><span/>{['Sleep','Meditate','Train'].map(n=><b key={n}>{n}</b>)}{Array.from({length:14},(_,i)=><React.Fragment key={i}><small>{i+4}</small>{[0,1,2].map(j=><div key={j}>{(i+j)%5===0?<X size={16}/>:<Check size={16}/>}</div>)}</React.Fragment>)}</div><p>Main panel - display image</p><div className="deviceTip"><RefreshCw size={20}/><p>Refresh the image to see updates.<br/>Device auto-refresh is optional.</p></div></div>}
function Scene({chapter,index}){
 const frame=useCurrentFrame(); const t=frame/timeline.fps; const p=frame/chapter.duration;
 const opacity=interpolate(frame,[0,8,chapter.duration-8,chapter.duration],[0,1,1,0],clamp);
 const id=chapter.id;
 let view;
 if(id==='create')view=p<.73?<Create p={p}/>:<Ledger mode="create" p={p} t={t}/>;
 else if(id==='dashboard')view=p<.2?<MenuScreen selected="Dashboard"/>:<Dashboard p={p}/>;
 else if(id==='profile')view=p<.2?<MenuScreen selected="Profile & settings"/>:<Profile p={p}/>;
 else if(id==='display')view=<Display/>;
 else if(id==='finish')view=p<.38?<Profile p={p} finish/>:<Ledger mode="welcome" p={p} t={t}/>;
 else view=<Ledger mode={id} p={p} t={t}/>;
 const caption=chapter.captions.find(c=>t>=c.start&&t<=c.end);
 let tap=null;
 if(id==='create')tap=p<.35?[198,341,.18]:p<.73?[190,480,.60]:[145,664,.89];
 if(id==='marks')tap=[229,607,p<.46?.2:p<.7?.46:.7];
 if(id==='notes')tap=p<.32?[229,607,.16]:[314,445,.84];
 if(id==='edit')tap=p<.2?[323,114,.15]:[349,229,.88];
 if(id==='dashboard')tap=p<.2?[190,476,.12]:[280,434,.62];
 if(id==='profile')tap=p<.2?[190,228,.12]:[95,354,.5];
 return <AbsoluteFill style={{opacity}}><div className="chapterLabel">STREAKER / MOBILE GUIDE <span>{String(index+1).padStart(2,'0')} / 09</span></div><h1>{chapter.title}</h1><div className="phone"><div className="screen"><Header/>{view}{tap&&<Tap x={tap[0]} y={tap[1]} at={tap[2]*chapter.duration/timeline.fps} t={t} hold={id==='notes'&&p<.32?2:0}/>}</div></div><div className="demo">Illustrated mobile view / Example data</div><div className="caption">{caption?.text || ''}</div><div className="chapterProgress"><div style={{width:`${p*100}%`}}/></div><Sequence from={Math.round(.4*timeline.fps)}><Audio src={staticFile(`${id}.mp3`)}/></Sequence></AbsoluteFill>
}
function Video(){return <AbsoluteFill style={{background:'#eee8de',color:C.ink,fontFamily:'Arial, sans-serif'}}>{timeline.chapters.map((c,i)=><Sequence key={c.id} from={c.start} durationInFrames={c.duration}><Scene chapter={c} index={i}/></Sequence>)}</AbsoluteFill>}
registerRoot(()=> <Composition id="StreakerMobile" component={Video} width={720} height={1280} fps={timeline.fps} durationInFrames={timeline.duration}/>);
