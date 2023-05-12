import { format } from "util";
import { CAPTURE_ENDPOINT, LogLevel, transport } from "@traceo-sdk/node-core";
import { getGlobalTraceo } from "@traceo-sdk/node-core/dist/utils";

export class Logger {
  private logsQueue = [];
  private INTERVAL = 60;

  constructor() {
    this.logsQueue = [];

    const client = getGlobalTraceo();
        
    const scrapLogsInterval = client.options.scrapLogsInterval;
    if (scrapLogsInterval && scrapLogsInterval >= 15) {
      this.INTERVAL = scrapLogsInterval;
    }

    this.register();
  }

  private register() {
    setInterval(() => this.sendLogs(), this.INTERVAL * 1000);
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
      unix: Math.floor(Date.now() / 1000),
      resources: this.resources
    };

    this.logsQueue.push(requestPayload);
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
    const localeStringOptions = {
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      day: "2-digit",
      month: "2-digit"
    };
    return new Date(Date.now()).toLocaleString(
      undefined,
      localeStringOptions as Intl.DateTimeFormatOptions
    );
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
