const SEVERITY = {
  debug: "DEBUG",
  info: "info",
  warn: "WARNING",
  error: "ERROR",
};

const logger = Object.fromEntries(
  Object.keys(SEVERITY).map((level) => [
    level,
    (message, meta = {}) =>
      console.log(
        JSON.stringify({
          severity: SEVERITY[level],
          message,
          ...meta,
          timestamp: new Date().toISOString(),
        })
      ),
  ])
);

module.exports = logger;
