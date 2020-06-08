const fetch = require('node-fetch');

const TELEGRAM_REPLY_URL = (token) => `https://api.telegram.org/bot${token}/sendMessage`;
const DATE_OPTIONS = { weekday: 'long', month: 'long', day: 'numeric' };

async function sendMessage(data, res) {
  const token = process.env.TELEGRAM_TOKEN;
  const url = TELEGRAM_REPLY_URL(token);
  const payload = {
    chat_id: data.chatId,
    text: data.response,
    parse_mode: 'MarkdownV2',
  };

  console.log('Sending payload', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(url, { 
      method: 'POST', 
      body: JSON.stringify(payload),
		  headers: {'Content-Type': 'application/json'}
    });
    if(!response.ok) {
      const jsonResponse = await response.json();
      console.log('Failed to send payload', JSON.stringify(jsonResponse, null, 2));
    }
    res.send({ status: 'OK'});
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
}

function formatDateSlots(dateSlots) {
  return Object.keys(dateSlots).map((time) => `* ${time}: ${dateSlots[time]}`);
}

function formatMessage(timeSlotJson) {
  const formattedDays = Object.keys(timeSlotJson).map((date) => {
    const formattedDate = new Date(date).toLocaleString('en-GB', DATE_OPTIONS);
    const formattedDateSlots = formatDateSlots(timeSlotJson[date]);
    return `${formattedDate}\n${formattedDateSlots.join('\n')}`;
  });
  return formattedDays.join('\n\n');
}

module.exports = {
  sendMessage,
  formatMessage,
  formatDateSlots,
};