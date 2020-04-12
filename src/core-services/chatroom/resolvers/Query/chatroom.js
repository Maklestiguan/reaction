import { decodeChatroomOpaqueId } from "../../xforms/id.js";

export default async function chatroom(_, { id }, context) {
  const dbChatroomId = decodeChatroomOpaqueId(id);

  return context.queries.chatroomById(context, dbChatroomId);
}