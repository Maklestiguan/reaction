import importAsString from "@reactioncommerce/api-utils/importAsString.js";

const chatroomSchema = importAsString("./chatroom.graphql");
const messageSchema = importAsString("./message.graphql");

export default [chatroomSchema, messageSchema];