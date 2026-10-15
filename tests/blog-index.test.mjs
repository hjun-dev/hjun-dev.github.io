import assert from "node:assert/strict";
import test from "node:test";

import { listPostPaths, readFrontMatter, readText } from "./helpers/site-files.mjs";

function readOptional(relativePath) {
  try {
    return readText(relativePath);
  } catch (error) {
    if (error.code === "ENOENT") return "";
    throw error;
  }
}

function frontMatterCategories(frontMatter) {
  const match = frontMatter.match(/^categories:\s*\[([^\]]*)\]/m);
  return match ? match[1].split(",").map((category) => category.trim().replace(/^['"]|['"]$/g, "")) : [];
}

function categoryCount(topic) {
  return listPostPaths().filter((postPath) => frontMatterCategories(readFrontMatter(postPath)).includes(topic)).length;
}

const expectedTopics = ["optimization", "control", "reinforcement learning", "deep learning", "linear algebra", "paper review"];
const blogPage = readText("_pages/blog.md");
const blogScss = readOptional("_sass/_blog.scss");
const topicsData = readOptional("_data/blog_topics.yml");
const topicPanel = readOptional("_includes/blog/topic_panel.liquid");
const archiveLayout = readOptional("_layouts/archive.liquid");
const archiveRow = readOptional("_includes/blog/archive_row.liquid");

test("page one progresses from summary to topics and all posts without a duplicate latest module", () => {
  assert.match(blogPage, /paginator\.page\s*==\s*1/);
  assert.match(blogPage, /site\.posts\.size/);
  assert.match(blogPage, /site\.data\.blog_topics/);
  assert.match(blogPage, /blog\/post_row\.liquid/);
  assert.doesNotMatch(blogPage, /Latest writing|blog\/featured_post\.liquid|blog-recent-grid/);

  const topicsPosition = blogPage.indexOf("Explore by topic");
  const archivePosition = blogPage.indexOf("All posts");
  assert.ok(topicsPosition > -1 && topicsPosition < archivePosition);
});

test("all configured topics resolve to canonical posts", () => {
  const configuredTopics = [...topicsData.matchAll(/^- key:\s*(.+)$/gm)].map((match) => match[1].trim());
  assert.deepEqual(configuredTopics, expectedTopics);

  for (const topic of expectedTopics) {
    assert.ok(categoryCount(topic) > 0, `${topic} must have at least one post`);
  }
});

test("omits topic panels whose filtered post list is empty", () => {
  assert.match(topicPanel, /if topic_posts and topic_posts\.size > 0[\s\S]*endif/);
});

test("topic post counts link to their canonical archives with an accessible arrow", () => {
  assert.match(
    topicPanel,
    /<a\s+class="blog-topic-panel__count-link"[\s\S]*href="{{ topic_path \| relative_url }}"[\s\S]*aria-label="View all {{ topic_posts\.size }} {{ topic_post_noun }} in {{ topic\.label }}"/
  );
  assert.match(topicPanel, /class="blog-topic-panel__arrow" aria-hidden="true">→<\/span>/);
});

test("topic post count labels use the singular noun for one post", () => {
  assert.match(topicPanel, /assign topic_post_noun = ['"]posts['"][\s\S]*topic_posts\.size == 1[\s\S]*assign topic_post_noun = ['"]post['"]/);
  assert.match(topicPanel, /aria-label="View all {{ topic_posts\.size }} {{ topic_post_noun }} in {{ topic\.label }}"/);
});

test("category archives show newest-first article summaries with dates on the right", () => {
  assert.match(archiveLayout, /assign sorted_documents = page\.documents \| sort: ['"]date['"] \| reverse/);
  assert.match(archiveLayout, /page\.type == ['"]categories['"][\s\S]*blog\/archive_row\.liquid/);
  assert.match(archiveRow, /class="blog-archive-row__title"[\s\S]*document\.description[\s\S]*class="blog-archive-row__date"/);
  assert.match(blogScss, /\.blog-archive-row\s*{[\s\S]*?border-bottom:\s*1px solid var\(--journal-border\)/);
  assert.match(blogScss, /\.blog-archive-row\s*{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto/);
});

test("later pagination pages omit page-one discovery modules", () => {
  assert.match(blogPage, /if paginator\.page == 1[\s\S]*endif[\s\S]*All posts/);
});

test("long bilingual titles wrap inside cards and archive rows", () => {
  assert.match(blogScss, /blog-(?:card__title|post-row__title)[\s\S]*overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(blogScss, /blog-(?:card__title|post-row__title)[^}]*white-space:\s*nowrap/);
});
