jest.mock("node-fetch");
const fetch = require("node-fetch");
const { Response } = jest.requireActual("node-fetch");
const client = require("./client");

describe("client", () => {
  const date = "2021-05-19";
  const CABLES = client.CABLES;
  const CABLE_MAPPING = client.CABLE_MAPPING;

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
        client.buildUrl(date, 1, CABLE_MAPPING[CABLES.PRO])
      );
    });
  });

  describe("fetchDateCountCombination()", () => {
    beforeEach(async () => {
      await client.fetchDateCountCombination(date, 1, CABLES.EASY);
    });

    it("calls correct endpoint", () => {
      expect(fetch).toHaveBeenCalledWith(client.buildUrl(date, 1, CABLES.EASY));
    });
  });

  describe("fetchDateSlots()", () => {
    beforeEach(async () => {
      await Promise.all(client.fetchDateSlots(date, CABLES.PRO));
    });

    it("fetches all combinations", () => {
      expect(fetch).toHaveBeenCalledWith(
        client.buildUrl(date, 1, CABLE_MAPPING[CABLES.PRO])
      );
      expect(fetch).toHaveBeenCalledWith(
        client.buildUrl(date, 2, CABLE_MAPPING[CABLES.PRO])
      );
      expect(fetch).toHaveBeenCalledWith(
        client.buildUrl(date, 3, CABLE_MAPPING[CABLES.PRO])
      );
      expect(fetch).toHaveBeenCalledWith(
        client.buildUrl(date, 4, CABLE_MAPPING[CABLES.PRO])
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
        CABLES.EASY
      );
    });

    it("returns object containg all dates", () => {
      expect(slots).toMatchObject({
        [date1]: [
          { url: client.buildUrl(date1, 1, CABLE_MAPPING[CABLES.EASY]) },
          { url: client.buildUrl(date1, 2, CABLE_MAPPING[CABLES.EASY]) },
          { url: client.buildUrl(date1, 3, CABLE_MAPPING[CABLES.EASY]) },
          { url: client.buildUrl(date1, 4, CABLE_MAPPING[CABLES.EASY]) },
        ],
        [date2]: [
          { url: client.buildUrl(date2, 1, CABLE_MAPPING[CABLES.EASY]) },
          { url: client.buildUrl(date2, 2, CABLE_MAPPING[CABLES.EASY]) },
          { url: client.buildUrl(date2, 3, CABLE_MAPPING[CABLES.EASY]) },
          { url: client.buildUrl(date2, 4, CABLE_MAPPING[CABLES.EASY]) },
        ],
      });
    });
  });
});
