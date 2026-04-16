import * as lancedb from "@lancedb/lancedb";
import type { AIMessage } from "../../core/types.ts";
import { uuidv4 } from "zod";
import { ur } from "zod/locales";
import { get } from "http";
import * as arrow from "apache-arrow";
import type { ModelMessage } from "ai";

// import { mergeTypes } from "zod/v3";

const uri = "/home/miladi/repos/agents-v2";
const messagesTable = await lancedb.connect(uri);

export const connectAgent = async (dbUri: string = uri) => {
  const db = await lancedb.connect(dbUri);
  return db;
};

// Generate a unique id for each message.

export type MessageWithMetadata = AIMessage & {
  id: string;
  createdAt: string;
};

// Add meta data label to each message

export const addMetaData = (message: AIMessage) => {
  return {
    ...message,
    //An error occured due to lancedb not recognizing zod schema.
    //id: uuidv4(),
    id: crypto.randomUUID(),
    role: message.role,
    content: message.content,
    createdAt: new Date().toISOString(),
  };
};

// Remove metadata from message
export const removeMetaData = (message: MessageWithMetadata) => {
  const { id, createdAt, ...rest } = message;
  console.log(`rest: `, rest)
  return rest;
};

//  * Implement these using LanceDB
//  *
//  * type Data = {
//     messages: MessageWithMetaData[]
// }
// const defaultData: Data = {
//     messages: []
// }

//Created a generic Data type to store an array of messages inside db.json
export const getDb = async () => {
  const db = await connectAgent();
  const tableNames = await db.tableNames();

  console.log("tablenames :", tableNames);

  if (tableNames.includes("messages")) {
    console.log("Opentable :", db.openTable("messages"));

    return db.openTable("messages");
  }

  const schema = new arrow.Schema([
    new arrow.Field("id", new arrow.Utf8()),
    new arrow.Field("role", new arrow.Utf8()),
    new arrow.Field("content", new arrow.Utf8()),
    new arrow.Field("createdAt", new arrow.Utf8()),
    new arrow.Field("tool_call_id", new arrow.Utf8(), true),
  ]);

  console.log("schema");
  return db.createEmptyTable("messages", schema);
};

//

export const addMessage = async (messages: AIMessage[]) => {
  const db = await getDb();
  const MessageWithMetaData = messages.map(addMetaData);

  MessageWithMetaData.forEach((msg, i) => {
    console.log(`--- Message ${i} ---`);
    console.log("keys:", Object.keys(msg));
    console.log("id type:", typeof msg.id);
    console.log("id value:", msg.id);
    console.log("id own props:", Object.getOwnPropertyNames(msg.id));
    console.log("role type:", typeof msg.role);
    console.log("content type:", typeof msg.content);
    console.log("createdAt type:", typeof msg.createdAt);
  });
  return await db.add(MessageWithMetaData);
};

export const getMessages = async () : Promise<ModelMessage[]> => {
  const db = await getDb();
  const messages = await db.query().toArray();
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,

  }))
  
};

export const saveToolResponse = async (id: any, response: any) => {
  addMessage([{ role: "tool", content: response, tool_call_id: id }]);
};
