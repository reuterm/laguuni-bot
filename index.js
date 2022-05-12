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
  if (!(message && message.text)) {
    console.log("Received invalid request:", JSON.stringify(req.body, null, 2));
    res.send({ status: "OK" }); // Stop Telegram backend from sending more requests
    return;
  }

  if (message.reply_to_message) {
    res.send({ status: "OK" }); // Don't respond to replies
    return;
  }

  console.log("Received message:", JSON.stringify(message, null, 2));
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
