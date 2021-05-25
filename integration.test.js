jest.mock("node-fetch");
const fetch = require("node-fetch");
const { Response } = jest.requireActual("node-fetch");
const { handleRequest } = require("./index");

const buildReq = (text) => ({
  body: {
    message: {
      text,
      chat: {
        id: "someId",
      },
    },
  },
});

describe("handleRequest()", () => {
  let res;

  beforeEach(() => {
    res = {
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
    fetch.mockReset();
  });

  describe("when received message requires response", () => {
    beforeEach(async () => {
      fetch.mockReturnValue(Promise.resolve(new Response()));
      await handleRequest(buildReq("help"), res);
    });
    it("sends response to the chat", () => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it("responds to request", () => {
      expect(res.send).toHaveBeenCalledWith({ status: "OK" });
    });
  });

  describe("when received message does not require response", () => {
    beforeEach(async () => {
      fetch.mockReturnValue(Promise.resolve(new Response()));
      await handleRequest(buildReq(" "), res);
    });
    it("does not send response to the chat", () => {
      expect(fetch).not.toHaveBeenCalled();
    });

    it("responds to request", () => {
      expect(res.send).toHaveBeenCalledWith({ status: "OK" });
    });
  });

  describe("when received invalid message", () => {
    beforeEach(async () => {
      fetch.mockReturnValue(Promise.resolve(new Response()));
      await handleRequest(buildReq(undefined), res);
    });
    it("does not send response to the chat", () => {
      expect(fetch).not.toHaveBeenCalled();
    });

    it("responds to request", () => {
      expect(res.send).toHaveBeenCalledWith({ status: "OK" });
    });
  });

  describe("when received invalid request", () => {
    beforeEach(async () => {
      fetch.mockReturnValue(Promise.resolve(new Response()));
      await handleRequest({ body: {} }, res);
    });
    it("does not send response to the chat", () => {
      expect(fetch).not.toHaveBeenCalled();
    });

    it("responds to request", () => {
      expect(res.send).toHaveBeenCalledWith({ status: "OK" });
    });
  });

  describe("when sending response to the chat fails", () => {
    beforeEach(async () => {
      fetch.mockReturnValue(Promise.reject(new Error("error")));
      await handleRequest(buildReq("help"), res);
    });

    it("responds to request with error", () => {
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });
});
