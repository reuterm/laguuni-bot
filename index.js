const fetch = require('node-fetch');
const jsdom = require('jsdom')
const axios = require('axios');

const BASE_URL = 'https://laguuniin.fi/';
const PRO_URL = 'https://laguuniin.fi/app/themes/LevelupSkele/templates/bookly_ajax.php?service=pro_kaapeli_keilis&location=1';
const PRO_TIME_SLOTS_URL = (csrfToken, formId) => `https://laguuniin.fi/wp/wp-admin/admin-ajax.php?lang=fi&action=bookly_render_time&csrf_token=${csrfToken}&form_id=${formId}`;
const TELEGRAM_REPLY_URL = (token) => `https://api.telegram.org/bot${token}/sendMessage`;

async function sendInitialRequest() {
  const response = await fetch(BASE_URL);
  const sessionCookie = getPhpSession(response);
  const csrfToken = await getCsrfToken(response);

  return { csrfToken, sessionCookie };
}

function getPhpSession(response) {
  const cookiesRaw = response.headers.get('set-cookie');
  const cookies = cookiesRaw.split(';');
  return cookies.find((cookie) => cookie.includes('PHPSESSID'))
}

async function getCsrfToken(response) {
  const html = await response.text();
  const dom = new jsdom.JSDOM(html);

  const scripts = Object.values(dom.window.document.scripts)
    .filter((script) => !script.src)
    .map((script) => script.textContent)
    .filter((script) => script.includes("csrf_token"));

  const tokenMatches = scripts.length > 0 ? scripts[0].match(/{[^}]+}/) : [];
  const tokenObject = tokenMatches.length > 0 ? JSON.parse(tokenMatches[0]) : {};

  return tokenObject.csrf_token;
}

async function getFormId(sessionCookie) {
  const response = await fetch(PRO_URL, {
    'headers': {
      'cookie': sessionCookie,
    },
  })
  const text = await response.text();

  const idMatches = text.match(/"form_id"[^,]+/);
  const idObject = idMatches.length > 0 ? JSON.parse(`{${idMatches[0]}}`): {};

  return idObject.form_id;
}

async function getTimeSlots() {
  const { csrfToken, sessionCookie } = await sendInitialRequest();
  const formId = await getFormId(sessionCookie);

  const response = await fetch(PRO_TIME_SLOTS_URL(csrfToken, formId), {
    'headers': {
      'cookie': sessionCookie,
    },
  });
  const timeJson = await response.json();

  return timeJson.slots_data;
}

function formatTimeSlots(timeSlots) {
  const dates = Object.keys(timeSlots);
  return dates.reduce((acc, date) => {
    const dateAcc = timeSlots[date].slots.reduce((slotAcc, slot) => {
      if(Boolean(slot.additional_text)) {
        return {
          ...slotAcc,
          [slot.time_text]: slot.additional_text,
        };
      }

      return slotAcc;
    }, {});
    
    return {
      ...acc,
      [date]: dateAcc,
    }
  }, {});
}

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