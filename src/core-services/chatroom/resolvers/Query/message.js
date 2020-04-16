import { decodeMessageOpaqueId } from "../../xforms/id.js";

export default async function message(_, { id }, context) {
  const dbMessageId = decodeMessageOpaqueId(id);

  return context.queries.messageById(context, dbMessageId);
}