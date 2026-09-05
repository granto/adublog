# ADUroi blog

Static, server-rendered HTML for `blog.aduroi.com`. Node 22+, npm, Markdown content, and local Inter font files. No browser JavaScript is required to read or navigate the site; no analytics is installed.

## Build and verify

```sh
npm ci --ignore-scripts
npm run verify
npm run serve
```

`public/` is the complete deployable output. `netlify.toml` explicitly overrides the former provider-side `gatsby build` command with `npm run build` and keeps `public` as the publish directory. No provider configuration changes are required to build this source, but an authorized reviewer must verify the preview before any production release.

For a non-indexable preview artifact:

```sh
CONTEXT=deploy-preview npm run build
node tests/preview-output.mjs
```

All non-production Netlify contexts (or `BLOG_PREVIEW=1`) emit page-level `noindex`, `robots.txt` disallowing crawling, and a Netlify `_headers` rule with `X-Robots-Tag: noindex, nofollow, noarchive`. Canonicals still point to the intended production URL. These measures are crawler directives, not access control; do not put confidential material in `public/`.

`npm test` expects a production-mode build. It also independently builds temporary production/preview sites and exercises draft filtering, stale-output cleanup, and unsafe Markdown handling. `npm run verify` rebuilds production output; run the preview build last before uploading a draft artifact.

## Content and publication rules

- Markdown articles live in `content/blog/`. Filenames determine `/blog/<filename>/`, preserving the former Gatsby paths. The old free-text `path` field never determined article URLs.
- A file must explicitly have `status: published` or `status: archived` to generate an article. Missing, misspelled, and draft statuses are excluded. Other content directories are never copied into the build.
- Required public metadata: `title`, `description`, `date` (original publication timestamp), `reviewed` (actual editorial review date), `author`, and `topic`.
- `archived` articles remain reachable at their original URLs with a visible notice and `noindex`. They are absent from sitemap/RSS. Set `archiveReason` to explain why.
- `featured: true` places a published guide in the starting-point cards. `cta` provides an article-specific next step. Related articles prioritize the same topic and never link to drafts.
- Keep original publication dates. A review date is not a new publication date. Verify time-sensitive claims against the cited first-party source before changing `reviewed`.
- Complete confidential launch copy belongs outside public source control. `.hermes/editorial/` is ignored and never read by the builder. Never move it into `content/blog/` until production facts and release approval are verified. The checked-in draft fixture contains no confidential copy.

The release-day draft remains gated on production behavior, pricing, entitlements, reports, branding, privacy disclosures, and cost-estimate behavior. The three public-ready evergreen guides deliberately teach the method without claiming those features are live.

## Migration scope

The obsolete Gatsby 2/MDX/Netlify CMS client stack has been replaced by a small deterministic Markdown-to-HTML build. The old CMS admin/search UI is not shipped. Edit Markdown through reviewed source changes. Original article assets remain in the source repository for history but are not copied to the public output; outdated comparison charts, screenshots, and remote article images are not served by this build.

`sw.js` retires the old Gatsby offline service worker for returning visitors; the refreshed pages do not register a replacement. Do not restore the old Google Analytics integration or service worker.

## Acceptance evidence

See `docs/legacy-urls.json` for the eight-route inventory tied to the original commit, and `docs/editorial-review.md` for the article/source disposition. Tests inspect generated HTML, sitemap, RSS, local links, dates, schema, headings, crawl controls, and publication boundaries. Browser/device visual QA and hosted-preview response headers remain release-review tasks; they cannot be inferred from a successful local build.
