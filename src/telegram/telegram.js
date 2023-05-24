const fetch = require("node-fetch");
const { CABLES } = require("../client/client");
const { Table } = require("../table/table");
const logger = require("../logging/client");

const ESCAPE_CHARS = /[<>!\.\|+`-]/g;
const LAGUUNI_FIXER_URL =
  "http://laguuni-fixer-public.s3-website-eu-west-1.amazonaws.com";
const OVERVIEW_LINK = `[Overview](${LAGUUNI_FIXER_URL})`;
const TELEGRAM_REPLY_URL = (token) =>
  `https://api.telegram.org/bot${token}/sendMessage`;
const DATE_OPTIONS = { weekday: "long", month: "long", day: "numeric" };
const BOOKING_PAGE = {
  [CABLES.EASY]:
    "https://shop.laguuniin.fi/fi_FI/wakeboarding/wakeboarding-easy-kaapeli",
  [CABLES.PRO]:
    "https://shop.laguuniin.fi/fi_FI/wakeboarding/wakeboarding-pro-kaapeli",
  [CABLES.HIETSU]:
    "https://shop.laguuniin.fi/fi_FI/wakeboarding-hietsu/wakeboarding-hietsun-kaapeli",
};

async function sendMessage(data) {
  if (!data.response || data.response.length === 0) {
    logger.info("No response, skipping");
    return;
  }

  const token = process.env.TELEGRAM_TOKEN;
  const url = TELEGRAM_REPLY_URL(token);
  const payload = {
    chat_id: data.chatId,
    text: data.response,
    parse_mode: "MarkdownV2",
    disable_web_page_preview: true,
  };

  logger.debug("Sending payload", { payload });

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const jsonResponse = await res.json();
      logger.error("Failed to send payload", { resp: jsonResponse });
    }
  } catch (err) {
    throw err;
  }
}

function getBookingPage(cable) {
  const url = BOOKING_PAGE[cable];
  if (!url) {
    return "";
  }

  return `[Book](${url})`;
}

function formatToHumanDate(date) {
  return new Date(date).toLocaleString("en-US", DATE_OPTIONS);
}

function formatDateSlots(dateSlots) {
  return Object.keys(dateSlots).map(
    (time) => `|    ${time}   |       ${dateSlots[time]}       |`
  );
}

function formatToTable(dateSlots) {
  const table = new Table();
  table.setColumns(["Start", "Available"]);
  Object.keys(dateSlots).forEach((time) => {
    table.addRow([time, dateSlots[time]]);
  });
  return table.toString();
}

function formatDays(timeSlotJson) {
  const formattedDays = Object.keys(timeSlotJson).map((date) => {
    const formattedDate = formatToHumanDate(date);
    const formattedSlots = formatToTable(timeSlotJson[date]);
    return `${formattedDate}\n\`\`\`\n${formattedSlots}\`\`\``;
  });
  return formattedDays.join("\n\n");
}

function formatMessage(timeSlotJson, cable) {
  const formattedDays = formatDays(timeSlotJson);
  const bookingPage = getBookingPage(cable);

  return `${formattedDays}\n\n${OVERVIEW_LINK}\n\n${bookingPage}`;
}

function sanitiseMessage(message) {
  return String(message)
    .trim()
    .replace(/^\//, "")
    .replace(process.env.TELEGRAM_BOT_NAME, "")
    .trim();
}

function escapeMarkdown(message) {
  return message.replace(ESCAPE_CHARS, "\\$&");
}

module.exports = {
  sendMessage,
  getBookingPage,
  formatMessage,
  formatDays,
  formatToHumanDate,
  formatDateSlots,
  sanitiseMessage,
  escapeMarkdown,
  OVERVIEW_LINK,
  BOOKING_PAGE,
};
