const fetch = require("node-fetch");
const { formatDate } = require("../day-filter/day-filter");

const CABLES = {
  PRO: "pro",
  EASY: "easy",
  HIETSU: "hietsu",
};

const CABLE_MAPPING = {
  [CABLES.PRO]: "6",
  [CABLES.EASY]: "7",
  [CABLES.HIETSU]: "157",
};

function buildUrl(date, count, cableStr) {
  const cable = CABLE_MAPPING[cableStr] || CABLE_MAPPING[CABLES.PRO];
  return `https://johku.com/laguuni/fi_FI/products/${cable}/availabletimes/${date}.json?count=${count}`;
}

function fetchDateCountCombination(date, count, cable) {
  return fetch(buildUrl(date, count, cable));
}

function fetchDateSlots(date, cable) {
  return [1, 2, 3, 4].map(async (count) => {
    const data = await fetchDateCountCombination(date, count, cable);
    return data.json();
  });
}

async function getTimeSlots(dates, cable = CABLES.PRO) {
  const dateStrings = dates.map((date) => formatDate(date));
  const timeSlots = await Promise.all(
    dateStrings.map((date) => Promise.all(fetchDateSlots(date, cable)))
  );

  return timeSlots.reduce((acc, data, i) => {
    acc[dateStrings[i]] = data;
    return acc;
  }, {});
}

module.exports = {
  getTimeSlots,
  fetchDateSlots,
  fetchDateCountCombination,
  buildUrl,
  CABLES,
};
