export const safeParseJson = (message: string) => {
  try {
    const parsedMessage = JSON.parse(message);
    return parsedMessage;
  } catch (e) {
    console.error("error while parsing message", e);
    return null;
  }
};
