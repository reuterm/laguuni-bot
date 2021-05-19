jest.mock("./src/client/client");
const addDays = require("date-fns/addDays");
const client = require("./src/client/client");
const { formatDate } = require("./src/day-filter/day-filter");
const { formatToHumanDate } = require("./src/telegram/telegram");
const { processMessage, HELP_MESSAGE } = require("./bot");

const today = new Date();

const getJson = (dates) =>
  dates.reduce((acc, date) => {
    return {
      ...acc,
      [formatDate(date)]: [
        { starttimes: ["10:00", "11:00", "12:00"] },
        { starttimes: ["10:00", "11:00", "12:00"] },
        { starttimes: ["10:00", "11:00"] },
        { starttimes: ["10:00"] },
      ],
    };
  }, {});

describe("bot", () => {
  let response;
  beforeEach(async () => {
    jest.spyOn(client, "getTimeSlots").mockImplementation((dates) => {
      return getJson(dates);
    });
  });

  describe("when message only contains single day", () => {
    beforeEach(async () => {
      response = await processMessage("today");
    });

    it("returns correct data", () => {
      expect(response).toEqual(`${formatToHumanDate(today)}
10:00: 0/4
11:00: 1/4
12:00: 2/4`);
    });
  });

  describe("when message contains multiple days", () => {
    beforeEach(async () => {
      response = await processMessage("today and tomorrow");
    });

    it("returns correct data", () => {
      expect(response).toEqual(`${formatToHumanDate(today)}
10:00: 0/4
11:00: 1/4
12:00: 2/4

${formatToHumanDate(addDays(today, 1))}
10:00: 0/4
11:00: 1/4
12:00: 2/4`);
    });
  });

  describe("when message is empty", () => {
    beforeEach(async () => {
      response = await processMessage();
    });

    it("returns an empty message", () => {
      expect(response).toEqual("");
    });
  });

  describe("when asking for help", () => {
    beforeEach(async () => {
      response = await processMessage("help");
    });

    it("returns the help message", () => {
      expect(response).toEqual(HELP_MESSAGE);
    });
  });
});

// describe("processTimeSlots()", () => {
//   describe("when not including everything", () => {
//     describe("when message only contains one day", () => {
//       it("returns correct data", () => {
//         expect(processTimeSlots("today", getJson(), false)).toStrictEqual({
//           [formatDate(today)]: {
//             "10:00:00": "[0/4]",
//             "11:00:00": "[1/4]",
//             "12:00:00": "[2/4]",
//           },
//         });
//       });
//     });

//     describe("when message only contains multiple days", () => {
//       it("returns correct data", () => {
//         expect(
//           processTimeSlots("today and tomorrow", getJson(), false)
//         ).toStrictEqual({
//           [formatDate(today)]: {
//             "10:00:00": "[0/4]",
//             "11:00:00": "[1/4]",
//             "12:00:00": "[2/4]",
//           },
//           [formatDate(addDays(today, 1))]: {
//             "10:00:00": "[0/4]",
//             "11:00:00": "[1/4]",
//             "12:00:00": "[3/4]",
//           },
//         });
//       });
//     });
//   });

//   describe("when including everything", () => {
//     it("does not filter anything", () => {
//       expect(processTimeSlots(null, getJson(), true)).toStrictEqual({
//         [formatDate(today)]: {
//           "10:00:00": "[0/4]",
//           "11:00:00": "[1/4]",
//           "12:00:00": "[2/4]",
//         },
//         [formatDate(addDays(today, 1))]: {
//           "10:00:00": "[0/4]",
//           "11:00:00": "[1/4]",
//           "12:00:00": "[3/4]",
//         },
//         [formatDate(addDays(today, 2))]: {
//           "14:00:00": "[0/4]",
//           "17:00:00": "[3/4]",
//           "20:00:00": "[2/4]",
//         },
//       });
//     });
//   });
// });
