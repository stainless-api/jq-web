/** @format */

const fs = require("fs");
const path = require("path");

let metaURL = undefined;
try {
  const { url } = require("./jq-wasm.url.mjs")
  metaURL = url;
} catch {}

let wasmPath = path.join(__dirname, "jq.wasm");

// If running in NextJS, we need to find the actual place that the jq.wasm is stored in static files.
const nextJSBuildPath = wasmPath.match(/^.+[\\\/]\.next[\\\/]server[\\\/]/)?.[0];
if (nextJSBuildPath && metaURL !== undefined) {
  const suffix = metaURL.pathname.startsWith('/_next/') ? metaURL.pathname.slice('/_next/'.length) : metaURL.pathname;
  const chunkedWasmPath = path.join(nextJSBuildPath, 'chunks', suffix);
  if (fs.existsSync(chunkedWasmPath)) {
    wasmPath = chunkedWasmPath;
  } else {
    wasmPath = path.join(nextJSBuildPath, suffix);
  }
}

const wasmFile = fs.readFileSync(wasmPath);

const jqFactory = require("./jq.js");

module.exports = jqFactory({
  instantiateWasm: (imports, callback) => {
    const wasmModule = new WebAssembly.Module(wasmFile);
    const instance = new WebAssembly.Instance(wasmModule, imports);
    callback(instance);
    return instance.exports;
  },
});
