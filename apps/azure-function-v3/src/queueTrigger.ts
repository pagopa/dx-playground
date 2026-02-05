/* eslint-disable */
export const entryPoint = async (
  context: any,
  myQueueItem: any,
): Promise<void> => {
  context.log("Queue trigger received message:", myQueueItem);

  try {
    const parsed =
      typeof myQueueItem === "string" ? JSON.parse(myQueueItem) : myQueueItem;
    context.log("Parsed message:", parsed);
  } catch (err) {
    context.log("Message is not valid JSON, raw value:", myQueueItem);
  }
};
