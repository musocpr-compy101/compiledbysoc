# Page architecture

All public pages are React server components.

- `app/<route>/page.tsx` loads the page copy and renders `<PageFrame>` (design stylesheet, skip link, shared header, footer, dialogs) around a view component.
- `components/pages/*View.tsx` is the page layout: a short exported view composed of named section components (e.g. `StudentDesk`, `CampusStories`) and named item components for repeated cards/rows (e.g. `SocialCard`, `CourseTableTrItem`), all formatted with Prettier (`npm run format`). Text, links and images are read with `t("field.key")`; repeated cards/rows are `.map()` loops over indexed keys such as `tab-values.val-card.2.val-title.text`.
- `content/pages/*.ts` holds default copy per page. Keys ending in `~` are structural (ids, data attributes, inline style values): never editable, never overridden.
- `content/pages/registry.ts` lists every page and its editable fields for `/admin/content`. `lib/page-copy.ts` merges saved edits (links/images validated by `safeUrl`) over the defaults.
- One template each serves the 9 news articles (`ArticleView`), 4 events (`EventView`) and 8 reference pages (`ReferenceView`) through `app/news-events/[slug]`; the 4 journal stories use `app/stories/[slug]`.
- `/about` is hand-structured with typed data (`content/pages/about.ts`, `components/about/*`) and is a good model for further tidying.

Adding or changing a page: edit the view and defaults, register new pages in `registry.ts`, add a route. Edit keys are names, not DOM positions, so redesigning a component does not move saved edits.

Old edits: content saved against the previous positional keys (e.g. `r.1.3.0:text`) does not carry over. Copy anything important into the new fields before deploying over a live database.
