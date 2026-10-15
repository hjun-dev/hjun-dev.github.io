import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { selectActiveHeading, readingLinePosition, isSpacerContent, tocScrollTarget, scrollRegionAttributes } = require("../assets/js/post-reading.js");

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
