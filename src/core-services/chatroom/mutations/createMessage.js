import Random from "@reactioncommerce/random";
import { Message as MessageSchema } from "../simpleSchemas.js";

/**
 * @summary Create a message
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - mutation input
 * @returns {Promise<Object>} Created message
 */
export default async function createMessage(context, input) {
  const { _id, text, chatroomId } = input;
  const { collections } = context;
  const { Messages } = collections;

  // await context.validatePermissions("reaction:legacy:", "create", { shopId });

  const createdAt = new Date();
  const message = {
    _id: Random.id(),
    text: text,
    createdBy: Random.id(), // viewer _id from input
    createdAt,
    chatroomId: Random.id() // chatroomId from input
  };

  MessageSchema.validate(message);

  await Messages.insertOne(message);

  // await appEvents.emit("afterMessageCreate", message);

  return message;
}