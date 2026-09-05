import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
const pages=readdirSync('public',{recursive:true}).filter(p=>p.endsWith('.html'));
assert.ok(pages.length>0);
for(const path of pages) assert.match(load(readFileSync(`public/${path}`,'utf8'))('meta[name=robots]').attr('content'),/noindex/);
assert.match(readFileSync('public/robots.txt','utf8'),/^User-agent: \*\nDisallow: \/\n$/);
assert.match(readFileSync('public/_headers','utf8'),/X-Robots-Tag: noindex, nofollow, noarchive/);
console.log(`Preview crawl guards verified on ${pages.length} HTML pages, robots.txt, and _headers.`);
