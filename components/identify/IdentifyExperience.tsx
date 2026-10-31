"use client";

import { FormEvent, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, X, Target, ArrowRight, Keyboard, Volume2, Send, Plus, Trash2 } from "lucide-react";
import { AppContext } from "@/context/appContext";
import { useAppAuth } from "@/hooks/useAppAuth";
import { LoginLink } from "@/components/auth/AuthLinks";
import AiInputForm from "@/components/AiInputForm";
import { habitDraftSchema } from "@/lib/panel-schema";
import { IdentifyDraft, VoiceMessage } from "@/lib/identify-conversation";
import { IdentifyVoiceSession, VoicePhase } from "@/lib/identify-voice-session";
import styles from "./IdentifyExperience.module.css";

export default function IdentifyExperience() {
  const { user } = useAppAuth();
  const { startDraft, draft: existingDraft } = useContext(AppContext);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<VoicePhase>("ready");
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [proposal, setProposal] = useState<IdentifyDraft | null>(null);
  const [review, setReview] = useState(false);
  const [error, setError] = useState("");
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [replaceDraft, setReplaceDraft] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const caption = useRef<HTMLParagraphElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const session = useMemo(() => new IdentifyVoiceSession({
    phase: setPhase, error: setError, playbackBlocked: setPlaybackBlocked, draft: setProposal,
    message: (message, append) => setMessages(previous => {
      if (!message.id) return previous;
      const found = previous.find(item => item.id === message.id);
      const next = { ...message, text: ((append ? found?.text || "" : "") + message.text).slice(0, 6000) };
      return (found ? previous.map(item => item.id === message.id ? next : item) : [...previous, next]).slice(-40);
    }),
  }), []);
  useEffect(() => {
    const hide = () => { if (document.hidden) session.stop(); };
    document.addEventListener("visibilitychange", hide);
    return () => { session.stop(); document.removeEventListener("visibilitychange", hide); };
  }, [session]);
  useEffect(() => {
    session.stop("ready"); setOpen(false); setMessages([]); setProposal(null); setReview(false); setError("");
  }, [session, user?.id]);
  useEffect(() => { if (open) dialog.current?.showModal(); }, [open]);
  const lastMessage = messages.filter(message => message.text).at(-1);
  useEffect(() => { if (caption.current) caption.current.scrollTop = caption.current.scrollHeight; }, [lastMessage?.text]);
  const active = ["connecting", "listening", "thinking", "speaking"].includes(phase);
  function close() { session.stop(); setOpen(false); launcher.current?.focus(); }
  function openReview() { close(); setReview(true); setError(""); setReplaceDraft(false); }
  function start(withMicrophone: boolean) { setTyping(!withMicrophone); void session.start(withMicrophone, messages, proposal); }
  function send(event: FormEvent) { event.preventDefault(); if (session.sendText(text)) setText(""); }
  async function accept(event: FormEvent) {
    event.preventDefault(); if (!proposal || busy || (existingDraft && !replaceDraft)) return;
    const parsed = habitDraftSchema.safeParse(proposal);
    if (!parsed.success) { setError("Use an intention of 3–180 characters and 1–5 practices, each with a name and target of 1–30 characters."); return; }
    setBusy(true); setError(""); session.stop();
    try { await startDraft(parsed.data); router.push("/panel"); }
    catch { setError("The draft could not be opened. Please try again; your proposal is still here."); }
    finally { setBusy(false); }
  }
  function editHabit(index: number, field: "name" | "target", value: string) {
    setProposal(current => current && ({ ...current, habits: current.habits.map((habit, i) => i === index ? { ...habit, [field]: value } : habit) }));
  }
  const labels: Record<VoicePhase, string> = {
    ready: "Let’s find what matters to you", connecting: "Connecting to Streaker…",
    listening: typing ? "What would you like to share?" : "Streaker is listening…",
    thinking: "Streaker is reflecting…", speaking: "Streaker is speaking…",
    paused: "Take your time", error: "Let’s pause for a moment",
  };
  return <div className={styles.page}>
    <header className={styles.intro}>
      <p className={styles.eyebrow}>Identify</p>
      <h1>Make room for what matters.</h1>
      <p>You don’t need a finished plan. Talk it through with Streaker and find a few everyday practices that fit your life.</p>
    </header>
    <section className={styles.invitation} aria-label="Conversation with Streaker">
      <div className={styles.smallOrb} aria-hidden="true"><Target size={30} strokeWidth={1.25} /></div>
      <h2>Start with a conversation</h2>
      <p>One question at a time. Your intention, your pace, your panel.</p>
      {user?.email ? <button ref={launcher} className={styles.primary} onClick={() => { setOpen(true); setError(""); }}><Mic size={19} />{messages.length ? "Continue conversation" : "Speak with Streaker"}</button>
        : <LoginLink className={styles.primary}>Sign in to speak with Streaker <ArrowRight size={18} /></LoginLink>}
      <p className={styles.note}>AI voice · You can type instead · Review before saving</p>
      {proposal && !review && <button className={styles.secondary} onClick={openReview}>Review your {proposal.habits.length} practices <ArrowRight size={18} /></button>}
    </section>

    {proposal && review && <form className={styles.review} onSubmit={accept}>
      <p className={styles.eyebrow}>Your proposal</p><h2>A panel that fits your day</h2>
      <p>Adjust anything below. This opens a draft; save it from the panel when you’re ready.</p>
      <label>Intention<input required minLength={3} maxLength={180} value={proposal.title} disabled={busy} onChange={event => setProposal({ ...proposal, title: event.target.value })} /></label>
      <fieldset disabled={busy}><legend>Daily practices</legend>
        {proposal.habits.map((habit, index) => <div className={styles.habit} key={index}>
          <label>Practice {index + 1}<input required maxLength={30} value={habit.name} onChange={event => editHabit(index, "name", event.target.value)} /></label>
          <label>Target<input required maxLength={30} value={habit.target} onChange={event => editHabit(index, "target", event.target.value)} /></label>
          <button type="button" className={styles.iconButton} aria-label={`Remove practice ${index + 1}`} disabled={proposal.habits.length <= 1} onClick={() => setProposal({ ...proposal, habits: proposal.habits.filter((_, i) => i !== index) })}><Trash2 size={18} /></button>
        </div>)}
        {proposal.habits.length < 5 && <button className={styles.textButton} type="button" onClick={() => setProposal({ ...proposal, habits: [...proposal.habits, { name: "", target: "" }] })}><Plus size={18} />Add a practice</button>}
      </fieldset>
      <label>Notes<textarea maxLength={2400} rows={3} value={proposal.explanation || ""} disabled={busy} onChange={event => setProposal({ ...proposal, explanation: event.target.value })} /></label>
      {existingDraft && <label className={styles.checkbox}><input type="checkbox" checked={replaceDraft} onChange={event => setReplaceDraft(event.target.checked)} />Replace my existing unsaved draft with this proposal.</label>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <button className={styles.primary} disabled={busy || (!!existingDraft && !replaceDraft)}>{busy ? "Opening draft…" : "Open panel draft"}<ArrowRight size={18} /></button>
    </form>}

    <details className={styles.fallback}><summary>Prefer to write your intention or enter practices yourself?</summary><AiInputForm /></details>

    {open && <dialog ref={dialog} className={styles.dialog} aria-labelledby="identify-voice-title" onCancel={event => { event.preventDefault(); close(); }} onClose={() => { session.stop(); setOpen(false); }}>
      <div className={styles.dialogHeader}><span>Streaker</span><button type="button" className={styles.iconButton} aria-label="Close voice conversation" onClick={close}><X /></button></div>
      <p id="identify-voice-title" className={styles.eyebrow}>Speak with Streaker</p>
      <div className={styles.orb} data-phase={phase} aria-hidden="true"><span /><span /><Target size={50} strokeWidth={1} />{phase === "speaking" && <div className={styles.wave}><i /><i /><i /><i /></div>}</div>
      <h2 className={styles.status} aria-live="polite">{labels[phase]}</h2>
      <p ref={caption} className={styles.caption}>{lastMessage ? <><span>{lastMessage.role === "user" ? "You" : "Streaker"}</span>{lastMessage.text}</> : "We’ll explore what you want to make space for, then shape one to five practices together."}</p>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {playbackBlocked && <button type="button" className={styles.secondary} onClick={() => void session.enablePlayback()}><Volume2 size={18} />Enable voice playback</button>}
      {proposal && <div className={styles.proposalNotice}><span>{proposal.habits.length} practices ready to review</span><button type="button" className={styles.textButton} onClick={openReview}>Review panel <ArrowRight size={18} /></button></div>}
      <div className={styles.controls}>
        {!active ? <><button type="button" className={styles.primary} onClick={() => start(true)}><Mic size={19} />{messages.length ? "Resume speaking" : "Start speaking"}</button><button type="button" className={styles.textButton} onClick={() => start(false)}><Keyboard size={18} />Type instead</button></>
          : <><button type="button" className={styles.secondary} onClick={() => session.stop()}><MicOff size={18} />{phase === "connecting" ? "Cancel connection" : "Pause conversation"}</button>
            {(phase === "speaking" || phase === "thinking") && <button type="button" className={styles.textButton} onClick={() => session.interrupt()}>Interrupt and {typing ? "type" : "speak"}</button>}
            <form className={styles.composer} onSubmit={send}><label className={styles.srOnly} htmlFor="voice-message">Message Streaker</label><input id="voice-message" maxLength={2000} value={text} onChange={event => setText(event.target.value)} placeholder="Or type a thought…" disabled={phase === "connecting"} /><button type="submit" aria-label="Send message" className={styles.iconButton} disabled={!text.trim() || phase !== "listening"}><Send size={18} /></button></form></>}
        <p className={styles.note}>AI-generated voice. Audio is processed by OpenAI. Streaker keeps this conversation only while this page is open.</p>
      </div>
      {messages.some(message => message.text) && <details className={styles.transcript}><summary>Conversation transcript</summary><ol>{messages.filter(message => message.text).map(message => <li key={message.id}><strong>{message.role === "user" ? "You" : "Streaker"}</strong><p>{message.text}</p></li>)}</ol></details>}
    </dialog>}
  </div>;
}
