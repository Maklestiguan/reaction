import ReactionError from "@reactioncommerce/reaction-error";

export default async function chatroomQuery(context, id) {
  const { collections } = context;
  const { Chatrooms } = collections;

  const chatroom = await Chatrooms.findOne({ _id: id });
  if (!chatroom) throw new ReactionError("not-found", "No account found");

  // Check to make sure current user has permissions to view queried user
  // await context.validatePermissions("reaction:legacy:accounts", "read", {
  //   owner: account.userId
  // });

  return chatroom;
}