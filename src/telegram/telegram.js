const fetch = require("node-fetch");

const ESCAPE_CHARS = /[<>!\.]/g;
const LAGUUNI_FIXER_URL =
  "http://laguuni-fixer-public.s3-website-eu-west-1.amazonaws.com";
const OVERVIEW_LINK = `[Overview](${LAGUUNI_FIXER_URL})`;
const TELEGRAM_REPLY_URL = (token) =>
  `https://api.telegram.org/bot${token}/sendMessage`;
const DATE_OPTIONS = { weekday: "long", month: "long", day: "numeric" };

async function sendMessage(data) {
  if (!data.response || data.response.length === 0) {
    console.log("No response, skipping");
    return;
  }

  const token = process.env.TELEGRAM_TOKEN;
  const url = TELEGRAM_REPLY_URL(token);
  const payload = {
    chat_id: data.chatId,
    text: data.response,
    parse_mode: "MarkdownV2",
  };

  console.log("Sending payload:", JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const jsonResponse = await res.json();
      console.log(
        "Failed to send payload:",
        JSON.stringify(jsonResponse, null, 2)
      );
    }
  } catch (err) {
    throw err;
  }
}

function formatToHumanDate(date) {
  return new Date(date).toLocaleString("en-US", DATE_OPTIONS);
}

function formatDateSlots(dateSlots) {
  return Object.keys(dateSlots).map((time) => `${time}: ${dateSlots[time]}`);
}

function formatDays(timeSlotJson) {
  const formattedDays = Object.keys(timeSlotJson).map((date) => {
    const formattedDate = formatToHumanDate(date);
    const formattedDateSlots = formatDateSlots(timeSlotJson[date]);
    return `${formattedDate}\n${formattedDateSlots.join("\n")}`;
  });
  return formattedDays.join("\n\n");
}

function formatMessage(timeSlotJson) {
  const formattedDays = formatDays(timeSlotJson);

  return `${formattedDays}\n\n${OVERVIEW_LINK}`;
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
  formatMessage,
  formatDays,
  formatToHumanDate,
  formatDateSlots,
  sanitiseMessage,
  escapeMarkdown,
  OVERVIEW_LINK,
};
