import * as os from "node:os";

const averageCpu = (): { idle: number; total: number } => {
  let totalIdle = 0;
  let totalTick = 0;
  const cpus = os.cpus();

  for (let i = 0, len = cpus.length; i < len; i++) {
    const cpu = cpus[i];
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }

    totalIdle += cpu.times.idle;
  }

  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
};

const startMeasure = averageCpu();

const getCpuUsage = () => {
  const endMeasure = averageCpu();

  const idleDifference = endMeasure.idle - startMeasure.idle;
  const totalDifference = endMeasure.total - startMeasure.total;

  const cpuUsage =
    Math.round((100 - (100 * idleDifference) / totalDifference) * 100) / 100;

  return cpuUsage;
};

export const cpu = {
  usage: getCpuUsage,
};
