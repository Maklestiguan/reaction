import mockContext from "@reactioncommerce/api-utils/tests/mockContext.js";
import createChatroom from "./createChatroom.js";

mockContext.mutations.createChatroom = jest.fn().mockName("mutations.createChatroom");

test("createChatroom resolver function should correctly passes through to internal mutation function", async () => {
  const fakeCreatedChatroom = {
      status: "OPENED",
      createdBy: "FAKE_ACCOUNT_ID",
      messages: []
  };

  mockContext.mutations.createChatroom.mockReturnValueOnce(Promise.resolve(fakeCreatedChatroom));

  const result = await createChatroom(null, mockContext);

  expect(mockContext.mutations.createChatroom).toHaveBeenCalledWith(mockContext);

  expect(result).toMatchObject({
    chatroom: {
      status: "OPENED",
      createdBy: "FAKE_ACCOUNT_ID",
      messages: []
    }
  });
});
