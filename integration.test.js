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
  let fetchSpy;

  beforeEach(() => {
    res = {
      send: vi.fn(),
      sendStatus: vi.fn(),
    };
    fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe("when received message requires response", () => {
    beforeEach(async () => {
      await handleRequest(buildReq("help"), res);
    });
    it("sends response to the chat", () => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("responds to request", () => {
      expect(res.send).toHaveBeenCalledWith({ status: "OK" });
    });
  });

  describe("when received message does not require response", () => {
    beforeEach(async () => {
      await handleRequest(buildReq(" "), res);
    });
    it("does not send response to the chat", () => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("responds to request", () => {
      expect(res.send).toHaveBeenCalledWith({ status: "OK" });
    });
  });

  describe("when received invalid message", () => {
    beforeEach(async () => {
      await handleRequest(buildReq(undefined), res);
    });
    it("does not send response to the chat", () => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("responds to request", () => {
      expect(res.send).toHaveBeenCalledWith({ status: "OK" });
    });
  });

  describe("when received invalid request", () => {
    beforeEach(async () => {
      await handleRequest({ body: {} }, res);
    });
    it("does not send response to the chat", () => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("responds to request", () => {
      expect(res.send).toHaveBeenCalledWith({ status: "OK" });
    });
  });

  describe("when sending response to the chat fails", () => {
    beforeEach(async () => {
      fetchSpy.mockRejectedValue(new Error("error"));
      await handleRequest(buildReq("help"), res);
    });

    it("responds to request with error", () => {
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });
});
