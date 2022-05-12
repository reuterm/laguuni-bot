const bunyan = require("bunyan");
const { LoggingBunyan } = require("@google-cloud/logging-bunyan");

let logger;

function getStreams() {
  let streams = { stream: process.stdout, level: "debug" };
  // default to console stream
  if (process.env.ENV == "PRD") {
    const loggingBunyan = new LoggingBunyan();
    streams = [...streams, loggingBunyan.stream("debug")];
  }

  return streams;
}

function getLogger() {
  if (!logger) {
    logger = bunyan.createLogger({
      name: "laguuni-bot",
      streams: getStreams(),
    });
  }

  return logger;
}

module.exports = {
  getLogger,
};
