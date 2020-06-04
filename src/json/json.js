function formatTimeSlots(timeSlots) {
  const dates = Object.keys(timeSlots);
  return dates.reduce((acc, date) => {
    const dateAcc = timeSlots[date].slots.reduce((slotAcc, slot) => {
      if(Boolean(slot.additional_text)) {
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
    }
  }, {});
}

module.exports = {
  formatTimeSlots,
};