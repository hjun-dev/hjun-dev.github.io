import assert from "node:assert/strict";
import test from "node:test";

import { listPostPaths, readFrontMatter, readText } from "./helpers/site-files.mjs";

const config = readText("_config.yml");
const socials = readText("_data/socials.yml");
const phangmanFrontMatter = readFrontMatter("_posts/2026-05-19-phangman.md");

function configuredCategories() {
  const match = config.match(/^display_categories:\s*(\[[^\n]+\])/m);
  assert.ok(match, "display_categories must be present in _config.yml");
  return JSON.parse(match[1]);
}

function frontMatterCategories(frontMatter) {
  const match = frontMatter.match(/^categories:\s*\[([^\]]*)\]/m);
  return match ? match[1].split(",").map((category) => category.trim().replace(/^['"]|['"]$/g, "")) : [];
}

function nonCanonicalPostCategories() {
  const deprecatedAliases = new Set(["reinforcement-learning", "deep-learning", "paper-review"]);

  return listPostPaths()
    .flatMap((postPath) => frontMatterCategories(readFrontMatter(postPath)))
    .filter((category) => deprecatedAliases.has(category)).length;
}

test("uses canonical public blog categories", () => {
  assert.deepEqual(configuredCategories(), [
    "optimization",
    "control",
    "reinforcement learning",
    "deep learning",
    "linear algebra",
    "paper review",
  ]);
  assert.equal(nonCanonicalPostCategories(), 0);
});

test("uses the real CV and removes starter configuration", () => {
  assert.match(socials, /cv_pdf:\s*\/assets\/pdf\/cv\.pdf/);
  assert.match(config, /footer_fixed:\s*false/);
  assert.doesNotMatch(config, /You can even add a little note/);
  assert.doesNotMatch(config, /disqus_shortname:\s*al-folio/);
});

test("matches the PHANG-MAN post date to its filename", () => {
  assert.match(phangmanFrontMatter, /date:\s*2026-05-19/);
});
