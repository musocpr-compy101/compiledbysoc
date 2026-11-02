-- Apply after 001. Extends the integrated admin; no external CMS.
alter table public.profiles add column active boolean not null default true;
alter table public.profiles drop constraint profiles_role_check;
alter table public.profiles add constraint profiles_role_check check(role in ('student','editor','election_officer','staff','admin'));
create table public.staff_access(user_id uuid not null references public.profiles(id) on delete cascade, area text not null check(area in ('content','academics','finance','community','elections','settings')), primary key(user_id,area));
alter table public.staff_access enable row level security;
revoke all on public.staff_access from anon,authenticated;
grant select on public.staff_access to authenticated;
create function public.can_access(p_area text) returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select exists(select 1 from public.profiles p where p.id=auth.uid() and p.active and (p.role='admin' or exists(select 1 from public.staff_access a where a.user_id=p.id and a.area=p_area) or (p.role='editor' and p_area='content') or(p.role='election_officer' and p_area='elections')));
$$;
create or replace function public.has_role(roles text[]) returns boolean language sql stable security definer set search_path=public,pg_temp as $$
 select exists(select 1 from public.profiles p where p.id=auth.uid() and p.active and (p.role=any(roles) or ('editor'=any(roles) and public.can_access('content')) or ('election_officer'=any(roles) and public.can_access('elections'))));
$$;
create policy own_access on public.staff_access for select to authenticated using(user_id=auth.uid() or public.has_role(array['admin']));
create table private.staff_audit(id bigint generated always as identity primary key,actor uuid not null, subject uuid not null, action jsonb not null,created_at timestamptz not null default now());
create function public.staff_directory() returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if not public.has_role(array['admin']) then raise exception 'Administrator access required.';end if;
 return (select coalesce(jsonb_agg(t),'[]'::jsonb) from (select p.id,p.display_name,p.role,p.active,u.email,coalesce((select jsonb_agg(a.area) from public.staff_access a where a.user_id=p.id),'[]'::jsonb) as areas from public.profiles p join auth.users u on u.id=p.id where p.role<>'student' or exists(select 1 from public.staff_access a where a.user_id=p.id) order by p.display_name) t);
end;$$;
create function public.staff_find_email(p_email text) returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
begin
 if not public.has_role(array['admin']) then raise exception 'Administrator access required.';end if;
 return (select id from auth.users where lower(email)=lower(trim(p_email)) limit 1);
end;$$;
create function public.set_staff_access(p_user uuid,p_name text,p_areas text[],p_active boolean,p_admin boolean default false) returns void language plpgsql security definer set search_path=public,pg_temp as $$
begin
 perform pg_advisory_xact_lock(823417);
 if not public.has_role(array['admin']) then raise exception 'Administrator access required.';end if;
 if p_user=auth.uid() then raise exception 'Ask another administrator to change your own access.';end if;
 if length(trim(p_name)) not between 2 and 100 then raise exception 'Enter a staff name.';end if;
 if p_areas is null or not p_areas <@ array['content','academics','finance','community','elections','settings'] then raise exception 'Invalid access area.';end if;
 if not p_admin and p_active and cardinality(p_areas)=0 then raise exception 'Choose at least one area.';end if;
 if not exists(select 1 from public.profiles where id=p_user) then raise exception 'Create the account first.';end if;
 update public.profiles set display_name=trim(p_name),active=p_active,role=case when p_admin then 'admin' else 'staff' end where id=p_user;
 delete from public.staff_access where user_id=p_user;
 insert into public.staff_access(user_id,area) select p_user,x from (select distinct unnest(p_areas) x) a;
 insert into private.staff_audit(actor,subject,action) values(auth.uid(),p_user,jsonb_build_object('areas',p_areas,'active',p_active,'administrator',p_admin));
end;$$;

create function public.content_area(p_page text) returns text language sql immutable as $$
 select case when p_page like '/academics%' or p_page like '/resources/%' then 'academics' when p_page like '/pay-dues%' then 'finance' when p_page like '/communities%' or p_page='/feedback' then 'community' when p_page like '@%' then 'settings' else 'content' end;
