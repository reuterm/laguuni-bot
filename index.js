const { getTimeSlots, formatTimeSlots } = require('./src/crawler/crawler');
const { sendMessage } = require('./src/telegram/telegram');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendTimeSlotJson = async (req, res) => {
  const timeSlotsRaw = await getTimeSlots();
  const timeSlots = formatTimeSlots(timeSlotsRaw);
  const message = req.body.message;

  sendMessage({
    timeSlots,
    chatId: message.chat.id
  }, res);
};
