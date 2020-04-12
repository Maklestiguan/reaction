export default async function createChatroom(_, { input }, context) {
  const { clientMutationId = null, ...mutationInput } = input;
  
  const chatroom = await context.mutations.createChatroom(context, { ...mutationInput });
  
  return { chatroom, clientMutationId };
}