export default async function getAssistant() {
    const currentAssistant = await fetch(
      `${location.origin}/api/v2/assistantsapi-v2/assistant/getAssistant`,
      {
        method: "GET",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   threadId: threadId,
        // }),
      }
    );
    const jsonCurrentAssistant = await currentAssistant.json();
    console.log("in getAssistant internalApi", jsonCurrentAssistant);
    if (currentAssistant.status !== 200) {
      throw (
        jsonCurrentAssistant.error ||
        new Error(`Request failed in getAssistant internalApi with status ${currentAssistant.status}`)
      );
    }
    return await jsonCurrentAssistant;
  }