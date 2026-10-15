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

function frontMatterTags(frontMatter) {
  const match = frontMatter.match(/^tags:\s*\[([^\]]*)\]/m);
  return match ? match[1].split(",").map((tag) => tag.trim().replace(/^['"]|['"]$/g, "")) : [];
}

const expectedTopicGroups = ["Foundations", "Decision & Control", "Learning Systems"];
const expectedTopics = [
  "optimization",
  "mathematics",
  "control",
  "reinforcement learning",
  "imitation and intervention learning",
  "generative models",
  "generalization",
  "representation learning",
];
const blogPage = readText("_pages/blog.md");
const blogScss = readOptional("_sass/_blog.scss");
const topicsData = readOptional("_data/blog_topics.yml");
const featuredTagsData = readOptional("_data/blog_featured_tags.yml");
const topicPanel = readOptional("_includes/blog/topic_panel.liquid");
const tagBrowser = readOptional("_includes/blog/tag_browser.liquid");
const archiveLayout = readOptional("_layouts/archive.liquid");
const archiveRow = readOptional("_includes/blog/archive_row.liquid");

test("page one progresses from summary to topics and all posts without a duplicate latest module", () => {
  assert.match(blogPage, /paginator\.page\s*==\s*1/);
  assert.match(blogPage, /site\.posts\.size/);
  assert.match(blogPage, /site\.data\.blog_topics/);
  assert.match(blogPage, /blog\/post_row\.liquid/);
  assert.doesNotMatch(blogPage, /Latest writing|blog\/featured_post\.liquid|blog-recent-grid/);

  const topicsPosition = blogPage.indexOf('id="explore-topics"');
  const archivePosition = blogPage.indexOf('id="all-posts"');
  assert.ok(topicsPosition > -1 && topicsPosition < archivePosition);
});

test("topic taxonomy is grouped into durable research tracks", () => {
  const configuredGroups = [...topicsData.matchAll(/^- label:\s*(.+)$/gm)].map((match) => match[1].trim());
  const configuredTopics = [...topicsData.matchAll(/^\s{4}- key:\s*(.+)$/gm)].map((match) => match[1].trim());

  assert.deepEqual(configuredGroups, expectedTopicGroups);
  assert.deepEqual(configuredTopics, expectedTopics);
});

test("every article has exactly one primary category", () => {
  for (const postPath of listPostPaths()) {
    const categories = frontMatterCategories(readFrontMatter(postPath));
    assert.equal(categories.length, 1, `${postPath} must have one primary category`);
    assert.ok(expectedTopics.includes(categories[0]), `${postPath} must use a known primary category`);
  }

});

test("cross-cutting subjects and formats are tags rather than primary categories", () => {
  const retiredCategories = ["deep learning", "linear algebra", "paper review"];

  for (const postPath of listPostPaths()) {
    const categories = frontMatterCategories(readFrontMatter(postPath));
    for (const retiredCategory of retiredCategories) {
      assert.ok(!categories.includes(retiredCategory), `${postPath} still uses ${retiredCategory} as a category`);
    }
  }

  for (const postPath of [
    "_posts/2026-05-19-phangman.md",
    "_posts/2026-05-31-rocket-landing-annealing.md",
    "_posts/2026-06-07-predictive-safety-filter.md",
  ]) {
    assert.ok(frontMatterTags(readFrontMatter(postPath)).includes("paper review"), `${postPath} must retain its review format as a tag`);
  }
});

test("blog page counts only active topics and groups their panels", () => {
  assert.match(blogPage, /assign active_topic_count = 0/);
  assert.match(blogPage, /for group in site\.data\.blog_topics[\s\S]*for topic in group\.topics/);
  assert.match(blogPage, /if group_post_count > 0[\s\S]*blog-topic-group/);
  assert.match(blogPage, /<dd>{{ active_topic_count }}<\/dd>/);
});

test("specific-topic browser links only tags that already have articles", () => {
  assert.match(featuredTagsData, /^- key:\s*paper review/m);
  assert.match(featuredTagsData, /^- key:\s*imitation learning/m);
  assert.match(featuredTagsData, /^- key:\s*flow matching/m);
  assert.match(featuredTagsData, /^- key:\s*diffusion policy/m);
  assert.match(featuredTagsData, /^- key:\s*contrastive learning/m);
  assert.match(featuredTagsData, /^- key:\s*sergey levine/m);
  assert.match(tagBrowser, /assign tagged_posts = site\.tags\[featured_tag\.key\]/);
  assert.match(tagBrowser, /if tagged_posts and tagged_posts\.size > 0/);
  assert.match(tagBrowser, /prepend: ['"]\/blog\/tag\/['"]/);
  assert.match(blogPage, /include blog\/tag_browser\.liquid/);
});

test("omits empty topic panels", () => {
  assert.match(topicPanel, /if post_count > 0[\s\S]*endif/);
});

test("topic counts link to canonical post archives", () => {
  assert.match(
    topicPanel,
    /<a\s+class="blog-topic-panel__count-link"[\s\S]*href="{{ topic_path \| relative_url }}"[\s\S]*aria-label="View {{ post_count }} posts in {{ topic\.label }}"/
  );
  assert.match(topicPanel, /class="blog-topic-panel__arrow" aria-hidden="true">→<\/span>/);
});

test("topic post count labels use singular and include the field description", () => {
  assert.match(topicPanel, /post_count == 1[\s\S]*post[\s\S]*posts/);
  assert.match(topicPanel, /topic\.description/);
});

test("category and tag archives show newest-first article summaries with dates on the right", () => {
  assert.match(archiveLayout, /assign sorted_documents = ['"]['"] \| split: ['"],['"]/);
  assert.match(archiveLayout, /if page\.documents[\s\S]*assign sorted_documents = page\.documents \| sort: ['"]date['"] \| reverse/);
  assert.match(archiveLayout, /elsif page\.type == 'categories' and site\.categories\[page\.title\][\s\S]*assign sorted_documents = site\.categories\[page\.title\] \| sort: 'date' \| reverse/);
  assert.match(archiveLayout, /page\.type == ['"]categories['"] or page\.type == ['"]tags['"]/);
  assert.match(archiveLayout, /blog\/archive_row\.liquid/);
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
