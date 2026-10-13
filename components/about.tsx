"use client";

import Hero from "./hero";
import VideoBlock from "./video-block";
import Content from "./content";
import StandardButton from "./v1/StandardButton";

export default function About() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[var(--paper)] text-[var(--ink)] overflow-x-hidden pb-32">
      <Hero />
      <section className="px-6 sm:px-10 py-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--ink-soft)] mb-3">
              What this is
            </p>
            <p className="text-base sm:text-lg text-[var(--ink)] leading-relaxed">
              Streaker is not a habit tracker. It is not a productivity tool. It is
              not a gamified system. It is a discipline ledger and a temporal mirror
              of intention, a place where truth over time is made visible.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--ink-soft)] mb-3">
              Continuity over intensity
            </p>
            <p className="text-base sm:text-lg text-[var(--ink)] leading-relaxed">
              We value the long arc. Quiet repetitions matter more than bursts of
              effort. What remains is what is practiced.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--ink-soft)] mb-3">
              Streaks as consequence, not reward
            </p>
            <p className="text-base sm:text-lg text-[var(--ink)] leading-relaxed">
              A streak is a trace, not a prize. It is the shadow cast by repeated
              action, a record of what actually happened.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--ink-soft)] mb-3">
              AI as witness, not manipulator
            </p>
            <p className="text-base sm:text-lg text-[var(--ink)] leading-relaxed">
              The AI does not coach or cheer. It reflects. It notices rhythm, names
              pauses, and holds the facts without judgment.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[var(--ink-soft)] mb-3">
              Practice as a lifelong arc
            </p>
            <p className="text-base sm:text-lg text-[var(--ink)] leading-relaxed">
              This is a place to return to for years. The ledger endures, and so do
              you. Over time, the record becomes a mirror.
            </p>
          </div>
        </div>
      </section>
      <section className="px-6 sm:px-10 pb-10">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--ink-soft)] mb-4">
            Entry points
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <StandardButton text="Open the ledger" type="pill" pushTo="/panel" />
            <StandardButton text="View the record" type="pill" pushTo="/dashboard" />
            <StandardButton text="Name an intention" type="pill" pushTo="/generategoals" />
            <StandardButton
              text="Read the business plan"
              type="pill"
              pushTo="https://streaker-xqt5f0f.gamma.site/"
              newWindow
            />
          </div>
        </div>
      </section>
      <Content />
      <VideoBlock />
    </div>
  );
}
