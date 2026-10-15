import assert from "node:assert/strict";
import test from "node:test";

import { readText } from "./helpers/site-files.mjs";

const cvData = readText("_data/cv.yml");
const cvLayout = readText("_layouts/cv.liquid");
const cvPage = readText("_pages/cv.md");
const cvScss = readText("_sass/_cv.scss");
const timeTable = readText("_includes/cv/time_table.liquid");

test("contains the supplied current research projects and funder links", () => {
  assert.match(cvData, /Local LLM-based AI agents for autonomous eVTOL operations/);
  assert.match(cvData, /2026\s*-\s*2030/);
  assert.match(cvData, /https:\/\/www\.kari\.re\.kr\//);
  assert.match(cvData, /Local LLM-based Agent-Skill architecture with closed-network RAG/);
  assert.match(cvData, /Intervention learning within the human-in-the-loop coordination/);

  assert.match(cvData, /Cross-vehicle domain adaptation and generalization for AI-based road surface classification/);
  assert.match(cvData, /https:\/\/www\.hyundai\.com\//);
  assert.match(cvData, /adversarial domain alignment, supervised contrastive learning, and weight averaging/);
  assert.match(cvData, /knowledge distillation and in-vehicle validation/);

  assert.equal((cvData.match(/Data-efficient safe reinforcement learning from human corrections/g) ?? []).length, 1);
  assert.match(cvData, /https:\/\/viterbischool\.usc\.edu\/aier\//);
  assert.match(cvData, /https:\/\/www\.usc\.edu\//);
  assert.match(cvData, /Integration of human correction models to improve the safety and data-efficiency of aerospace systems/);
});

test("retains the existing CV project history", () => {
  assert.match(cvData, /AI-based Moving Target Tracking & Situational Awareness/);
  assert.match(cvData, /Deep learning model for off-road vehicle state estimation/);
  assert.doesNotMatch(cvData, /title:.*\(Funded by (?:Hyundai Motor Company|Hanwha Aerospace)\)/);
  assert.match(cvData, /institution: Funded by Hyundai Motor Company/);
  assert.match(cvData, /institution: Funded by Hanwha Aerospace/);
  assert.match(cvData, /https:\/\/www\.hanwhaaerospace\.com\/eng\/index\.do/);
});

test("uses document sections and safe external actions", () => {
  assert.match(cvLayout, /cv-summary/);
  assert.match(cvLayout, /cv-section-nav/);
  assert.match(cvLayout, /cv-download/);
  assert.match(cvLayout, /entry\.title \| slugify/);
  assert.match(timeTable, /class="cv-timeline"/);
  assert.match(timeTable, /rel="noopener noreferrer"/);
  assert.doesNotMatch(cvLayout, /class="card mt-3 p-3"/);
});

test("uses a labeled PDF action and responsive document styling", () => {
  assert.match(cvPage, /cv_pdf:\s*cv\.pdf/);
  assert.match(cvLayout, />\s*View PDF/);
  assert.match(cvScss, /\.cv-section/);
  assert.match(cvScss, /grid-template-columns/);
  assert.match(cvScss, /@media\s*\(max-width:/);
});
