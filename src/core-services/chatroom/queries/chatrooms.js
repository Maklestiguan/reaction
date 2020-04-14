export default async function chatrooms(context) {

  const { collections } = context;
  const { Chatrooms } = collections;
  const selector = {};

  return Chatrooms.find(selector);
}