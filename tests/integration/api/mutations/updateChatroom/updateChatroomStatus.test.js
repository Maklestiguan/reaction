import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";
import importAsString from "@reactioncommerce/api-utils/importAsString.js";
import Factory from "/tests/util/factory.js";
import TestApp from "/tests/util/TestApp.js";

const updateChatroomStatusMutation = importAsString("./UpdateChatroomStatusMutation.graphql");

jest.setTimeout(300000);

let updateChatroomStatus;
let customerGroup;
let mockAccountsManagerAccount;
let mockCustomerAccount;
let mockAccountsManagerChatroom;
let mockCustomerChatroom;
let shopId;
let testApp;

// Should match UTC datetime of the form YYYY-MM-DDTHH:MM:SS.mmmZ e.g. 2019-12-10T13:37:58.833Z
const UTC_REGEX_PATTERN = /\b[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[.]{1}[0-9]{3}Z\b/;

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

  updateChatroomStatus = testApp.mutate(updateChatroomStatusMutation);
});

// There is no need to delete any test data from collections because
// testApp.stop() will drop the entire test database. Each integration
// test file gets its own test database.
afterAll(() => testApp.stop());

test(`AccountManager can update any chatroom using chatroomId`, async () => {
  await testApp.setLoggedInUser(mockAccountsManagerAccount);
  
  const result = await updateChatroomStatus({
    input: {
      chatroomId: "fakeCustomerChatroomId",
      status: "CLOSED",
      reason: "Client's issue has been resolved"
    }
  });

  expect(result.updateChatroomStatus.chatroom).toMatchObject({
    _id: "fakeCustomerChatroomId",
    status: "CLOSED",
    messages: [],
  });
});

test(`Customer can update his own chatroom`, async () => {
  await testApp.setLoggedInUser(mockCustomerAccount);

  const result = await updateChatroomStatus({
    input: {
      chatroomId: null,
      status: "REOPENED",
      reason: "My issue has been resolved"
    }
  });

  expect(result.updateChatroomStatus.chatroom).toMatchObject({
    _id: "fakeCustomerChatroomId",
    status: "REOPENED",
    messages: []
  });
});

test(`should throw if user tries to update chatroom using id of another user's chatroom`, async () => {
  await testApp.setLoggedInUser(mockCustomerAccount);

  try {
    await updateChatroomStatus({
      input: {
        chatroomId: "fakeCustomerChatroomId",
        status: "CLOSED",
        reason: "My issue has been resolved"
      }
    });

    //This should throw
    await updateChatroomStatus({
      input: {
        chatroomId: "fakeAccountsManagerChatroomId",
        status: "REOPENED",
        reason: "My issue has been resolved"
      }
    });
  } catch (errors) {
    expect(errors[0]).toMatchSnapshot();
  }
});

test("should throw if chatroom is already in provided status", async () => {
  await testApp.setLoggedInUser(mockAccountsManagerAccount);

  try {
    await updateChatroomStatus({
      input: {
        chatroomId: null,
        status: "CLOSED",
        reason: "My issue has been resolved"
      }
    });

    // This should throw
    await updateChatroomStatus({
      input: {
        chatroomId: null,
        status: "CLOSED",
        reason: "My issue has been resolved"
      }
    });
  } catch (errors) {
    expect(errors[0]).toMatchSnapshot();
  }
});
