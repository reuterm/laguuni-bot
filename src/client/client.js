const fetch = require("node-fetch");
const { formatDate } = require("../day-filter/day-filter");

function buildUrl(date, count) {
  return `https://johku.com/laguuni/fi_FI/products/6/availabletimes/${date}.json?count=${count}`;
}

function fetchDateCountCombination(date, count) {
  return fetch(buildUrl(date, count));
}

function fetchDateSlots(date) {
  return [1, 2, 3, 4].map(async (count) => {
    const data = await fetchDateCountCombination(date, count);
    return data.json();
  });
}

async function getTimeSlots(dates) {
  const dateStrings = dates.map((date) => formatDate(date));
  const timeSlots = await Promise.all(
    dateStrings.map((date) => Promise.all(fetchDateSlots(date)))
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
};
