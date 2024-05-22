import createThread from "@/utils/openai-v2/internalApi/thread/createThread";
import createMessage from "@/utils/openai-v2/internalApi/message/createMessage";
import getRun from "@/utils/openai-v2/internalApi/run/getRun";

const createCompletionV1 = async (input) => {
  if (!input) {
    alert("No input.");
    return;
  }

  try {
    // Create a new thread
    const currentThread = await createThread();

    // Create a message in the newly created thread
    const messages = await createMessage(currentThread.newThread.id, input.goal);

    // Get the run details for the new thread
    const rawMessages = await getRun(currentThread.newThread.id);

    // Log the raw messages
    console.log("in createCompletionV1 rawMessages", rawMessages);

    // Return the raw messages
    return rawMessages;

  } catch (error) {
    console.error('An error occurred:', error);
    throw error; // Re-throw the error if you want to handle it further up the call stack
  }
};

export default createCompletionV1;

