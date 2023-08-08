import { format } from "util";
import { CAPTURE_ENDPOINT, LogLevel, transport } from "@traceo-sdk/node-core";
import { getGlobalTraceo } from "@traceo-sdk/node-core/dist/utils";

const DEFAULT_EXPORT_INTERVAL = 15000;
export class Logger {
  private logsQueue = [];
  private INTERVAL = DEFAULT_EXPORT_INTERVAL;

  constructor() {
    this.logsQueue = [];

    const client = getGlobalTraceo();

    const scrapLogsInterval = client.options.exportIntervalMillis;
    if (scrapLogsInterval && scrapLogsInterval >= DEFAULT_EXPORT_INTERVAL) {
      this.INTERVAL = scrapLogsInterval;
    }

    this.register();
  }

  private register() {
    setInterval(() => this.sendLogs(), this.INTERVAL);
  }

  public log(...args: any[]): void {
    return this.printMessage(this.getEntryFromArgs(args), LogLevel.Log);
  }

  public error(...args: any[]): void {
    return this.printMessage(this.getEntryFromArgs(args), LogLevel.Error);
  }

  public info(...args: any[]): void {
    return this.printMessage(this.getEntryFromArgs(args), LogLevel.Info);
  }

  public warn(...args: any[]): void {
    return this.printMessage(this.getEntryFromArgs(args), LogLevel.Warn);
  }

  public debug(...args: any[]): void {
    return this.printMessage(this.getEntryFromArgs(args), LogLevel.Debug);
  }

  private printMessage({ message }: { message: string }, level: LogLevel): void {
    const timestamp = this.timestamp;
    const messagePayload = `[${level.toUpperCase()}] - ${timestamp} - ${message}`;

    if (level === LogLevel.Error) {
      console[level](`\x1B[31m${messagePayload}\x1B[39m`);
    } else {
      console[level](messagePayload);
    }

    const requestPayload = {
      level,
      message,
      timestamp,
      unix: this.getUnix,
      resources: this.resources
    };

    this.logsQueue.push(requestPayload);
  }

  private get getUnix(): number {
    const currentDate = new Date();

    const unixTimestamp = Math.floor(currentDate.getTime() / 1000);
    const milliseconds = currentDate.getMilliseconds();
    const unixWithMilliseconds = unixTimestamp * 1000 + milliseconds;

    return unixWithMilliseconds;
  }

  private async sendLogs() {
    if (this.logsQueue.length > 0) {
      transport.request({
        url: CAPTURE_ENDPOINT.LOG,
        body: this.logsQueue,
        onError: (error: Error) => {
          console.error(
            `Traceo Error. Something went wrong while sending new Logs to Traceo. Please report this issue.`
          );
          console.error(`Caused by: ${error.message}`);
        },
        callback: () => {
          this.logsQueue = [];
        }
      });
    }
  }

  private get timestamp(): string {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}`;
  }

  private get resources(): { [key: string]: any } {
    return {
      nodeVersion: process.env["npm_package_engines_node"],
      packageName: process.env["npm_package_name"],
      packageVersion: process.env["npm_package_version"],
      traceoVersion:
        process.env["npm_package_dependencies_@traceo-sdk/node"] ??
        process.env["npm_package_devDependencies_@traceo-sdk/node"]
    };
  }

  private getEntryFromArgs(args: any[]) {
    return Object.assign(
      {},
      {
        message: format.apply(null, args)
      }
    );
  }
}
