# Research Blog Redesign Specification

## Purpose

Refine Hyeong-Jun Lee's existing Jekyll/al-folio website into a polished research portfolio and frequently updated technical blog. The root page remains the researcher-facing portfolio, while `/blog/` becomes the primary place to discover recent writing, topic collections, and the complete archive.

The redesign must make a growing body of posts easy to browse without requiring a thumbnail for every technical article. It must also improve long-form Korean and English reading, make the CV feel deliberate rather than template-generated, and remove visible remnants of the starter theme.

## Scope

### In scope

- Redesign the `/blog/` landing page and its post-discovery flow.
- Improve global typography, spacing, navigation, footer behavior, responsive layout, and dark mode consistency.
- Improve blog-post metadata, long-form typography, tables, equations, code blocks, and table-of-contents behavior.
- Restyle `/cv/` without changing the factual meaning of the existing entries.
- Add the supplied ongoing research projects to the existing CV Projects section and update the existing Airbus entry.
- Normalize blog category metadata and category display names.
- Correct presentation-only defects such as malformed Markdown tables, a stale date, broken sample links, and fixed elements that cover content.
- Remove or exclude verified, unreferenced starter-theme content and sample assets.
- Validate desktop and mobile layouts, light and dark modes, internal links, and browser console output.

### Out of scope

- Rewriting, summarizing, translating, or fact-checking blog article prose.
- Moving the portfolio home away from `/` or making `/blog/` the site root.
- Replacing Jekyll/al-folio, changing GitHub Pages hosting, or adding a CMS.
- Requiring featured images or thumbnails for every post.
- Publishing new factual claims not supplied by the user or already present in the repository.
- Redesigning the Publications or individual Project detail content beyond shared global styling.

## Content Integrity Rules

- Article bodies remain semantically unchanged.
- Technical source corrections are allowed only when they preserve rendered wording and meaning, such as replacing table-breaking `|` characters inside LaTeX with `\vert`.
- Front matter may be normalized for category spelling, dates, descriptions, and presentation flags.
- Existing URLs and permalinks remain stable.
- Uncertain personal or research facts must not be invented. Existing content is retained unless it is clearly starter content or the user supplied a replacement.

## Information Architecture

The primary navigation remains:

1. About (`/`)
2. Blog (`/blog/`)
3. Publications (`/publications/`)
4. Projects (`/projects/`)
5. CV (`/cv/`)

The root About page remains a compact research profile with research interests, selected engineering projects, contact details, and a short latest-posts list. It should direct repeat readers to Blog without duplicating the complete blog landing page.

The Projects page keeps its existing engineering project collection. Newly supplied research projects are added only to the CV Projects section, as requested.

## Blog Landing Page

### Page progression

The first blog page uses the following order:

1. **Compact introduction** — a restrained title and one-sentence description instead of the current oversized hero.
2. **Blog summary** — automatically calculated total post count, displayed topic count, and latest post date.
3. **Latest writing** — the newest post receives one prominent editorial card; the next four posts appear as compact cards or rows.
4. **Explore by topic** — responsive topic panels display the canonical topic name, post count, and up to two recent post titles.
5. **All posts** — the paginated chronological list provides title, date, description, primary category, and a restrained tag subset.
6. **Pagination** — clear previous/next controls plus numbered pages.

Later pagination pages omit the introduction, summary, featured area, and topic explorer so readers arrive directly at the chronological list.

### Canonical displayed topics

- Optimization
- Control
- Reinforcement Learning
- Deep Learning
- Linear Algebra
- Paper Review

Counts are derived at build time from post front matter. Existing space/hyphen variants are normalized so a topic has one archive URL and one count. Posts may remain multi-category; the UI shows a single primary category in compact cards and all categories on the post itself.

### Card behavior

- Cards are content-led and do not require images.
- Category color accents may distinguish topics but must remain subtle and accessible in both themes.
- Titles may wrap naturally and must not be truncated mid-word.
- Descriptions are clamped only on compact cards; the complete description remains accessible on list rows and post pages.
- The layout uses two columns where space allows and one column on narrow screens.

## Blog Post Reading Experience

### Typography

- Use `Inter` for Latin UI text and `Noto Sans KR` for Korean-capable body text, with system-font fallbacks.
- Target a reading column of approximately 720–780 px.
- Use a base article size around 17 px with a line height near 1.75; reduce slightly on narrow screens.
- Establish consistent heading scale, section spacing, paragraph spacing, list indentation, and link treatment.
- Use the existing monospace stack for code unless a bundled option is already available.

### Header and metadata

- Long post titles scale responsively instead of dominating the viewport.
- Date, estimated reading time, categories, and tags form a clear metadata block.
- Tags remain secondary to categories and use low-contrast chips rather than dense blue badges.

### Table of contents

- Desktop sidebar TOCs remain sticky but receive a viewport-relative maximum height and their own scroll area.
- Active sections remain visually clear without increasing font size.
- Mobile uses a compact collapsible table of contents near the post header instead of hiding navigation completely.

### Technical content

- Tables scroll horizontally on narrow screens and must not trigger `bootstrap-table` parsing errors.
- Display equations scroll without clipping; inline equations keep normal line flow.
- Code blocks preserve copy controls and gain consistent spacing and overflow behavior.
- Figures, captions, and image zoom remain supported.

## CV Page

### Layout

