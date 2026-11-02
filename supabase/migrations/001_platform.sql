-- Run once in a fresh Supabase project. No service-role key is required by the app.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '',
 role text not null default 'student' check(role in ('student','editor','election_officer','admin'))
);
create function private.provision_profile() returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin insert into public.profiles(id) values(new.id); return new; end; $$;
create trigger provision_profile after insert on auth.users for each row execute function private.provision_profile();
insert into public.profiles(id) select id from auth.users on conflict do nothing;
create function public.has_role(roles text[]) returns boolean language sql stable security definer set search_path = public, pg_temp as $$
 select exists(select 1 from public.profiles where id=auth.uid() and role=any(roles));
$$;
alter table public.profiles enable row level security;
create policy self_profile on public.profiles for select to authenticated using(id=auth.uid() or public.has_role(array['admin']));
create policy self_name on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
revoke all on public.profiles from anon,authenticated;
grant select on public.profiles to authenticated;
grant update(display_name) on public.profiles to authenticated;

create table public.media (
 id uuid primary key default gen_random_uuid(), object_key text not null unique,
 name text not null, content_type text not null check(content_type in ('image/jpeg','image/png','image/webp','application/pdf')),
 size_bytes integer not null check(size_bytes between 1 and 4194304), owner_id uuid not null default auth.uid() references auth.users(id),
 created_at timestamptz not null default now()
);
create table public.posts (
 id uuid primary key default gen_random_uuid(), kind text not null check(kind in ('announcement','rule','news','journal')),
 title text not null check(length(title) between 3 and 160), excerpt text not null default '' check(length(excerpt)<=320),
 body text not null check(length(body) between 10 and 30000), byline text not null,
 pinned boolean not null default false, status text not null default 'draft' check(status in ('draft','published')),
 published_at timestamptz, image_id uuid references public.media(id), attachment_id uuid references public.media(id),
 author_id uuid not null default auth.uid() references auth.users(id), updated_at timestamptz not null default now()
);
create function private.stamp_post() returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
 new.updated_at=now();
 if new.status='published' then new.published_at=coalesce(new.published_at,now()); else new.published_at=null; end if;
 return new;
end; $$;
create trigger stamp_post before insert or update on public.posts for each row execute function private.stamp_post();
alter table public.posts enable row level security;
create policy public_posts on public.posts for select using(status='published' and published_at<=now() or public.has_role(array['admin','editor']));
create policy editor_posts on public.posts for all to authenticated using(public.has_role(array['admin','editor'])) with check(public.has_role(array['admin','editor']));
alter table public.media enable row level security;
create policy readable_media on public.media for select using(public.has_role(array['admin','editor']) or exists(select 1 from public.posts p where p.status='published' and p.published_at<=now() and (p.image_id=media.id or p.attachment_id=media.id)));
create policy upload_media on public.media for insert to authenticated with check(owner_id=auth.uid() and public.has_role(array['admin','editor']));
grant select on public.posts,public.media to anon,authenticated;
grant insert,update,delete on public.posts to authenticated;
grant insert on public.media to authenticated;

create table public.events (
 id uuid primary key default gen_random_uuid(), title text not null check(length(title) between 3 and 160),
 description text not null check(length(description) between 5 and 5000), location text not null,
 starts_at timestamptz not null, ends_at timestamptz not null check(ends_at>starts_at)
);
alter table public.events enable row level security;
create policy read_events on public.events for select using(true);
create policy manage_events on public.events for all to authenticated using(public.has_role(array['admin','editor'])) with check(public.has_role(array['admin','editor']));
grant select on public.events to anon,authenticated;
grant insert,update,delete on public.events to authenticated;

create table public.elections (
 id uuid primary key default gen_random_uuid(), title text not null check(length(title) between 3 and 160),
 rules text not null check(length(rules) between 20 and 15000), starts_at timestamptz not null, ends_at timestamptz not null check(ends_at>starts_at),
 status text not null default 'draft' check(status in ('draft','scheduled','released'))
);
create table public.offices (
 id uuid primary key default gen_random_uuid(), election_id uuid not null references public.elections(id) on delete cascade,
 title text not null check(length(title) between 2 and 100), sort_order integer not null, unique(election_id,title), unique(id,election_id)
);
create table public.candidates (
 id uuid primary key default gen_random_uuid(), election_id uuid not null,
 office_id uuid not null, name text not null check(length(name) between 2 and 100), manifesto text not null default '' check(length(manifesto)<=5000),
 foreign key(office_id,election_id) references public.offices(id,election_id) on delete cascade,
 unique(id,office_id,election_id), unique(office_id,name)
);
create table private.voter_roster (
 election_id uuid not null references public.elections(id), email text not null, matric text not null,
 primary key(election_id,email),unique(election_id,matric)
);
create table private.participation (
 election_id uuid not null references public.elections(id), user_id uuid not null references auth.users(id),
 email text not null, receipt uuid not null default gen_random_uuid(),
 primary key(election_id,user_id), unique(election_id,email)
);
-- No identity, receipt or timestamp is stored with ballot choices.
create table private.ballots (
 ballot_id uuid not null, election_id uuid not null, office_id uuid not null, candidate_id uuid,
 primary key(ballot_id,office_id),
 foreign key(office_id,election_id) references public.offices(id,election_id),
 foreign key(candidate_id,office_id,election_id) references public.candidates(id,office_id,election_id)
);
create table private.election_audit (
 id bigint generated always as identity primary key, election_id uuid references public.elections(id),
 actor_id uuid not null references auth.users(id), action text not null, created_at timestamptz not null default now()
);
alter table private.voter_roster enable row level security;
alter table private.participation enable row level security;
alter table private.ballots enable row level security;
alter table private.election_audit enable row level security;
alter table public.elections enable row level security;
alter table public.offices enable row level security;
alter table public.candidates enable row level security;
create policy view_elections on public.elections for select using(status<>'draft' or public.has_role(array['admin','election_officer']));
create policy view_offices on public.offices for select using(exists(select 1 from public.elections e where e.id=election_id));
create policy view_candidates on public.candidates for select using(exists(select 1 from public.elections e where e.id=election_id));
revoke all on public.elections,public.offices,public.candidates from anon,authenticated;
grant select on public.elections,public.offices,public.candidates to anon,authenticated;

