#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const { spawn, execSync } = require("child_process");
const { join, resolve } = require("path");
const packageJSON = require("../package.json");
const os = require("os");
const fs = require("fs");
const temp = require("temp");
const Qjsc = require("qjsc");
const exportDartCode = require("../lib/export_dart");
const { option } = require("commander");

const SUPPORTED_JS_ENGINE = ["quickjs"];

program.version(packageJSON.version);

program
  .command("run [bundle|url]")
  .description("Start a webf app.")
  .option(
    "-b --bundle <filename>",
    "Bundle path. One of bundle or url is needed, if both determined, bundle path will be used."
  )
  .option(
    "-u --url <URL>",
    "Bundle URL. One of bundle or URL is needed, if both determined, bundle path will be used."
  )
  .option("-i --instruct <instruct>", "instruct file path.")
  .option(
    "-s, --source <source>",
    "Source code. pass source directory from command line"
  )
  .option("--enable-webf-js-log", "print webf js to dart log", false)
  .option(
    "--show-performance-monitor",
    "show render performance monitor",
    false
  )
  .option("-d, --debug-layout", "debug element's paint layout", false)
  .action((bundleOrUrl, command) => {
    let options;
    let { bundle, url, source, instruct } = (options = command.opts());

    if (!bundle && !url && !source && !bundleOrUrl) {
      command.help();
      return;
    }

    if (bundleOrUrl) {
      if (/^http/.test(bundleOrUrl)) {
        url = bundleOrUrl;
      } else {
        bundle = bundleOrUrl;
      }
    }

    handleRun(bundle, url, source, instruct, options);
  });

// Same as webf run, To compact with old version of webf command.
program
  .description("Start a webf app.")
  .option(
    "-b --bundle <filename>",
    "Bundle path. One of bundle or url is needed, if both determined, bundle path will be used."
  )
  .option(
    "-u --url <URL>",
    "Bundle URL. One of bundle or URL is needed, if both determined, bundle path will be used."
  )
  .option("-i --instruct <instruct>", "instruct file path.")
  .option(
    "-s, --source <source>",
    "Source code. pass source directory from command line"
  )
  .option("--enable-webf-js-log", "print webf js to dart log", false)
  .option(
    "--show-performance-monitor",
    "show render performance monitor",
    false
  )
  .option("-d, --debug-layout", "debug element's paint layout", false)
  .action((options) => {
    let { bundle, url, source, instruct } = options;

    if (!bundle && !url && !source && !options.args) {
      program.help();
    }

    const firstArgs = options.args[0];

    if (firstArgs) {
      if (/^http/.test(firstArgs)) {
        url = firstArgs;
      } else {
        bundle = firstArgs;
      }
    }

    handleRun(bundle, url, source, instruct, options);
  });

function handleRun(bundle, url, source, instruct, options) {
  const env = Object.assign({}, process.env);

  ensureBundleExist();

  const shellPath = getShellPath();

  // only linux platform need this
  if (os.platform() === "linux") {
    env["WEBF_LIBRARY_PATH"] = resolve(__dirname, "../build/lib");
  }

  if (options.enableWebfJsLog) {
    env["ENABLE_WEBF_JS_LOG"] = "true";
  }

  if (options.showPerformanceMonitor) {
    env["WEBF_ENABLE_PERFORMANCE_OVERLAY"] = true;
  }

  if (options.debugLayout) {
    env["WEBF_ENABLE_DEBUG"] = true;
  }

  if (instruct) {
    const absoluteInstructPath = resolve(process.cwd(), instruct);
    env["WEBF_INSTRUCT_PATH"] = absoluteInstructPath;
  }

  if (bundle) {
    const absoluteBundlePath = resolve(process.cwd(), bundle);
    env["WEBF_BUNDLE_PATH"] = absoluteBundlePath;
  } else if (url) {
    env["WEBF_BUNDLE_URL"] = url;
  } else if (source) {
    let t = temp.track();
    let tempdir = t.openSync({ suffix: ".js" });
    let tempPath = tempdir.path;
    fs.writeFileSync(tempPath, source, { encoding: "utf-8" });
    env["WEBF_BUNDLE_PATH"] = tempPath;
  }

  if (fs.existsSync(shellPath)) {
    console.log(chalk.green("Execute binary:"), shellPath, "\n");
    let childProcess = spawn(shellPath, [], {
      stdio: "pipe",
      env,
    });
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.on("data", (data) => {
      let errlog = data.toString();
      errlog = errlog
        .split("\n")
        .filter((line) => line.indexOf("JavaScriptCore.framework") < 0);
      process.stderr.write(errlog.join("\n"));
    });
  } else {
    console.error(chalk.red("WebF Binary NOT exists, try reinstall."));
    process.exit(1);
  }
}

program
  .command("qjsc <source> [destination]")
  .requiredOption("--pluginName [pluginName]", "the flutter plugin name.")
  .option("--dart", "export dart source file contains bytecode.")
  .description("convert javascript code to quickjs bytecode.")
  .action((source, destination, command) => {
    if (command.args.length == 0) {
      command.help();
      return;
    }

    const bundlePath = resolve(process.cwd(), source);
    destination = resolve(process.cwd(), destination);
    const code = fs.readFileSync(bundlePath, { encoding: "utf-8" });
    const qjsc = new Qjsc();
    const buffer = qjsc.compile(code, "plugin://");
    let output;
    if (command.dart) {
      output = exportDartCode(buffer, command.pluginName);
    } else {
      output = buffer;
    }
    fs.writeFileSync(destination, output);
    console.log("Bytecode generated at " + destination);
  });

program.parse(process.argv);

if (program.args.length == 0) {
  program.help();
  return;
}

function ensureBundleExist() {
  const platform = os.platform();
  let appBundlePath = join(__dirname, "../node_modules/@openwebf", platform === 'darwin' ? 'cli-macos' : `cli-${platform}`, 'app.tar.gz');

  if (!fs.existsSync(appBundlePath)) {
    console.error(chalk.red("Bundle tar NOT exists, try reinstall."));
    process.exit(1);
  }

  execSync(`tar xzf ${appBundlePath} -C ./`, {
    cwd: join(appBundlePath, '../'),
    stdio: "inherit",
  });

  return false;
}

function getShellPath() {
  const platform = os.platform();
  const appPath = join(__dirname, "../node_modules/@openwebf");
  if (platform === "darwin") {
    return join(appPath, "cli-macos/app.app/Contents/MacOS/app");
  } else if (platform === "linux") {
    return join(appPath, "cli-linux/bundle/webf_example");
  } else {
    console.log(
      chalk.red(
        `[ERROR]: Platform ${platform} not supported by ${packageJSON.name}.`
      )
    );
    process.exit(1);
  }
}
