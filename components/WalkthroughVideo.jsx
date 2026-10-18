"use client";

import { useRef } from "react";
import chapters from "@/lib/walkthrough.json";

function timeLabel(seconds) {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export default function WalkthroughVideo() {
  const video = useRef(null);
  function jumpTo(seconds) {
    if (!video.current) return;
    video.current.currentTime = seconds;
    video.current.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    video.current.play().catch(() => video.current?.focus());
  }
  return (
    <section aria-labelledby="walkthrough-title" className="border-t border-[var(--surface-border)] bg-[var(--paper-veil)] px-5 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">A guided first visit</p>
        <h2 id="walkthrough-title" className="text-3xl font-semibold">Streaker, step by step</h2>
        <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">A narrated mobile walkthrough: create a panel, record your days, add notes, and bring your practice onto a screen.</p>
        <div className="mt-8 grid items-start gap-8 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <div>
            <video ref={video} controls playsInline preload="metadata" poster="/videos/streaker-mobile-poster.png?v=2" aria-label="Streaker mobile instruction video" className="mx-auto aspect-[9/16] w-full max-w-[420px] md:max-h-[70svh] md:w-auto rounded-xl border border-[var(--surface-border)] bg-[var(--paper)]">
              <source src="/videos/streaker-mobile-walkthrough.mp4?v=2" type="video/mp4" />
              <track kind="captions" src="/videos/streaker-mobile-walkthrough.vtt" srcLang="en" label="English" />
              Your browser does not support embedded video. <a href="/videos/streaker-mobile-walkthrough.mp4?v=2">Download the walkthrough</a>.
            </video>
            <p className="mt-3 text-xs leading-relaxed text-[var(--ink-soft)]">2 min 40 sec | Illustrated mobile demonstration with example data. Includes on-screen captions and AI narration.</p>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-semibold">Jump to a step</h3>
            <ol className="divide-y divide-[var(--surface-border)]">
              {chapters.map(chapter => <li key={chapter.id}><button type="button" onClick={() => jumpTo(chapter.seconds)} className="flex min-h-[48px] w-full items-center gap-4 rounded-sm py-3 text-left text-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"><span className="font-mono text-xs text-[var(--ink-soft)]">{timeLabel(chapter.seconds)}</span><span>{chapter.title}</span></button></li>)}
            </ol>
            <details className="mt-6 border-t border-[var(--surface-border)] pt-4">
              <summary className="min-h-[44px] cursor-pointer text-sm font-semibold">Read the full transcript</summary>
              <div className="space-y-5 pt-2 text-sm leading-relaxed">{chapters.map(chapter => <div key={chapter.id}><h4 className="font-semibold">{chapter.title}</h4><p className="mt-1 text-[var(--ink-soft)]">{chapter.text}</p></div>)}</div>
            </details>
            <a href="/videos/streaker-mobile-walkthrough.mp4?v=2" download className="mt-5 inline-flex min-h-[44px] items-center text-sm underline underline-offset-4">Download the video</a>
          </div>
        </div>
      </div>
    </section>
  );
}
