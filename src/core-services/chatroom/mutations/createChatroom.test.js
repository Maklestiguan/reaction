import mockContext from "@reactioncommerce/api-utils/tests/mockContext.js";
import mockCollection from "@reactioncommerce/api-utils/tests/mockCollection.js";
import ReactionError from "@reactioncommerce/reaction-error";
import createChatroom from "./createChatroom.js";

mockContext.validatePermissions = jest.fn("validatePermissions");
mockContext.collections["Chatrooms"] = mockCollection("Chatrooms");
mockContext.collections.Chatrooms.insert = jest.fn().mockName("collections.Chatrooms.insertOne");
mockContext.collections.Chatrooms.countDocuments = jest.fn().mockName("collections.Chatrooms.countDocuments");

test("should create a chat for user", async () => {
  const fakeResult = {
    createdBy: "FAKE_ACCOUNT_ID",
    status: "OPENED",
    messages: [],
  };

  const insertOneRes = {
    ops: [fakeResult]
  };
  mockContext.collections.Chatrooms.insertOne.mockReturnValueOnce(Promise.resolve(insertOneRes));
  mockContext.collections.Chatrooms.countDocuments.mockReturnValueOnce(Promise.resolve(undefined));

  const result = await createChatroom(mockContext);
  const expected = fakeResult;
  await expect(result).toMatchObject(expected);

  expect(mockContext.collections.Chatrooms.countDocuments).toHaveBeenNthCalledWith(1, {
    createdBy: mockContext.accountId }, { projection: { _id: 1 } }
  );
  expect(mockContext.collections.Chatrooms.insertOne).toHaveBeenCalledWith({
    _id: expect.any(String),
    createdBy: "FAKE_ACCOUNT_ID",
    status: "OPENED",
    messages: [],
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date)
  });
});

test("should throw if chat for user already exists", async () => {
    const fakeResult = {
    createdBy: "FAKE_ACCOUNT_ID",
    status: "OPENED",
    messages: [],
  };

  const insertOneRes = {
    ops: [fakeResult]
  };
  mockContext.collections.Chatrooms.insertOne.mockReturnValueOnce(Promise.resolve(insertOneRes));
  mockContext.collections.Chatrooms.countDocuments
    .mockReturnValueOnce(Promise.resolve(fakeResult))
    .mockReturnValueOnce(Promise.resolve(undefined));

  await expect(createChatroom(mockContext)).rejects.toThrow(new ReactionError("chatroom-found", "Each account may have only one chatroom."));
});
