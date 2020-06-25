const { getTimeSlots } = require("./src/crawler/crawler");
const { formatTimeSlots, filterTimeSlots } = require("./src/json/json");
const {
  sendMessage,
  formatMessage,
  sanitiseMessage,
} = require("./src/telegram/telegram");
const { getDates } = require("./src/day-filter/day-filter");

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendTimeSlots = async (req, res) => {
  const timeSlotsRaw = await getTimeSlots();
  const message = req.body.message;

  console.log("Received message", JSON.stringify(message, null, 2));
  const sanitisedMessage = sanitiseMessage(message.text);
  console.log(`Sanitised message: ${sanitisedMessage}`);

  const dates = getDates(sanitisedMessage);
  console.log(`Interpreted date: ${dates}`);
  const filteredTimeSlots = filterTimeSlots(dates, timeSlotsRaw);
  const timeSlots = formatTimeSlots(filteredTimeSlots);

  sendMessage(
    {
      response: formatMessage(timeSlots),
      chatId: message.chat.id,
    },
    res
  );
};
