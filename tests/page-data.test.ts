import test from 'node:test';
import assert from 'node:assert/strict';
import {flatten,overlay} from '../lib/page-data';
import {aboutDefaults} from '../content/pages/about';
import {safeUrl} from '../lib/cms-core';

const clean=(v:string,image:boolean)=>safeUrl(v,image);

test('about fields have stable, named keys and correct types',()=>{
 const f=flatten(aboutDefaults);const byKey=new Map(f.map(x=>[x.key,x]));
 assert.equal(byKey.get('values.items.0.title')?.value,'Academic Excellence');
 assert.equal(byKey.get('masthead.image')?.type,'image');
 assert.equal(byKey.get('departments.items.0.href')?.type,'url');
 assert.equal(byKey.get('rules.downloadHref')?.type,'url');
 assert.equal(new Set(f.map(x=>x.key)).size,f.length,'keys must be unique');
});
test('structural and design values are not editable',()=>{
 const keys=flatten(aboutDefaults).map(f=>f.key);
 assert.ok(!keys.some(k=>/(^|\.)(id|icon|bg|fg|border)$/.test(k)));
});
test('about is registered as an editable page with typed fields',async()=>{
 const {fieldsFor,catalogue}=await import('../lib/cms-core');
 assert.ok(fieldsFor('/about').length>100);
 assert.equal(catalogue().filter(p=>p.key==='/about').length,1);
});
test('overrides apply by name and untouched fields keep defaults',()=>{
 const out=overlay(aboutDefaults,{'values.items.1.title':'Honesty','masthead.accent':'SOC!'},clean);
 assert.equal(out.values.items[1].title,'Honesty');
 assert.equal(out.masthead.accent,'SOC!');
 assert.equal(out.values.items[0].title,'Academic Excellence');
});
test('unsafe links and images are dropped, locked values ignored',()=>{
 const out=overlay(aboutDefaults,{'departments.items.0.href':'javascript:alert(1)','masthead.image':'//evil.test/x.png','tabs.0.id':'hacked','dresscode.items.0.swatches.0.bg':'red'},clean);
 assert.equal(out.departments.items[0].href,'');
 assert.equal(out.masthead.image,'');
 assert.equal(out.tabs[0].id,'overview');
 assert.equal(out.dresscode.items[0].swatches[0].bg,'#111');
});

test('every component page is registered with unique, typed, editable fields',async()=>{
 const {pageRegistry}=await import('../content/pages/registry');
 const keys=Object.keys(pageRegistry);
 for(const k of ['/','/about','/academics','/communities','/contact','/feedback','/news-events','/resources/rules','/news-events/a1','/news-events/ev1','/news-events/reference-4','/stories/bug-in-the-brief','@header','@footer','@navigation'])assert.ok(keys.includes(k),k+' registered');
 for(const [k,p] of Object.entries(pageRegistry)){
  assert.ok(p.leaves.length>0,k+' has fields');
  assert.equal(new Set(p.leaves.map(l=>l.key)).size,p.leaves.length,k+' keys unique');
  assert.ok(!p.leaves.some(l=>l.key.endsWith('~')),k+' exposes no structural keys');
 }
});
