import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const starterPaths = [
  "_pages/about_einstein.md",
  "_pages/profiles.md",
  "_pages/repositories.md",
  "_pages/teaching.md",
  "_pages/dropdown.md",
  "_pages/books.md",
  "_pages/news.md",
  "_books/the_godfather.md",
  "_data/repositories.yml",
  "_data/citations.yml",
  "assets/html/relativity.html",
  "assets/jupyter/blog.ipynb",
  "assets/pdf/example_pdf.pdf",
  "assets/img/prof_pic.jpg",
  "assets/img/prof_pic_color.png",
  "assets/img/rhino.png",
  "assets/img/template_error.png",
];

function listSourceFiles(relativeDirectory) {
  const directory = join(repositoryRoot, relativeDirectory);

  if (!existsSync(directory)) return [];

  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(md|markdown|liquid|ya?ml)$/i.test(entry.name))
    .map((entry) => join(entry.parentPath ?? entry.path, entry.name));
}

function publicSourceText() {
  const paths = [join(repositoryRoot, "_config.yml"), ...listSourceFiles("_pages"), ...listSourceFiles("_data"), ...listSourceFiles("_books")];

  return paths
    .map((path) => readFileSync(path, "utf8"))
    .join("\n")
    .split(/\r?\n/)
    .filter((line) => !/^\s*#/.test(line))
    .join("\n");
}

test("removes the al-folio starter pages and assets after the reference audit", () => {
  for (const relativePath of starterPaths) {
    assert.equal(existsSync(join(repositoryRoot, relativePath)), false, relativePath);
  }
});

test("keeps the owner's public profile, CV, publications, and projects", () => {
  const protectedPaths = ["assets/img/leepic.jpg", "assets/pdf/cv.pdf", "_pages/about.md", "_pages/publications.md", "_pages/projects.md"];

  for (const relativePath of protectedPaths) {
    assert.equal(existsSync(join(repositoryRoot, relativePath)), true, relativePath);
  }
});

test("does not expose starter identity or placeholder references", () => {
  assert.doesNotMatch(publicSourceText(), /Albert Einstein|555 your office|example_pdf|torvalds/i);
  assert.doesNotMatch(readFileSync(join(repositoryRoot, "FAQ.md"), "utf8"), /assets\/img\/template_error\.png/);
});

test("gives About readers a clear route to the full blog", () => {
  const aboutLayout = readFileSync(join(repositoryRoot, "_layouts/about.liquid"), "utf8");

  assert.match(aboutLayout, /href=["']\{\{\s*['"]\/blog\/['"]\s*\|\s*relative_url\s*\}\}["']/);
  assert.match(aboutLayout, /Browse all writing/i);
});

test("uses reusable layout classes instead of inline presentation on About", () => {
  const about = readFileSync(join(repositoryRoot, "_pages/about.md"), "utf8");

  assert.match(about, /class="section-heading/);
  assert.doesNotMatch(about, /style=/);
});
