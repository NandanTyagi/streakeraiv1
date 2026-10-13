"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, LoaderCircle } from "lucide-react";
import { AppContext } from "@/context/appContext";
import { useAppAuth } from "@/hooks/useAppAuth";
import { LoginLink } from "@/components/auth/AuthLinks";
export default function AiInputForm() {
  const router=useRouter();
  const {startDraft}=useContext(AppContext);
  const {user}=useAppAuth();
  const [goal,setGoal]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  async function submit(event) {
    event.preventDefault(); if(busy)return;
    setBusy(true);setError("");
    try {
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
    <textarea id="intention" value={goal} onChange={event=>setGoal(event.target.value)} minLength={10} maxLength={1000} required rows={4} disabled={busy} placeholder="I want a steady morning practice." className="w-full rounded-md border border-[var(--surface-border)] bg-[var(--paper)] p-3 text-base" />
    <p className="text-sm text-[var(--ink-soft)]">Get five daily practices to review. Save the draft as a new panel when you are happy with it.</p>
    {error&&<p role="alert" className="text-sm text-[var(--danger)]">{error}</p>}
    {user?<button type="submit" disabled={busy} className="w-full inline-flex justify-center items-center gap-2 min-h-[44px] border border-[var(--ink)] rounded-full px-4 font-semibold disabled:opacity-50">{busy?<LoaderCircle size={18} className="animate-spin"/>:<Sparkles size={18}/>} {busy?"Drafting practices…":"Draft practices"}</button>:<LoginLink className="block text-center underline">Sign in to draft a panel</LoginLink>}
  </form>;
}
