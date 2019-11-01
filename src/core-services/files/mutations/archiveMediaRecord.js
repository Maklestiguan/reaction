import ReactionError from "@reactioncommerce/reaction-error";

/**
 * @summary Archive a MediaRecord
 * @param {Object} context App context
 * @param {Object} input Input data
 * @returns {Object} Archived MediaRecord
 */
export default async function archiveMediaRecord(context, input) {
  const {
    appEvents,
    validatePermissions,
    validatePermissionsLegacy,
    collections: { MediaRecords },
    userId
  } = context;
  const { mediaRecordId, shopId } = input;

  await validatePermissionsLegacy(["media/update"], shopId);
  await validatePermissions("reaction:media", "update", { shopId });

  const { value: updatedMediaRecord } = await MediaRecords.findOneAndUpdate(
    {
      "_id": mediaRecordId,
      "metadata.shopId": shopId
    },
    {
      $set: {
        "metadata.workflow": "archived"
      }
    },
    {
      returnOriginal: false
    }
  );

  if (!updatedMediaRecord) {
    throw new ReactionError("server-error", "Unable to archive media record");
  }

  appEvents.emit("afterMediaUpdate", { updatedBy: userId, mediaRecord: updatedMediaRecord });

  return updatedMediaRecord;
}
