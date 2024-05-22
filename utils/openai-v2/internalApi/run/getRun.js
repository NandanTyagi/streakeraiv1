export default async function getRun(threadId, runId) {
    console.log("in getRun internalApi intro", threadId);

    const runResult = await fetch(
      `${location.origin}/api/v2/assistantsapi-v2/run/getRun`,
      {
        method: "POST",
        next: {
          revalidate: 0,
        },
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            threadId: threadId,
            runId: runId
        }),
      }
    );
    const jsonRunResult = await runResult.json();
    console.log("in getRun internalApi", jsonRunResult);
    if (runResult.status !== 200) {
        console.log("in getRun internalApi error", runResult);
      throw (
        jsonRunResult.error ||
        new Error(
          `Request failed in getRun internalApi with status ${runResult.status}`
        )
      );
    }
    return await jsonRunResult;
  }
  