import * as os from "node:os";
import { toDecimalNumber } from "../helpers";

const usage = () => {
  const freeMemory = Math.round(os.freemem() / 1024 / 1024);
  const totalMemory = Math.round(os.totalmem() / 1024 / 1024);

  const usedMemory = Math.round(totalMemory - freeMemory);
  const percentageUsed = toDecimalNumber((usedMemory / totalMemory) * 100);

  return {
    mb: usedMemory,
    percentage: percentageUsed,
  };
};

export const memory = {
  usage,
};
