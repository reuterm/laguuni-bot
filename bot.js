const { getTimeSlots } = require("./src/client/client");
const { formatTimeSlots } = require("./src/json/json");
const { formatMessage } = require("./src/telegram/telegram");
const { getDates } = require("./src/day-filter/day-filter");

const HELP_MESSAGE = `Get booking information of Laguunis Pro Cable

Usage:
_*all*_: All available information
_*\\<day\\>*_: Filter information by days\\. Here,_*\\<day\\>*_ can be any weekday or _*today*_ as well as *_tomorrow_*\\. You can chain mulitple days with _*and*_\\.`;

async function respondWithTimeSlots(message) {
  const dates = getDates(message);
  const timeSlotsRaw = await getTimeSlots(dates);
  const timeSlots = formatTimeSlots(timeSlotsRaw);
  return formatMessage(timeSlots);
}

function processMessage(message) {
  if (!message) {
    return "";
  }

  if (String(message).toUpperCase() === "HELP") {
    return HELP_MESSAGE;
  }

  return respondWithTimeSlots(message);
}

module.exports = {
  processMessage,
  HELP_MESSAGE,
};
