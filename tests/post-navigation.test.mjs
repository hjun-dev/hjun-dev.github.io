import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { selectActiveHeading, readingLinePosition, isSpacerContent, tocScrollTarget, scrollRegionAttributes, needsInlineScroll, init } = require("../assets/js/post-reading.js");

test("tracks the last heading above the reading line, including exact boundaries", () => {
  assert.equal(selectActiveHeading([], 96), -1);
  assert.equal(selectActiveHeading([180, 500, 900], 96), 0);
  assert.equal(selectActiveHeading([-500, 96, 450], 96), 1);
  assert.equal(selectActiveHeading([-900, -400, -20], 96), 2);
});

test("uses current heading positions after equations or images change the layout", () => {
  assert.equal(selectActiveHeading([-200, 80, 700], 96), 1);
  assert.equal(selectActiveHeading([-200, 200, 820], 96), 0);
  assert.equal(selectActiveHeading([-700, -300, 88], 96), 2);
});

test("keeps anchored headings current across mobile and desktop header heights", () => {
  assert.equal(readingLinePosition(59, 88), 109);
  assert.equal(readingLinePosition(68, 88), 118);
  assert.equal(selectActiveHeading([-400, 88.17, 800], readingLinePosition(59, 88)), 1);
});

test("keeps a directly linked section current after a small font or math layout shift", () => {
  assert.equal(selectActiveHeading([-400, 100.39, 800], readingLinePosition(68, 88)), 1);
  assert.equal(selectActiveHeading([-400, 100.39, 800], readingLinePosition(59, 88)), 1);
});

test("marks a short final section at the document end even if its heading cannot reach the reading line", () => {
  assert.equal(selectActiveHeading([-200, 80, 400], 96, true), 2);
  assert.equal(selectActiveHeading([-200, 80, 400], 96, false), 1);
});

test("collapses only empty line-break paragraphs, never prose, math, or media", () => {
  assert.equal(isSpacerContent(" \n", ["BR"]), true);
  assert.equal(isSpacerContent("", ["BR", "BR"]), true);
  assert.equal(isSpacerContent("A paragraph", ["BR"]), false);
  assert.equal(isSpacerContent("$x < y$", ["BR"]), false);
  assert.equal(isSpacerContent("", ["IMG"]), false);
  assert.equal(isSpacerContent("", ["SPAN", "BR"]), false);
  assert.equal(isSpacerContent("", []), false);
});

test("keeps visible TOC items still and reveals clipped items within the rail", () => {
  const viewport = { top: 100, bottom: 500 };
  assert.equal(tocScrollTarget(viewport, { top: 200, bottom: 240 }, 80, 400), 80);
  assert.equal(tocScrollTarget(viewport, { top: 70, bottom: 100 }, 80, 400), 38);
  assert.equal(tocScrollTarget(viewport, { top: 480, bottom: 520 }, 80, 400), 112);
  assert.equal(tocScrollTarget(viewport, { top: -100, bottom: -70 }, 80, 400), 0);
  assert.equal(tocScrollTarget(viewport, { top: 800, bottom: 840 }, 380, 400), 400);
});

test("makes overflow keyboard accessible without replacing native table semantics", () => {
  assert.deepEqual(scrollRegionAttributes("TABLE", {}), { tabindex: "0", "aria-label": "Scrollable table" });
  assert.deepEqual(scrollRegionAttributes("PRE", {}), { tabindex: "0", role: "region", "aria-label": "Scrollable code" });
  assert.deepEqual(scrollRegionAttributes("MJX-CONTAINER", { role: "math" }), { tabindex: "0", "aria-label": "Scrollable equation" });
});

test("preserves existing focus, role, and naming attributes including empty values", () => {
  assert.deepEqual(scrollRegionAttributes("TABLE", { tabindex: "-1", role: "table", "aria-label": "Results" }), {});
  assert.deepEqual(scrollRegionAttributes("PRE", { tabindex: "", role: "", "aria-label": "" }), {});
});

test("confines an inline equation wider than its paragraph or indented list to its own scroll area", () => {
  assert.equal(typeof needsInlineScroll, "function", "inline equation overflow must be measured");
  assert.equal(needsInlineScroll(738.2, 330), true);
  assert.equal(needsInlineScroll(378.3, 275), true);
  assert.equal(needsInlineScroll(210, 200), true);
  assert.equal(needsInlineScroll(190, 200), false);
});

test("restores ordinary inline math when a wider viewport can fit the same equation", () => {
  assert.equal(typeof needsInlineScroll, "function", "inline equation overflow must be measured");
  assert.equal(needsInlineScroll(378.3, 330), true);
  assert.equal(needsInlineScroll(378.3, 760), false);
  assert.equal(needsInlineScroll(330.5, 330), false);
});

test("does not reformat math in a hidden or not-yet-measured container", () => {
  assert.equal(typeof needsInlineScroll, "function", "inline equation overflow must be measured");
  assert.equal(needsInlineScroll(300, 0), false);
  assert.equal(needsInlineScroll(0, 330), false);
  assert.equal(needsInlineScroll(Number.NaN, 330), false);
});

test("removes owned scroll announcements after widening while preserving MathJax focus", () => {
  // Geometry and animation frames are the browser boundary; execute the real init/resize handlers.
  let width = 300;
  const frames = [], events = {}, attrs = { tabindex: "0" }, classes = new Set();
  const block = { get clientWidth() { return width; } };
  const equation = {
    tagName: "MJX-CONTAINER", dataset: {},
    classList: { toggle(name, on) { if (on) classes.add(name); else classes.delete(name); } },
    closest(selector) { return selector === "table" ? null : block; },
    querySelector() { return { getBoundingClientRect: () => ({ width: 500 }) }; },
    get scrollWidth() { return classes.has("reading-math-overflow") ? 500 : 0; },
    get clientWidth() { return classes.has("reading-math-overflow") ? width : 0; },
    getAttribute(name) { return attrs[name] ?? null; },
    setAttribute(name, value) { attrs[name] = value; },
    removeAttribute(name) { delete attrs[name]; },
  };
  const content = {
    children: [],
    querySelectorAll(selector) {
      if (selector.startsWith("h2")) return [];
      if (selector.startsWith('mjx-container[jax')) return [equation];
      return classes.has("reading-math-overflow") || (selector.includes("[data-reading-overflow]") && equation.dataset.readingOverflow) ? [equation] : [];
    },
  };
  const doc = { querySelector: (selector) => selector.startsWith(".post-reading ") ? content : null, getElementById: () => null };
  const win = {
    getComputedStyle: () => ({ paddingLeft: "0", paddingRight: "0" }),
    addEventListener(name, callback) { events[name] = callback; },
    requestAnimationFrame(callback) { frames.push(callback); },
  };
  const flush = () => { while (frames.length) frames.shift()(); };
  init(doc, win);
  flush();
  assert.equal(classes.has("reading-math-overflow"), true);
  assert.equal(attrs["aria-label"], "Scrollable equation");
  assert.equal(attrs.role, "region");
  width = 760;
  events.resize();
  flush();
  assert.equal(classes.has("reading-math-overflow"), false);
  assert.deepEqual(attrs, { tabindex: "0" });
  assert.equal(equation.dataset.readingOverflow, undefined);
});
