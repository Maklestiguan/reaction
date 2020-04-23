import Random from "@reactioncommerce/random";
import ReactionError from "@reactioncommerce/reaction-error";
import { Chatroom as ChatroomSchema } from "../simpleSchemas.js";

/**
 * @summary Create a chatroom
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - mutation input
 * @returns {Promise<Object>} Created chatroom
 */
export default async function createChatroom(context) {
  const { collections, userId } = context;
  const { Chatrooms, Accounts } = collections;

  const account = await Accounts.findOne({ _id: userId }, { projection: { userId: 1 } });
  await context.validatePermissions("reaction:chatrooms", "create", {
    owner: account.userId
  });

  // If we have an accountId and that account already has a chatroom - throw error
  if (userId) {
    const existingChatroom = await Chatrooms.count({ createdBy: userId }, { projection: { _id: 1 } });

    if (existingChatroom) {
      throw new ReactionError("chatroom-found", "Each account may have only one chatroom.");
    }
  }

  const createdAt = new Date();
  const chatroom = {
    _id: Random.id(),
    status: "OPENED",
    createdBy: userId,
    messages: [],
    createdAt,
    updatedAt: createdAt
  };

  ChatroomSchema.validate(chatroom);

  await Chatrooms.insertOne(chatroom);

  // await appEvents.emit("afterChatroomCreate", chatroom);

  return chatroom;
}