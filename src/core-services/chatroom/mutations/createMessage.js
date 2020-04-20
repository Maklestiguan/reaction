import Random from "@reactioncommerce/random";
import ReactionError from "@reactioncommerce/reaction-error";
import { Message as MessageSchema } from "../simpleSchemas.js";

/**
 * @summary Create a message
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - mutation input
 * @returns {Promise<Object>} Created message
 */
export default async function createMessage(context, input) {
  const { text } = input;
  const { collections, userId } = context;
  const { Messages, Chatrooms, Accounts } = collections;

  const account = await Accounts.findOne({ _id: userId }, { projection: { userId: 1 } });
  const chatroom = await Chatrooms.findOne({ createdBy: userId }, { projection: { userId: 1} });

  await context.validatePermissions("reaction:messages", "create", {
    owner: account.userId
  });

  if(!chatroom) {
    throw new ReactionError("chatroom-not-found", "Click on chat widget to start a chat");
  }

  const createdAt = new Date();
  const message = {
    _id: Random.id(),
    text: text,
    createdBy: userId,
    createdAt,
    chatroomId: chatroom._id
  };

  MessageSchema.validate(message);

  await Chatrooms.findOneAndUpdate(
    { _id: chatroom._id },
    {
      $push: {messages: message}
    },
    {
      returnOriginal: false
    }
  );

  // await appEvents.emit("afterMessageCreate", message);

  return message;
}