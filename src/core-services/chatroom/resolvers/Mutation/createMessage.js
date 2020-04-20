export default async function createMessage(_, { input }, context) {
  const { clientMutationId = null, ...mutationInput } = input;

  const message = await context.mutations.createMessage(context, { ...mutationInput });

  return { message, clientMutationId };
}