"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, LoaderCircle } from "lucide-react";
import { AppContext } from "@/context/appContext";
import { useAppAuth } from "@/hooks/useAppAuth";
import { habitDraftSchema } from "@/lib/panel-schema";
import { LoginLink } from "@/components/auth/AuthLinks";
export default function AiInputForm() {
  const router=useRouter();
  const {startDraft}=useContext(AppContext);
  const {user}=useAppAuth();
  const [goal,setGoal]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [manual,setManual]=useState(false);
  const [practiceCount,setPracticeCount]=useState(5);
  const [habits,setHabits]=useState(Array.from({length:5},()=>({name:"",target:""})));
  function updateHabit(index,field,value) {
    setHabits(previous=>previous.map((habit,i)=>i===index?{...habit,[field]:value}:habit));
  }
  async function submit(event) {
    event.preventDefault(); if(busy)return;
    setBusy(true);setError("");
    try {
      if(manual) {
        const parsed=habitDraftSchema.safeParse({title:goal.trim(),habits:habits.slice(0,practiceCount)});
        if(!parsed.success) throw new Error(`Enter an intention of 3 to 180 characters and ${practiceCount} practices with names and targets of 1 to 30 characters each.`);
        await startDraft(parsed.data);
        router.push("/panel");
        return;
      }
      const response=await fetch("/api/identify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({goal,practiceCount})});
      const draft=await response.json();
      if(!response.ok)throw new Error(draft.error || "Could not generate a draft.");
      await startDraft(draft);router.push("/panel");
    } catch(error){setError(error.message);}
    finally{setBusy(false);}
  }
  return <form onSubmit={submit} className="space-y-5 border border-[var(--surface-border)] rounded-lg bg-[var(--paper-veil)] p-6 w-[95%] max-w-[500px]">
    <h1 className="text-xl font-semibold">Start a new panel</h1>
    <label htmlFor="intention" className="block font-semibold">What intention are you holding?</label>
    <textarea id="intention" value={goal} onChange={event=>setGoal(event.target.value)} minLength={manual?3:10} maxLength={manual?180:1000} required rows={4} disabled={busy} placeholder="I want a steady morning practice." className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--paper)] p-3 text-base" />
    <fieldset disabled={busy}>
      <legend className="font-semibold mb-2">Number of practices</legend>
      <div className="grid grid-cols-5 gap-2">
        {[1,2,3,4,5].map(count=><label key={count} className={`relative flex min-h-[44px] cursor-pointer items-center justify-center rounded-md border ${practiceCount===count ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" : "border-[var(--surface-border)]"}`}>
          <input type="radio" name="practiceCount" value={count} checked={practiceCount===count} onChange={()=>setPracticeCount(count)} aria-label={`${count} ${count===1?"practice":"practices"}`} className="peer sr-only" />
          <span className="absolute inset-0 rounded-md peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus-ring)]" aria-hidden="true" />
          {count}
        </label>)}
      </div>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">One column per practice. This new panel will have {practiceCount}.</p>
    </fieldset>
    <p className="text-sm text-[var(--ink-soft)]">{manual ? "Enter your daily practices and measurable targets, then review your draft." : "Get short, one-word practice names and daily targets. Review your draft before saving it as a new panel."}</p>
    {manual && <fieldset disabled={busy} className="space-y-3">
      <legend className="font-semibold mb-2">Daily practices</legend>
      {habits.slice(0,practiceCount).map((habit,index)=><div key={index} className="grid grid-cols-2 gap-2">
        <label className="text-sm">Practice {index+1}<input required pattern={".*\\S.*"} maxLength={30} value={habit.name} onChange={event=>updateHabit(index,"name",event.target.value)} className="w-full border rounded p-2 bg-transparent" /></label>
        <label className="text-sm">Target {index+1}<input required pattern={".*\\S.*"} maxLength={30} placeholder="10 min" value={habit.target} onChange={event=>updateHabit(index,"target",event.target.value)} className="w-full border rounded p-2 bg-transparent" /></label>
      </div>)}
    </fieldset>}
    {error&&<p role="alert" className="text-sm text-[var(--danger)]">{error}</p>}
    {user?<button type="submit" disabled={busy} className="w-full inline-flex justify-center items-center gap-2 min-h-[44px] border border-[var(--ink)] rounded-full px-4 font-semibold disabled:opacity-50">{busy?<LoaderCircle size={18} className="animate-spin"/>:<Sparkles size={18}/>} {busy?"Preparing draft...":manual?"Review panel":"Draft practices"}</button>:<LoginLink className="block text-center underline">Sign in to draft a panel</LoginLink>}
    {user && <button type="button" disabled={busy} onClick={()=>{setManual(value=>!value);setError("");}} className="w-full min-h-[44px] underline text-sm">{manual?"Use AI to draft practices":"Enter practices manually"}</button>}
  </form>;
}
