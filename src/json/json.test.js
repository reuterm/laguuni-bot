const json = require('./json');

describe('formatTimeSlots()', () => {
  let timeSlots;

  beforeEach(() => {
    timeSlots = {
      firstDay: { slots: [{ time_text: '10:00:00', additional_text: '[0/4]' }, { time_text: '11:00:00', additional_text: '[1/4]' }, { time_text: '12:00:00', additional_text: '[2/4]' }] },
      secondDay: { slots: [{ time_text: '10:00:00', additional_text: '[0/4]' }, { time_text: '11:00:00', additional_text: '[1/4]' }, { time_text: '12:00:00', additional_text: '[3/4]' }] },
    };
  });

  it('includes all days', () => {
    const formatted = json.formatTimeSlots(timeSlots);
    expect(Object.keys(formatted).length).toBe(Object.keys(timeSlots).length);
  });

  it('filters out full time slots', () => {
    const data = {
      firstDay: {
        ...timeSlots.firstDay,
        slots: [
          ...timeSlots.firstDay.slots,
          { additional_text: '', time_text: '13:00:00' },
        ],
      }
    };
    const existingSlots = data.firstDay.slots.length;
    const formatted = json.formatTimeSlots(data);
    expect(Object.keys(formatted.firstDay).length).toBe(existingSlots - 1);
  });

  it('returns correct json', () => {
    const formatted = json.formatTimeSlots(timeSlots);
    expect(formatted).toMatchObject({
      firstDay: {
        '10:00:00': '[0/4]',
        '11:00:00': '[1/4]',
        '12:00:00': '[2/4]',
      },
      secondDay: {
        '10:00:00': '[0/4]',
        '11:00:00': '[1/4]',
        '12:00:00': '[3/4]',
      }
    })
  });
});