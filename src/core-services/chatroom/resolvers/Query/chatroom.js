import { decodeChatroomOpaqueId } from "../../xforms/id.js";

export default async function chatroom(_, { id }, context) {
  const dbChatroomId = decodeShopOpaqueId(id);

  return context.queries.chatroomById(context, dbChatroomId);
}