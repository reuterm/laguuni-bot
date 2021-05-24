const { getTimeSlots } = require("./src/client/client");
const { formatTimeSlots } = require("./src/json/json");
const { formatMessage } = require("./src/telegram/telegram");
const { getDates } = require("./src/day-filter/day-filter");

const HELP_MESSAGE = `Get booking information of Laguunis Pro Cable

Usage:
_*help*_: Show this message
_*<day>*_: Filter information by days. Here,_*<day>*_ can be any weekday or _*today*_ as well as *_tomorrow_*. You can chain mulitple days with _*and*_.`;

const ERR_NO_DATES = "Could not parse dates.";
const ERR_FETCH_DATA = "Failed to fetch slots data, please try again later.";

async function respondWithTimeSlots(message) {
  const dates = getDates(message);
  if (dates.length === 0) {
    return ERR_NO_DATES;
  }

  try {
    timeSlotsRaw = await getTimeSlots(dates);
    const timeSlots = formatTimeSlots(timeSlotsRaw);

    return formatMessage(timeSlots);
  } catch (err) {
    console.log("failed to fetch data", err);

    return ERR_FETCH_DATA;
  }
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
  ERR_NO_DATES,
  ERR_FETCH_DATA,
};

processMessage("tomorrow").then((msg) => console.log("response", msg));