$$;
create table public.content_documents(page_key text primary key,fields jsonb not null default '{}'::jsonb check(jsonb_typeof(fields)='object'),revision integer not null default 0,updated_at timestamptz not null default now());
create table public.content_history(id bigint generated always as identity primary key,page_key text not null,fields jsonb not null,revision integer not null,actor uuid not null references auth.users(id),created_at timestamptz not null default now(),unique(page_key,revision));
alter table public.content_documents enable row level security;
alter table public.content_history enable row level security;
revoke all on public.content_documents,public.content_history from anon,authenticated;
grant select on public.content_documents to anon,authenticated;
grant select on public.content_history to authenticated;
create policy read_content on public.content_documents for select using(true);
create policy read_history on public.content_history for select to authenticated using(public.can_access(public.content_area(page_key)));
create function public.save_content(p_page text,p_fields jsonb,p_revision integer) returns integer language plpgsql security definer set search_path=public,pg_temp as $$
declare current_revision integer; next_revision integer;
begin
 if not public.can_access(public.content_area(p_page)) then raise exception 'Page editing access required.';end if;
 if length(p_page)>180 or jsonb_typeof(p_fields)<>'object' or octet_length(p_fields::text)>2000000 then raise exception 'Invalid page content.';end if;
 insert into public.content_documents(page_key) values(p_page) on conflict do nothing;
 select revision into current_revision from public.content_documents where page_key=p_page for update;
 if current_revision<>p_revision then raise exception 'This page changed. Reload before saving.';end if;
 next_revision=current_revision+1;
 update public.content_documents set fields=p_fields,revision=next_revision,updated_at=now() where page_key=p_page;
 insert into public.content_history(page_key,fields,revision,actor) values(p_page,p_fields,next_revision,auth.uid());
 return next_revision;
end;$$;
create table public.content_blocks(id uuid primary key default gen_random_uuid(),page_key text not null,title text not null check(length(title) between 2 and 160),body text not null default '' check(length(body)<=15000),media_id uuid references public.media(id),link_url text not null default '',link_label text not null default '',position integer not null default 0,enabled boolean not null default true);
alter table public.content_blocks enable row level security;
revoke all on public.content_blocks from anon,authenticated;
grant select on public.content_blocks to anon,authenticated;
grant insert,update,delete on public.content_blocks to authenticated;
create policy public_blocks on public.content_blocks for select using(enabled or public.can_access(public.content_area(page_key)));
create policy edit_blocks on public.content_blocks for all to authenticated using(public.can_access(public.content_area(page_key))) with check(public.can_access(public.content_area(page_key)));
alter table public.media add column area text not null default 'content' check(area in ('content','academics','finance','community','settings'));
drop policy readable_media on public.media;
drop policy upload_media on public.media;
create policy readable_media on public.media for select using(public.can_access(area) or exists(select 1 from public.posts p where p.status='published' and p.published_at<=now() and (p.image_id=media.id or p.attachment_id=media.id)) or exists(select 1 from public.content_documents d,jsonb_each_text(d.fields) f where f.value='/api/media/'||media.id::text) or exists(select 1 from public.content_blocks b where b.enabled and b.media_id=media.id));
create policy upload_media on public.media for insert to authenticated with check(owner_id=auth.uid() and public.can_access(area));

