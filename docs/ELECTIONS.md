# Election operation and limits

## Defaults implemented

- Students verify an emailed code at `/vote-access`; there is no separate signup form or password. An internal identity is created on first verification, but this does not grant voting rights.
- The election committee provides an approved list of **email + matric number** pairs. Eligibility checks the verified account email against that list. A matric number alone is never accepted as authentication.
- Each election has one ballot containing all its offices. Each office requires one candidate choice or an explicit abstention.
- Students review the whole ballot before submitting it once. There are no revisions after submission.
- Candidate selections are inserted atomically with participation. A unique election/user constraint and a unique election/email constraint prevent repeat voting. Duplicate matric/email entries are rejected during voter-list import.
- The voting window uses timestamps, displayed/entered in Nigeria time (UTC+01:00).
- Scheduling locks rules, dates, candidates, offices and the voter list. Drafts can be edited and the draft list replaced. This first release does not support reopening, extending or cancelling a scheduled election through the UI.
- Results stay hidden until the closing time has passed and an election officer/admin explicitly releases them. Staff do not get live candidate totals. Public results include total participation, eligible count, candidate totals and abstentions. The committee handles ties/runoffs under its published rules; the app does not invent a winner policy.

## Privacy model

The application keeps participation and a random receipt in one private table. Ballot choices go into a different private table with a separate ballot ID and no voter identity, receipt or timestamp. Browser state is cleared after submission. Choices are never placed in URLs, local storage or analytics. Staff application accounts cannot read raw ballots or the participation register; the admin summary exposes only voter-list size and setup actions.

This is **application-level separation, not cryptographic end-to-end verifiable anonymous voting**. Database owners and infrastructure operators remain trusted. They can access underlying database records, transaction traces, backups and potentially correlate activity. Do not claim that the system hides choices from the database owner. Do not add request-body logging, session replay or analytics to ballot actions. Establish acceptable privacy, oversight and grievance procedures with the committee before a real election.

A participation receipt confirms a submission but is not a receipt for a particular candidate. This is intentional. The app has no coercion resistance or independent cryptographic tally proofs. Plan an independent technical review before relying on this build for the live association election.

## Committee decisions still needed

Confirm the source and accuracy of the voter list; whether dues/level/programme affect eligibility; whether the proposed one-ballot/abstention model matches the constitution; who can act as election officers; complaint/recount procedure; tie/runoff rules; the publication process; and the student-data retention/deletion period. The app's defaults can be adjusted once these are settled.

## Staging rehearsal

Use a separate test project. Create distinct test accounts as admin, editor, eligible student and ineligible student. Test:

1. Draft visibility and staff access boundaries.
2. Two or more offices, multiple candidates, statements and an explicit abstention.
3. Duplicate emails/matrics reject the entire import without deleting the previous roster.
4. Email verification and eligibility. Check corrected emails before scheduling; access to someone else's matric number must not grant voting rights.
5. Scheduling, future start time and immutable candidates/roster afterward.
6. Submit one ballot, refresh, then attempt a second submission from another tab. Only one ballot should exist.
7. Close the browser while submitting, sign back in and use the receipt/status to resolve whether the vote recorded. Never rely on browser state alone.
8. Voting closure and results inaccessible before officer release.
9. Published totals and abstentions reconcile to participation for every office.
10. Keyboard access, screen reader labels, small Android screens, slow data and email delivery.

The included PGlite tests cover database invariants locally, but are not a replacement for this live-service rehearsal, concurrency/load checks and human review.

## Activate only after review

Two switches must be enabled. In the production database, after readiness is approved:

```sql
update private.settings set voting_enabled = true where id = true;
```

Set `ELECTION_VOTING_ENABLED=true` in Vercel and redeploy. Both switches default to off. Closing the emergency database switch blocks direct database RPC calls as well as the website:

```sql
update private.settings set voting_enabled = false where id = true;
```

Do not use the emergency switch as an informal election extension. Record and communicate interruptions under the agreed committee process.

## Integrity and operations

- Create and test a backup/restore procedure, with access restricted to the responsible office.
- Use named accounts and assign election access from `/admin/staff`. Review and revoke access after handover.
- The activity log records creation, draft edits, roster imports, scheduling and result release; it does not log voter choices. It is not a tamper-proof external audit ledger.
- Keep system clocks correct and check monitoring during the voting window. The database evaluates opening/closing times and serialises casts with election state changes. Do not deploy schema changes during voting.
- The server and database both validate ballots. Browser disabled buttons are conveniences, never the enforcement boundary.
- Review dependency security advisories and apply current patches before opening the site or accepting ballots.
- Determine how long to keep eligibility records, participation and ballots. There is no automatic retention deletion job in this release.
