// Logger file to handle or print logs from everwhere in the app.

import pino from "pino";
import fs from "fs";
import path from "path";

const logFilePath = path.join(__dirname, "app.log");

const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

const consoleStream = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "yyyy-mm-dd HH:MM:ss.l o",
    ignore: "pid,hostname",
    singleLine: true,
  },
});

const Logger = pino(
  {
    level: "info",
  },
  pino.multistream([{ stream: consoleStream }, { stream: logStream }])
);

export default Logger;
