const { getTimeSlots } = require('./src/crawler/crawler');
const { formatTimeSlots, filterTimeSlots } = require('./src/json/json');
const { sendMessage, formatMessage, sanitiseMessage } = require('./src/telegram/telegram');
const { getDate } = require('./src/day-filter/day-filter');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendTimeSlots = async (req, res) => {
  const timeSlotsRaw = await getTimeSlots();
  console.log('Received message', JSON.stringify(req.body.message, null, 2));
  const message = sanitiseMessage(req.body.message);
  console.log(`Sanitized message: ${message}`);

  const date = getDate(message.text);
  console.log(`Interpreted date: ${date}`);
  const filteredTimeSlots = filterTimeSlots(date, timeSlotsRaw);
  const timeSlots = formatTimeSlots(filteredTimeSlots);

  sendMessage({
    response: formatMessage(timeSlots),
    chatId: message.chat.id
  }, res);
};