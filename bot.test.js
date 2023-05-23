jest.mock("./src/client/client");
const addDays = require("date-fns/addDays");
const client = require("./src/client/client");
const { formatDate } = require("./src/day-filter/day-filter");
const { formatToHumanDate, OVERVIEW_LINK, BOOKING_PAGE, SLOTS_HEADER } = require("./src/telegram/telegram");
const {
  stripCableFilter,
  processMessage,
  HELP_MESSAGE,
  ERR_NO_DATES,
  ERR_FETCH_DATA,
} = require("./bot");

describe("bot", () => {
  let response;
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

  describe("stripCableFilter()", () => {
    it("correctly detects and removes pro cable", () => {
      expect(stripCableFilter("pro today")).toMatchObject({
        cable: "pro",
        strippedMessage: "today",
      });
    });

    it("correctly detects and removes easy cable", () => {
      expect(stripCableFilter("tomorrow easy")).toMatchObject({
        cable: "easy",
        strippedMessage: "tomorrow",
      });
    });

    it("use pro cable as default if no cable is detected", () => {
      expect(stripCableFilter("tomorrow and today")).toMatchObject({
        cable: client.CABLES.PRO,
        strippedMessage: "tomorrow and today",
      });
    });
  });

  describe("processMessage()", () => {
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
\`\`\`${SLOTS_HEADER}
|    10:00   |       4/4       |
|    11:00   |       3/4       |
|    12:00   |       2/4       |\`\`\`

${OVERVIEW_LINK}

[Book](${BOOKING_PAGE[client.CABLES.PRO]})`);
      });
    });

    describe("when message contains multiple days", () => {
      beforeEach(async () => {
        response = await processMessage("today and tomorrow");
      });

      it("returns correct data", () => {
        expect(response).toEqual(`${formatToHumanDate(today)}
\`\`\`${SLOTS_HEADER}
|    10:00   |       4/4       |
|    11:00   |       3/4       |
|    12:00   |       2/4       |\`\`\`

${formatToHumanDate(addDays(today, 1))}
\`\`\`${SLOTS_HEADER}
|    10:00   |       4/4       |
|    11:00   |       3/4       |
|    12:00   |       2/4       |\`\`\`

${OVERVIEW_LINK}

[Book](${BOOKING_PAGE[client.CABLES.PRO]})`);
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

    describe("when message contains no days", () => {
      beforeEach(async () => {
        response = await processMessage("foo");
      });

      it("returns error message", () => {
        expect(response).toEqual(ERR_NO_DATES);
      });
    });

    describe("when fetching data failed", () => {
      beforeEach(async () => {
        jest.spyOn(client, "getTimeSlots").mockImplementation((dates) => {
          throw Error(err);
        });
        response = await processMessage("today");
      });

      it("returns appropriate error message", () => {
        expect(response).toEqual(ERR_FETCH_DATA);
      });
    });
  });
});
