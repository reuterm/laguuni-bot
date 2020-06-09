jest.mock('node-fetch');
const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');
const telegram = require('./telegram');

describe('formateDateSlots()', () => {
  let data;

  beforeEach(() => {
    data = { 1: '1', 2: '2', 3: '3'};
  });

  it('returns list of formatted items', () => {
    expect(telegram.formatDateSlots(data)).toStrictEqual([
      '1: 1',
      '2: 2',
      '3: 3',
    ]);
  });

  it('includes all items', () => {
    expect(telegram.formatDateSlots(data).length).toEqual(Object.keys(data).length);
  });
});

describe('formatMessage()', () => {
  let data;

  beforeEach(() => {
    data = {
      '2020-06-03': { 1: '1', 2: '2', 3: '3'},
      '2020-06-04': { 4: '4', 5: '5', 6: '6'},
    };
  });

  it('correctly formats json', () => {
    const formatted =
    `Wednesday, June 3
1: 1
2: 2
3: 3

Thursday, June 4
4: 4
5: 5
6: 6`;
    expect(telegram.formatMessage(data)).toMatch(formatted);
  });
});

describe('sendMessage()', () => {
  let res;

  beforeEach(() => {
    res = {
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  describe('always', () => {
    beforeEach(() => {
      process.env = Object.assign(process.env, { TELEGRAM_TOKEN: 'myToken' });
      fetch.mockReturnValue(Promise.resolve(new Response()));
    });
  
    it('calls correct endpoint', () => {
      telegram.sendMessage({}, res);
      expect(fetch)
      .toHaveBeenCalledWith('https://api.telegram.org/botmyToken/sendMessage', expect.any(Object));
    });
  
    it('calls endpoint with correct parameters', () => {
      const data = { chatId: 'someId', response: 'someResponse' };
      telegram.sendMessage(data, res);
      expect(fetch)
      .toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        body: JSON.stringify({
          chat_id: data.chatId,
          text: data.response,
          parse_mode: 'MarkdownV2',
        }),
        headers: {'Content-Type': 'application/json'},
      });
    });
  });

  describe('when call succeeds', () => {
    beforeEach(() => {
      fetch.mockReturnValue(Promise.resolve(new Response()));
    });

    it('sends OK to caller', async () => {
      await telegram.sendMessage({}, res);
      expect(res.send).toHaveBeenCalledWith({ status: 'OK' });
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      fetch.mockReturnValue(Promise.reject('error'));
    });

    it('sends error to caller', async () => {
      await telegram.sendMessage({}, res);
      expect(res.sendStatus).toHaveBeenCalledWith(500);
    });
  });
});

describe('sanitiseMessage()', () => {
  beforeEach(() => {
    process.env = Object.assign(process.env, { TELEGRAM_BOT_NAME: '@myBot' });
  });

  it('trims whitespace', () => {
    expect(telegram.sanitiseMessage('   some whitespace ')).toEqual('some whitespace');
  });

  it('removes leading forward slash', () => {
    expect(telegram.sanitiseMessage('/some/message/')).toEqual('some/message/');
  });

  it('removes own bot name', () => {
    expect(telegram.sanitiseMessage('@myBot hello')).toEqual('hello');
  });
});