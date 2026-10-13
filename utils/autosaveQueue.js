// One in-flight save per account. New edits replace the queued snapshot.
export function createAutosaveQueue({ save, publish, onState, onSaved, delay = 700 }) {
  let pending, running = false, timer, stopped = false, version = 0, lastKey;
  const state = (value) => { if (!stopped) onState(value); };
  async function flush() {
    clearTimeout(timer);
    if (stopped || running || !pending) return;
    running = true;
    const job = pending;
    pending = undefined;
    try {
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
        state(error.display ? "display-error" : "error");
      }
    } finally {
      running = false;
      if (!stopped && pending && pending.version !== job.version) timer = setTimeout(flush, delay);
    }
  }
  return {
    enqueue(board) {
      const key = JSON.stringify(board);
      if (key === lastKey) return;
      lastKey = key;
      pending = { board: JSON.parse(key), version: ++version };
      clearTimeout(timer);
      state("pending");
      timer = setTimeout(flush, delay);
    },
    retry: flush,
    dispose() { stopped = true; clearTimeout(timer); },
  };
}
