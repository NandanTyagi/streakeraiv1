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
  const [habits,setHabits]=useState(Array.from({length:5},()=>({name:"",target:""})));
  function updateHabit(index,field,value) {
    setHabits(previous=>previous.map((habit,i)=>i===index?{...habit,[field]:value}:habit));
  }
  async function submit(event) {
    event.preventDefault(); if(busy)return;
    setBusy(true);setError("");
    try {
      if(manual) {
        const parsed=habitDraftSchema.safeParse({title:goal.trim(),habits});
        if(!parsed.success) throw new Error("Enter an intention of 3 to 180 characters and five practices with targets of 1 to 30 characters each.");
        await startDraft(parsed.data);
        router.push("/panel");
        return;
      }
      const response=await fetch("/api/identify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({goal})});
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
    <p className="text-sm text-[var(--ink-soft)]">{manual ? "Enter five daily practices and measurable targets, then review your draft." : "Get five daily practices to review. Save the draft as a new panel when you are happy with it."}</p>
    {manual && <fieldset disabled={busy} className="space-y-3">
      <legend className="font-semibold mb-2">Daily practices</legend>
      {habits.map((habit,index)=><div key={index} className="grid grid-cols-2 gap-2">
        <label className="text-sm">Practice {index+1}<input required pattern={".*\\S.*"} maxLength={30} value={habit.name} onChange={event=>updateHabit(index,"name",event.target.value)} className="w-full border rounded p-2 bg-transparent" /></label>
        <label className="text-sm">Target {index+1}<input required pattern={".*\\S.*"} maxLength={30} placeholder="10 min" value={habit.target} onChange={event=>updateHabit(index,"target",event.target.value)} className="w-full border rounded p-2 bg-transparent" /></label>
      </div>)}
    </fieldset>}
    {error&&<p role="alert" className="text-sm text-[var(--danger)]">{error}</p>}
    {user?<button type="submit" disabled={busy} className="w-full inline-flex justify-center items-center gap-2 min-h-[44px] border border-[var(--ink)] rounded-full px-4 font-semibold disabled:opacity-50">{busy?<LoaderCircle size={18} className="animate-spin"/>:<Sparkles size={18}/>} {busy?"Preparing draft...":manual?"Review panel":"Draft practices"}</button>:<LoginLink className="block text-center underline">Sign in to draft a panel</LoginLink>}
    {user && <button type="button" disabled={busy} onClick={()=>{setManual(value=>!value);setError("");}} className="w-full min-h-[44px] underline text-sm">{manual?"Use AI to draft practices":"Enter practices manually"}</button>}
  </form>;
}
