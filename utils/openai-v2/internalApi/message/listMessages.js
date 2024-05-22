export default async function listMessages(threadId) {
    console.log("in listMessages internalApi intro", threadId);

    const messageList = await fetch(
      `${location.origin}/api/v2/assistantsapi-v2/message/listMessages`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            threadId: threadId,
        }),
      }
    );
    const jsonMessageList = await messageList.json();
    console.log("in listMessages internalApi", jsonMessageList);
    if (messageList.status !== 200) {
        console.log("in listMessages internalApi error", messageList);
      throw (
        jsonMessageList.error ||
        new Error(
          `Request failed in listMessages internalApi with status ${messageList.status}`
        )
      );
    }
    return await jsonMessageList;
  }
  