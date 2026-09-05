import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync, existsSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { load } from 'cheerio';
const source=process.cwd();
function sandbox(run) {
  const dir=mkdtempSync(`${tmpdir()}/aduroi-blog-test-`);
  try {
    cpSync('content',`${dir}/content`,{recursive:true}); cpSync('static',`${dir}/static`,{recursive:true});
    symlinkSync(resolve('node_modules'),`${dir}/node_modules`,'dir');
    run(dir);
  } finally { rmSync(dir,{recursive:true,force:true}); }
}
function build(dir,context='production') {
  const result=spawnSync(process.execPath,[`${source}/scripts/build.mjs`],{cwd:dir,env:{...process.env,CONTEXT:context,BLOG_PREVIEW:'0'},encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
}
function allText(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?allText(`${dir}/${e.name}`):/\.(html|xml|json|txt|js)$/.test(e.name)?[readFileSync(`${dir}/${e.name}`,'utf8')]:[]).join('\n');}
test('draft, absent status, misspelled status, and private content fail closed; stale output is cleaned',()=>sandbox(dir=>{
  const fixture=readFileSync('tests/fixtures/unpublished.md','utf8');
  for(const [name,content] of [['draft',fixture],['missing',fixture.replace('status: draft','')],['typo',fixture.replace('status: draft','status: publised')]]) writeFileSync(`${dir}/content/blog/${name}.md`,content);
  mkdirSync(`${dir}/content/drafts`);writeFileSync(`${dir}/content/drafts/private.md`,fixture);
  mkdirSync(`${dir}/public/blog/stale-draft`,{recursive:true});writeFileSync(`${dir}/public/blog/stale-draft/index.html`,'DRAFT_CANARY_DO_NOT_PUBLISH');
  build(dir);
  assert.doesNotMatch(allText(`${dir}/public`),/DRAFT_CANARY_DO_NOT_PUBLISH|Unpublished regression canary/);
  for(const name of ['draft','missing','typo','stale-draft']) assert.ok(!existsSync(`${dir}/public/blog/${name}`));
}));
test('all non-production contexts emit noindex metadata, disallow robots, and X-Robots-Tag',()=>sandbox(dir=>{
  for(const context of ['deploy-preview','branch-deploy']) {
    build(dir,context);
    assert.match(readFileSync(`${dir}/public/robots.txt`,'utf8'),/Disallow: \/\n/);
    assert.match(readFileSync(`${dir}/public/_headers`,'utf8'),/X-Robots-Tag: noindex, nofollow, noarchive/);
    const pages=readdirSync(`${dir}/public`,{recursive:true}).filter(p=>p.endsWith('.html'));
    for(const p of pages) assert.match(load(readFileSync(`${dir}/public/${p}`,'utf8'))('meta[name=robots]').attr('content'),/noindex/);
  }
  build(dir,'production');
  assert.doesNotMatch(readFileSync(`${dir}/public/_headers`,'utf8'),/X-Robots-Tag/);
  assert.equal(load(readFileSync(`${dir}/public/index.html`,'utf8'))('meta[name=robots]').attr('content'),'index, follow');
}));
test('raw HTML and dangerous markdown links do not become executable content',()=>sandbox(dir=>{
  const file=`${dir}/content/blog/why-build-an-adu.md`;
  writeFileSync(file,readFileSync(file,'utf8')+'\n<script>alert("canary")</script>\n\n[bad](javascript:alert(1))\n');
  build(dir); const $=load(readFileSync(`${dir}/public/blog/why-build-an-adu/index.html`,'utf8'));
  assert.equal($('script:not([type="application/ld+json"])').length,0);
  assert.equal($('a[href^="javascript:"]').length,0);
}));
