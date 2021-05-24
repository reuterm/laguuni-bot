const CAPACITY = 4;

function extractDateCountCombinations(timeSlotsRaw) {
  return Object.keys(timeSlotsRaw).reduce((globalAcc, date) => {
    const dateAcc = timeSlotsRaw[date].reduce(
      (slotsAcc, slots, i) => ({
        ...slotsAcc,
        [i + 1]: slots.starttimes,
      }),
      {}
    );

    return {
      ...globalAcc,
      [date]: dateAcc,
    };
  }, {});
}

function mergeDays(combinations) {
  return Object.keys(combinations).reduce((globalAcc, date) => {
    const dateAcc = Object.keys(combinations[date]).reduce(
      (slotsAcc, count) => {
        const countAcc = combinations[date][count].reduce(
          (timesAcc, time) => ({
            ...timesAcc,
            [time]: `${count}/${CAPACITY}`,
          }),
          {}
        );

        return Object.assign(slotsAcc, countAcc);
      },
      {}
    );

    return {
      ...globalAcc,
      [date]: dateAcc,
    };
  }, {});
}

function removeEmptyDays(timeSlots) {
  return Object.keys(timeSlots).reduce((acc, date) => {
    const slots = timeSlots[date];
    const isEmpty = Object.keys(slots).length === 0;

    if (!isEmpty) {
      acc[date] = slots;
    }

    return acc;
  }, {});
}

function formatTimeSlots(timeSlotsRaw) {
  const combinations = extractDateCountCombinations(timeSlotsRaw);
  const merged = mergeDays(combinations);
  return removeEmptyDays(merged);
}

module.exports = {
  extractDateCountCombinations,
  mergeDays,
  removeEmptyDays,
  formatTimeSlots,
};
