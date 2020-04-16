import SimpleSchema from "simpl-schema";


export const Message = new SimpleSchema({
  "_id": String,
  "text": String,
  "createdBy": String,
  "createdAt": Date,
  "chatroomId": String
});

export const Chatroom = new SimpleSchema({
  "_id": String,
  "status": String,
  "createdBy": String,
  "messages": {
    type: Array,
    optional: true
  },
  "messages.$": {
    type: Message
  },
  "createdAt": Date,
  "updatedAt": Date
});
