import { Trace } from "../types/stacktrace";

const LINE_REGEXP = /\s*at\s*(?:(.+?)\s*\()?(?:(.+):(\d+):(\d+))?\)?/;
const EXTENSION_REGEXP = /\.(\w+)$/;
const CLASS_METHOD_REGEXP = /(.+)\.([^.]+)$/;

const EXCLUDED = ["<anonymous>"];

export class StacktraceParser {
  constructor() { }

  public static parse(stackTrace: string): Trace[] {
    const lines = stackTrace.split("\n");
    const traces: Trace[] = [];

    for (const line of lines) {
      const stackTraceLine = this.parseStackTraceLine(line);
      if (stackTraceLine && stackTraceLine?.filename) {
        traces.push(stackTraceLine);
      }
    }

    return traces;
  }

  private static parseStackTraceLine = (line: string): Trace | null => {
    const match = line.match(LINE_REGEXP);
    if (!match || EXCLUDED.includes(match[1])) {
      return null;
    }

    const [, method, file, lineStr, columnStr] = match;
    const lineNo = this.parseOptionalInt(lineStr);
    const columnNo = this.parseOptionalInt(columnStr);
    const ext = this.getFileExtension(file);
    const methodName = this.getFullMethodName(method);

    return {
      filename: file,
      lineNo,
      columnNo,
      function: methodName,
      extension: ext
    };
  };

  private static parseOptionalInt = (str?: string): number | null => {
    return str ? parseInt(str, 10) : null;
  };

  private static getFileExtension = (file?: string): string | null => {
    if (!file) {
      return null;
    }

    const match = file.match(EXTENSION_REGEXP);
    return match ? match[1] : null;
  };

  private static getFullMethodName = (method?: string): string | null => {
    if (!method) {
      return null;
    }

    const match = method.match(CLASS_METHOD_REGEXP);
    return match ? `${match[1]}.${match[2]}` : method;
  };

}
