import ReactionError from "@reactioncommerce/reaction-error";
import SimpleSchema from "simpl-schema";

const chatroomUpdatesSchema = new SimpleSchema({
  "status": String,
  "reason" : String,
  "updatedAt": Date
});

/**
 * @summary Update a chatroom's status
 * @param {Object} context - an object containing the per-request state
 * @param {Object} input - mutation input
 * @returns {Promise<Object>} Updated chatroom
 */
export default async function updateChatroomStatus(context, input) {
  const { chatroomId, status, reason } = input;
  const { collections, accountId } = context;
  const { Groups, Chatrooms, Accounts } = collections;

  const account = await Accounts.findOne({ _id: accountId }, { projection: { _id: 1, groups: 1 } });

  // Всегда возвращает чат созданный пользователем в тестах (?) TODO: Fix
  // const chatroom = await Chatrooms.findOne({
  //   $or: [ { _id: chatroomId }, { createdBy: accountId } ] },
  //   { projection: { _id: 1, status: 1, createdBy: 1 } 
  // });

  const chatroom = await Chatrooms.findOne({ _id: chatroomId }) || await Chatrooms.findOne({ createdBy: accountId });
  const accountManagerGroup = await Groups.findOne({ name: "accounts manager" }, { projection: { _id: 1 } });
  
  // const groupId = accountManagerGroup._id;
  // const isInGroup = await Accounts.countDocuments({ _id: accountId, groups: { $elemMatch: { groupId } } });
  // isInGroups = 0
  // $in также не работает

  if(chatroom.createdBy !== accountId && !account.groups.includes(accountManagerGroup._id)) {
    throw new ReactionError("permission-error", "You have no permission to perform this action");
  }

  const updates = {
    status,
    reason,
    updatedAt: new Date()
  };

  chatroomUpdatesSchema.validate(updates);

  const isSameStatus = updates.status === chatroom.status;

  if(isSameStatus) {
    throw new ReactionError("chatroom-update-error", "Chatroom is already in the provided status");
  }

  const { value: updatedChatroom } = await Chatrooms.findOneAndUpdate(
    { _id: chatroom._id },
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