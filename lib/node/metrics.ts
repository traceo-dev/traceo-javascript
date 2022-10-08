import * as os from "os";
import * as v8 from "v8";
import { httpService } from "../core/http";

const sanitizePackageName = (pkg: string, pkgType: string) => {
  let targetKey = pkg.replace(pkgType, "").replace("__", "@");
  if (targetKey.includes("@")) {
    const [lib, pkg] = targetKey.split("_");
    targetKey = `${lib}/${pkg}`;
  }

  targetKey = targetKey.replace("_", "").replace("_", "-");

  return targetKey;
};

const collectMetricsDataOnRuntime = () => {
  const traceoVersion =
    process.env["npm_package_dependencies_traceo"] ||
    process.env["npm_package_devDependencies_traceo"];

  const packageEngineNode = process.env["npm_package_engines_node"];
  const packageName = process.env["npm_package_name"];
  const packageDescription = process.env["npm_package_description"];
  const packageVersion = process.env["npm_package_version"];

  const dependencies = {};
  const devDependencies = {};
  const scripts = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (key?.startsWith("npm_package_dependencies_")) {
      const targetKey = sanitizePackageName(key, "npm_package_dependencies");
      dependencies[targetKey] = value;
    }

    if (key?.startsWith("npm_package_devDependencies_")) {
      const targetKey = sanitizePackageName(key, "npm_package_devDependencies");
      devDependencies[targetKey] = value;
    }

    if (key?.startsWith("npm_package_scripts_")) {
      const targetKey = key.replace("npm_package_scripts_", "");
      scripts[targetKey] = value;
    }
  }

  const osDataToScrap = [
    "arch",
    "platform",
    "release",
    "version",
    "homedir",
    "tmpdir",
    "type",
    "hostname",
  ];
  const osData = {};
  for (const [key, _] of Object.entries(os)) {
    if (osDataToScrap.includes(key)) {
      osData[key] = os[key]();
    }
  }

  const heap = {};
  for (const [key, value] of Object.entries(v8.getHeapCodeStatistics())) {
    heap[key] = value;
  }

  const heapStats = v8.getHeapStatistics();
  const heapStatistics = {
    heap_size_limit: heapStats.heap_size_limit,
    total_heap_size_executable: heapStats.total_heap_size_executable,
    total_physical_size: heapStats.total_physical_size,
  };

  const nodeVersion = process.versions;

  const data = {
    node: {
      ...heap,
      ...heapStatistics,
      ...nodeVersion,
    },
    os: osData,
    scripts,
    dependencies,
    devDependencies,
    npm: {
      packageEngineNode,
      packageName,
      packageDescription,
      packageVersion,
    },
    traceo: {
      version: traceoVersion,
    },
  };

  httpService.sendRuntimeMetrics(data);
};

export const metrics = {
  collectMetricsDataOnRuntime,
};
