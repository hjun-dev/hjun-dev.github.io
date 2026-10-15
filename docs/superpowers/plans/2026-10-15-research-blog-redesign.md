# Research Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing al-folio site into a polished research portfolio and frequently updated technical blog with stronger discovery, long-form readability, and a refined CV.

**Architecture:** Keep Jekyll, Liquid, SCSS, Bootstrap utilities, and the existing archive/pagination plugins. Add focused Liquid includes and scoped SCSS partials for the blog, post, and site shell; keep CV content data-driven from `_data/cv.yml`; add dependency-free Node source tests plus a production Jekyll build and browser QA.

**Tech Stack:** Jekyll 4/al-folio, Liquid, SCSS, Bootstrap 4 utilities, Node.js built-in test runner, Prettier, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-15-research-blog-redesign-design.md`

## Global Constraints

- Preserve `/` as the portfolio home and `/blog/` as the blog landing page.
- Do not rewrite, summarize, translate, or fact-check article prose.
- Preserve existing post URLs and permalinks.
- Permit only meaning-preserving technical source corrections inside article bodies.
- Add the supplied research projects only to the existing CV Projects section; do not add them to the Projects collection.
- Do not require thumbnails and do not add a JavaScript framework, CMS, or runtime dependency.
- Reuse Liquid, SCSS, Bootstrap utilities, and existing Jekyll plugins.
- Preserve light/dark mode, search, comments, image zoom, code copy, and archive behavior.
- Remove only starter files proven unreferenced; retain uncertain content and theme infrastructure.
- Do not push or deploy without separate user authorization.

## File Structure

- `tests/helpers/site-files.mjs` — dependency-free repository readers used by all source tests.
- `tests/content-metadata.test.mjs` — canonical categories, dates, profile links, and configuration assertions.
- `tests/global-shell.test.mjs` — typography, footer flow, theme tokens, focus, and reduced-motion assertions.
- `tests/blog-index.test.mjs` — blog landing composition, pagination branching, topic data, and count assertions.
- `tests/post-reading.test.mjs` — post metadata, reading time, TOC, technical overflow, and table-source assertions.
- `tests/cv-page.test.mjs` — CV project facts, funder links, accessible layout hooks, and PDF action assertions.
- `tests/starter-cleanup.test.mjs` — public starter-content removal and protected active-content assertions.
- `_data/blog_topics.yml` — canonical blog-topic keys and user-facing labels.
- `_includes/blog/featured_post.liquid` — page-one featured article.
- `_includes/blog/post_card.liquid` — compact recent-post card.
- `_includes/blog/topic_panel.liquid` — topic count and recent links.
- `_includes/blog/post_row.liquid` — chronological archive row.
- `_sass/_journal.scss` — global editorial tokens, typography, navbar, footer, focus, and responsive shell.
- `_sass/_blog.scss` — blog landing, topic panels, cards, archive rows, and pagination.
- `_sass/_post.scss` — post header, metadata, reading column, mobile/desktop TOC, tables, equations, code, and figures.
- `_layouts/cv.liquid` and `_sass/_cv.scss` — data-driven document-style CV structure and presentation.

## Review Focus

- A post with a very long bilingual title must wrap without horizontal overflow or clipped controls — covered by `tests/blog-index.test.mjs` and Task 6 mobile QA.
- A configured topic with no posts must not render a misleading count or broken recent-link list — covered by `tests/blog-index.test.mjs` in Task 3.
- A post without `toc` front matter must not render empty mobile or desktop TOC controls — covered by `tests/post-reading.test.mjs` in Task 4.
- CV project descriptions containing apostrophes, ampersands, and external links must remain valid YAML/HTML and use safe link attributes — covered by `tests/cv-page.test.mjs` in Task 5.
- Starter cleanup must not delete the real CV, publications, profile image, or active project assets — covered by protected-file assertions in `tests/starter-cleanup.test.mjs` in Task 6.

---

### Task 1: Test Harness and Canonical Metadata

**Files:**
- Create: `tests/helpers/site-files.mjs`
- Create: `tests/content-metadata.test.mjs`
- Modify: `package.json`
- Modify: `_config.yml`
- Modify: `_data/socials.yml`
- Modify: `_posts/2025-01-06-unified-approach.md`
- Modify: `_posts/2026-05-19-phangman.md`

**Interfaces:**
- Produces: `readText(relativePath: string): string`, `readFrontMatter(relativePath: string): string`, `listPostPaths(): string[]` from `tests/helpers/site-files.mjs`.
- Produces: `npm test` invoking `node --test tests/*.test.mjs`.
- Produces: canonical category values `optimization`, `control`, `reinforcement learning`, `deep learning`, `linear algebra`, and `paper review` for later Liquid lookups.

- [ ] **Step 1: Create the test helper and write failing metadata tests**

```js
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
  assert.doesNotMatch(config, /You can even add a little note/);
  assert.doesNotMatch(config, /disqus_shortname:\s*al-folio/);
});

test("matches the PHANG-MAN post date to its filename", () => {
  assert.match(phangmanFrontMatter, /date:\s*2026-05-19/);
});
```

- [ ] **Step 2: Run the metadata test and verify RED**

Run: `node --test tests/content-metadata.test.mjs`

Expected: FAIL for the starter CV path, starter contact note/Disqus value, hyphenated category variants, missing Linear Algebra display category, and PHANG-MAN date mismatch.

- [ ] **Step 3: Normalize metadata and add the test script**

Set `footer_fixed: false`; make `contact_note` empty or relevant; clear `disqus_shortname`; set the six canonical `display_categories`; point `cv_pdf` to `/assets/pdf/cv.pdf`; normalize only front-matter category spelling; set the PHANG-MAN front-matter date to `2026-05-19 13:00:00 +0900`. Do not edit either post body.

- [ ] **Step 4: Run the metadata test and full Node suite and verify GREEN**

Run: `node --test tests/content-metadata.test.mjs`

Expected: PASS.

Run: `npm test`

Expected: all current tests PASS.

- [ ] **Step 5: Commit Task 1**

```bash
git add package.json tests/helpers/site-files.mjs tests/content-metadata.test.mjs _config.yml _data/socials.yml _posts/2025-01-06-unified-approach.md _posts/2026-05-19-phangman.md
git commit -m "chore: normalize blog metadata"
```

### Task 2: Global Editorial Shell

**Files:**
- Create: `tests/global-shell.test.mjs`
- Create: `_sass/_journal.scss`
- Modify: `assets/css/main.scss`
- Modify: `_sass/_variables.scss`
- Modify: `_config.yml`
- Modify: `_includes/footer.liquid`
- Modify: `_includes/header.liquid`
- Modify: `_sass/_layout.scss`

**Interfaces:**
- Consumes: `readText()` from Task 1.
- Produces: CSS custom properties `--journal-content-width`, `--journal-reading-width`, `--journal-radius`, `--journal-shadow`, and `--journal-section-gap`.
- Produces: reusable classes `.journal-shell`, `.section-heading`, `.eyebrow`, `.surface`, and `.text-link`.

- [ ] **Step 1: Write failing global-shell tests**

```js
test("loads bilingual editorial fonts and the journal partial", () => {
  assert.match(config, /Inter/);
  assert.match(config, /Noto\+Sans\+KR/);
  assert.match(mainScss, /"journal"/);
});

test("keeps the footer in normal flow and exposes accessible interaction states", () => {
  assert.doesNotMatch(footer, /fixed-bottom/);
  assert.match(journalScss, /:focus-visible/);
  assert.match(journalScss, /prefers-reduced-motion/);
});
```

- [ ] **Step 2: Run the global-shell test and verify RED**

Run: `node --test tests/global-shell.test.mjs`

Expected: FAIL because the journal partial, bilingual font URL, normal-flow-only footer, and accessibility rules do not exist.

- [ ] **Step 3: Implement the editorial shell**

Import `_journal.scss` after the theme base partials; update the sans-serif stack to `Inter`, `Noto Sans KR`, and system fallbacks; switch the Google Fonts URL to the CSS2 endpoint; simplify `footer.liquid` to one normal-flow footer; style the fixed navbar, active state, search/theme controls, footer, surfaces, focus rings, and reduced-motion behavior. Keep existing DOM IDs and JavaScript hooks intact.

- [ ] **Step 4: Run focused and full tests and verify GREEN**

Run: `node --test tests/global-shell.test.mjs`

Expected: PASS.

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 5: Commit Task 2**

```bash
git add tests/global-shell.test.mjs assets/css/main.scss _sass/_journal.scss _sass/_variables.scss _sass/_layout.scss _config.yml _includes/footer.liquid _includes/header.liquid
git commit -m "style: add editorial site shell"
```

### Task 3: Blog Discovery Landing Page

**Files:**
- Create: `tests/blog-index.test.mjs`
- Create: `_data/blog_topics.yml`
- Create: `_includes/blog/featured_post.liquid`
- Create: `_includes/blog/post_card.liquid`
- Create: `_includes/blog/topic_panel.liquid`
- Create: `_includes/blog/post_row.liquid`
- Create: `_sass/_blog.scss`
- Modify: `_pages/blog.md`
- Modify: `_includes/pagination.liquid`
- Modify: `assets/css/main.scss`

**Interfaces:**
- Consumes: canonical post categories from Task 1 and global tokens/classes from Task 2.
- Produces: topic objects `{ key: string, label: string }` in `_data/blog_topics.yml`.
- Produces: include contracts `featured_post.liquid(post)`, `post_card.liquid(post)`, `topic_panel.liquid(topic)`, and `post_row.liquid(post)`.

- [ ] **Step 1: Write failing blog-index tests**

```js
test("page one progresses from summary to latest, topics, and all posts", () => {
  assert.match(blogPage, /paginator\.page\s*==\s*1/);
  assert.match(blogPage, /site\.posts\.size/);
  assert.match(blogPage, /blog\/featured_post\.liquid/);
  assert.match(blogPage, /site\.data\.blog_topics/);
  assert.match(blogPage, /blog\/post_row\.liquid/);
});

test("all configured topics resolve to canonical posts", () => {
  for (const topic of expectedTopics) assert.ok(categoryCount(topic) > 0);
});

test("omits topic panels whose filtered post list is empty", () => {
  assert.match(topicPanel, /if topic_posts and topic_posts\.size > 0[\s\S]*endif/);
});

test("later pagination pages omit page-one discovery modules", () => {
  assert.match(blogPage, /if paginator\.page == 1[\s\S]*endif[\s\S]*All posts/);
});
```

- [ ] **Step 2: Run the blog-index test and verify RED**

Run: `node --test tests/blog-index.test.mjs`

Expected: FAIL because the topic data, modular includes, summary/latest progression, and page-one branch do not exist.

- [ ] **Step 3: Implement the Liquid composition**

Create the six topic records in the spec order. On page 1, render a compact introduction, total-post/topic/latest-date summary, the newest post as featured, the next four as cards, and topic panels with build-time counts and up to two recent links. Render `paginator.posts` through archive rows on every page and keep the existing pagination URLs.

- [ ] **Step 4: Implement scoped blog styling**

Import `_blog.scss`; add responsive featured/recent grids, two-column topic panels, archive rows, restrained chips, title wrapping, description clamping only on compact cards, and mobile one-column behavior. Do not add image requirements.

- [ ] **Step 5: Run focused and full tests and verify GREEN**

Run: `node --test tests/blog-index.test.mjs`

Expected: PASS with nonzero counts for all six topics.

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 6: Commit Task 3**

```bash
git add tests/blog-index.test.mjs _data/blog_topics.yml _includes/blog _sass/_blog.scss _pages/blog.md _includes/pagination.liquid assets/css/main.scss
git commit -m "feat: redesign blog discovery page"
```

### Task 4: Long-Form Post Reading Experience

**Files:**
- Create: `tests/post-reading.test.mjs`
- Create: `_sass/_post.scss`
- Modify: `_layouts/default.liquid`
- Modify: `_layouts/post.liquid`
- Modify: `_includes/related_posts.liquid`
- Modify: `_sass/_base.scss`
- Modify: `assets/css/main.scss`
- Modify: `_posts/2026-06-07-predictive-safety-filter.md`

**Interfaces:**
- Consumes: global tokens from Task 2.
- Produces: `.post-reading`, `.post-meta-row`, `.post-taxonomy`, `.post-toc-mobile`, and `.post-related` layout hooks.
- Produces: Liquid reading-time calculation from `content | number_of_words`, clamped to a minimum of one minute.

- [ ] **Step 1: Write failing post-reading tests**

```js
test("renders reading time and TOCs only for opted-in posts", () => {
  assert.match(postLayout, /number_of_words/);
  assert.match(
    postLayout,
    /if page\.toc and page\.toc\.sidebar[\s\S]*post-toc-mobile[\s\S]*toc-sidebar[\s\S]*endif/,
  );
});

test("supports technical overflow and bounded desktop TOCs", () => {
  assert.match(postScss, /max-height:\s*calc\(100vh/);
  assert.match(postScss, /overflow-x:\s*auto/);
});

test("does not split LaTeX table cells on pipe characters", () => {
  assert.match(psfPost, /mu_\{i\\vert k\}/);
  assert.doesNotMatch(psfTableSection, /mu_\{i\|k\}/);
});
```

- [ ] **Step 2: Run the post-reading test and verify RED**

Run: `node --test tests/post-reading.test.mjs`

Expected: FAIL for missing reading time/mobile TOC/scoped styles and raw `|` characters in the Markdown table.

- [ ] **Step 3: Implement the post header and TOC structure**

Add responsive title/meta markup, estimated reading time, category-first taxonomy, and secondary tag chips. Add a `<details>` mobile TOC only when `page.toc.sidebar` is configured; retain the existing desktop `#toc-sidebar` hook and hide it below the large breakpoint. Replace utility-like related-post markup with `.post-related` semantic markup.

- [ ] **Step 4: Implement long-form typography and technical-content styling**

Import `_post.scss`; constrain the reading column to 720–780 px when no sidebar is present, use approximately 17 px/1.75 article type, set responsive headings, bound and scroll the desktop TOC, and add overflow handling for tables, equations, code, and figures. Remove only duplicated post rules from `_base.scss` that conflict with the new scoped partial.

- [ ] **Step 5: Correct the predictive-safety-filter table source**

Within the Markdown table only, replace LaTeX cell pipes such as `\mu_{i|k}` and `v_{i|k}` with `\vert`. Preserve every rendered word and mathematical meaning outside this syntax correction.

- [ ] **Step 6: Run focused and full tests and verify GREEN**

Run: `node --test tests/post-reading.test.mjs`

Expected: PASS.

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 7: Commit Task 4**

```bash
git add tests/post-reading.test.mjs _sass/_post.scss _sass/_base.scss assets/css/main.scss _layouts/default.liquid _layouts/post.liquid _includes/related_posts.liquid _posts/2026-06-07-predictive-safety-filter.md
git commit -m "style: refine technical post reading"
```

### Task 5: Data-Driven CV Refinement and Research Projects

**Files:**
- Create: `tests/cv-page.test.mjs`
- Modify: `_data/cv.yml`
- Modify: `_pages/cv.md`
- Modify: `_layouts/cv.liquid`
- Modify: `_includes/cv/time_table.liquid`
- Modify: `_sass/_cv.scss`

**Interfaces:**
- Consumes: global typography, surfaces, and spacing tokens from Task 2.
- Produces: CV entry anchors using slugified titles and `.cv-section`, `.cv-summary`, `.cv-section-nav`, `.cv-timeline`, and `.cv-download` hooks.
- Consumes existing `time_table` fields and `linkitems: [{ linkname: string, link: string }]` for safe funder links.

- [ ] **Step 1: Write failing CV tests**

```js
test("contains the supplied current research projects and funder links", () => {
  assert.match(cvData, /Local LLM-based AI agents for autonomous eVTOL operations/);
  assert.match(cvData, /https:\/\/www\.kari\.re\.kr\//);
  assert.match(cvData, /Cross-vehicle domain adaptation and generalization/);
  assert.match(cvData, /https:\/\/www\.hyundai\.com\//);
  assert.equal((cvData.match(/Data-efficient safe reinforcement learning from human corrections/g) ?? []).length, 1);
  assert.match(cvData, /https:\/\/viterbischool\.usc\.edu\/aier\//);
  assert.match(cvData, /https:\/\/www\.usc\.edu\//);
});

test("uses document sections and safe external actions", () => {
  assert.match(cvLayout, /cv-section-nav/);
  assert.match(cvLayout, /cv-download/);
  assert.match(timeTable, /rel="noopener noreferrer"/);
  assert.doesNotMatch(cvLayout, /class="card mt-3 p-3"/);
});
```

- [ ] **Step 2: Run the CV test and verify RED**

Run: `node --test tests/cv-page.test.mjs`

Expected: FAIL because the new projects, safe funder link attributes, text download action, and document-style hooks do not exist.

- [ ] **Step 3: Update CV data without removing existing projects**

Add the KARI and 2026–2027 Hyundai entries exactly as specified. Update the existing Airbus entry in place with two description bullets and Airbus Institute/USC `linkitems`; retain the Hanwha and earlier Hyundai entries. Keep years and funder wording from the user-supplied source.

- [ ] **Step 4: Refactor the CV layout and include semantics**

Move Basics into a compact `.cv-summary`; add a text-labeled PDF action and section navigation; render remaining entries as semantic `<section>` elements instead of shadow cards; keep the existing entry-type dispatch. Add safe `rel` attributes to external CV link buttons.

- [ ] **Step 5: Restyle the CV as a responsive document**

Replace high shadows and excessive card gaps with thin dividers, aligned date columns, responsive timeline rows, compact interest/skill groups, and readable project descriptions. Collapse to one column on mobile without shrinking text below the global base size.

- [ ] **Step 6: Run focused and full tests and verify GREEN**

Run: `node --test tests/cv-page.test.mjs`

Expected: PASS with exactly one updated Airbus entry.

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 7: Commit Task 5**

```bash
git add tests/cv-page.test.mjs _data/cv.yml _pages/cv.md _layouts/cv.liquid _includes/cv/time_table.liquid _sass/_cv.scss
git commit -m "feat: refine CV and add research projects"
```

### Task 6: Starter Cleanup, Portfolio Polish, and Integrated Verification

**Files:**
- Create: `tests/starter-cleanup.test.mjs`
- Modify: `_pages/about.md`
- Modify: `_includes/latest_posts.liquid`
- Modify: `_config.yml`
- Delete after reference audit: `_pages/about_einstein.md`
- Delete after reference audit: `_pages/profiles.md`
- Delete after reference audit: `_pages/repositories.md`
- Delete after reference audit: `_pages/teaching.md`
- Delete after reference audit: `_pages/dropdown.md`
- Delete after reference audit: `_pages/books.md`
- Delete after reference audit: `_pages/news.md`
- Delete after reference audit: `_books/the_godfather.md`
- Delete after reference audit: `_data/repositories.yml`
- Delete after reference audit: `assets/html/relativity.html`
- Delete after reference audit: `assets/pdf/example_pdf.pdf`
- Delete after reference audit when unreferenced: `assets/img/prof_pic.jpg`
- Delete after reference audit when unreferenced: `assets/img/prof_pic_color.png`
- Delete after reference audit when unreferenced: `assets/img/rhino.png`
- Delete after reference audit when unreferenced: `assets/img/template_error.png`

**Interfaces:**
- Consumes: global shell, blog includes, and canonical metadata from Tasks 1–5.
- Produces: a compact About-page blog CTA and a public source tree with no starter-profile routes or example CV links.

- [ ] **Step 1: Write failing cleanup and protected-content tests**

```js
test("removes public starter content and example links", () => {
  for (const path of starterPaths) assert.equal(exists(path), false);
  assert.doesNotMatch(publicSourceText(), /Albert Einstein|555 your office|example_pdf\.pdf|torvalds/);
});

test("retains real portfolio content", () => {
  for (const path of [
    "assets/pdf/cv.pdf",
    "assets/img/leepic.jpg",
    "_pages/publications.md",
    "_pages/projects.md",
  ]) assert.equal(exists(path), true);
});

test("links the portfolio home to the complete blog", () => {
  assert.match(latestPosts, /View all posts/);
  assert.match(latestPosts, /\/blog\//);
});
```

- [ ] **Step 2: Run the cleanup test and verify RED**

Run: `node --test tests/starter-cleanup.test.mjs`

Expected: FAIL because starter pages/assets remain and the About latest-posts block lacks a complete-blog CTA.

- [ ] **Step 3: Audit references and remove only confirmed starter files**

Run an `rg --fixed-strings` reference check for each candidate outside documentation and generated/vendor files. Delete the explicit starter pages, book, sample repository data, relativity HTML, and example PDF when only starter files reference them. Delete candidate sample images only when no active page, post, project, bibliography, include, or stylesheet references them. Remove deleted-page entries from `_config.yml` excludes.

- [ ] **Step 4: Polish the About-page handoff to Blog**

Keep the existing biography, interests, selected engineering projects, and contact facts. Tighten spacing through existing global classes and add an accessible “View all posts” link after the three latest posts; do not duplicate the blog discovery modules.

- [ ] **Step 5: Run the complete source test suite**

Run: `npm test`

Expected: all tests PASS with no skipped tests.

- [ ] **Step 6: Format only touched source files**

Run: `npx prettier --write package.json _config.yml _data/blog_topics.yml _data/cv.yml _data/socials.yml _pages/about.md _pages/blog.md _pages/cv.md _layouts/default.liquid _layouts/post.liquid _layouts/cv.liquid _includes/footer.liquid _includes/header.liquid _includes/latest_posts.liquid _includes/pagination.liquid _includes/related_posts.liquid _includes/blog/*.liquid _includes/cv/time_table.liquid _sass/_journal.scss _sass/_blog.scss _sass/_post.scss _sass/_cv.scss _sass/_layout.scss _sass/_variables.scss assets/css/main.scss tests/*.mjs tests/helpers/*.mjs`

Run: `npm test`

Expected: all tests still PASS.

- [ ] **Step 7: Build the production Jekyll site**

Run in a Ruby 3.3/Bundler environment: `bundle exec jekyll build`

Expected: exit 0, `_site/` produced, and no new Liquid, Sass, YAML, or pagination warnings. If the local host lacks Ruby/Bundler, request approval to provision the project toolchain rather than skipping this gate.

- [ ] **Step 8: Run browser QA on the local production build**

Serve `_site/` locally and inspect `/`, `/blog/`, `/blog/page/2/`, `/blog/2026/predictive-safety-filter/`, `/projects/`, and `/cv/` at representative desktop and mobile viewports. Check light/dark themes, keyboard focus, footer overlap, title wrapping, topic counts, TOCs, tables/equations, CV links, and horizontal overflow. Confirm the predictive-safety-filter page has no `bootstrap-table` console error.

- [ ] **Step 9: Inspect the final diff for article-content integrity**

Run: `git diff 84f937c -- _posts`

Expected: post changes are limited to front matter normalization/date correction and `\vert` substitutions inside the known Markdown table; no prose changes.

- [ ] **Step 10: Commit Task 6**

```bash
git add -A
git commit -m "chore: remove starter content and verify redesign"
```

- [ ] **Step 11: Run final verification**

Run: `npm test`

Expected: all tests PASS.

Run in the Ruby-capable environment: `bundle exec jekyll build`

Expected: exit 0 with a complete `_site/`.

Run: `git status --short`

Expected: no unexpected uncommitted files.
