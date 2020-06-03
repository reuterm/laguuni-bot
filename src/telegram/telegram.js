const axios = require('axios');

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

module.exports = {
  sendMessage,
};