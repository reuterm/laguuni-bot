const winston = require("winston");
const { LEVEL } = require('triple-beam');

const SeverityLookup = {
  'default': 'DEFAULT',
  'silly': 'DEFAULT',
  'verbose': 'DEBUG',
  'debug': 'DEBUG',
  'http': 'notice',
  'info': 'info',
  'warn': 'WARNING',
  'error': 'ERROR',
}

const stackdriverSeverityFormat = winston.format((info) => ({
  ...info,
  // Add severity to your log
  severity: SeverityLookup[info[LEVEL]] || SeverityLookup['default'],
}));

const formatters = [
  winston.format.timestamp(),
  // Add the format that supplements the JSON with severity
  stackdriverSeverityFormat(),
  winston.format.json(),
];

module.exports = winston.createLogger({
  level: "info",
  format: winston.format.combine(...formatters),
  transports: [
    new winston.transports.Console(),
  ],
})
