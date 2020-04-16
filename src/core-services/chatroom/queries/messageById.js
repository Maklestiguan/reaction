import ReactionError from "@reactioncommerce/reaction-error";

export default async function messageQuery(context, id) {
  const { collections } = context;
  const { Messages } = collections;

  const message = await Messages.findOne({ _id: id });
  if (!message) throw new ReactionError("not-found", "No account found");

  // Check to make sure current user has permissions to view queried user
  // await context.validatePermissions("reaction:legacy:accounts", "read", {
  //   owner: account.userId
  // });

  return message;
}