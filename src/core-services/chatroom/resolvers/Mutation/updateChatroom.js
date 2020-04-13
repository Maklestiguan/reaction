import { encodeChatroomOpaqueId, decodeChatroomOpaqueId } from "../../xforms/id.js";


export default async function updateChatroom(_, { input }, context) {
  const {
    clientMutationId = null,
    chatroomId: opaqueChatroomId,
    // не думаю, что это необходимо. Взято из reaction/shop/resolvers/mutation/updateShop.js
    ...passThroughInput 
  } = input;
  const chatroomId = decodeChatroomOpaqueId(opaqueChatroomId);

  const updatedChatroom = await context.mutations.updateChatroom(context, {
    ...passThroughInput,
    chatroomId
  });

  return {
    chatroom: updatedChatroom,
    clientMutationId
  };
}