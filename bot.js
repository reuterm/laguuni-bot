const { getTimeSlots } = require("./src/crawler/crawler");
const { formatTimeSlots, filterTimeSlots } = require("./src/json/json");
const { formatMessage } = require("./src/telegram/telegram");
const { getDates } = require("./src/day-filter/day-filter");

const HELP_MESSAGE = `Get booking information of Laguunis Pro Cable

Usage:
_*all*_: All available information
_*\\<day\\>*_: Filter information by days\\. Here,_*\\<day\\>*_ can be any weekday or _*today*_ as well as *_tomorrow_*\\. You can chain mulitple days with _*and*_\\.`;

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

console.log(JSON.stringify(HELP_MESSAGE));
