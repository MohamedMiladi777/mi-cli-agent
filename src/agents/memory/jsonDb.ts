// import { JSONFilePreset } from 'lowdb/node'
// import type { AIMessage } from '../../core/types.ts'
// import { v4 as uuidv4 } from 'uuid'
// import type { Message } from 'openai/resources/beta/threads/messages.mjs'

// // Lowdb is used as a database for the project
// // AI message type has role and content
// // uuid is for generating random strings

// //Use type intersection (combine two types) to generate random id for message
// export type MessageWithMetaData = AIMessage & {
//   id: string
//   createdAt: string
// }


// export const addMetaData = (message: AIMessage) => {
//     return {
//         ...message,
//         id: uuidv4(),
//         createdAt: new Date().toISOString()
//     }

// }


// export const removeMetaData = (message: MessageWithMetaData) => {
// const {id, createdAt, ...rest} = message
// return rest

// }


// //Default data to store messages
// type Data = {
//     messages: MessageWithMetaData[]
// }
// const defaultData: Data = {
//     messages: []
// }

// //Created a generic Data type to store an array of messages inside db.json
// export const getDb = async () => {
// const db = await  <Data>('db.json', defaultData)
// return db
// }

// export const addMessage = async (messages: AIMessage[]) => {
//     const db = await getDb()
//     db.data.messages.push(...messages.map(addMetaData))
//     await db.write()

// }

// export const getMessages = async () => {
//     const db = await getDb()
//     return db.data.messages.map(removeMetaData)
// }

// /** Make a save tool response function which takes
//  * @param {ToolCallId}: string
//  * @param {toolResponse} : string
//  * 
//  * @returns {role}: tool
//  * @returns {content}: toolResponse
//  * @returns {tool_call_id} : toolCallId
//  */
