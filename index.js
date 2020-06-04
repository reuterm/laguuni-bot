const { getTimeSlots } = require('./src/crawler/crawler');
const { formatTimeSlots, filterTimeSlots } = require('./src/json/json');
const { sendMessage, formatMessage } = require('./src/telegram/telegram');
const { getDate } = require('./src/day-filter/day-filter');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendTimeSlots = async (req, res) => {
  const timeSlotsRaw = await getTimeSlots();
  const message = req.body.message;

  const date = getDate(message);
  const filteredTimeSlots = filterTimeSlots(date, timeSlotsRaw);
  const timeSlots = formatTimeSlots(filteredTimeSlots);

  sendMessage({
    response: formatMessage(timeSlots),
    chatId: message.chat.id
  }, res);
};
