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

  describe("buildUrl()", () => {
    it("used pro cable as default", () => {
      expect(client.buildUrl(date, 1)).toEqual(
        client.buildUrl(date, 1, client.CABLES.PRO)
      );
    });
  });

  describe("fetchDateCountCombination()", () => {
    beforeEach(async () => {
      await client.fetchDateCountCombination(date, 1, client.CABLES.PRO);
    });

    it("calls correct endpoint", () => {
      expect(fetch).toHaveBeenCalledWith(
        client.buildUrl(date, 1, client.CABLES.PRO)
      );
    });
  });

  describe("fetchDateSlots()", () => {
    beforeEach(async () => {
      await Promise.all(client.fetchDateSlots(date, client.CABLES.EASY));
    });

    it("fetches all combinations", () => {
      expect(fetch).toHaveBeenCalledWith(
        client.buildUrl(date, 1, client.CABLES.EASY)
      );
      expect(fetch).toHaveBeenCalledWith(
        client.buildUrl(date, 2, client.CABLES.EASY)
      );
      expect(fetch).toHaveBeenCalledWith(
        client.buildUrl(date, 3, client.CABLES.EASY)
      );
      expect(fetch).toHaveBeenCalledWith(
        client.buildUrl(date, 4, client.CABLES.EASY)
      );
    });
  });

  describe("getTimeSlots()", () => {
    let slots;
    const date1 = "2021-05-19";
    const date2 = "2021-05-20";
    beforeEach(async () => {
      slots = await client.getTimeSlots(
        [new Date(date1), new Date(date2)],
        client.CABLES.EASY
      );
    });

    it("returns object containg all dates", () => {
      expect(slots).toMatchObject({
        [date1]: [
          { url: client.buildUrl(date1, 1, client.CABLES.EASY) },
          { url: client.buildUrl(date1, 2, client.CABLES.EASY) },
          { url: client.buildUrl(date1, 3, client.CABLES.EASY) },
          { url: client.buildUrl(date1, 4, client.CABLES.EASY) },
        ],
        [date2]: [
          { url: client.buildUrl(date2, 1, client.CABLES.EASY) },
          { url: client.buildUrl(date2, 2, client.CABLES.EASY) },
          { url: client.buildUrl(date2, 3, client.CABLES.EASY) },
          { url: client.buildUrl(date2, 4, client.CABLES.EASY) },
        ],
      });
    });
  });
});
