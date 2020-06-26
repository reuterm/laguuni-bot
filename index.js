const { getTimeSlots } = require("./src/crawler/crawler");
const { formatTimeSlots, filterTimeSlots } = require("./src/json/json");
const {
  sendMessage,
  formatMessage,
  sanitiseMessage,
} = require("./src/telegram/telegram");
const { getDates } = require("./src/day-filter/day-filter");

function processMessage(message, timeSlots) {
  const sanitisedMessage = sanitiseMessage(message);
  console.log("Sanitised message", sanitisedMessage);

  const dates = getDates(sanitisedMessage);
  console.log("Interpreted dates", dates);

  const filteredTimeSlots = filterTimeSlots(dates, timeSlots);
  return formatTimeSlots(filteredTimeSlots);
}

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
async function sendTimeSlots(req, res) {
  const timeSlotsRaw = await getTimeSlots();
  const message = req.body.message;
  console.log("Received message", JSON.stringify(message, null, 2));

  const timeSlots = processMessage(message.text, timeSlotsRaw);

  sendMessage(
    {
      response: formatMessage(timeSlots),
      chatId: message.chat.id,
    },
    res
  );
}

module.exports = {
  processMessage,
  sendTimeSlots,
};
