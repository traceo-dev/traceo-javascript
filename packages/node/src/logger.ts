import { format } from "util";
import { HttpModule } from "./core/http";
import { LogLevel } from "./types";

export class Logger {
  private readonly http: HttpModule;

  constructor() {
    this.http = new HttpModule("/api/worker/log");
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

  private printMessage(
    { message }: { message: string },
    level: LogLevel
  ): void {
    const timestamp = this.timestamp;
    const messagePayload = `[TraceoLogger][${level.toUpperCase()}] - ${timestamp} - ${message}`;

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
      resources: this.resources,
    };

    this.http.request({
      body: requestPayload,
      onError: (error: Error) => {
        console.error(
          `Traceo Error. Something went wrong while sending new Log to Traceo. Please report this issue.`
        );
        console.error(`Caused by: ${error.message}`);
      },
    });
  }

  private get timestamp(): string {
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
  }

  private get resources(): { [key: string]: any } {
    return {
      nodeVersion: process.env["npm_package_engines_node"],
      packageName: process.env["npm_package_name"],
      packageVersion: process.env["npm_package_version"],
      traceoVersion:
        process.env["npm_package_dependencies_traceo"] ||
        process.env["npm_package_devDependencies_traceo"],
    };
  }

  private getEntryFromArgs(args: any[]) {
    return Object.assign(
      {},
      {
        message: format.apply(null, args),
      }
    );
  }
}
