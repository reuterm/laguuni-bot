const { sendMessage, sanitiseMessage } = require("./src/telegram/telegram");
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

  const sanitisedMessage = sanitiseMessage(message.text);
  console.log("Sanitised message:", sanitisedMessage);

  try {
    const data = await processMessage(sanitisedMessage);
    await sendMessage({
      response: data,
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
