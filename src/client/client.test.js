jest.mock("node-fetch");
const fetch = require("node-fetch");
const { Response } = jest.requireActual("node-fetch");
const client = require("./client");

describe("client", () => {
  const date = "2021-05-19";

  beforeEach(() => {
    fetch.mockImplementation((url) =>
      Promise.resolve(new Response(`{"url":"${url}"}`))
    );
  });

  afterEach(() => {
    fetch.mockClear();
  });

  describe("fetchDateCountCombination()", () => {
    beforeEach(async () => {
      await client.fetchDateCountCombination(date, 1);
    });

    it("calls correct endpoint", () => {
      expect(fetch).toHaveBeenCalledWith(client.buildUrl(date, 1));
    });
  });

  describe("fetchDateSlots()", () => {
    beforeEach(async () => {
      await Promise.all(client.fetchDateSlots(date));
    });

    it("fetches all combinations", () => {
      expect(fetch).toHaveBeenCalledWith(client.buildUrl(date, 1));
      expect(fetch).toHaveBeenCalledWith(client.buildUrl(date, 2));
      expect(fetch).toHaveBeenCalledWith(client.buildUrl(date, 3));
      expect(fetch).toHaveBeenCalledWith(client.buildUrl(date, 4));
    });
  });

  describe("getTimeSlots()", () => {
    let slots;
    const date1 = "2021-05-19";
    const date2 = "2021-05-20";
    beforeEach(async () => {
      slots = await client.getTimeSlots([new Date(date1), new Date(date2)]);
    });

    it("returns object containg all dates", () => {
      expect(slots).toMatchObject({
        [date1]: [
          { url: client.buildUrl(date1, 1) },
          { url: client.buildUrl(date1, 2) },
          { url: client.buildUrl(date1, 3) },
          { url: client.buildUrl(date1, 4) },
        ],
        [date2]: [
          { url: client.buildUrl(date2, 1) },
          { url: client.buildUrl(date2, 2) },
          { url: client.buildUrl(date2, 3) },
          { url: client.buildUrl(date2, 4) },
        ],
      });
    });
  });
});
