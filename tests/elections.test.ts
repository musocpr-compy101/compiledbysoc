import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
const admin='11111111-1111-4111-8111-111111111111';
const student='22222222-2222-4222-8222-222222222222';
const outsider='33333333-3333-4333-8333-333333333333';
const editor='44444444-4444-4444-8444-444444444444';
test('Database enforces election, identity, publishing and ballot boundaries',async t=>{
 const pg=new PGlite();
 await pg.exec(`create role anon; create role authenticated; create role service_role bypassrls; create schema auth;
 create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema public,auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;`);
 await pg.exec(await readFile('supabase/migrations/001_platform.sql','utf8'));
 await pg.exec(await readFile('supabase/migrations/002_admin_content_finance.sql','utf8'));
 await pg.query(`insert into auth.users values ($1,'officer@example.test',now()),($2,'student@example.test',now()),($3,'outsider@example.test',now()),($4,'editor@example.test',now())`,[admin,student,outsider,editor]);
 await pg.query(`update public.profiles set role='admin' where id=$1`,[admin]);
 await pg.query(`update public.profiles set role='editor' where id=$1`,[editor]);
 const as=async(id:string,role='authenticated')=>{await pg.exec('reset role');await pg.query(`select set_config('request.jwt.claim.sub',$1,false)`,[id]);await pg.exec('set role '+role);};
 const root=async()=>pg.exec('reset role');
 const scalar=async(sql:string,args:unknown[]=[])=>Object.values((await pg.query(sql,args)).rows[0] as Record<string,unknown>)[0] as any;
 await as(admin);
 const payload={title:'Test student election',rules:'Choose a candidate or abstain. One final ballot per eligible student.',starts_at:new Date(Date.now()+3600000).toISOString(),ends_at:new Date(Date.now()+7200000).toISOString(),offices:[{title:'President',candidates:[{name:'Candidate Alpha',manifesto:'Statement A'},{name:'Candidate Beta',manifesto:'Statement B'}]},{title:'Secretary',candidates:[{name:'Candidate Gamma',manifesto:'Statement C'}]}]};
 const election=await scalar(`select public.manage_election('create',null,$1)`,[JSON.stringify(payload)]) as string;
 const offices=(await pg.query<{id:string;title:string}>(`select * from public.offices where election_id=$1 order by sort_order`,[election])).rows;
 const candidates=(await pg.query<{id:string;office_id:string}>(`select * from public.candidates where election_id=$1`,[election])).rows;
 const choices=offices.map((o,i)=>({office_id:o.id,candidate_id:i===0?candidates.find(c=>c.office_id===o.id)!.id:null}));
 await t.test('students cannot promote themselves or publish posts',async()=>{
  await as(student);await assert.rejects(()=>pg.query(`update public.profiles set role='admin' where id=$1`,[student]),/permission denied/);
  await assert.rejects(()=>pg.query(`insert into public.posts(kind,title,body,byline) values('rule','Test rule','This is a test rule body','Student')`),/row-level security/);
  assert.equal((await pg.query('select * from public.elections')).rows.length,0);
  await assert.rejects(()=>pg.query(`select public.manage_election('create',null,$1)`,[JSON.stringify(payload)]),/Election access required/);
 });
 await t.test('editors can publish, but cannot administer elections',async()=>{
  await as(editor);await pg.query(`insert into public.posts(kind,title,body,byline,status) values('announcement','Published test','This is an approved test post','Editorial','published')`);
  await pg.query(`insert into public.posts(kind,title,body,byline,status) values('announcement','Private draft','This is a private draft post','Editorial','draft')`);
  await assert.rejects(()=>pg.query(`select public.manage_election('schedule',$1)`,[election]),/Election access required/);
  await as('', 'anon');const posts=await pg.query<{title:string}>('select title from public.posts');assert.deepEqual(posts.rows.map(x=>x.title),['Published test']);
 });
 await t.test('roster duplicates reject atomically; only future complete drafts schedule',async()=>{
  await as(admin);await assert.rejects(()=>pg.query(`select public.manage_election('schedule',$1)`,[election]),/voter list first/);
  const voters=[{email:'student@example.test',matric:'MU/SE/001'},{email:'student2@example.test',matric:'MU/SE/001'}];
  await assert.rejects(()=>pg.query(`select public.manage_election('roster',$1,$2)`,[election,JSON.stringify({voters})]),/duplicate key/);
  await pg.query(`select public.manage_election('roster',$1,$2)`,[election,JSON.stringify({voters:[voters[0]]})]);
  await pg.query(`select public.manage_election('schedule',$1)`,[election]);
  await assert.rejects(()=>pg.query(`select public.manage_election('roster',$1,$2)`,[election,JSON.stringify({voters:[voters[0]]})]),/locked/);
  await assert.rejects(()=>pg.query(`select public.manage_election('update',$1,$2)`,[election,JSON.stringify(payload)]),/Only drafts/);
 });
 await t.test('database gate and voting window are enforced independent of UI',async()=>{
  await as(student);await assert.rejects(()=>pg.query('select public.cast_ballot($1,$2)',[election,JSON.stringify(choices)]),/not enabled/);
  await root();await pg.exec('update private.settings set voting_enabled=true');await as(student);
  await assert.rejects(()=>pg.query('select public.cast_ballot($1,$2)',[election,JSON.stringify(choices)]),/Voting is closed/);
  await root();await pg.query(`update public.elections set starts_at=now()-interval '1 hour' where id=$1`,[election]);
 });
 await t.test('ineligible account and invalid ballots cannot create participation',async()=>{
  await as(outsider);await assert.rejects(()=>pg.query('select public.cast_ballot($1,$2)',[election,JSON.stringify(choices)]),/not on the approved/);
  await as(student);await assert.rejects(()=>pg.query('select public.cast_ballot($1,$2)',[election,JSON.stringify([choices[0],choices[0]])]),/Duplicate/);
  const forged=[{...choices[0],candidate_id:candidates.find(c=>c.office_id===offices[1].id)!.id},choices[1]];
  await assert.rejects(()=>pg.query('select public.cast_ballot($1,$2)',[election,JSON.stringify(forged)]),/Invalid candidate/);
  const status=await scalar('select public.my_ballot_status($1)',[election]);assert.equal(status.voted,false);assert.equal(status.eligible,true);
 });
 let receipt:string;
 await t.test('one whole ballot is recorded once, with identity separated from choices',async()=>{
  await as(student);receipt=await scalar('select public.cast_ballot($1,$2)',[election,JSON.stringify(choices)]);
  await assert.rejects(()=>pg.query('select public.cast_ballot($1,$2)',[election,JSON.stringify(choices)]),/duplicate key/);
  const status=await scalar('select public.my_ballot_status($1)',[election]);assert.equal(status.receipt,receipt);assert.equal(status.voted,true);
  await assert.rejects(()=>pg.query('select * from private.ballots'),/permission denied/);
  await root();assert.equal(await scalar('select count(*)::integer from private.ballots'),2);assert.equal(await scalar('select count(*)::integer from private.participation'),1);
  const cols=(await pg.query<{column_name:string}>(`select column_name from information_schema.columns where table_schema='private' and table_name='ballots'`)).rows.map(x=>x.column_name);
  assert.deepEqual(cols.sort(),['ballot_id','candidate_id','election_id','office_id']);
 });
 await t.test('results stay hidden until close AND officer release, even from officers',async()=>{
  await as(admin);assert.equal(await scalar('select public.election_results($1)',[election]),null);
  await assert.rejects(()=>pg.query(`select public.manage_election('release',$1)`,[election]),/after voting closes/);
  await assert.rejects(()=>pg.query('select * from private.ballots'),/permission denied/);
  await root();await pg.query(`update public.elections set ends_at=now()-interval '1 second' where id=$1`,[election]);
  await as(student);await assert.rejects(()=>pg.query('select public.cast_ballot($1,$2)',[election,JSON.stringify(choices)]),/Voting is closed/);
  assert.equal(await scalar('select public.election_results($1)',[election]),null);
  await as(admin);await pg.query(`select public.manage_election('release',$1)`,[election]);
  await as('','anon');const results=await scalar('select public.election_results($1)',[election]);assert.equal(results.turnout,1);assert.equal(results.eligible,1);assert.equal(results.candidates.reduce((a:number,c:any)=>a+Number(c.votes),0),1);assert.equal(results.abstentions.reduce((a:number,c:any)=>a+Number(c.votes),0),1);
 });
 await pg.close();
});
