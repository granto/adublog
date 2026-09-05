import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { load } from 'cheerio';

test('founder story is Grant Olsen in first person without collective founder language', () => {
  const content = readFileSync('content/blog/why-build-an-adu.md', 'utf8');
  assert.match(content, /author: "Grant Olsen"/);
  assert.match(content, /In 2018, I decided to buy my first investment property/);
  assert.doesNotMatch(content, /\b(we|our|us|wife|founders)\b/i);
  for (const fact of ['Southern California', 'six months', 'two-bedroom, one-bath', 'three months', 'within weeks', 'not a forecast', 'subject to eligibility']) assert.ok(content.includes(fact), fact);
  const $ = load(readFileSync('public/blog/why-build-an-adu/index.html', 'utf8'));
  assert.match($('.metadata').text(), /By Grant Olsen/);
  const schema = JSON.parse($('script[type="application/ld+json"]').text());
  assert.deepEqual(schema.author, {'@type':'Person',name:'Grant Olsen'});
});

test('founder cross-link attributes the experience to Grant, not a group', () => {
  const content = readFileSync('content/blog/14-expert-tips-on-adus.md', 'utf8');
  assert.match(content, /Grant.*founder story/);
  assert.doesNotMatch(content, /led us to build|our founder story/i);
  for (const file of readdirSync('content/blog')) assert.doesNotMatch(readFileSync(`content/blog/${file}`, 'utf8'), /\b(founders|wife)\b/i);
});

test('all public article bylines identify Grant rather than a team', () => {
  for (const file of readdirSync('content/blog').filter(f=>f.endsWith('.md'))) {
    const $=load(readFileSync(`public/blog/${file.slice(0,-3)}/index.html`, 'utf8'));
    assert.match($('.metadata').text(), /By Grant Olsen/, file);
    const schema=JSON.parse($('script[type="application/ld+json"]').text());
    assert.deepEqual(schema.author, {'@type':'Person',name:'Grant Olsen'},file);
  }
});

test('public article CTAs are launch-ready and keep the planning caveat', () => {
  const $ = load(readFileSync('public/blog/why-build-an-adu/index.html', 'utf8'));
  assert.equal($('.callout a').first().text(), 'Explore ADUroi');
  assert.doesNotMatch($.text(), /current app|current availability|do not announce new app features|forthcoming|not live yet/i);
  assert.match($('.callout').text(), /Results depend on your assumptions/);
});
test('financing page no longer presents mortgage products as unavailable', () => {
  const content = readFileSync('content/blog/how-to-finance-an-adu.md', 'utf8');
  assert.doesNotMatch(content, /Mortgage products aren't available|there are no mortgage specific products/);
  assert.match(content, /singlefamily\.fanniemae\.com/);
});
