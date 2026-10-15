import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import test from "node:test";

import { readText } from "./helpers/site-files.mjs";

const head = readText("_includes/head.liquid");
const scripts = readText("_includes/scripts.liquid");
const config = readText("_config.yml");
const archiveRow = readText("_includes/blog/archive_row.liquid");

test("site applies a privacy-preserving referrer policy", () => {
  assert.match(head, /<meta name="referrer" content="strict-origin-when-cross-origin">/);
});

test("unused publication trackers and legacy polyfill are disabled", () => {
  assert.match(
    config,
    /enable_publication_badges:\s*\n\s+altmetric: false[^\n]*\n\s+dimensions: false[^\n]*\n\s+google_scholar: false[^\n]*\n\s+inspirehep: false/
  );
  assert.doesNotMatch(scripts, /d1bxh8uas1mnw7\.cloudfront\.net|badge\.dimensions\.ai/);
  assert.doesNotMatch(scripts, /third_party_libraries\.polyfill/);
});

test("external archive links prevent opener access and referrer leakage", () => {
  assert.match(archiveRow, /target="_blank" rel="noopener noreferrer"/);
});

test("only required GitHub Actions workflows remain", () => {
  const workflows = readdirSync(new URL("../.github/workflows/", import.meta.url))
    .filter((name) => /\.ya?ml$/.test(name))
    .sort();

  assert.deepEqual(workflows, ["codeql.yml", "deploy.yml"]);
});

test("GitHub Actions are pinned and deployment separates build from write access", () => {
  for (const workflowName of ["codeql.yml", "deploy.yml"]) {
    const workflow = readText(`.github/workflows/${workflowName}`);
    const references = [...workflow.matchAll(/uses:\s+[^@\s]+@([^\s#]+)/g)].map((match) => match[1]);

    assert.ok(references.length > 0, `${workflowName} must use at least one action`);
    assert.ok(
      references.every((reference) => /^[0-9a-f]{40}$/.test(reference)),
      `${workflowName} must pin every action to a full commit SHA`
    );
  }

  const deploy = readText(".github/workflows/deploy.yml");
  assert.match(deploy, /permissions:\s*\n\s+contents: read/);
  assert.match(deploy, /persist-credentials: false/);
  assert.match(deploy, /\n\s{2}build:\s*[\s\S]*\n\s{2}deploy:\s*[\s\S]*permissions:\s*[\s\S]*?contents: write/);
  assert.doesNotMatch(deploy, /yaml-update-action|npm install -g|pip3? install/);

  const deployJob = deploy.split("\n  deploy:")[1];
  const checkoutPosition = deployJob.indexOf("name: Checkout deployment repository");
  const downloadPosition = deployJob.indexOf("name: Download site artifact");
  const deployPosition = deployJob.indexOf("name: Deploy");
  assert.ok(checkoutPosition > -1, "deploy job must initialize the Git repository");
  assert.ok(checkoutPosition < downloadPosition && downloadPosition < deployPosition);
});
