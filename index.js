const {
  sendMessage,
  sanitiseMessage,
  escapeMarkdown,
} = require("./src/telegram/telegram");
const { processMessage } = require("./bot");

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
async function handleRequest(req, res) {
  const message = req.body.message;
  console.log("Received message:", JSON.stringify(message, null, 2));

  if (!(message && message.text)) {
    res.sendStatus(400);
    return;
  }

  const sanitisedMessage = sanitiseMessage(message.text);

  try {
    const data = await processMessage(sanitisedMessage);
    await sendMessage({
      response: escapeMarkdown(data),
      chatId: message.chat.id,
    });
    res.send({ status: "OK" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}

module.exports = {
  handleRequest,
};
