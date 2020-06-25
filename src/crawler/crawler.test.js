jest.mock("jsdom");
jest.mock("node-fetch");
const jsdom = require("jsdom");
const fetch = require("node-fetch");
const { Response } = jest.requireActual("node-fetch");
const crawler = require("./crawler");

describe("getPhpSession()", () => {
  let response;

  describe("when session cookie is in header", () => {
    beforeEach(() => {
      response = new Response("", {
        headers: new Headers({ "set-cookie": "PHPSESSID=foobar;foo=bar" }),
      });
    });

    it("returns sessions cookie", () => {
      expect(crawler.getPhpSession(response)).toBe("PHPSESSID=foobar");
    });
  });

  describe("when session cookies is not in header", () => {
    beforeEach(() => {
      response = new Response("", {
        headers: new Headers({ "set-cookie": "foo=bar" }),
      });
    });

    it("returns undefined", () => {
      expect(crawler.getPhpSession(response)).toBe(undefined);
    });
  });
});

describe("getCsrfToken()", () => {
  describe("always", () => {
    beforeEach(() => {
      jsdom.JSDOM.mockReturnValue({ window: { document: { scripts: [] } } });
    });

    it("converts response into dom object", async () => {
      await crawler.getCsrfToken(new Response("response-html"));
      expect(jsdom.JSDOM).toHaveBeenCalledWith("response-html");
    });
  });

  describe("when reponse contains no scripts", () => {
    beforeEach(() => {
      jsdom.JSDOM.mockReturnValue({ window: { document: { scripts: [] } } });
    });

    it("returns undefined", async () => {
      const token = await crawler.getCsrfToken(new Response());
      expect(token).toBe(undefined);
    });
  });

  describe("when response contains scripts", () => {
    describe("when scripts contain a CSRF token", () => {
      beforeEach(() => {
        jsdom.JSDOM.mockReturnValue({
          window: {
            document: {
              scripts: [{ textContent: '{"csrf_token": "my_token"}' }],
            },
          },
        });
      });

      it("returns token", async () => {
        const token = await crawler.getCsrfToken(new Response());
        expect(token).toBe("my_token");
      });
    });

    describe("when scripts contain no CSRF token", () => {
      beforeEach(() => {
        jsdom.JSDOM.mockReturnValue({
          window: {
            document: {
              scripts: [{ textContent: '"csrf_token"' }],
            },
          },
        });
      });

      it("returns undefined", async () => {
        const token = await crawler.getCsrfToken(new Response());
        expect(token).toBe(undefined);
      });
    });
  });
});

describe("getFormId()", () => {
  describe("always", () => {
    beforeEach(() => {
      fetch.mockReturnValue(Promise.resolve(new Response()));
    });

    it("calls endpoint with passed cookie", async () => {
      await crawler.getFormId("cookie");
      expect(fetch).toHaveBeenCalledWith(expect.any(String), {
        headers: {
          cookie: "cookie",
        },
      });
    });
  });

  describe("when response text contains a form ID", () => {
    beforeEach(() => {
      fetch.mockReturnValue(
        Promise.resolve(new Response('"form_id":"some_id"'))
      );
    });

    it("returns form ID", async () => {
      const formId = await crawler.getFormId();
      expect(formId).toBe("some_id");
    });
  });

  describe("when response text contains no form ID", () => {
    beforeEach(() => {
      fetch.mockReturnValue(Promise.resolve(new Response('"foo":"bar"')));
    });

    it("returns undefined", async () => {
      const formId = await crawler.getFormId();
      expect(formId).toBe(undefined);
    });
  });
});
