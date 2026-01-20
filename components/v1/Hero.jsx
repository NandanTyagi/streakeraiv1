const Hero = () => {
  return (
    <div className="relative pt-20 pb-10 px-6 sm:px-10">
      <div className="max-w-3xl mx-auto text-[var(--ink)] flex flex-col items-center">
        <section className="relative z-10 flex justify-center py-4">
          <div className="flex h-26 w-26 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden">
            <img
              src="/streaker-logo.png"
              alt="Streaker"
              className="h-[auto] w-[76px]"
            />
          </div>
        </section>
        <h1 className="text-4xl sm:text-5xl font-semibold text-[var(--ink)] leading-tight">
          Streaker
        </h1>
        <p className="mt-6 text-lg text-[var(--ink-soft)] leading-relaxed text-center">
          Did you show up, or not?
        </p>
      </div>
    </div>
  );
};

export default Hero;
