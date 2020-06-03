const { getTimeSlots, formatTimeSlots } = require('./src/crawler/crawler');
const { sendMessage, formatMessage } = require('./src/telegram/telegram');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendTimeSlots = async (req, res) => {
  const timeSlotsRaw = await getTimeSlots();
  const timeSlots = formatTimeSlots(timeSlotsRaw);
  const message = req.body.message;

  sendMessage({
    response: formatMessage(timeSlots),
    chatId: message.chat.id
  }, res);
};
