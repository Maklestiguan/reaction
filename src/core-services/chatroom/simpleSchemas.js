import SimpleSchema from "simpl-schema";

export const Chatroom = new SimpleSchema({
  "_id": String,
  "status": String,
  "createdBy": String,
  "messages": {
    type: Array,
    optional: true
  },
  "createdAt": Date,
  "lastUpdatedAt": Date
});