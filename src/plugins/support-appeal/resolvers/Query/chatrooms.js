/**
 * @name "Query.chatrooms"
 * @method
 * @memberof MyPlugin/GraphQL
 * @summary resolver for the chatrooms GraphQL query
 * @param {Object} parentResult - unused
 * @param {Object} args - an object of all arguments that were sent by the client
 * @param {Object} context - an object containing the per-request state
 * @return {Promise<Object>} TODO
 */
export default async function chatrooms(parentResult, args, context) {
    // TODO: decode incoming IDs here
    return context.queries.chatrooms(context);
  }