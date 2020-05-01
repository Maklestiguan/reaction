import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";
import importAsString from "@reactioncommerce/api-utils/importAsString.js";
import Factory from "/tests/util/factory.js";
import TestApp from "/tests/util/TestApp.js";

const createMessageMutation = importAsString("./CreateMessageMutation.graphql");

jest.setTimeout(300000);

let createMessage;
let customerGroup;
let mockAccountsManagerAccount;
let mockCustomerAccount;
let mockAccountsManagerChatroom;
let mockCustomerChatroom;
let shopId;
let testApp;


beforeAll(async () => {
  testApp = new TestApp();
  await testApp.start();
  shopId = await testApp.insertPrimaryShop();

  const accountsManagerGroup = Factory.Group.makeOne({
    _id: "accountsManagerGroup",
    createdBy: null,
    name: "accounts manager",
    slug: "accounts manager",
    shopId
  });
  await testApp.collections.Groups.insertOne(accountsManagerGroup);

  mockAccountsManagerAccount = Factory.Account.makeOne({
    _id: "mockAccountsManagerAccount",
    groups: [accountsManagerGroup._id],
    shopId
  });
  await testApp.createUserAndAccount(mockAccountsManagerAccount);

  customerGroup = Factory.Group.makeOne({
    createdBy: null,
    name: "customer",
    slug: "customer",
    shopId
  });
  await testApp.collections.Groups.insertOne(customerGroup);

  mockCustomerAccount = Factory.Account.makeOne({
    _id: "mockCustomerAccount",
    groups: [customerGroup._id],
    shopId
  });
  await testApp.createUserAndAccount(mockCustomerAccount);

  mockAccountsManagerChatroom = {
    _id: "fakeAccountsManagerChatroomId",
    status: "OPENED",
    createdBy: "mockAccountsManagerAccount",
    messages: []
  };
  mockCustomerChatroom = {
    _id: "fakeCustomerChatroomId",
    status: "OPENED",
    createdBy: "mockCustomerAccount",
    messages: []
  };

  await testApp.collections.Chatrooms.insertOne(mockCustomerChatroom);
  await testApp.collections.Chatrooms.insertOne(mockAccountsManagerChatroom);

  createMessage = testApp.mutate(createMessageMutation);
});

// There is no need to delete any test data from collections because
// testApp.stop() will drop the entire test database. Each integration
// test file gets its own test database.
afterAll(() => testApp.stop());

test(`AccountManager can send message to any chatroom using chatroomId`, async () => {
  await testApp.setLoggedInUser(mockAccountsManagerAccount);

  const result = await createMessage({
    input: {
      chatroomId: "fakeCustomerChatroomId",
      text: "I'm an admin and can send message here"
    }
  });

  expect(result.createMessage.message).toMatchObject({
    chatroomId: "fakeCustomerChatroomId",
    text: "I'm an admin and can send message here"
  });
});

test(`Customer can send message to his own chatroom`, async () => {
  await testApp.setLoggedInUser(mockCustomerAccount);

  const result = await createMessage({
    input: {
      text: "I've created this chat and can send messages here"
    }
  });

  expect(result.createMessage.message).toMatchObject({
    chatroomId: "fakeCustomerChatroomId",
    text: "I've created this chat and can send messages here"
  });
});

test(`should throw if user tries to send message to chatroom using id of another user's chatroom`, async () => {
  await testApp.setLoggedInUser(mockCustomerAccount);

  try {
    await createMessage({
      input: {
        chatroomId: "fakeCustomerChatroomId",
        text: "I've created this chat and can send messages here"
      }
    });

    //This should throw
    await createMessage({
      input: {
        chatroomId: "fakeAccountsManagerChatroomId",
        text: "I've created this chat and can send messages here"
      }
    });
  } catch (errors) {
    expect(errors[0]).toMatchSnapshot();
  }
});