-- A separate DB switch is checked even when someone calls the RPC directly.
create table private.settings (id boolean primary key default true check(id), voting_enabled boolean not null default false);
insert into private.settings(id) values(true);

create function public.manage_election(p_action text,p_id uuid default null,p_data jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare eid uuid; oid uuid; office jsonb; candidate jsonb; item jsonb; e public.elections; n integer=0;
begin
 if not public.has_role(array['admin','election_officer']) then raise exception 'Election access required.'; end if;
 if p_action in ('create','update') then
  if coalesce(jsonb_typeof(p_data->'offices'),'null')<>'array' or jsonb_array_length(p_data->'offices') not between 1 and 20 then raise exception 'Add 1 to 20 offices.'; end if;
  if p_action='update' then
   eid=p_id;
   select * into e from public.elections where id=eid for update;
   if not found or e.status<>'draft' then raise exception 'Only drafts can be edited.'; end if;
   delete from public.offices where election_id=eid;
   update public.elections set title=p_data->>'title',rules=p_data->>'rules',starts_at=(p_data->>'starts_at')::timestamptz,ends_at=(p_data->>'ends_at')::timestamptz where id=eid;
  else
   insert into public.elections(title,rules,starts_at,ends_at) values(p_data->>'title',p_data->>'rules',(p_data->>'starts_at')::timestamptz,(p_data->>'ends_at')::timestamptz) returning id into eid;
  end if;
  for office in select value from jsonb_array_elements(p_data->'offices') loop
   n=n+1;
   insert into public.offices(election_id,title,sort_order) values(eid,office->>'title',n) returning id into oid;
   if coalesce(jsonb_typeof(office->'candidates'),'null')<>'array' or jsonb_array_length(office->'candidates') not between 1 and 20 then raise exception 'Add candidates for every office.'; end if;
   for candidate in select value from jsonb_array_elements(office->'candidates') loop
    insert into public.candidates(election_id,office_id,name,manifesto) values(eid,oid,candidate->>'name',coalesce(candidate->>'manifesto',''));
   end loop;
  end loop;
 else
  eid=p_id;
  select * into e from public.elections where id=eid for update;
  if not found then raise exception 'Election not found.'; end if;
  if p_action='roster' then
   if e.status<>'draft' then raise exception 'Voter list is locked after scheduling.'; end if;
   if coalesce(jsonb_typeof(p_data->'voters'),'null')<>'array' or jsonb_array_length(p_data->'voters') not between 1 and 2000 then raise exception 'Add 1 to 2000 voters.'; end if;
   delete from private.voter_roster where election_id=eid;
   for item in select value from jsonb_array_elements(p_data->'voters') loop
    if coalesce(item->>'email','') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or length(coalesce(item->>'matric',''))<4 then raise exception 'Every voter needs an email and matric number.'; end if;
    insert into private.voter_roster(election_id,email,matric) values(eid,lower(trim(item->>'email')),upper(regexp_replace(item->>'matric','\s','','g')));
   end loop;
  elsif p_action='schedule' then
   if e.status<>'draft' or e.starts_at<=now() then raise exception 'Only a future draft can be scheduled.'; end if;
   if not exists(select 1 from private.voter_roster where election_id=eid) then raise exception 'Import the approved voter list first.'; end if;
   if not exists(select 1 from public.offices where election_id=eid) then raise exception 'Add offices first.'; end if;
   if exists(select 1 from public.offices o where o.election_id=eid and not exists(select 1 from public.candidates c where c.office_id=o.id)) then raise exception 'Add candidates for every office.'; end if;
   update public.elections set status='scheduled' where id=eid;
  elsif p_action='release' then
   if e.status<>'scheduled' or now()<e.ends_at then raise exception 'Results can only be released after voting closes.'; end if;
   update public.elections set status='released' where id=eid;
  else raise exception 'Unknown election action.';
  end if;
 end if;
 insert into private.election_audit(election_id,actor_id,action) values(eid,auth.uid(),p_action);
 return eid;
end; $$;

create function public.my_ballot_status(p_election_id uuid) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare email_address text; receipt_id uuid;
begin
 if auth.uid() is null then return jsonb_build_object('eligible',false,'voted',false); end if;
 select lower(email) into email_address from auth.users where id=auth.uid() and email_confirmed_at is not null;
 select receipt into receipt_id from private.participation where election_id=p_election_id and (user_id=auth.uid() or email=email_address);
 return jsonb_build_object('eligible',exists(select 1 from private.voter_roster where election_id=p_election_id and email=email_address),'voted',receipt_id is not null,'receipt',receipt_id,'enabled',(select voting_enabled from private.settings where id=true));
end; $$;

create function public.cast_ballot(p_election_id uuid,p_choices jsonb) returns uuid language plpgsql security definer set search_path = public, pg_temp as $$
declare e public.elections; email_address text; receipt_id uuid; ballot uuid=gen_random_uuid(); item jsonb; expected integer;
begin
 if auth.uid() is null then raise exception 'Sign in to vote.'; end if;
 if not coalesce((select voting_enabled from private.settings where id=true),false) then raise exception 'Voting is not enabled.'; end if;
 -- Row lock serializes casting with publication and other casts. Appropriate for ~200 voters.
 select * into e from public.elections where id=p_election_id for update;
 if not found or e.status<>'scheduled' or now()<e.starts_at or now()>=e.ends_at then raise exception 'Voting is closed.'; end if;
 select lower(email) into email_address from auth.users where id=auth.uid() and email_confirmed_at is not null;
 if not exists(select 1 from private.voter_roster where election_id=p_election_id and email=email_address) then raise exception 'Your account is not on the approved voter list.'; end if;
 select count(*) into expected from public.offices where election_id=p_election_id;
 if coalesce(jsonb_typeof(p_choices),'null')<>'array' or jsonb_array_length(p_choices)<>expected then raise exception 'Choose a candidate or abstain for every office.'; end if;
 if (select count(distinct value->>'office_id') from jsonb_array_elements(p_choices))<>expected then raise exception 'Duplicate or missing office.'; end if;
 -- Unique constraints prevent repeat votes, including from concurrent requests or changed account emails.
 insert into private.participation(election_id,user_id,email) values(p_election_id,auth.uid(),email_address) returning receipt into receipt_id;
 for item in select value from jsonb_array_elements(p_choices) loop
  if not exists(select 1 from public.offices where id=(item->>'office_id')::uuid and election_id=p_election_id) then raise exception 'Invalid office.'; end if;
  if item->>'candidate_id' is not null and not exists(select 1 from public.candidates where id=(item->>'candidate_id')::uuid and office_id=(item->>'office_id')::uuid and election_id=p_election_id) then raise exception 'Invalid candidate.'; end if;
  insert into private.ballots(ballot_id,election_id,office_id,candidate_id) values(ballot,p_election_id,(item->>'office_id')::uuid,(item->>'candidate_id')::uuid);
 end loop;
 return receipt_id;
end; $$;

create function public.election_results(p_election_id uuid) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
begin
 if not exists(select 1 from public.elections where id=p_election_id and status='released' and ends_at<=now()) then return null; end if;
 return jsonb_build_object('turnout',(select count(*) from private.participation where election_id=p_election_id),'eligible',(select count(*) from private.voter_roster where election_id=p_election_id),'candidates',(select coalesce(jsonb_agg(t),'[]'::jsonb) from (select c.id,c.office_id,c.name,count(b.candidate_id) as votes from public.candidates c left join private.ballots b on b.candidate_id=c.id where c.election_id=p_election_id group by c.id) t),'abstentions',(select coalesce(jsonb_agg(t),'[]'::jsonb) from (select o.id as office_id,count(b.ballot_id) as votes from public.offices o left join private.ballots b on b.office_id=o.id and b.candidate_id is null where o.election_id=p_election_id group by o.id) t));
end; $$;
create function public.election_admin_summary(p_election_id uuid) returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
begin
 if not public.has_role(array['admin','election_officer']) then raise exception 'Election access required.'; end if;
 return jsonb_build_object('voters',(select count(*) from private.voter_roster where election_id=p_election_id),'audit',(select coalesce(jsonb_agg(t order by t.created_at desc),'[]'::jsonb) from (select action,created_at,actor_id from private.election_audit where election_id=p_election_id) t));
end; $$;
revoke all on function public.manage_election(text,uuid,jsonb),public.cast_ballot(uuid,jsonb),public.my_ballot_status(uuid),public.election_admin_summary(uuid) from public,anon;
grant execute on function public.manage_election(text,uuid,jsonb),public.cast_ballot(uuid,jsonb),public.my_ballot_status(uuid),public.election_admin_summary(uuid) to authenticated;
revoke all on function public.has_role(text[]),public.election_results(uuid) from public;
grant execute on function public.has_role(text[]),public.election_results(uuid) to anon,authenticated;
