const bunyan = require("bunyan");
const { LoggingBunyan } = require("@google-cloud/logging-bunyan");

let logger;

function getStream() {
  // default to console stream
  if (process.env.ENV == "PRD") {
    const loggingBunyan = new LoggingBunyan();
    return loggingBunyan.stream("debug");
  }

  return { stream: process.stdout, level: "debug" };
}

function getLogger() {
  if (!logger) {
    logger = bunyan.createLogger({
      name: "laguuni-bot",
      streams: [getStream()],
    });
  }

  return logger;
}

module.exports = {
  getLogger,
};
