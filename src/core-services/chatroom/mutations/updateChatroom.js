import ReactionError from "@reactioncommerce/reaction-error";
import SimpleSchema from "simpl-schema";

const chatroomUpdatesSchema = new SimpleSchema({
  "status": String,
  "reason" : String,
  "updatedAt": Date
});

/**
 * @summary Update a chatroom
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - mutation input
 * @returns {Promise<Object>} Updated chatroom
 */
export default async function updateChatroom(context, input) {
  const { chatroom, status, reason } = input;
  const { collections } = context;
  const { Chatrooms } = collections;

  // await context.validatePermissions(`reaction:legacy:addressValidationRules:${_id}`, "update", { shopId });

  const updates = {
    status,
    reason,
    updatedAt: new Date()
  };

  chatroomUpdatesSchema.validate(updates);

  console.log(chatroom);

  const { value: updatedChatroom } = await Chatrooms.findOneAndUpdate(
    { _id: chatroom },
    {
      $set: updates
    },
    {
      returnOriginal: false
    }
  );

  if (!updatedChatroom) {
    throw new ReactionError("not-found", "Not found");
  }

  // await appEvents.emit("afterChatroomUpdate", updatedChatroom);

  return updatedChatroom;
}