- Replace the repeated high-shadow card stack with a flatter document-style layout.
- Use a compact header containing the CV title, a text-labeled PDF download action, and the existing basic details.
- Add an in-page section navigation for Education, Honors and Awards, Research Interests, Skills, and Projects.
- Present Education, Awards, and Projects with aligned date columns or a responsive timeline.
- Present Research Interests and Skills as compact grouped lists instead of large empty cards.
- Preserve all existing factual entries unless superseded by user-supplied text.

### Research project updates

Add the following entries to the existing CV Projects section. Keep other current entries. Update the existing Airbus entry rather than duplicating it.

#### Local LLM-based AI agents for autonomous eVTOL operations

- Funder: [Korea Aerospace Research Institute](https://www.kari.re.kr/)
- Years: 2026–2030
- Local LLM-based Agent-Skill architecture with closed-network RAG for autonomous decision-making across eVTOL traffic management, flight operations, vertiport operations, and air traffic control.
- Intervention learning within human-in-the-loop coordination and digital integrated-test validation for conflict resolution, mission replanning, resource allocation, and emergency response.

#### Cross-vehicle domain adaptation and generalization for AI-based road surface classification

- Funder: [Hyundai Motor Company](https://www.hyundai.com/)
- Years: 2026–2027
- Domain-invariant feature learning from wheel-speed and IMU signals using adversarial domain alignment, supervised contrastive learning, and weight averaging for robust classification across unseen vehicle domains.
- Few-shot adaptation and vehicle-metadata-based feature modulation for rapid transfer to new vehicle types, with knowledge distillation and in-vehicle validation for embedded deployment.

#### Data-efficient safe reinforcement learning from human corrections

- Funders: [Airbus Institute for Engineering Research](https://viterbischool.usc.edu/aier/) and [USC](https://www.usc.edu/)
- Years: 2025–2027
- Reinforcement learning enhanced with computational modeling of human interventions.
- Integration of human correction models to improve the safety and data efficiency of aerospace systems.

External funder links open safely in a new tab with `rel="noopener noreferrer"`.

## Global Visual System

### Direction

Use a calm editorial research-journal aesthetic: strong hierarchy, restrained blue accents, thin borders, low or no shadows, and generous but not wasteful spacing. The site should feel authored and technical rather than like a generic academic template.

### Layout and spacing

- Retain a compact fixed navbar, but improve active states and mobile spacing.
- Increase the general content maximum width for index and CV pages while keeping article text narrow.
- Standardize section spacing and card padding through reusable CSS variables.
- Make the footer part of normal document flow so it never covers content.

### Color and themes

- Preserve the existing light/dark toggle.
- Replace saturated default-blue usage with a restrained research-blue accent and accessible hover/focus colors.
- Ensure borders, cards, code, tags, and muted text have equivalent contrast in dark mode.
- Avoid using color as the sole indicator for categories or active navigation.

### Motion and interaction

- Limit motion to short hover/focus transitions and respect `prefers-reduced-motion`.
- Preserve keyboard search and visible keyboard focus.
- Do not add decorative animations or interactions that make technical reading slower.

## Repository and Metadata Cleanup

The implementation audits references before deleting files. Only content positively identified as unreferenced starter material is removed. Git history remains the recovery path.

The cleanup includes:

- Pointing the social CV icon to `assets/pdf/cv.pdf` instead of `example_pdf.pdf`.
- Replacing the starter contact note with relevant copy or omitting it.
- Clearing deprecated sample Disqus configuration when unused.
- Removing or excluding unreferenced Einstein biography/profile pages, placeholder teaching/repository pages, sample PDFs, and sample assets.
- Retaining theme infrastructure required by active layouts and plugins.
- Hiding or retaining questionable content rather than deleting it when ownership is unclear.
- Correcting the known post date mismatch and category naming variants in front matter without editing article prose.

## Implementation Boundaries

- Reuse Liquid, SCSS, Bootstrap utilities, and existing Jekyll plugins.
- Do not add a JavaScript framework or CMS.
- Prefer new focused includes for blog cards/topic panels instead of expanding `_pages/blog.md` into a monolith.
- Keep blog-specific styles scoped under dedicated classes so CV and publication tables do not regress.
- Keep CV rendering data-driven from `_data/cv.yml`.
- Avoid new runtime dependencies unless the existing toolchain cannot express a required behavior.

## Validation

The implementation is complete only when all of the following pass:

- Jekyll production build completes without warnings introduced by the change.
- Automated checks verify the blog summary, canonical topic counts, featured/latest sections, archive pagination, CV project entries, sample-link removal, and technical table correction.
- Existing post permalinks and main navigation URLs remain unchanged.
- Desktop and mobile browser checks cover About, Blog page 1, Blog page 2, a long post with TOC/tables/equations, Projects, and CV.
- Light and dark modes are inspected at representative desktop and mobile widths.
- No fixed footer overlaps content.
- Long titles, category panels, tables, equations, and CV project descriptions remain readable without horizontal page overflow.
- Browser console checks show no `bootstrap-table` error on the predictive safety filter article.
- Keyboard focus and reduced-motion behavior remain usable.

## Success Criteria

- A first-time visitor can identify the blog's subject and open a recent post without scrolling through a large hero.
- A repeat visitor can discover older posts by topic, post count, date, or archive without search.
- Adding a normal post with canonical front matter automatically updates latest writing, topic counts, topic panels, and the archive.
- Long Korean/English technical posts remain comfortable to read on desktop and mobile.
- The CV communicates hierarchy and current research projects without looking like a stack of template cards.
- No visible starter-theme biography, example CV link, placeholder copy, or sample content remains in the public experience.
