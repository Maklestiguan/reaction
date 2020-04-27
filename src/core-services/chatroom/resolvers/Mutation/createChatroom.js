export default async function createChatroom(_, context) {
  
  const chatroom = await context.mutations.createChatroom(context);
  
  return { chatroom };
}