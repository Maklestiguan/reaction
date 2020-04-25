import ReactionError from "@reactioncommerce/reaction-error";

export default async function chatroomQuery(context) {
  const { chatroomId } = input;
  const { collections } = context;
  const { Chatrooms } = collections;

  const chatroom = await Chatrooms.findOne({ _id: chatroomId });
  if (!chatroom) {
    throw new ReactionError("not-found", "No chatroom found");
  }

  // Check to make sure current user has permissions to view queried chatroom
  await context.validatePermissions(`reaction:chatrooms:${chatroom._id}`, "read");

  return chatroom;
}