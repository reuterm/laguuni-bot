import { processMessage } from "./bot.js";
import logger from "./src/logging/client.js";
import {
  escapeMarkdown,
  sanitiseMessage,
  sendMessage,
} from "./src/telegram/telegram.js";

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
async function handleRequest(req, res) {
  const message = req.body.message;
  if (!message?.text) {
    logger.error("Received invalid request", { req: req.body });
    res.send({ status: "OK" }); // Stop Telegram backend from sending more requests
    return;
  }

  if (message.reply_to_message) {
    res.send({ status: "OK" }); // Don't respond to replies
    return;
  }

  logger.debug("Received message", { msg: message });
  const sanitisedMessage = sanitiseMessage(message.text);

  try {
    const data = await processMessage(sanitisedMessage);
    await sendMessage({
      response: escapeMarkdown(data),
      chatId: message.chat.id,
    });
    res.send({ status: "OK" });
  } catch (err) {
    logger.error("Failed to handle message", { error: err });
    res.sendStatus(500);
  }
}

export { handleRequest };
