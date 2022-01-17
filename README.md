## Command Line Tools for Kraken  [![npm](https://img.shields.io/npm/v/@openkraken/cli)](https://www.npmjs.com/package/@openkraken/cli)

You can install kraken CLI with npm (you may need to use sudo on Linux or macOS):

```
npm install -g @openkraken/cli
```

Plaform support:

- [x] macOS
- [x] Linux
- [ ] Windows

## Usage

**kraken run**

```sh
Usage: kraken run [options] [bundle|url]

Start a kraken app.

Options:
  -b --bundle <filename>           Bundle path. One of bundle or url is needed, if both determined, bundle path will be used.
  -u --url <URL>                   Bundle URL. One of bundle or URL is needed, if both determined, bundle path will be used.
  -i --instruct <instruct>         instruct file path.
  -s, --source <source>            Source code. pass source directory from command line
  -m --runtime-mode <runtimeMode>  Runtime mode, debug | release. (default: "debug")
  --enable-kraken-js-log           print kraken js to dart log (default: false)
  --show-performance-monitor       show render performance monitor (default: false)
  -d, --debug-layout               debug element's paint layout (default: false)
  -h, --help                       output usage information
```

**kraken qjsc**

```
Usage: kraken qjsc [options] <source> [destination]

convert javascript code to quickjs bytecode.

Options:
  --pluginName [pluginName]  the flutter plugin name.
  --dart                     export dart source file contains bytecode.
  -h, --help                 output usage information
```