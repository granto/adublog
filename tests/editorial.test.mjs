import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('financing page no longer presents mortgage products as unavailable', () => {
  const content = readFileSync('content/blog/how-to-finance-an-adu.md', 'utf8');
  assert.doesNotMatch(content, /Mortgage products aren't available|there are no mortgage specific products/);
  assert.match(content, /singlefamily\.fanniemae\.com/);
});
