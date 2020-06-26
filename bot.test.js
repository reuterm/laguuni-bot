const addDays = require("date-fns/addDays");
const { formatDate } = require("./src/day-filter/day-filter");
const { processTimeSlots } = require("./bot");

const today = new Date();

const getJson = () => ({
  [formatDate(today)]: {
    slots: [
      { time_text: "10:00:00", additional_text: "[0/4]" },
      { time_text: "11:00:00", additional_text: "[1/4]" },
      { time_text: "12:00:00", additional_text: "[2/4]" },
    ],
  },
  [formatDate(addDays(today, 1))]: {
    slots: [
      { time_text: "10:00:00", additional_text: "[0/4]" },
      { time_text: "11:00:00", additional_text: "[1/4]" },
      { time_text: "12:00:00", additional_text: "[3/4]" },
    ],
  },
  [formatDate(addDays(today, 2))]: {
    slots: [
      { time_text: "14:00:00", additional_text: "[0/4]" },
      { time_text: "17:00:00", additional_text: "[3/4]" },
      { time_text: "20:00:00", additional_text: "[2/4]" },
    ],
  },
});

describe("processTimeSlots()", () => {
  describe("when not including everything", () => {
    describe("when message only contains one day", () => {
      it("returns correct data", () => {
        expect(processTimeSlots("today", getJson(), false)).toStrictEqual({
          [formatDate(today)]: {
            "10:00:00": "[0/4]",
            "11:00:00": "[1/4]",
            "12:00:00": "[2/4]",
          },
        });
      });
    });

    describe("when message only contains multiple days", () => {
      it("returns correct data", () => {
        expect(
          processTimeSlots("today and tomorrow", getJson(), false)
        ).toStrictEqual({
          [formatDate(today)]: {
            "10:00:00": "[0/4]",
            "11:00:00": "[1/4]",
            "12:00:00": "[2/4]",
          },
          [formatDate(addDays(today, 1))]: {
            "10:00:00": "[0/4]",
            "11:00:00": "[1/4]",
            "12:00:00": "[3/4]",
          },
        });
      });
    });
  });

  describe("when including everything", () => {
    it("does not filter anything", () => {
      expect(processTimeSlots(null, getJson(), true)).toStrictEqual({
        [formatDate(today)]: {
          "10:00:00": "[0/4]",
          "11:00:00": "[1/4]",
          "12:00:00": "[2/4]",
        },
        [formatDate(addDays(today, 1))]: {
          "10:00:00": "[0/4]",
          "11:00:00": "[1/4]",
          "12:00:00": "[3/4]",
        },
        [formatDate(addDays(today, 2))]: {
          "14:00:00": "[0/4]",
          "17:00:00": "[3/4]",
          "20:00:00": "[2/4]",
        },
      });
    });
  });
});