create table public.payment_items(id uuid primary key default gen_random_uuid(),title text not null check(length(title) between 3 and 120),description text not null default '',academic_session text not null,amount_kobo bigint not null check(amount_kobo between 100 and 100000000),currency text not null default 'NGN' check(currency='NGN'),active boolean not null default false,created_at timestamptz not null default now());
alter table public.payment_items enable row level security;
revoke all on public.payment_items from anon,authenticated;
grant select on public.payment_items to anon,authenticated;
grant insert,update on public.payment_items to authenticated;
create policy public_payment_items on public.payment_items for select using(active or public.can_access('finance'));
create policy manage_payment_items on public.payment_items for all to authenticated using(public.can_access('finance')) with check(public.can_access('finance'));
create table public.payments(
 id uuid primary key,reference text not null unique,receipt_hash text not null,
 item_id uuid not null references public.payment_items(id),item_title text not null,academic_session text not null,
 payer_name text not null,email text not null,matric text not null,programme text not null,level text not null,
 amount_kobo bigint not null check(amount_kobo>0),currency text not null check(currency='NGN'),domain text not null check(domain in ('test','live')),
 status text not null default 'pending' check(status in ('pending','paid','failed','abandoned','review')),
 authorization_url text,provider_id text unique,channel text,fees_kobo bigint,paid_at timestamptz,
 created_at timestamptz not null default now(),verified_at timestamptz,review_reason text,
 duplicate_of uuid references public.payments(id)
);
alter table public.payments enable row level security;
revoke all on public.payments from anon,authenticated;
-- No receipt hash or checkout capability in staff SELECT responses.
grant select(id,reference,item_id,item_title,academic_session,payer_name,email,matric,programme,level,amount_kobo,currency,domain,status,provider_id,channel,fees_kobo,paid_at,created_at,verified_at,review_reason,duplicate_of) on public.payments to authenticated;
create policy finance_records on public.payments for select to authenticated using(public.can_access('finance'));
create table public.payment_notes(id bigint generated always as identity primary key,payment_id uuid not null references public.payments(id),author_id uuid not null default auth.uid() references auth.users(id),note text not null check(length(note) between 3 and 2000),created_at timestamptz not null default now());
alter table public.payment_notes enable row level security;
revoke all on public.payment_notes from anon,authenticated;
grant select,insert on public.payment_notes to authenticated;
grant usage on sequence public.payment_notes_id_seq to authenticated;
create policy finance_notes on public.payment_notes for select to authenticated using(public.can_access('finance'));
create policy append_finance_notes on public.payment_notes for insert to authenticated with check(public.can_access('finance') and author_id=auth.uid());
create table public.payment_events(id bigint generated always as identity primary key,payment_id uuid not null references public.payments(id),event_key text not null unique,event_type text not null,summary jsonb not null,created_at timestamptz not null default now());
alter table public.payment_events enable row level security;
revoke all on public.payment_events from anon,authenticated;
grant select on public.payment_events to authenticated;
create policy finance_events on public.payment_events for select to authenticated using(public.can_access('finance'));
create table private.request_limits(key text primary key,window_start timestamptz not null default now(),attempts integer not null default 1);
create function public.consume_payment_limit(p_key text) returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare n integer;
begin
 insert into private.request_limits(key) values(p_key) on conflict(key) do update set attempts=case when private.request_limits.window_start<now()-interval '15 minutes' then 1 else private.request_limits.attempts+1 end,window_start=case when private.request_limits.window_start<now()-interval '15 minutes' then now() else private.request_limits.window_start end returning attempts into n;
 return n<=12;
end;$$;
-- Only the trusted server can reserve or settle payments. Amounts come from the item row.
create function public.reserve_payment(p_id uuid,p_reference text,p_hash text,p_item uuid,p_name text,p_email text,p_matric text,p_programme text,p_level text,p_domain text) returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare item public.payment_items; prior public.payments; result public.payments;
begin
 perform pg_advisory_xact_lock(hashtext(p_id::text));
 select * into prior from public.payments where id=p_id;
 if found then
  if prior.receipt_hash<>p_hash or prior.item_id<>p_item or prior.email<>lower(p_email) or prior.matric<>upper(regexp_replace(p_matric,'\s','','g')) or prior.payer_name<>p_name or prior.programme<>p_programme or prior.level<>p_level or prior.domain<>p_domain then raise exception 'Payment attempt does not match.';end if;
  return to_jsonb(prior);
 end if;
 select * into item from public.payment_items where id=p_item and active for share;
 if not found then raise exception 'This payment item is unavailable.';end if;
 if exists(select 1 from public.payments where item_id=p_item and matric=upper(regexp_replace(p_matric,'\s','','g')) and status='paid' and domain=p_domain) then raise exception 'A successful payment is already recorded for this item and matric number.';end if;
 insert into public.payments(id,reference,receipt_hash,item_id,item_title,academic_session,payer_name,email,matric,programme,level,amount_kobo,currency,domain) values(p_id,p_reference,p_hash,item.id,item.title,item.academic_session,p_name,lower(p_email),upper(regexp_replace(p_matric,'\s','','g')),p_programme,p_level,item.amount_kobo,item.currency,p_domain) returning * into result;
 return to_jsonb(result);
