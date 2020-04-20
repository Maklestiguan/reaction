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
  const { collections, userId } = context;
  const { Chatrooms, Accounts } = collections;

  const account = await Accounts.findOne({ _id: userId }, { projection: { userId: 1 } });
  await context.validatePermissions(`reaction:chatrooms:${chatroom}`, "update", {
    owner: account.userId
  });

  const updates = {
    status,
    reason,
    updatedAt: new Date()
  };

  chatroomUpdatesSchema.validate(updates);

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