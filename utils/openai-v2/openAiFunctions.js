import { OpenAI } from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.OPENAI_API_STREAKER_AI_ORG_ID,
  project: process.OPENAI_API_PROJECT_ID
});

const assistantId = process.env.ASSISTANT_ID;

export const getAssistant = async () => {
  const assistant = await openai.beta.assistants.retrieve(assistantId);
  return assistant;
};

export const createThread = async () => {
  const emptyThread = await openai.beta.threads.create();
  return emptyThread;
};

export const createMessage = async (threadId, content, role = "user") => {
  console.log("in createMessage openAiFunctions", threadId, content, role);
  const threadMessages = await openai.beta.threads.messages.create(threadId, {
    role,
    content
  });

  console.log("in runAssistant openAiFunctions", threadMessages);
  return threadMessages;
};

export const listMessages = async (threadId) => {
  console.log("in listMessages openAiFunctions £££££333£££££££££££££££££££££££", threadId);
  const messageList = await openai.beta.threads.messages.list(threadId);

  return messageList.data;
};

export const runAssistant = async (threadId) => {
  console.log("in runAssistant openAiFunctions", threadId, assistantId);
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });

  return run;
};

export const getRun = async (threadId) => {
  console.log("in getRun openAiFunctions", threadId, assistantId);
  const run = await openai.beta.threads.runs.createAndPoll(threadId, {
    assistant_id: assistantId,
  });

  const response = [];
  let m = {}

  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(
      run.thread_id
    );
    for (const message of messages.data.reverse()) {
      console.log(`${message.role} > ${message.content[0].text.value}`);
      m.role = message.role;
      m.content = message.content[0].text.value;
      response.push(m);
      m = {};
    }
  } else {
    console.log(run.status);
  }

  return response;
};

