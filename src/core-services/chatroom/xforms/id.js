import decodeOpaqueIdForNamespace from "@reactioncommerce/api-utils/decodeOpaqueIdForNamespace.js";
import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";

const namespaces = {
  Chatroom: "reaction/chatroom",
};

export const encodeChatroomOpaqueId = encodeOpaqueId(namespaces.Chatroom);

export const decodeChatroomOpaqueId = decodeOpaqueIdForNamespace(namespaces.Chatroom);