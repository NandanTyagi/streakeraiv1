export default async function createThread() {
  const newThread = await fetch(
    `${location.origin}/api/v2/assistantsapi-v2/thread/createThread`,
    {
      method: "GET",
      next: {
        revalidate: 0,
      },
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const jsonNewThread = await newThread.json();
  console.log("in createThread internalApi", jsonNewThread);
  if (newThread.status !== 200) {
    throw (
      jsonNewThread.error ||
      new Error(
        `Request failed in createThread internalApi with status ${newThread.status}`
      )
    );
  }
  return await jsonNewThread;
}
