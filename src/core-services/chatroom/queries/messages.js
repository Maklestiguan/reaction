export default async function messages(context) {

  const { collections } = context;
  const { Messages } = collections;
  const selector = {};
  
  return Messages.find(selector);
}