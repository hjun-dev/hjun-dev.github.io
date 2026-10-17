import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";

import { readText } from "./helpers/site-files.mjs";

function setup(blockCount) {
  const events = [];
  let onReady;
  const parent = { appendChild() {}, removeChild() {} };
  const blocks = Array.from({ length: blockCount }, (_, index) => ({
    textContent: `algorithm ${index}`,
    parentElement: { parentElement: parent },
  }));
  const document = {
    readyState: "loading",
    addEventListener(name, callback) { onReady = callback; },
    querySelectorAll() { return blocks; },
    createElement() { return { classList: { add() {} }, appendChild() {} }; },
    createTextNode(text) { return { textContent: text }; },
  };
  const window = {};
  vm.runInNewContext(readText("assets/js/pseudocode-setup.js"), {
    window, document,
    pseudocode: { renderElement() { events.push("render"); } },
  });
  window.MathJax.chtmlStylesheet = () => events.push("refresh glyph CSS");
  return { document, events, ready: () => onReady() };
}

test("refreshes MathJax glyph styles after all late-rendered pseudocode blocks", () => {
  const page = setup(2);
  page.ready();
  assert.deepEqual(page.events, []);
  page.document.readyState = "complete";
  page.ready();
  assert.deepEqual(page.events, ["render", "render", "refresh glyph CSS"]);
});

test("does not refresh MathJax styles when there is no pseudocode block", () => {
  const page = setup(0);
  page.document.readyState = "complete";
  page.ready();
  assert.deepEqual(page.events, []);
});
