import Random from "@reactioncommerce/random";
import ReactionError from "@reactioncommerce/reaction-error";
import { Message as MessageSchema } from "../simpleSchemas.js";

/**
 * @summary Create a message
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - mutation input
 * @param {String} [input.chatroomId] - optional ID of chatroom to send message to for shop workers/admins
 * @returns {Promise<Object>} Created message
 */
export default async function createMessage(context, input) {
  const { text, chatroomId } = input;
  const { collections, userId } = context;
  const { Groups, Chatrooms, Accounts } = collections;

  const account = await Accounts.findOne({ _id: userId });
  const accountManagerGroup = await Groups.findOne({ name: "accounts manager"});
  const chatroom = await Chatrooms.findOne({ _id: chatroomId })
    || await Chatrooms.findOne({ createdBy: userId });

  // await context.validatePermissions(`reaction:chatrooms:${chatroom._id})`, "create:messages", {
  //   owner: account._id,
  // });

  if(!chatroom) {
    throw new ReactionError("chatroom-not-found", "Click on chat widget to start a chat");
  }

  if(chatroom.createdBy !== userId && !account.groups.includes(accountManagerGroup._id)) {
    throw new ReactionError("permission-error", "You have no permission to perform this action");
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