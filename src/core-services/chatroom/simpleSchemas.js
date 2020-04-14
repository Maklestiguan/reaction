import SimpleSchema from "simpl-schema";

export const Chatroom = new SimpleSchema({
  "_id": String,
  "status": String,
  "createdBy": String,
  "messages": {
    type: Array,
    optional: true
  },
  "messages.$": {
    type: Object,
    optional: true
  },
  "createdAt": Date,
  "updatedAt": Date
});