import decodeOpaqueIdForNamespace from "@reactioncommerce/api-utils/decodeOpaqueIdForNamespace.js";
import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";

const namespaces = {
  Chatroom: "reaction/chatroom",
  Message: "reaction/message"
};

export const encodeChatroomOpaqueId = encodeOpaqueId(namespaces.Chatroom);
export const encodeMessageOpaqueId = encodeOpaqueId(namespaces.Message);

export const decodeChatroomOpaqueId = decodeOpaqueIdForNamespace(namespaces.Chatroom);
export const decodeMessageOpaqueId = decodeOpaqueIdForNamespace(namespaces.Message);