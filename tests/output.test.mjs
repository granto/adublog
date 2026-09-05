import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { load } from 'cheerio';
const root = 'public';
const read = p => readFileSync(`${root}/${p}`, 'utf8');
const inventory = JSON.parse(readFileSync('docs/legacy-urls.json'));
function files(dir) { return readdirSync(dir).flatMap(name => { const p = `${dir}/${name}`; return statSync(p).isDirectory() ? files(p) : [p]; }); }
test('every original article URL and original publication date survives', () => {
  assert.equal(inventory.count, 8); assert.equal(new Set(inventory.posts.map(p=>p.url)).size,8);
  for (const p of inventory.posts) { const html = read(`${p.url.slice(1)}index.html`); assert.match(html, new RegExp(p.date.replaceAll('.', '\\.'))); }
});
test('relaunch draft excluded from every public artifact, even its title', () => {
  // The complete relaunch is local-only, never a prerequisite for a public clone.
  assert.ok(existsSync('tests/fixtures/unpublished.md'));
  assert.ok(!existsSync(`${root}/blog/aduroi-relaunch-clearer-adu-decision`));
  for (const p of files(root).filter(p=>/\.(html|xml|json|txt|js)$/.test(p))) {
    assert.doesNotMatch(readFileSync(p,'utf8'), /aduroi-relaunch-clearer-adu-decision|ADUroi is being rebuilt around the decision/);
  }
});
test('three new evergreen articles exist and do not announce staged features', () => {
  for (const slug of ['adu-cash-flow-with-and-without-adu','adu-construction-cost-estimate-range','adu-evaluation-buyer-homeowner-investor']) {
    const $ = load(read(`blog/${slug}/index.html`));
    assert.ok($('article').text().split(/\s+/).length > 450);
    assert.doesNotMatch($('article').text(), /ADUroi (now|can create)|Saved revisions let|Power-user entry exposes/);
  }
});
test('all generated pages have unique metadata, accessible structure and working internal links', () => {
  const titles = new Set();
  for (const file of files(root).filter(p=>p.endsWith('.html'))) {
    const $=load(readFileSync(file,'utf8')); const title=$('title').text();
    assert.ok(title); assert.ok(!titles.has(title), `duplicate title ${file}`); titles.add(title);
    assert.equal($('h1').length,1,file); assert.equal($('main#main').length,1);
    assert.equal($('link[rel=canonical]').length,1);
    const canonical=$('link[rel=canonical]').attr('href');
    const route=file==='public/index.html'?'/':file.slice('public'.length).replace(/index\.html$/,'');
    assert.equal(canonical,`https://blog.aduroi.com${route}`,file);
    assert.equal($('meta[property="og:url"]').attr('content'),canonical);
    if (file.startsWith('public/blog/') && file !== 'public/blog/index.html') {
      assert.equal($('article.reading').length,1,`article required: ${file}`);
      const schema=JSON.parse($('script[type="application/ld+json"]').text());
      assert.equal(schema['@type'],'Article'); assert.equal(schema.mainEntityOfPage,canonical);
      assert.equal(schema.headline,$('h1').text()); assert.ok(schema.datePublished); assert.ok(schema.dateModified);
      assert.equal($('time').first().attr('datetime'),schema.datePublished);
      assert.equal($('.related .card').length,2);
      assert.equal(new Set($('.related a').map((_,a)=>$(a).attr('href')).get()).size,2);
      assert.ok($('article.reading .callout a[href="https://aduroi.com/"]').length>=1);
    }
    for (const key of ['description','twitter:card']) assert.ok($(`meta[name="${key}"]`).attr('content'));
    for (const key of ['og:title','og:description','og:url','og:image']) assert.ok($(`meta[property="${key}"]`).attr('content'));
    assert.equal($('html').attr('lang'),'en'); assert.ok($('a[href="#main"]').length);
    assert.ok($('a[href="https://aduroi.com/"]').length); assert.ok($('a[href="https://app.aduroi.com/"]').length);
    let level=0; $('h1,h2,h3,h4,h5,h6').each((_,el)=>{const next=Number(el.tagName.slice(1)); assert.ok($(el).text().trim()); assert.ok(next<=level+1,`heading skip ${file}`);level=next;});
    $('a[href],link[rel=stylesheet],img[src]').each((_,el)=>{const href=$(el).attr('href')||$(el).attr('src'); if(href.startsWith('/')&&!href.startsWith('//')) {const dest=href.split('#')[0]; assert.ok(existsSync(`${root}${dest.endsWith('/')?dest+'index.html':dest}`),`${file}: broken ${href}`);} if(href.startsWith('#')) assert.ok($(href).length,`missing anchor ${href}`);});
    $('img').each((_,el)=>assert.ok($(el).attr('alt')!==undefined));
    $('script[type="application/ld+json"]').each((_,el)=>{const data=JSON.parse($(el).text());assert.equal(data['@context'],'https://schema.org');});
    assert.equal($('script[src]').length,0,'no analytics or required client JS');
  }
});
test('sitemap contains indexable pages only and exact current article count', () => {
  const $=load(read('sitemap.xml'),{xmlMode:true}); const locs=$('loc').map((_,el)=>$(el).text()).get();
  assert.equal(locs.length,new Set(locs).size);
  assert.equal(locs.length,9); // home + 8 current articles; 3 historical articles remain accessible but noindex
  for(const url of locs){const page=load(read(`${new URL(url).pathname.slice(1)}index.html`));assert.doesNotMatch(page('meta[name=robots]').attr('content')||'',/noindex/);}
  for(const slug of ['housable-vs-maxable','california-adu-housing-laws-2021','ca-governor-signs-housing-bills-8-9-10']) {const page=load(read(`blog/${slug}/index.html`));assert.match(page('meta[name=robots]').attr('content'),/noindex/);assert.match(page('article').text(),/Historical archive/);}
  assert.match(read('robots.txt'),/Sitemap: https:\/\/blog.aduroi.com\/sitemap.xml/);
});
