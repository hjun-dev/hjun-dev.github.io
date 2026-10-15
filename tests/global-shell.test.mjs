import assert from "node:assert/strict";
import test from "node:test";

import { readText } from "./helpers/site-files.mjs";

function readOptional(relativePath) {
  try {
    return readText(relativePath);
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

const config = readText("_config.yml");
const footer = readText("_includes/footer.liquid");
const header = readText("_includes/header.liquid");
const layoutScss = readText("_sass/_layout.scss");
const mainScss = readText("assets/css/main.scss");
const variables = readText("_sass/_variables.scss");
const journalScss = readOptional("_sass/_journal.scss");

test("loads bilingual editorial fonts and the journal partial", () => {
  assert.match(config, /fonts\.googleapis\.com\/css2\?/);
  assert.match(config, /family=Inter/);
  assert.match(config, /Noto\+Sans\+KR/);
  assert.match(variables, /"Inter",\s*"Noto Sans KR"/);
  assert.match(mainScss, /"journal"/);
});

test("keeps the footer in normal flow", () => {
  assert.doesNotMatch(footer, /fixed-bottom/);
  assert.equal((footer.match(/<footer\b/g) ?? []).length, 1);
  assert.doesNotMatch(layoutScss, /body\s*\{[\s\S]*?padding-bottom:\s*70px/);
});

test("exposes editorial tokens and accessible interaction states", () => {
  for (const token of [
    "--journal-content-width",
    "--journal-reading-width",
    "--journal-radius",
    "--journal-shadow",
    "--journal-section-gap",
  ]) {
    assert.match(journalScss, new RegExp(token));
  }

  assert.match(journalScss, /:focus-visible/);
  assert.match(journalScss, /prefers-reduced-motion/);
});

test("preserves navigation JavaScript hooks", () => {
  for (const id of ["navbar", "navbarNav", "search-toggle", "light-toggle"]) {
    assert.match(header, new RegExp(`id=["']${id}["']`));
  }
});
