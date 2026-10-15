import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export function readText(relativePath) {
  return readFileSync(join(repositoryRoot, relativePath), "utf8");
}

export function readFrontMatter(relativePath) {
  const source = readText(relativePath);
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);

  if (!match) {
    throw new Error(`Missing front matter: ${relativePath}`);
  }

  return match[1];
}

export function listPostPaths() {
  const postsDirectory = join(repositoryRoot, "_posts");

  return readdirSync(postsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(md|markdown|html)$/i.test(entry.name))
    .map((entry) => relative(repositoryRoot, join(postsDirectory, entry.name)).replaceAll("\\", "/"))
    .sort();
}
