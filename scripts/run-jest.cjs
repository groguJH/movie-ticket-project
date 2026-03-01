const Module = require("module");

const originalLoad = Module._load;

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === "strip-ansi") {
    const stripAnsiCjs = originalLoad.call(this, "strip-ansi-cjs", parent, isMain);
    return stripAnsiCjs && stripAnsiCjs.default
      ? stripAnsiCjs.default
      : stripAnsiCjs;
  }

  return originalLoad.call(this, request, parent, isMain);
};

require("jest/bin/jest");
