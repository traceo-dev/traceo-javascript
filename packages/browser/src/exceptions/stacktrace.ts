import { Trace } from "../types/stacktrace";

const LINE_REGEXP = /\s*at\s*(?:(.+?)\s*\()?(?:(.+):(\d+):(\d+))?\)?/;
const EXTENSION_REGEXP = /\.(\w+)$/;
const CLASS_METHOD_REGEXP = /(.+)\.([^.]+)$/;

const EXCLUDED = ["<anonymous>"];

const parse = (stackTrace: string): Trace[] => {
  const lines = stackTrace.split("\n");
  const traces: Trace[] = [];

  for (const line of lines) {
    const stackTraceLine = parseStackTraceLine(line);
    if (stackTraceLine) {
      traces.push(stackTraceLine);
    }
  }

  return traces;
};

const parseStackTraceLine = (line: string): Trace | null => {
  const match = line.match(LINE_REGEXP);
  if (!match || EXCLUDED.includes(match[1])) {
    return null;
  }

  const [, method, file, lineStr, columnStr] = match;
  const lineNo = parseOptionalInt(lineStr);
  const columnNo = parseOptionalInt(columnStr);
  const ext = getFileExtension(file);
  const methodName = getFullMethodName(method);

  return {
    filename: file,
    lineNo,
    columnNo,
    function: methodName,
    extension: ext
  };
};

const parseOptionalInt = (str?: string): number | null => {
  return str ? parseInt(str, 10) : null;
};

const getFileExtension = (file?: string): string | null => {
  if (!file) {
    return null;
  }

  const match = file.match(EXTENSION_REGEXP);
  return match ? match[1] : null;
};

const getFullMethodName = (method?: string): string | null => {
  if (!method) {
    return null;
  }

  const match = method.match(CLASS_METHOD_REGEXP);
  return match ? `${match[1]}.${match[2]}` : method;
};

export const stacktrace = {
  parse
};
