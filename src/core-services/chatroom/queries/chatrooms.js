export default async function chatrooms(context) {

  const { collections } = context;
  const { Chatrooms } = collections;

  await context.validatePermissions("reaction:chatrooms", "read");

  const selector = {};

  return Chatrooms.find(selector);
}