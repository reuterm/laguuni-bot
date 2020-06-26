const { getTimeSlots } = require("./src/crawler/crawler");
const { formatTimeSlots, filterTimeSlots } = require("./src/json/json");
const { formatMessage } = require("./src/telegram/telegram");
const { getDates } = require("./src/day-filter/day-filter");

const HELP_MESSAGE = `
  Get booking information of Laguuni's Pro Cable

  Send 'all' to get all alvailable information. Alternatively, you can filter by day.
  For example, send 'today' or 'tomorrow and tuesday' to only receive information for
  the specified days.
`;

function processTimeSlots(message, timeSlots, includeAll) {
  if (includeAll) {
    return formatTimeSlots(timeSlots);
  }

  const dates = getDates(message);
  console.log("Interpreted dates:", dates);

  const filteredTimeSlots = filterTimeSlots(dates, timeSlots);
  return formatTimeSlots(filteredTimeSlots);
}

async function respondWithTimeSlots(message, includeAll) {
  const timeSlotsRaw = await getTimeSlots();
  const timeSlots = processTimeSlots(message, timeSlotsRaw, includeAll);
  return formatMessage(timeSlots);
}

function processMessage(message) {
  if (!message) {
    return "";
  }

  if (String(message).toUpperCase() === "HELP") {
    return HELP_MESSAGE;
  }

  if (String(message).toUpperCase() === "ALL") {
    return respondWithTimeSlots(message, true);
  }

  return respondWithTimeSlots(message, false);
}

module.exports = {
  processMessage,
  processTimeSlots,
};
