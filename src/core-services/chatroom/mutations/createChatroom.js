import Random from "@reactioncommerce/random";
import ReactionError from "@reactioncommerce/reaction-error";
import { Chatroom as ChatroomSchema } from "../simpleSchemas.js";

/**
 * @summary Create a chatroom
 * @param {Object} context - an object containing the per-request state
 * @returns {Promise<Object>} Created chatroom
 */
export default async function createChatroom(context) {
  const { collections, accountId } = context;
  const { Chatrooms } = collections;

  // If we have an accountId and that account already has a chatroom - throw error
  if (accountId) {
    const existingChatroom = await Chatrooms.countDocuments({ createdBy: accountId }, { projection: { _id: 1 } });

    if (existingChatroom) {
      throw new ReactionError("chatroom-found", "Each account may have only one chatroom.");
    }
  }

  const createdAt = new Date();
  const chatroom = {
    _id: Random.id(),
    status: "OPENED",
    createdBy: accountId,
    messages: [],
    createdAt,
    updatedAt: createdAt
  };

  ChatroomSchema.validate(chatroom);

  await Chatrooms.insertOne(chatroom);

  return chatroom;
}
