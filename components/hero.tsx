export default function Hero() {
  return (
    <section className="relative py-20 px-6 sm:px-10 border-b border-[var(--surface-border)]">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs uppercase tracking-[0.32em] text-[var(--ink-soft)] mb-4 font-[var(--font-sans)]">
          Streaker.ai
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold text-[var(--ink)]">
          A continuity mirror for daily practice
        </h1>
        <p className="text-lg sm:text-xl text-[var(--ink-soft)] mt-6 leading-relaxed">
          This is a quiet place to record intention over time. It favors memory over
          motivation, and evidence over excitement.
        </p>
      </div>
    </section>
  )
}

