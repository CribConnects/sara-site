// Rebuilds the app <script> inside index.html from context/sara-prototype.jsx.
// Usage: node build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

let src = readFileSync("context/sara-prototype.jsx", "utf8");
src = src.replace(/^import React.*$/m, "const { useState, useEffect, useRef } = React;");
src = src.replace("export default function SARA", "function SARA");

const js = execFileSync("npx", ["esbuild", "--loader=jsx"], { input: src, maxBuffer: 64 * 1024 * 1024 }).toString();
const app = js + '\nReactDOM.createRoot(document.getElementById("root")).render(React.createElement(SARA));\n';

const html = readFileSync("index.html", "utf8");
const openIdx = html.lastIndexOf("<script>");
const closeIdx = html.lastIndexOf("</script>");
if (openIdx === -1 || closeIdx < openIdx) throw new Error("could not locate app script block");
writeFileSync("index.html", html.slice(0, openIdx + "<script>".length) + app + html.slice(closeIdx));
console.log("index.html rebuilt:", app.length, "bytes of app code");
