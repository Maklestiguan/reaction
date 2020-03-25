import chatroom from "./schemas";
import queries from "./queries/index.js";

export default async function register(app) {
  await app.registerPlugin({
    graphQL: {
      chatroom
    },
    queries,
    // other props
  });
}