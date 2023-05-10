jest.mock("node-fetch");
const fetch = require("node-fetch");
const { Response } = jest.requireActual("node-fetch");
const { CABLES } = require("../client/client");
const telegram = require("./telegram");

describe("telegram", () => {
  const FORMATTED = `Wednesday, June 3
${telegram.SLOTS_HEADER}
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |

Thursday, June 4
${telegram.SLOTS_HEADER}
| 4 | 4 |
| 5 | 5 |
| 6 | 6 |`;

  describe("getBookingPage", () => {
    it("returns formatted link to existing cable", () => {
      expect(telegram.getBookingPage(CABLES.HIETSU)).toEqual(
        "[Book](https://shop.laguuniin.fi/fi_FI/wakeboarding-hietsu/wakeboarding-hietsun-kaapeli)"
      );
    });

    it("returns empty string for non-existent cable", () => {
      expect(telegram.getBookingPage("foo")).toEqual("");
    });
  });

  describe("formateDateSlots()", () => {
    let data;

    beforeEach(() => {
      data = { 1: "1", 2: "2", 3: "3" };
    });

    it("returns list of formatted items", () => {
      expect(telegram.formatDateSlots(data)).toStrictEqual([
        "| 1 | 1 |",
        "| 2 | 2 |",
        "| 3 | 3 |",
      ]);
    });

    it("includes all items", () => {
      expect(telegram.formatDateSlots(data).length).toEqual(
        Object.keys(data).length
      );
    });
  });

  describe("formatDays()", () => {
    describe("when json includes data", () => {
      it("correctly formats json", () => {
        const data = {
          "2020-06-03": { 1: "1", 2: "2", 3: "3" },
          "2020-06-04": { 4: "4", 5: "5", 6: "6" },
        };
        expect(telegram.formatDays(data)).toEqual(FORMATTED);
      });
    });

    describe("when json is empty", () => {
      it("return empty string", () => {
        expect(telegram.formatDays({})).toEqual("");
      });
    });
  });

  describe("sendMessage()", () => {
    describe("response is not empty", () => {
      let data;

      beforeEach(() => {
        data = { chatId: "someId", response: "someResponse" };
        process.env = Object.assign(process.env, { TELEGRAM_TOKEN: "myToken" });
        fetch.mockReturnValue(Promise.resolve(new Response()));
      });

      it("calls correct endpoint", () => {
        telegram.sendMessage(data);
        expect(fetch).toHaveBeenCalledWith(
          "https://api.telegram.org/botmyToken/sendMessage",
          expect.any(Object)
        );
      });

      it("calls endpoint with correct parameters", () => {
        telegram.sendMessage(data);
        expect(fetch).toHaveBeenCalledWith(expect.any(String), {
          method: "POST",
          body: JSON.stringify({
            chat_id: data.chatId,
            text: data.response,
            parse_mode: "MarkdownV2",
            disable_web_page_preview: true,
          }),
          headers: { "Content-Type": "application/json" },
        });
      });

      describe("when call fails", () => {
        beforeEach(() => {
          fetch.mockReturnValue(Promise.reject(new Error("error")));
        });

        it("throws an error", async () => {
          expect(telegram.sendMessage(data)).rejects.toEqual(
            new Error("error")
          );
        });
      });
    });

    describe("when response is empty", () => {
      beforeEach(() => {
        fetch.mockClear();
      });

      it("does nothing", () => {
        telegram.sendMessage({ chatId: "someId" });
        expect(fetch).not.toHaveBeenCalled();
      });
    });
  });

  describe("sanitiseMessage()", () => {
    beforeEach(() => {
      process.env = Object.assign(process.env, { TELEGRAM_BOT_NAME: "@myBot" });
    });

    it("trims whitespace", () => {
      expect(telegram.sanitiseMessage("   some whitespace ")).toEqual(
        "some whitespace"
      );
    });

    it("removes leading forward slash", () => {
      expect(telegram.sanitiseMessage("/some/message/")).toEqual(
        "some/message/"
      );
    });

    it("removes own bot name", () => {
      expect(telegram.sanitiseMessage("@myBot hello")).toEqual("hello");
    });
  });

  describe("escapeMarkdown()", () => {
    it("escapes dots", () => {
      expect(telegram.escapeMarkdown("Hey.")).toEqual("Hey\\.");
    });

    it("escapes smaller signs", () => {
      expect(telegram.escapeMarkdown("Hey <3")).toEqual("Hey \\<3");
    });

    it("escapes greater signs", () => {
      expect(telegram.escapeMarkdown(">:)")).toEqual("\\>:)");
    });

    it("escapes pipes", () => {
      expect(telegram.escapeMarkdown("| foo |")).toEqual("\\| foo \\|");
    });

    it("espaces dashes", () => {
      expect(telegram.escapeMarkdown("- foo -")).toEqual("\\- foo \\-");
    });

    it("espaces multiple characters", () => {
      expect(telegram.escapeMarkdown("<alert>('Hi.')</alert>")).toEqual(
        "\\<alert\\>('Hi\\.')\\</alert\\>"
      );
    });
  });
});
