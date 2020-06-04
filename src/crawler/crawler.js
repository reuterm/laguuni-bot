const fetch = require('node-fetch');
const jsdom = require('jsdom')

const BASE_URL = 'https://laguuniin.fi/';
const PRO_URL = 'https://laguuniin.fi/app/themes/LevelupSkele/templates/bookly_ajax.php?service=pro_kaapeli_keilis&location=1';
const PRO_TIME_SLOTS_URL = (csrfToken, formId) => `https://laguuniin.fi/wp/wp-admin/admin-ajax.php?lang=fi&action=bookly_render_time&csrf_token=${csrfToken}&form_id=${formId}`;

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
  const tokenObject = tokenMatches && tokenMatches.length > 0 ? JSON.parse(tokenMatches[0]) : {};

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
  const idObject = idMatches && idMatches.length > 0 ? JSON.parse(`{${idMatches[0]}}`): {};

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

module.exports = {
  sendInitialRequest,
  getPhpSession,
  getCsrfToken,
  getFormId,
  getTimeSlots,
};