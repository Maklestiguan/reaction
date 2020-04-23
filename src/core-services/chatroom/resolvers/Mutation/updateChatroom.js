export default async function updateChatroom(_, { input }, context) {
  const { chatroomId, clientMutationId = null, ...otherInput } = input;

  const updatedChatroom = await context.mutations.updateChatroom(context, {
    ...otherInput,
    chatroomId
  });

  return {
    chatroom: updatedChatroom,
    clientMutationId
  };
}