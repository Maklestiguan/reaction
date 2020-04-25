import encodeOpaqueId from "@reactioncommerce/api-utils/encodeOpaqueId.js";
import importAsString from "@reactioncommerce/api-utils/importAsString.js";
import Factory from "/tests/util/factory.js";
import TestApp from "/tests/util/TestApp.js";

const createChatroomMutation = importAsString("./CreateChatroomMutation.graphql");

jest.setTimeout(300000);

let createChatroom;
let customerGroup;
let mockAdminAccount;
let mockCustomerAccount;
let shopId;
// let shopOpaqueId;

// для jest.each()
// let users;
let testApp;

// Should match UTC datetime of the form YYYY-MM-DDTHH:MM:SS.mmmZ e.g. 2019-12-10T13:37:58.833Z
const UTC_REGEX_PATTERN = /\b[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[.]{1}[0-9]{3}Z\b/;

beforeAll(async () => {
  testApp = new TestApp();
  await testApp.start();
  shopId = await testApp.insertPrimaryShop();

  const adminGroup = Factory.Group.makeOne({
    _id: "adminGroup",
    createdBy: null,
    name: "admin",
    permissions: ["reaction:chatrooms/create"],
    slug: "admin",
    shopId
  });
  await testApp.collections.Groups.insertOne(adminGroup);

  mockAdminAccount = Factory.Account.makeOne({
    _id: "mockAdminAccount",
    groups: [adminGroup._id],
    shopId
  });
  await testApp.createUserAndAccount(mockAdminAccount);

  customerGroup = Factory.Group.makeOne({
    createdBy: null,
    name: "customer",
    permissions: ["reaction:chatrooms:*/create"],
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

  // shopOpaqueId = encodeOpaqueId("reaction/shop", shopId);

  //Протестировать возможность использования jest.each()
  //users = [{ mockAdminAccount }, { mockCustomerAccount }];

  createChatroom = testApp.mutate(createChatroomMutation);
});

// There is no need to delete any test data from collections because
// testApp.stop() will drop the entire test database. Each integration
// test file gets its own test database.
afterAll(() => testApp.stop());

test(`Admin can create a chatroom`, async () => {
  await testApp.setLoggedInUser(mockAdminAccount);

  const result = await createChatroom({});

  expect(result.createChatroom.chatroom).toMatchObject({
    _id: expect.any(String),
    status: "OPENED",
    messages: [],
    createdAt: expect.stringMatching(UTC_REGEX_PATTERN),
    updatedAt: expect.stringMatching(UTC_REGEX_PATTERN)
  });
});

test(`Customer can create a chatroom`, async () => {
  await testApp.setLoggedInUser(mockCustomerAccount);

  const result = await createChatroom({});

  expect(result.createChatroom.chatroom).toMatchObject({
    _id: expect.any(String),
    status: "OPENED",
    messages: [],
    createdAt: expect.stringMatching(UTC_REGEX_PATTERN),
    updatedAt: expect.stringMatching(UTC_REGEX_PATTERN)
  });
});


test("should throw if user already has a chat created", async () => {
  await testApp.setLoggedInUser(mockAdminAccount);

  try {
    // Make sure DB is in clean state
    await testApp.collections.Chatrooms.deleteMany({});

    await createChatroom({});

    // This should throw
    await createChatroom({});
  } catch (errors) {
    expect(errors[0]).toMatchSnapshot();
  }

  const chatrooms = await testApp.collections.Chatrooms.find({}).toArray();

  expect(chatrooms.length).toBe(1);
});
