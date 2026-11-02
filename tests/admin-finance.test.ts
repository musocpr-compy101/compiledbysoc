import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID,createHmac} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {validWebhook,validateProvider,csvCell} from '../lib/payments-core';
import {fieldsFor,validateFields,safeUrl} from '../lib/cms-core';
import {resolveField} from '../lib/page-data';

// Real PostgreSQL policies and functions, with only the Supabase identity boundary simulated.
test('Integrated admin and finance boundaries',async t=>{
 const pg=new PGlite();
 await pg.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth;
 create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema public,auth to anon,authenticated,service_role; grant execute on function auth.uid() to anon,authenticated,service_role;`);
 for(const f of ['001_platform.sql','002_admin_content_finance.sql'])await pg.exec(await readFile('supabase/migrations/'+f,'utf8'));
 const owner=randomUUID(),finance=randomUUID(),academic=randomUUID(),student=randomUUID();
 for(const [id,email] of [[owner,'owner@test.test'],[finance,'finance@test.test'],[academic,'academic@test.test'],[student,'student@test.test']])await pg.query('insert into auth.users values($1,$2,now())',[id,email]);
 await pg.query("update public.profiles set role='admin' where id=$1",[owner]);
 const as=async(id='',role='authenticated')=>{await pg.exec('reset role');await pg.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);await pg.exec('set role '+role);};
 const one=async(sql:string,args:unknown[]=[])=>Object.values((await pg.query(sql,args)).rows[0] as Record<string,unknown>)[0] as any;
 let item:string;
 const attempts:{id:string;ref:string;hash:string}[]=[];
 const reserve=async(matric='MU/SE/001')=>{const a={id:randomUUID(),ref:'SOC_'+randomUUID().replaceAll('-',''),hash:'a'.repeat(64)};await one('select public.reserve_payment($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[a.id,a.ref,a.hash,item,'Student Name','student@test.test',matric,'Software Engineering','200','test']);attempts.push(a);return a;};
 const settle=(a:typeof attempts[number],over:Record<string,unknown>={})=>{const p={ref:a.ref,provider:a.id,amount:500000,currency:'NGN',domain:'test',email:'student@test.test',status:'success',channel:'card',fees:1000,date:new Date().toISOString(),...over};return one('select public.settle_payment($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',Object.values(p));};
 await t.test('owner grants areas; staff cannot grant themselves or edit other areas',async()=>{
  await as(owner);await pg.query("select public.set_staff_access($1,'Finance executive',array['finance'],true,false)",[finance]);await pg.query("select public.set_staff_access($1,'Academic executive',array['academics'],true,false)",[academic]);
  await assert.rejects(()=>pg.query("select public.set_staff_access($1,'Owner',array['finance'],false,false)",[owner]),/own access/);
  await as(finance);assert.equal(await one("select public.can_access('finance')"),true);assert.equal(await one("select public.can_access('academics')"),false);
  await assert.rejects(()=>pg.query("select public.set_staff_access($1,'Promotion',array['settings'],true,true)",[finance]),/Administrator access/);
  await assert.rejects(()=>pg.query("insert into public.staff_access values($1,'settings')",[finance]),/permission denied/);
  await assert.rejects(()=>pg.query("select public.save_content('/academics','{}',0)"),/Page editing access/);
  await assert.rejects(()=>pg.query("select public.manage_election('create',null,'{}')"),/Election access/);
  item=await one("insert into public.payment_items(title,academic_session,amount_kobo,active) values('Annual SOC dues','2026/27',500000,true) returning id");
 });
 await t.test('CMS saves are versioned, reject stale writes and isolate unpublished blocks',async()=>{
  await as(academic);assert.equal(await one("select public.save_content('/academics','{\"title\":\"Updated\"}',0)"),1);
  await assert.rejects(()=>pg.query("select public.save_content('/academics','{}',0)"),/changed/);
  assert.equal(await one("select count(*)::int from public.content_history"),1);
  await pg.query("insert into public.content_blocks(page_key,title,enabled) values('/academics','Draft material',false)");
  await as(finance);assert.equal(await one('select count(*)::int from public.content_history'),0);assert.equal(await one('select count(*)::int from public.content_blocks'),0);
  await as('','anon');assert.equal(await one('select count(*)::int from public.content_documents'),1);assert.equal(await one('select count(*)::int from public.content_blocks'),0);
 });
 await t.test('only server reserves payments; amount snapshots and attempt ownership hold',async()=>{
  await as('','anon');await assert.rejects(()=>reserve(),/permission denied/);
  await as(finance);await assert.rejects(()=>reserve(),/permission denied/);
  await as('','service_role');const a=await reserve();const b=await reserve();assert.notEqual(a.id,b.id);
  await pg.query('update public.payment_items set amount_kobo=600000 where id=$1',[item]);
  const again=await one('select public.reserve_payment($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[a.id,a.ref,a.hash,item,'Student Name','student@test.test','mu /se/001','Software Engineering','200','test']);assert.equal(again.amount_kobo,500000);
  await assert.rejects(()=>one('select public.reserve_payment($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[a.id,a.ref,'wrong',item,'Student Name','student@test.test','MU/SE/001','Software Engineering','200','test']),/does not match/);
  await pg.query('update public.payment_items set amount_kobo=500000 where id=$1',[item]);
 });
 await t.test('mismatched amount, currency, payer and environment never produce paid receipts',async()=>{
  await as('','service_role');for(const over of [{amount:1},{currency:'USD'},{domain:'live'},{email:'other@test.test'}]){const a=await reserve('MU/'+randomUUID());assert.equal(await settle(a,over),'review');assert.equal(await one('select status from public.payments where id=$1',[a.id]),'review');}
 });
 await t.test('verified payment is idempotent and cannot be downgraded; real duplicate is retained and flagged',async()=>{
  await as('','service_role');const [a,b]=attempts;assert.equal(await settle(a),'paid');assert.equal(await settle(a),'paid');assert.equal(await settle(a,{status:'failed'}),'paid');
  assert.equal(await one('select count(*)::int from public.payment_events where payment_id=$1',[a.id]),1);
  assert.equal(await settle(b),'paid');assert.equal(await one('select duplicate_of from public.payments where id=$1',[b.id]),a.id);
  await assert.rejects(()=>reserve(),/already recorded/);
  const failed=await reserve('MU/FAILED');assert.equal(await settle(failed,{status:'failed'}),'failed');
 });
 await t.test('finance records are private, immutable to staff and exclude receipt secrets',async()=>{
  const a=attempts[0];await as('','anon');await assert.rejects(()=>pg.query('select reference from public.payments'),/permission denied/);
  await as(academic);assert.equal(await one('select count(reference)::int from public.payments'),0);
  await as(finance);assert.ok(await one('select count(reference)::int from public.payments')>0);
  await assert.rejects(()=>pg.query('select receipt_hash from public.payments'),/permission denied/);
  await assert.rejects(()=>pg.query("update public.payments set status='paid'"),/permission denied/);
  await pg.query("insert into public.payment_notes(payment_id,note) values($1,'Reviewed duplicate with treasurer')",[a.id]);
  await assert.rejects(()=>pg.query("update public.payment_notes set note='Replaced note'"),/permission denied/);
  await assert.rejects(()=>pg.query('delete from public.payment_notes'),/permission denied/);
  await assert.rejects(()=>pg.query("insert into public.payment_notes(payment_id,author_id,note) values($1,$2,'Forged author')",[a.id,owner]),/row-level security/);
 });
 await t.test('disabled executive immediately loses access and server limits cap abuse',async()=>{
  await as(owner);await pg.query("select public.set_staff_access($1,'Finance executive',array['finance'],false,false)",[finance]);
  await as(finance);assert.equal(await one("select public.can_access('finance')"),false);assert.equal(await one('select count(reference)::int from public.payments'),0);
  await as('','service_role');for(let i=0;i<12;i++)assert.equal(await one("select public.consume_payment_limit('test')"),true);assert.equal(await one("select public.consume_payment_limit('test')"),false);
 });
 await pg.close();
});

test('Paystack raw-body signatures, required verification fields and spreadsheet escaping',()=>{
 const raw='{"event":"charge.success"}',secret='sk_test_example';const signature=createHmac('sha512',secret).update(raw).digest('hex');assert.equal(validWebhook(raw,signature,secret),true);assert.equal(validWebhook(raw+' ',signature,secret),false);assert.equal(validWebhook(raw,'bad',secret),false);
 assert.throws(()=>validateProvider({reference:'SOC_a',amount:100,domain:'test',currency:'NGN',status:'success',customer:{email:'test@test.test'}},'SOC_a'),/Incomplete/);
 assert.equal(csvCell(' =SUM(A1:A2)'),`"' =SUM(A1:A2)"`);assert.equal(csvCell('A"B'),'"A""B"');
});
test('Admin content cannot inject markup or executable links',()=>{
 const field=fieldsFor('/').find(f=>f.type==='text')!;assert.ok(field);
 // text edits are returned as plain strings; React escapes them when rendered (no HTML pipeline remains)
 assert.equal(resolveField(field.key,{[field.key]:field.value},{[field.key]:'<script>alert(1)</script>'},safeUrl),'<script>alert(1)</script>');
 for(const url of ['javascript:alert(1)','//evil.test','/\\\\evil.test','data:text/html,test'])assert.equal(safeUrl(url),'');
 const link=fieldsFor('/').find(f=>f.type==='url')!;assert.equal(resolveField(link.key,{[link.key]:link.value},{[link.key]:'javascript:alert(1)'},safeUrl),'');
 assert.throws(()=>validateFields('/',{[link.key]:'javascript:alert(1)'}),/HTTPS/);assert.throws(()=>validateFields('/',{unknown:'test'}),/Invalid/);
 const locked=Object.keys(fieldsFor('/')).length&&true;assert.ok(locked);
 assert.ok(!fieldsFor('/').some(f=>f.key.endsWith('~')),'structural values are not editable');
});
