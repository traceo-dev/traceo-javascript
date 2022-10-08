import { format } from "util";
import { httpService } from "../core/http";
import { LogLevel } from "../transport/logger";

const getTimestamp = () => {
  const localeStringOptions = {
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    day: "2-digit",
    month: "2-digit",
  };
  return new Date(Date.now()).toLocaleString(
    undefined,
    localeStringOptions as Intl.DateTimeFormatOptions
  );
};

const printMessage = ({ message }: { message: string }, level: LogLevel) => {
  const timestamp = getTimestamp();
  const messagePayload = `[TraceoLogger][${level.toUpperCase()}] - ${timestamp} - ${message}`;

  if (level === LogLevel.Error) {
    console[level](`\x1B[31m${messagePayload}\x1B[39m`);
  } else {
    console[level](messagePayload);
  }

  httpService.sendLog({
    level,
    message,
    timestamp,
    unix: Math.floor(Date.now() / 1000),
    resources: logResources(),
  });
};

const logResources = () => {
  return {
    nodeVersion: process.env["npm_package_engines_node"],
    packageName: process.env["npm_package_name"],
    packageVersion: process.env["npm_package_version"],
    traceoVersion:
      process.env["npm_package_dependencies_traceo"] ||
      process.env["npm_package_devDependencies_traceo"],
  };
};

const debug = (...args: any[]) =>
  printMessage(getEntryFromArgs(args), LogLevel.Debug);
const log = (...args: any[]) =>
  printMessage(getEntryFromArgs(args), LogLevel.Log);
const info = (...args: any[]) =>
  printMessage(getEntryFromArgs(args), LogLevel.Info);
const warn = (...args: any[]) =>
  printMessage(getEntryFromArgs(args), LogLevel.Warn);
const error = (...args: any[]) =>
  printMessage(getEntryFromArgs(args), LogLevel.Error);

const getEntryFromArgs = (args: any[]): { message: string } =>
  Object.assign(
    {},
    {
      message: format.apply(null, args),
    }
  );

export const logger = {
  debug,
  log,
  info,
  warn,
  error,
};
