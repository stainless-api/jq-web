/** @format */

const fs = require("fs");
const path = require("path");

const { url } = require("./jq-wasm.url.mjs")
let wasmPath = path.join(__dirname, "jq.wasm");

// If running in NextJS, we need to find the actual place that the jq.wasm is stored in static files.
const nextJSBuildPath = wasmPath.match(/^.+[\\\/]\.next[\\\/]server[\\\/]/)?.[0];
if (nextJSBuildPath) {
  const suffix = url.pathname.startsWith('/_next/') ? url.pathname.slice('/_next/'.length) : url.pathname
  const chunkedWasmPath = path.join(nextJSBuildPath, 'chunks', suffix)
  if (fs.existsSync(chunkedWasmPath)) {
    wasmPath = chunkedWasmPath;
  } else {
    wasmPath = path.join(nextJSBuildPath, suffix)
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
