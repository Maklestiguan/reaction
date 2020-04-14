import Random from "@reactioncommerce/random";
import { Chatroom as ChatroomSchema } from "../simpleSchemas.js";

/**
 * @summary Create a chatroom
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - mutation input
 * @returns {Promise<Object>} Created chatroom
 */
export default async function createChatroom(context, input) {
  // const { _id } = input;
  const { collections } = context;
  const { Chatrooms } = collections; // Нельзя сделать Chatrooms = context напрямую

  // await context.validatePermissions("reaction:legacy:", "create", { shopId });

  const createdAt = new Date();
  const chatroom = {
    _id: Random.id(),
    status: "OPENED",
    createdBy: Random.id(), // viewer _id from input
    messages: [],
    createdAt,
    updatedAt: createdAt
  };

  ChatroomSchema.validate(chatroom);

  await Chatrooms.insertOne(chatroom);

  // await appEvents.emit("afterChatroomCreate", chatroom);

  return chatroom;
}