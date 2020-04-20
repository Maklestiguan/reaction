import decodeOpaqueIdForNamespace from "@reactioncommerce/api-utils/decodeOpaqueIdForNamespace.js";
import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";

const namespaces = {
  Account: "reaction/account",
  Chatroom: "reaction/chatroom",
  Message: "reaction/message"
};

export const encodeAccountOpaqueId = encodeOpaqueId(namespaces.Account);
export const encodeChatroomOpaqueId = encodeOpaqueId(namespaces.Chatroom);
export const encodeMessageOpaqueId = encodeOpaqueId(namespaces.Message);

export const decodeAccountOpaqueId = decodeOpaqueIdForNamespace(namespaces.Account);
export const decodeChatroomOpaqueId = decodeOpaqueIdForNamespace(namespaces.Chatroom);
export const decodeMessageOpaqueId = decodeOpaqueIdForNamespace(namespaces.Message);