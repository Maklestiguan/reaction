import ReactionError from "@reactioncommerce/reaction-error";

export default async function chatroomByAccountId(context, { createdBy } = {}) {
  const { collections } = context;
  const { Chatrooms } = collections;

  console.log(createdBy);
  const chatroom = await Chatrooms.findOne({ createdBy });
  if (!chatroom) {
    throw new ReactionError("not-found", "No chatroom found");
  }

  return chatroom;
}