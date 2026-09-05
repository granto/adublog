# Editorial review — September 4, 2026

## Scope ledger

Local-only blog refresh; no application code, pricing claims, production entitlements, analytics, commit, push, or deployment. Preserve all eight legacy article URLs and original timestamps. Produce three public-ready evergreen guides and one local-only gated relaunch draft. Use a shared cream/off-white/forest/mint shell, local Inter, readable article templates, navigation to `aduroi.com` and `app.aduroi.com`, and generated crawl metadata.

## Legacy disposition

| Original route | Disposition |
| --- | --- |
| `/blog/14-expert-tips-on-adus/` | Retains the Redfin contribution link and original date; clarifies attribution and avoids presenting older external advice as current law. |
| `/blog/ca-governor-signs-housing-bills-8-9-10/` | Historical archive, noindex; retired compressed eligibility claims and diagram. Links original announcement as history and current HCD starting point. |
| `/blog/california-adu-housing-laws-2021/` | Historical archive, noindex; removed old approval/financing summaries, retained publication date, points to current HCD guidance. |
| `/blog/housable-vs-maxable/` | Historical archive, noindex; current service comparison unverified, old chart retired. Provides a written-scope checklist without ranking vendors. |
| `/blog/how-much-does-an-adu-rent-for/` | Rewritten as a repeatable comp method; removed automatic premium language, historical individual rents, and unsourced size-rule claims. |
| `/blog/how-to-finance-an-adu/` | Replaced stale mortgage-availability statement with qualified Fannie Mae/CFPB guidance and a lender-question checklist. |
| `/blog/what-is-buy-and-hold-real-estate-investing/` | Removed universal return, permit, and tax promises; distinguishes operating cash flow, sale value, reserves, and tax review. |
| `/blog/why-build-an-adu/` | Preserved source-reported founder experience; removed old unavailable-financing/legal claims and universal contingency recommendation. Original timestamp retained. |

The live homepage's article-link set was fetched and mechanically matched to all eight JSON inventory paths. Original texts remain in Git history at `5ff6fbbfacd53071f3fd511f85bf39875e78091e`; they are not silently republished as current guidance.

## New evergreen content

- `/blog/adu-cash-flow-with-and-without-adu/`: rent, vacancy, operating costs, funding, timing, tax assumptions, and the With ADU / Without ADU comparison.
- `/blog/adu-construction-cost-estimate-range/`: scope, allowances, exclusions, contingency, low/likely/high sensitivity, and questions for builders. No market-price numbers or live automated-estimator claims.
- `/blog/adu-evaluation-buyer-homeowner-investor/`: audience-specific baseline, capital requirement, timing, return horizon, and a decision brief. No claim that a staged goal picker or saved revisions are live.

The complete relaunch is intentionally local-only in ignored `.hermes/editorial/`, excluded from both tracked source and every build input. Do not publish before the production feature/release gates pass.

## First-party sources fetched and used

Fetched September 4, 2026. Review is limited to the assertions listed; this is not a legal opinion or comprehensive underwriting/tax review.

- [Fannie Mae ADUs](https://singlefamily.fanniemae.com/originating-underwriting/mortgage-products/accessory-dwelling-units): explicitly describes purchase, renovation, and ADU addition financing under Selling Guide products; identifies renovation and construction-to-permanent options. Eligibility and lender participation are not promised.
- [CFPB home-equity loan vs HELOC](https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-home-equity-loan-and-a-home-equity-line-of-credit-heloc-en-247/): lump-sum loan versus revolving draws, possible fixed/adjustable loan rates, usual adjustable HELOC rates, and additional mortgage obligations.
- [California HCD ADU program](https://www.hcd.ca.gov/building-standards/adu): page links the handbook as updated March 2026 and notes 2024 statutory renumbering. Direct handbook extraction failed; no new parcel eligibility or detailed legal rule was inferred from an unread handbook. Older law pages are archived instead.
- [HUD Fair Market Rents](https://www.huduser.gov/portal/datasets/fmr.html): area-level estimates, housing-program use, 40th-percentile gross rent basis; not a property-specific rent quote.
- [IRS Publication 527](https://www.irs.gov/publications/p527): residential rental income, expenses, depreciation, and personal-use topics. Articles refer readers to the publication/adviser rather than promising deductions.

## Explicit release limits

- Header/CTA links are standard product and app-root navigation, not a claim that staged workflows, pricing, or entitlements are available.
- No unpublished product screenshots, customer records, street addresses, financial inputs, or invasive analytics are included.
- Local automated checks do not establish production response headers or browser rendering. Hosted preview, mobile/keyboard review, and release approval remain the authorized release owner's responsibility.
- Gatsby 2 was replaced rather than retaining an obsolete native-image dependency stack. Netlify build command and output are declared in the repository. The retired CMS and client-side search are not part of the refreshed static site.
