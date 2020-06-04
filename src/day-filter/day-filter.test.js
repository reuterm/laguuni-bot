const addDays = require('date-fns/addDays')
const isAfter = require('date-fns/isAfter')
const dayFilter = require('./day-filter');


describe('getNextDateOfWeekday()', () => {
  it('returns correct date for value less or equal 7', () => {
    const date = new Date(Date.UTC(2020, 5, 3));
    expect(dayFilter.getNextDateOfWeekday(date, 1))
      .toStrictEqual(new Date(Date.UTC(2020, 5, 8)));
  });

  it('return correct date for value over 7', () => {
    const date = new Date(Date.UTC(2020, 5, 3));
    expect(dayFilter.getNextDateOfWeekday(date, 8))
      .toStrictEqual(new Date(Date.UTC(2020, 5, 8)));
  });
});

describe('getWeekdayNumber()', () => {
  it('returns correct value for Sunday', () => {
    expect(dayFilter.getWeekdayNumber('sunday')).toBe(0);
  });

  it('returns correct value for Monday', () => {
    expect(dayFilter.getWeekdayNumber('monday')).toBe(1);
  });

  it('returns correct value for Tuesday', () => {
    expect(dayFilter.getWeekdayNumber('tuesday')).toBe(2);
  });

  it('returns correct value for Wednesday', () => {
    expect(dayFilter.getWeekdayNumber('wednesday')).toBe(3);
  });

  it('returns correct value for Thursday', () => {
    expect(dayFilter.getWeekdayNumber('thursday')).toBe(4);
  });

  it('returns correct value for Friday', () => {
    expect(dayFilter.getWeekdayNumber('friday')).toBe(5);
  });

  it('returns correct value for Saturday', () => {
    expect(dayFilter.getWeekdayNumber('saturday')).toBe(6);
  });

  it('returns -1 for unkown weekday', () => {
    expect(dayFilter.getWeekdayNumber('foobar')).toBe(-1);
  });
});

describe('getDate()', () => {
  it('retruns correct date for today', () => {
    const today = new Date();
    expect(dayFilter.getDate('today').getDate()).toEqual(today.getDate());
  })

  it('retruns correct date for tomorrow', () => {
    const tomorrow = addDays(new Date(), 1);
    expect(dayFilter.getDate('tomorrow').getDate()).toEqual(tomorrow.getDate());
  });

  it('returns correct date for next Sunday', () => {
    const futureSunday = dayFilter.getDate('sunday');
    expect(futureSunday.getDay()).toBe(0);
    expect(isAfter(futureSunday, new Date())).toBe(true);
  });

  it('returns correct date for next Monday', () => {
    const futureMonday = dayFilter.getDate('monday');
    expect(futureMonday.getDay()).toBe(1);
    expect(isAfter(futureMonday, new Date())).toBe(true);
  });

  it('returns correct date for next Tuesday', () => {
    const futureTuesday = dayFilter.getDate('tuesday');
    expect(futureTuesday.getDay()).toBe(2);
    expect(isAfter(futureTuesday, new Date())).toBe(true);
  });

  it('returns correct date for next Wednesday', () => {
    const futureWednesday = dayFilter.getDate('wednesday');
    expect(futureWednesday.getDay()).toBe(3);
    expect(isAfter(futureWednesday, new Date())).toBe(true);
  });

  it('returns correct date for next Thursday', () => {
    const futureThursday = dayFilter.getDate('thursday');
    expect(futureThursday.getDay()).toBe(4);
    expect(isAfter(futureThursday, new Date())).toBe(true);
  });

  it('returns correct date for next Friday', () => {
    const futureFriday = dayFilter.getDate('friday');
    expect(futureFriday.getDay()).toBe(5);
    expect(isAfter(futureFriday, new Date())).toBe(true);
  });

  it('returns correct date for next Saturday', () => {
    const futureSaturday = dayFilter.getDate('saturday');
    expect(futureSaturday.getDay()).toBe(6);
    expect(isAfter(futureSaturday, new Date())).toBe(true);
  });

  it('returns null for unkown string', () => {
    expect(dayFilter.getDate('foobar')).toBe(null);
  });
});

describe('formatDate()',() => {
  describe('when passed value is a date', () => {
    it('correctly formats date', () => {
      const date = new Date(Date.UTC(2020, 5, 4));
      expect(dayFilter.formatDate(date)).toEqual('2020-06-04');
    });
  });

  describe('when passed value is no date', () => {
    it('returns null', () => {
      expect(dayFilter.formatDate('foo')).toEqual(null);
    });
  })
});