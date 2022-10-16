import * as os from "node:os";
import * as v8 from "node:v8";
import { HttpModule } from "../../core/http";

const normalizePackageName = (pkg: string, pkgType: string) => {
  let targetKey = pkg.replace(pkgType, "").replace("__", "@");
  if (targetKey.includes("@")) {
    const [lib, pkg] = targetKey.split("_");
    targetKey = `${lib}/${pkg}`;
  }

  targetKey = targetKey.replace("_", "").replace("_", "-");

  return targetKey;
};

const NPM_PKG_DEP = "npm_package_dependencies_";
const NPM_PKG_DEV_DEP = "npm_package_devDependencies_";
const NPM_PKG_SCRIPTS = "npm_package_scripts_";

export const loadRuntimeMetrics = () => {
  const {
    npm_package_engines_node: packageEngineNode,
    npm_package_name: packageName,
    npm_package_description: packageDescription,
    npm_package_version: packageVersion,
    npm_package_dependencies_traceo: traceoVersion,
  } = process.env;

  const heapStats = v8.getHeapStatistics();
  const heapCodeStats = v8.getHeapCodeStatistics();
  const heapStatistics = {
    ...heapStats,
    ...heapCodeStats,
  };

  const nodeVersion = process.versions;

  const data = {
    node: {
      ...heapStatistics,
      ...nodeVersion,
    },
    os: getOs(),
    ...getPkgDeps(),
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

  const httpModule = new HttpModule("/api/worker/runtime", data);
  httpModule.request();
};

const getOs = () => {
  const osData = {};
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
  for (const [key, _] of Object.entries(os)) {
    if (osDataToScrap.includes(key)) {
      osData[key] = os[key]();
    }
  }

  return osData;
};

const getPkgDeps = () => {
  const dependencies = {};
  const devDependencies = {};
  const scripts = {};

  for (const [key, value] of Object.entries(process.env)) {
    if (key?.startsWith(NPM_PKG_DEP)) {
      const targetKey = normalizePackageName(key, NPM_PKG_DEP);
      dependencies[targetKey] = value;
    }

    if (key?.startsWith(NPM_PKG_DEV_DEP)) {
      const targetKey = normalizePackageName(key, NPM_PKG_DEV_DEP);
      devDependencies[targetKey] = value;
    }

    if (key?.startsWith(NPM_PKG_SCRIPTS)) {
      const targetKey = key.replace(NPM_PKG_SCRIPTS, "");
      scripts[targetKey] = value;
    }
  }

  return { dependencies, devDependencies, scripts };
};
