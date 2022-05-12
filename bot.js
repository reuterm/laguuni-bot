const { getTimeSlots, CABLES } = require("./src/client/client");
const { formatTimeSlots } = require("./src/json/json");
const { formatMessage } = require("./src/telegram/telegram");
const { getDates } = require("./src/day-filter/day-filter");
const { getLogger } = require("./src/logging/client");

const HELP_MESSAGE = `Get booking information of Laguunis Pro Cable

Usage:
_*help*_: Show this message
_*<day>*_: Filter information by days. Here,_*<day>*_ can be any weekday or _*today*_ as well as *_tomorrow_*. You can chain mulitple days with _*and*_.`;

const ERR_NO_DATES = "Could not parse dates.";
const ERR_FETCH_DATA = "Failed to fetch slots data, please try again later.";

const CABLES_REGEX = new RegExp(Object.values(CABLES).join("|"), "i");

function stripCableFilter(message) {
  const match = message.match(CABLES_REGEX);
  const strippedMessage = message.replace(CABLES_REGEX, "").trim();

  return {
    cable: match && match.length > 0 ? match[0] : CABLES.PRO,
    strippedMessage,
  };
}

async function respondWithTimeSlots(message) {
  const { cable, strippedMessage } = stripCableFilter(message);
  const dates = getDates(strippedMessage);
  if (dates.length === 0) {
    return ERR_NO_DATES;
  }

  try {
    timeSlotsRaw = await getTimeSlots(dates, cable);
    const timeSlots = formatTimeSlots(timeSlotsRaw);

    return formatMessage(timeSlots, cable);
  } catch (err) {
    getLogger.error({ err }, "failed to fetch data");

    return ERR_FETCH_DATA;
  }
}

function processMessage(message) {
  if (!message) {
    return "";
  }

  if (message.toUpperCase() === "HELP") {
    return HELP_MESSAGE;
  }

  return respondWithTimeSlots(message);
}

module.exports = {
  stripCableFilter,
  processMessage,
  HELP_MESSAGE,
  ERR_NO_DATES,
  ERR_FETCH_DATA,
};

// processMessage("tomorrow").then((msg) => console.log("response", msg));
