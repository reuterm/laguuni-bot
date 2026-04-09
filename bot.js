import { CABLES, getTimeSlots } from "./src/client/client.js";
import { getDates } from "./src/day-filter/day-filter.js";
import { formatTimeSlots } from "./src/json/json.js";
import logger from "./src/logging/client.js";
import { formatMessage } from "./src/telegram/telegram.js";

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
    const timeSlotsRaw = await getTimeSlots(dates, cable);
    const timeSlots = formatTimeSlots(timeSlotsRaw);

    return formatMessage(timeSlots, cable);
  } catch (err) {
    logger.error("failed to fetch data", { error: err });

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

export {
  ERR_FETCH_DATA,
  ERR_NO_DATES,
  HELP_MESSAGE,
  processMessage,
  stripCableFilter,
};
