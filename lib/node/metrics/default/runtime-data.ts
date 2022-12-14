import * as os from "os";
import * as v8 from "v8";
import { HttpModule } from "../../../core/http";

const NPM_PKG_DEP = "npm_package_dependencies_";
const NPM_PKG_DEV_DEP = "npm_package_devDependencies_";
const NPM_PKG_SCRIPTS = "npm_package_scripts_";

export class RuntimeData {
  private readonly http: HttpModule;

  constructor() {
    this.http = new HttpModule("/api/worker/runtime");
  }

  public collect(): void {
    const { traceoVersion, ...rest } = this.packageJsonInfo;
    const data = {
      node: {
        ...this.heap,
        ...this.nodeVersion,
      },
      os: this.osData,
      ...this.packageJsonDependencies,
      npm: rest,
      traceo: {
        version: traceoVersion,
      },
    };

    this.http.request({
      body: data,
      onError: (error: Error) => {
        console.error(
          `Traceo Error. Something went wrong while sending new runtime data to Traceo. Please report this issue.`
        );
        console.error(`Caused by: ${error.message}`);
      },
    });
  }

  private get heap() {
    const heapStats = v8.getHeapStatistics();
    const heapCodeStats = v8.getHeapCodeStatistics();
    return {
      ...heapStats,
      ...heapCodeStats,
    };
  }

  private get packageJsonInfo() {
    const {
      npm_package_engines_node: packageEngineNode,
      npm_package_name: packageName,
      npm_package_description: packageDescription,
      npm_package_version: packageVersion,
      npm_package_dependencies_traceo: traceoVersion,
    } = process.env;

    return {
      packageEngineNode,
      packageDescription,
      packageName,
      packageVersion,
      traceoVersion,
    };
  }

  private get nodeVersion() {
    return process.versions;
  }

  private get osData() {
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
  }

  private get packageJsonDependencies() {
    const dependencies = {};
    const devDependencies = {};
    const scripts = {};

    for (const [key, value] of Object.entries(process.env)) {
      if (key?.startsWith(NPM_PKG_DEP)) {
        const targetKey = this.normalizeDependencyName(key, NPM_PKG_DEP);
        dependencies[targetKey] = value;
      }

      if (key?.startsWith(NPM_PKG_DEV_DEP)) {
        const targetKey = this.normalizeDependencyName(key, NPM_PKG_DEV_DEP);
        devDependencies[targetKey] = value;
      }

      if (key?.startsWith(NPM_PKG_SCRIPTS)) {
        const targetKey = key.replace(NPM_PKG_SCRIPTS, "");
        scripts[targetKey] = value;
      }
    }

    return { dependencies, devDependencies, scripts };
  }

  private normalizeDependencyName(pkg: string, pkgType: string) {
    let targetKey = pkg.replace(pkgType, "").replace("__", "@");
    if (targetKey.includes("@")) {
      const [lib, pkg] = targetKey.split("_");
      targetKey = `${lib}/${pkg}`;
    }

    targetKey = targetKey.replace("_", "").replace("_", "-");

    return targetKey;
  }
}
