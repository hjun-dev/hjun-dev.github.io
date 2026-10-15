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

const publicationsPage = readText("_pages/publications.md");
const bibliographyLayout = readText("_layouts/bib.liquid");
const publicationsScss = readOptional("_sass/_publications.scss");
const mainScss = readText("assets/css/main.scss");

test("groups each publication category into a labeled semantic section", () => {
  assert.equal((publicationsPage.match(/<section class="publication-section"/g) ?? []).length, 4);
  assert.equal((publicationsPage.match(/aria-labelledby="publications-/g) ?? []).length, 4);
  assert.match(publicationsPage, /class="section-heading"/);
});

test("omits empty publication categories from the rendered page", () => {
  assert.equal((publicationsPage.match(/{% capture \w+_publications %}/g) ?? []).length, 4);
  assert.equal((publicationsPage.match(/{% if \w+_publications contains '<li' %}/g) ?? []).length, 4);
});

test("keeps title, author, and venue metadata in distinct bibliography elements", () => {
  assert.match(bibliographyLayout, /class="title"/);
  assert.match(bibliographyLayout, /class="author"/);
  assert.match(bibliographyLayout, /class="periodical"/);
});

test("defines an explicit visual hierarchy for publication entries", () => {
  assert.match(mainScss, /"publications"/);
  assert.match(publicationsScss, /\.publications[\s\S]*ol\.bibliography > li \.title[\s\S]*font-size:[\s\S]*font-weight:\s*650/);
  assert.match(publicationsScss, /\.publications[\s\S]*\.author[\s\S]*font-size:/);
  assert.match(publicationsScss, /\.publications[\s\S]*\.periodical[\s\S]*font-size:/);
});
