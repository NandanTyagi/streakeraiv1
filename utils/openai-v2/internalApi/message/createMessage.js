export default async function createMessage(threadId, content) {
    console.log("in createMessage internalApi intro", threadId, content);

    const threadMessages = await fetch(
      `${location.origin}/api/v2/assistantsapi-v2/message/createMessageNew`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            threadId: threadId,
            content: content,
        }),
      }
    );
    const jsonThreadMessages = await threadMessages.json();
    console.log("in createMessage internalApi", jsonThreadMessages);
    if (threadMessages.status !== 200) {
        console.log("in createMessage internalApi error", threadMessages);
      throw (
        jsonThreadMessages.error ||
        new Error(
          `Request failed in createMessage internalApi with status ${threadMessages.status}`
        )
      );
    }
    return await jsonThreadMessages;
  }
  