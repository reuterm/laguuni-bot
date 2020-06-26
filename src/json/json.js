const pickBy = require("lodash/pickBy");
const { formatDate } = require("../day-filter/day-filter");

function formatTimeSlots(timeSlots) {
  const dates = Object.keys(timeSlots);
  return dates.reduce((acc, date) => {
    const dateAcc = timeSlots[date].slots.reduce((slotAcc, slot) => {
      if (Boolean(slot.additional_text)) {
        return {
          ...slotAcc,
          [slot.time_text]: slot.additional_text,
        };
      }

      return slotAcc;
    }, {});

    return {
      ...acc,
      [date]: dateAcc,
    };
  }, {});
}

function filterTimeSlots(filters, timeSlots) {
  const keys = filters.map((filter) => formatDate(filter));
  return pickBy(timeSlots, (_, key) => keys.includes(key));
}

module.exports = {
  formatTimeSlots,
  filterTimeSlots,
};
