export default async function runAssistant(threadId) {
    console.log("in runAssistant internalApi intro", threadId);

    const runResult = await fetch(
      `${location.origin}/api/v2/assistantsapi-v2/run/runAssistant`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            threadId: threadId
        }),
      }
    );
    const jsonRunResult = await runResult.json();
    console.log("in runAssistant internalApi", jsonRunResult);
    if (runResult.status !== 200) {
        console.log("in runAssistant internalApi error", runResult);
      throw (
        jsonRunResult.error ||
        new Error(
          `Request failed in runAssistant internalApi with status ${runResult.status}`
        )
      );
    }
    return await jsonRunResult;
  }
  