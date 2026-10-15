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

function markdownTable(source, heading) {
  const start = source.indexOf(heading);
  assert.notEqual(start, -1, `missing table heading: ${heading}`);
  const remainder = source.slice(start);
  const end = remainder.search(/\r?\n\r?\n/);
  return end === -1 ? remainder : remainder.slice(0, end);
}

const defaultLayout = readText("_layouts/default.liquid");
const postLayout = readText("_layouts/post.liquid");
const postScss = readOptional("_sass/_post.scss");
const relatedPosts = readText("_includes/related_posts.liquid");
const psfPost = readText("_posts/2026-06-07-predictive-safety-filter.md");
const psfTableSection = markdownTable(psfPost, "| Constraint");
const psfDisplayMath = [...psfPost.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((match) => match[1]).join("\n");
const psfInlineMath = [...psfPost.matchAll(/(?<!\$)\$(?!\$)([^$\r\n]+)\$(?!\$)/g)].map((match) => match[1]).join("\n");

test("renders reading time and TOCs only for opted-in posts", () => {
  assert.match(postLayout, /number_of_words/);
  assert.match(postLayout, /reading_time/);
  assert.match(postLayout, /if page\.toc and page\.toc\.sidebar[\s\S]*post-toc-mobile[\s\S]*toc-sidebar[\s\S]*endif/);
  assert.doesNotMatch(defaultLayout, /id="toc-sidebar"/);
});

test("supports technical overflow and bounded desktop TOCs", () => {
  assert.match(postScss, /max-height:\s*calc\(100vh/);
  assert.match(postScss, /overflow-x:\s*auto/);
  assert.match(postScss, /--journal-reading-width/);
  assert.match(postScss, /font-size:\s*1\.0625rem/);
});

test("does not split LaTeX table cells on pipe characters", () => {
  assert.match(psfPost, /mu_\{i\\vert k\}/);
  assert.doesNotMatch(psfTableSection, /\\mu_\{[^}\r\n]*\|k\}/);
  assert.doesNotMatch(psfTableSection, /v_\{[^}\r\n]*\|k\}/);
});

test("does not parse absolute-value display equations as Markdown tables", () => {
  assert.doesNotMatch(psfDisplayMath, /^\s*\|/m);
});

test("does not parse inline prediction indices as Markdown tables", () => {
  assert.doesNotMatch(psfInlineMath, /\|/);
});

test("uses semantic related-post markup", () => {
  assert.match(relatedPosts, /class="post-related"/);
  assert.match(relatedPosts, /<ul/);
  assert.doesNotMatch(relatedPosts, /text-pink-700|font-semibold/);
});
