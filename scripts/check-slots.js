import { processMessage } from "../bot.js";

const query = process.argv[2] || "tomorrow";

processMessage(query).then((msg) => console.log(msg));
