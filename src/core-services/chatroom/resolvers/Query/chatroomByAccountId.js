import { decodeAccountOpaqueId } from "../../xforms/id.js";

export default async function chatroomByAccountId(parentResult, args, context) {
    const { createdBy } = args;

    return context.queries.chatroomByAccountId(context, {
      createdBy: decodeAccountOpaqueId(createdBy),
    });
  }