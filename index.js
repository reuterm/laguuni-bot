const axios = require('axios');
const { getTimeSlots, formatTimeSlots } = require('./src/crawler/crawler');

const TELEGRAM_REPLY_URL = (token) => `https://api.telegram.org/bot${token}/sendMessage`;

function sendMessage(data, res) {
  const token = process.env.TELEGRAM_TOKEN;
  const url = TELEGRAM_REPLY_URL(token);
  axios.post(url, {
    chat_id: data.chatId,
    text: data.timeSlots
  })
  .then(() => {
    res.send({ status: 'OK'});
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
}

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
