const pino = require("pino");

const GCP_SEVERITY = {
  trace: "DEBUG",
  debug: "DEBUG",
  info: "INFO",
  warn: "WARNING",
  error: "ERROR",
  fatal: "CRITICAL",
};

const _logger = pino({
  level: process.env.ENV === "TEST" ? "silent" : "info",
  messageKey: "message",
  formatters: {
    level(label) {
      return { severity: GCP_SEVERITY[label] ?? label.toUpperCase() };
    },
    bindings() {
      return {};
    },
  },
  serializers: {
    error: pino.stdSerializers.err,
  },
});

const logger = {
  debug: (message, meta = {}) => _logger.debug(meta, message),
  info: (message, meta = {}) => _logger.info(meta, message),
  warn: (message, meta = {}) => _logger.warn(meta, message),
  error: (message, meta = {}) => _logger.error(meta, message),
};

module.exports = logger;
