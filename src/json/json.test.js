const json = require("./json");

describe("json", () => {
  const getRawJson = () => ({
    "2021-05-19": [
      { starttimes: ["10:00", "11:00", "12:00"] },
      { starttimes: ["10:00", "11:00", "12:00"] },
      { starttimes: ["10:00", "11:00"] },
      { starttimes: ["10:00"] },
    ],
    "2021-05-20": [
      { starttimes: ["10:00", "11:00", "12:00"] },
      { starttimes: ["10:00", "11:00"] },
      { starttimes: ["10:00", "11:00"] },
      { starttimes: ["10:00"] },
    ],
    "2021-05-21": [
      { starttimes: ["10:00", "11:00", "12:00"] },
      { starttimes: ["10:00", "11:00", "12:00"] },
      { starttimes: ["10:00", "11:00"] },
      { starttimes: ["11:00"] },
    ],
  });

  const getStrippedJson = () => ({
    "2021-05-19": {
      1: ["10:00", "11:00", "12:00"],
      2: ["10:00", "11:00", "12:00"],
      3: ["10:00", "11:00"],
      4: ["10:00"],
    },
    "2021-05-20": {
      1: ["10:00", "11:00", "12:00"],
      2: ["10:00", "11:00"],
      3: ["10:00", "11:00"],
      4: ["10:00"],
    },
    "2021-05-21": {
      1: ["10:00", "11:00", "12:00"],
      2: ["10:00", "11:00", "12:00"],
      3: ["10:00", "11:00"],
      4: ["11:00"],
    },
  });

  const getFormattedJson = () => ({
    "2021-05-19": {
      "10:00": "4/4",
      "11:00": "3/4",
      "12:00": "2/4",
    },
    "2021-05-20": {
      "10:00": "4/4",
      "11:00": "3/4",
      "12:00": "1/4",
    },
    "2021-05-21": {
      "10:00": "3/4",
      "11:00": "4/4",
      "12:00": "2/4",
    },
  });

  describe("extractDateCountCombinations()", () => {
    it("includes all days", () => {
      expect(json.extractDateCountCombinations(getRawJson())).toMatchObject(
        getStrippedJson()
      );
    });

    it("strips unwanted data", () => {
      const slotsData = {
        "2021-05-19": [{ starttimes: ["10:00"], foo: "bar", bar: 1 }],
      };
      expect(json.extractDateCountCombinations(slotsData)).toMatchObject({
        "2021-05-19": {
          1: ["10:00"],
        },
      });
    });
  });

  describe("mergeDays()", () => {
    it("correctly merges data of same days", () => {
      expect(json.mergeDays(getStrippedJson())).toMatchObject(
        getFormattedJson()
      );
    });

    it("handles empty days", () => {
      const empty = {
        "2021-05-19": {
          1: [],
          2: [],
          3: [],
          4: [],
        },
      };
      expect(json.mergeDays(empty)).toMatchObject({
        "2021-05-19": {},
      });
    });
  });

  describe("removeEmptyDays()", () => {
    it("removes days with not available slots", () => {
      expect(
        json.removeEmptyDays({
          "2021-05-19": {},
          "2021-05-20": {
            "10:00": "1/4",
          },
        })
      ).toMatchObject({
        "2021-05-20": {
          "10:00": "1/4",
        },
      });
    });
  });

  describe("formatTimeSlots()", () => {
    it("correctly formats raw slots data", () => {
      const data = { ...getRawJson(), "2021-05-23": [] };
      expect(json.formatTimeSlots(data)).toMatchObject(getFormattedJson());
    });
  });
});
