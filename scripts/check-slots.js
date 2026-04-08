const { processMessage } = require("../bot");

const query = process.argv[2] || "tomorrow";

processMessage(query).then((msg) => console.log(msg));
