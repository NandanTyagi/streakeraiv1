// One in-flight save per account. New edits replace the queued snapshot.
export function createAutosaveQueue({ save, publish, onState, onSaved, delay = 700 }) {
  let pending, running = false, timer, stopped = false, version = 0, lastKey, task, failed = false;
  const state = (value) => { if (!stopped) onState(value); };
  function flush() {
    if (running) return task;
    task = run();
    return task;
  }
  async function run() {
    clearTimeout(timer);
    if (stopped || running || !pending) return;
    running = true;
    const job = pending;
    pending = undefined;
    try {
      failed = false;
      state("saving");
      await save(job.board);
      if (!stopped && job.version === version) {
        onSaved(job.board);
        if (publish) { state("updating"); await publish(job.board); }
        if (job.version === version) state("saved");
      }
    } catch (error) {
      if (job.version === version) {
        pending = job;
        failed = true;
        state(error.display ? "display-error" : "error");
      }
    } finally {
      running = false;
      if (!stopped && pending && pending.version !== job.version) timer = setTimeout(flush, delay);
    }
  }
  return {
    enqueue(board, force = false) {
      const key = JSON.stringify(board);
      if (!force && key === lastKey) return;
      lastKey = key;
      pending = { board: JSON.parse(key), version: ++version };
      clearTimeout(timer);
      state("pending");
      timer = setTimeout(flush, delay);
    },
    retry: flush,
    async drain() {
      while (pending || running) {
        await flush();
        if (failed) {
          throw new Error("Finish saving this panel before switching. Use Retry if needed.");
        }
      }
    },
    dispose() { stopped = true; clearTimeout(timer); },
  };
}