end;$$;
create function public.settle_payment(p_reference text,p_provider_id text,p_amount bigint,p_currency text,p_domain text,p_email text,p_status text,p_channel text,p_fees bigint,p_paid_at timestamptz) returns text language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.payments; duplicate uuid; result text;
begin
 select * into row from public.payments where reference=p_reference for update;
 if not found then raise exception 'Unknown payment reference.';end if;
 if p_amount is null or p_currency is null or p_domain is null or p_email is null or p_status is null then raise exception 'Incomplete provider confirmation.';end if;
 if row.amount_kobo<>p_amount or row.currency<>p_currency or row.domain<>p_domain or row.email<>lower(p_email) then
  if row.status<>'paid' then update public.payments set status='review',review_reason='Provider verification did not match the reserved payment.',verified_at=now() where id=row.id;end if;
  insert into public.payment_events(payment_id,event_key,event_type,summary) values(row.id,'verify:'||p_reference||':mismatch','verification_mismatch',jsonb_build_object('amount_kobo',p_amount,'currency',p_currency,'domain',p_domain)) on conflict(event_key) do nothing;
  return 'review';
 end if;
 if row.status='paid' then return 'paid';end if;
 if p_status='success' then
  if p_provider_id is null or p_paid_at is null then raise exception 'Incomplete provider confirmation.';end if;
  perform pg_advisory_xact_lock(hashtext(row.item_id::text||row.matric||row.domain));
  select id into duplicate from public.payments where item_id=row.item_id and matric=row.matric and domain=row.domain and status='paid' limit 1;
  update public.payments set status='paid',provider_id=p_provider_id,channel=p_channel,fees_kobo=p_fees,paid_at=p_paid_at,verified_at=now(),duplicate_of=duplicate,review_reason=case when duplicate is not null then 'Multiple successful payments for this student and item. Review for refund.' else null end where id=row.id;
  result='paid';
 else
  result=case when p_status in ('failed','abandoned') then p_status else 'pending' end;
  update public.payments set status=result,verified_at=now() where id=row.id;
 end if;
 insert into public.payment_events(payment_id,event_key,event_type,summary) values(row.id,'verify:'||p_reference||':'||result,'verification',jsonb_build_object('status',result,'provider_id',p_provider_id,'amount_kobo',p_amount,'currency',p_currency,'domain',p_domain)) on conflict(event_key) do nothing;
 return result;
end;$$;
revoke all on function public.consume_payment_limit(text),public.reserve_payment(uuid,text,text,uuid,text,text,text,text,text,text),public.settle_payment(text,text,bigint,text,text,text,text,text,bigint,timestamptz) from public,anon,authenticated;
grant execute on function public.consume_payment_limit(text),public.reserve_payment(uuid,text,text,uuid,text,text,text,text,text,text),public.settle_payment(text,text,bigint,text,text,text,text,text,bigint,timestamptz) to service_role;
grant all on public.payments,public.payment_events,public.payment_items to service_role;
grant usage on sequence public.payment_events_id_seq to service_role;
revoke all on function public.staff_directory(),public.staff_find_email(text),public.set_staff_access(uuid,text,text[],boolean,boolean),public.save_content(text,jsonb,integer) from public,anon;
grant execute on function public.staff_directory(),public.staff_find_email(text),public.set_staff_access(uuid,text,text[],boolean,boolean),public.save_content(text,jsonb,integer) to authenticated;
revoke all on function public.can_access(text),public.content_area(text) from public;
grant execute on function public.can_access(text),public.content_area(text) to anon,authenticated;
