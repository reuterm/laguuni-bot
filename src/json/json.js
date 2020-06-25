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

function filterTimeSlots(filter, timeSlots) {
  const key = formatDate(filter);
  return timeSlots[key] ? { [key]: timeSlots[key] } : timeSlots;
}

module.exports = {
  formatTimeSlots,
  filterTimeSlots,
};
