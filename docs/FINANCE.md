# Payments and finance operations

## Student experience

At `/pay-dues`, a student chooses an active payment item, gives name/email/matric/programme/level and prepares a payment. There is no account creation. They keep the generated reference and private receipt access code, then continue to Paystack. Card details stay with Paystack.

The callback and signed webhook both verify the transaction through Paystack before marking it paid. The reference, amount, currency, environment and email must match the database reservation. The price comes from the published item; changing the browser or editing an item's later price cannot change an existing reservation.

A private browser cookie opens the receipt on the same device for 14 days. The reference plus saved access code restores access from another device without signup. The receipt code is stored only as a hash in the database and is excluded from staff responses/exports. If both cookie and code are lost, the student contacts finance; no identity-free reference lookup exposes their personal details. Finance verifies the claim through its normal procedure. No automatic emailed receipt-recovery system is included.

A pending, failed or review record is not a paid receipt. If charged but not confirmed, the student refreshes status or contacts finance instead of starting another payment. “Start a different payment” makes a new attempt; use it deliberately after resolving the previous one.

## Finance desk

Only assigned finance executives and full administrators can open `/admin/finance` or export its records. Other executives cannot read the register through the database either.

- Create/edit/activate payment items. Enter the price in naira; the ledger stores integer kobo.
- Filter by matric, status, test/live mode and date (Nigeria time). Export matching records as CSV. Amount and fee columns explicitly use kobo.
- Open a record for student details, provider reference, payment status, fee, timestamps, notes and provider events.
- “Check Paystack” reruns provider verification. Staff cannot manually switch a payment to paid or edit a captured amount.
- Add dated notes for enquiries, reconciliations, duplicate-payment resolution and provider refund IDs. Notes are append-only through the application. Database owners remain trusted and can access underlying records.
- Print the student receipt or use the browser's Save as PDF. Test receipts explicitly say they are not proof of dues.

Gross live captured totals exclude test transactions, pending/failed records and known mismatches. They are **not a bank settlement or refund-adjusted balance**. Known provider fees are shown separately. Reconcile settlements, partial/full refunds and disputes in Paystack. Signed refund/dispute events are recorded and flagged where they match a known reference or provider transaction ID; the app neither issues refunds nor silently subtracts them from historical gross amounts.

Duplicate webhook/verification deliveries do not duplicate successful records. If two distinct real charges were captured for the same student/item, both are retained and the later one links to the first for review. The app must not hide money actually received. New attempts are blocked once a successful item/matric payment is already recorded in that environment.

## Test before opening payments

1. Use test credentials and an active test item. Confirm checkout succeeds without student sign-in.
2. Finish a provider test payment; confirm exact amount, reference, name/matric, TEST label and receipt.
3. Refresh the callback and resend the same signed webhook. One payment remains, with no duplicate verification entry.
4. Test failed/abandoned checkout. It must not become a paid receipt. If no failure webhook is provided, refresh/reconcile to retrieve its latest state.
5. Retrieve the receipt with its reference/code from another browser. A wrong code or missing cookie must not disclose payment details.
6. Verify finance access from one executive and denial from an academics-only executive; disable finance access and retest.
7. Export a filtered set and reconcile kobo totals against the same rows. Confirm receipt hashes and authorization links are absent.
8. Exercise duplicate captured payments and refund/dispute notices in a safe provider test environment; verify finance flags and note the resolution.
9. Simulate provider/network interruption. The app must retain an unresolved record and never infer paid status from a redirect or browser message.
10. Check usability, printing and receipt-code copying on a small phone and desktop.

Checkout and recovery requests have server-side rate limits (12 per 15-minute key bucket). Keep provider protection and monitoring enabled; these limits alone are not a general anti-abuse service. Periodically purge expired entries in `private.request_limits` through an authorised maintenance process, and set a retention policy for finance data/backups.

No bank account details, card data or credentials are stored in this archive. Live Paystack, webhook, email and R2 checks have not yet been performed.
