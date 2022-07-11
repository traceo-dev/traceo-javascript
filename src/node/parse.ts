import { Trace } from "../transport/trace";
import { promises, existsSync } from "fs";
import { TraceoError } from "../transport/base";
import { TraceoEvent } from "../transport/events";
import { TraceoIncomingMessage } from "../transport/http";
import { getOsPlatform, mapRequestData } from "./helpers";

const FULL_MATCH =
  /at (?:async )?(?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/;

export const parseStackTraces = async (stack: string): Promise<Trace[]> => {
  const frames: Trace[] = [];

  if (!stack.length) {
    return [];
  }

  for (const line of stack.split("\n").slice(1)) {
    const frame = await createTrace(line);
    if (frame) {
      frames.push(frame);
    }
  }

  return (
    frames.slice(0, 25).map((frame) => ({
      ...frame,
    })) || []
  );
};

export const createTrace = async (line: string): Promise<Trace | undefined> => {
  const lineMatch = line.match(FULL_MATCH);
  if (!lineMatch || lineMatch[0].includes("<anonymous>")) {
    return undefined;
  }

  let functionName: string | undefined;
  let typeName: string | undefined;
  let methodName: string | undefined;
  let splitedPath: string[] | undefined;

  if (lineMatch[1]) {
    functionName = lineMatch[1];
  }

  if (functionName === undefined) {
    functionName = typeName ? `${typeName}.${methodName}` : "<anonymous>";
  }

  const path = lineMatch[2]?.startsWith("file://")
    ? lineMatch[2].substr(7)
    : lineMatch[2];
  const internal =
    path !== undefined &&
    !path.includes("node_modules/") &&
    !path.includes("node_modules\\") &&
    !path.includes("internal/");

  const isNodeProcess = path?.includes("internal") || path?.includes("process");
  isNodeProcess
    ? (splitedPath = path?.split("/"))
    : (splitedPath = path?.split("\\"));

  const fileName = splitedPath[splitedPath?.length - 1];

  const splitedFilename = fileName.split(".");
  const extension = splitedFilename[splitedFilename.length - 1];
  const lineNo = parseInt(lineMatch[3], 10);

  const { code, preCode, postCode } = await getCodeFromFs(path, lineNo);

  return {
    filename: fileName,
    function: functionName,
    absPath: path,
    lineNo,
    columnNo: parseInt(lineMatch[4], 10) || undefined,
    internal,
    extension,
    code,
    postCode,
    preCode,
  };
};

const getCodeFromFs = async (
  path: string,
  codeLine: number
): Promise<{ code: string; preCode: string[]; postCode: string[] }> => {
  let code: string = "";
  let preCode: string[] = [];
  let postCode: string[] = [];
  let linesOfCode: string[] = [];

  const context = await readFileAsync(path);

  if (context) {
    linesOfCode = context?.split("\n");

    code = linesOfCode[codeLine - 1];
    preCode = linesOfCode.slice(codeLine - 6, codeLine - 1);
    postCode = linesOfCode.slice(codeLine + 1, codeLine + 6);
  }

  return {
    code,
    preCode,
    postCode,
  };
};

const readFileAsync = async (path: string): Promise<string> => {
  let context = "";

  //check if file with this path exist
  const isFileExists = existsSync(path);
  if (isFileExists) {
    context = await promises.readFile(path, "utf8");
  }

  return context;
};

export const prepareException = async (
  error: TraceoError,
  req?: TraceoIncomingMessage
): Promise<TraceoEvent> => {
  const { message, name } = error;

  const platform = getOsPlatform();

  const traces = await parseStackTraces(String(error?.stack));
  const event: TraceoEvent = {
    type: name,
    message,
    traces,
    stack: String(error.stack),
    platform,
  };

  if (req !== undefined) {
    event.requestData = mapRequestData(req);
  }

  return event;
};
