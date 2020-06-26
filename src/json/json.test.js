const json = require("./json");

const getJson = () => ({
  "2020-06-04": {
    slots: [
      { time_text: "10:00:00", additional_text: "[0/4]" },
      { time_text: "11:00:00", additional_text: "[1/4]" },
      { time_text: "12:00:00", additional_text: "[2/4]" },
    ],
  },
  "2020-06-05": {
    slots: [
      { time_text: "10:00:00", additional_text: "[0/4]" },
      { time_text: "11:00:00", additional_text: "[1/4]" },
      { time_text: "12:00:00", additional_text: "[3/4]" },
    ],
  },
  "2020-06-06": {
    slots: [
      { time_text: "10:00:00", additional_text: "[1/4]" },
      { time_text: "11:00:00", additional_text: "[0/4]" },
      { time_text: "12:00:00", additional_text: "[2/4]" },
    ],
  },
});

describe("formatTimeSlots()", () => {
  let timeSlots;

  beforeEach(() => {
    timeSlots = getJson();
  });

  it("includes all days", () => {
    const formatted = json.formatTimeSlots(timeSlots);
    expect(Object.keys(formatted).length).toBe(Object.keys(timeSlots).length);
  });

  it("filters out full time slots", () => {
    const day = "2020-06-04";
    const data = {
      [day]: {
        ...timeSlots.firstDay,
        slots: [
          ...timeSlots[day].slots,
          { additional_text: "", time_text: "13:00:00" },
        ],
      },
    };
    const existingSlots = data[day].slots.length;
    const formatted = json.formatTimeSlots(data);
    expect(Object.keys(formatted[day]).length).toBe(existingSlots - 1);
  });

  it("returns correct json", () => {
    const formatted = json.formatTimeSlots(timeSlots);
    expect(formatted).toMatchObject({
      "2020-06-04": {
        "10:00:00": "[0/4]",
        "11:00:00": "[1/4]",
        "12:00:00": "[2/4]",
      },
      "2020-06-05": {
        "10:00:00": "[0/4]",
        "11:00:00": "[1/4]",
        "12:00:00": "[3/4]",
      },
    });
  });
});

describe("filterTimeSlots()", () => {
  let timeSlots;

  beforeEach(() => {
    timeSlots = getJson();
  });

  describe("when filter can be applied", () => {
    it("correctly filters slots", () => {
      const filter = [
        new Date(Date.UTC(2020, 5, 4)),
        new Date(Date.UTC(2020, 5, 6)),
      ];
      const filteredJson = json.filterTimeSlots(filter, timeSlots);
      expect(Object.keys(filteredJson)).toStrictEqual([
        "2020-06-04",
        "2020-06-06",
      ]);
    });
  });

  describe("when filters contain duplicates", () => {
    it("correctly filter slots", () => {
      const filter = [
        new Date(Date.UTC(2020, 5, 4)),
        new Date(Date.UTC(2020, 5, 6)),
        new Date(Date.UTC(2020, 5, 4)),
      ];
      const filteredJson = json.filterTimeSlots(filter, timeSlots);
      expect(Object.keys(filteredJson)).toStrictEqual([
        "2020-06-04",
        "2020-06-06",
      ]);
    });
  });

  describe("when filters an only be partially applied", () => {
    it("correctly filter slots", () => {
      const filter = [null, new Date(Date.UTC(2020, 5, 6))];
      const filteredJson = json.filterTimeSlots(filter, timeSlots);
      expect(Object.keys(filteredJson)).toStrictEqual(["2020-06-06"]);
    });
  });

  describe("when filter can not be applied", () => {
    it("returns empty boject", () => {
      expect(json.filterTimeSlots(["foobar"], timeSlots)).toStrictEqual({});
    });
  });
});
