# Compiled By SOC — design direction

## Current phase

Application build v34 adds integrated page editing, scoped executive accounts and guest Paystack checkout with a finance register. All website content management lives in the admin dashboard. Students browse and pay without registration; election access uses an email code. Next.js serves the retained design, Supabase stores content and permissions, and R2 stores media. Live providers still need configuration and verification.

Keep the existing ASCII hero and CMD navigation. The navigation stays in terminal style on every page. The rest of the site can use a distinct visual system. C_ is the logo, with black and ash treatment outside the CLI areas. Mobile navigation includes a small “Compiled By SOC” name. Do not restore the removed portrait or shell-user path.

**Current responsive direction:** desktop keeps tactile maximalism in black, white and grey with borders, offset shadows, layered paper and bold typography. Mobile intentionally uses a simple, approachable interface. Photographs retain their natural colour. Desktop section navigation uses an icon-led sticky card beside its content; mobile uses one Sections button and a bottom sheet instead of scrolling page tabs. Keep the layouts useful on mobile and animate transforms and opacity only. The home page now starts its non-terminal area with everyday student tasks.

## Purpose and ownership

A student-led daily hub for the School of Computing at Maduka University, serving roughly 200 students across Computer Science, Software Engineering and Cybersecurity, levels 100–400. Every page should help current students do something. The existing WhatsApp channel and website should support each other.

The platform belongs to the PRO office. Domain, hosting, GitHub and administrator accounts use the PR team's shared email. The future build includes a README, admin guide and handover checklist, with an agreed “Built by [name]” credit in the footer and About page.

## Navigation and home

Header: logo, search, Pay Dues and hamburger. Slide-in navigation groups: Home, Updates, Study, Pay, About, Community (including Feedback), Contact. A floating feedback control appears on every page.

Below the existing hero: Timetable, Materials, Events and Dues quick actions; a full-width campus-photo carousel; department-and-level preferences for the feed; next-event countdown; pinned notice; WhatsApp join button; monthly pulse poll.

Carousel: 4–6 approved photos and short text. Desktop keeps the action links, controls and 5–6 second crossfade. Mobile shows pictures and words only, with manual swipe and keyboard navigation and no autoplay. Both support reduced motion and lazy loading after the first slide. Future admin controls include order, enable/disable, dates and click tracking. Recognisable people must consent to photo use.

## Student areas

- **Updates:** announcements, news, approved student articles with bylines, events with RSVP and QR check-in, polls, and an opportunities board with deadlines.
- **Study:** class and exam timetables filtered by programme and level; materials, past questions and course outlines; research with abstracts, authors, tags and PDFs or links; peer tutoring. Research requires author consent and approval.
- **Pay:** bank-transfer instructions, proof upload, finance verification, payment-status check and receipts, plus a “where your dues go” page. Paystack is a later addition.
- **About:** vision, mission, NACOS constitution summary and PDF, rules, dress code with photos, lecturer and executive directories, and a practical freshers' guide.
- **Community:** affiliations with join actions, clubs, student spotlights, builders wall, student businesses, lost and found, ICT/Wi-Fi reporting, welfare and feedback.
- **Contact:** form, office hours and approved social links.

## Feedback and trust

Named or anonymous feedback with a tracking code and Received, Reviewing and Resolved states. Categories include bugs, suggestions, complaints, event feedback, welfare, dues, and course or lecturer feedback. Route each to the responsible office. Suggestions can be public and upvoted; complaints stay private. Include “You said, we did”, event ratings and a monthly pulse poll.

Course and lecturer feedback is anonymous, private to the HOD, and shown only in aggregate above an agreed minimum response count. No public lecturer ratings. Clearly state who can read sensitive submissions; final complaint-access policy needs agreement. Anonymous forms require rate limits and spam moderation. Payment proofs and matric numbers are restricted to finance and admins.

## Application direction and remaining requirements

Next.js on Vercel, Supabase for database/auth and Cloudflare R2 for files, Tailwind, shadcn/ui, Motion for small interactions and limited GSAP scroll effects. Separate the UI from the data layer. Mobile first, installable PWA with an install invitation after a few visits, fast on mid-range Android and mobile data. Use transform/opacity animations, compressed and lazy-loaded media, reduced-motion support, and real low-end-phone testing.

Global search spans the platform. The admin dashboard is the CMS: Tiptap, image/PDF uploads, drafts, publishing, scheduling and a student-submission approval queue. PRO has full control; executives manage assigned areas; class reps upload materials and class notices; students read, RSVP and submit feedback, articles and research. Admin forms manage content, slides and ads without code.

Announcements are mirrored to the WhatsApp channel with a link back to the site; an optional email digest follows. These are future integrations, not automatic external messaging in the mockup.

## Advertising

Eight labelled, fixed-size placements: home banner under quick actions; one sponsored carousel slide; roughly every fifth Updates card; Events “Presented by” strip; slim banner under the timetable; banner above materials; end-of-article card; featured business-directory listing. No ads on Pay, feedback/welfare forms or admin pages. No pop-ups, autoplay video or sound.

All ads require approval, advertiser/image/link/date/enable controls, and impression/click reporting. Empty slots show a house ad. Premium: slots 1–2; Standard: 3–6; Featured: 7–8. Offer launch concessions for student businesses. Exclude betting and dubious loan apps. PR-team income and its use are published transparently.

## Content and launch

No invented achievements, quotes, research or unapproved factual claims. Replace all placeholders before launch. Test with the existing WhatsApp channel, track visits and useful actions, and introduce the site and channel at orientation. October 8 is the stated target; design approval and implementation readiness still determine what can launch.

## News and journal visual reference (October 11)

Use rectangular editorial cards with wide cover images, category/date overlays, bold sans-serif titles, quiet excerpts and a byline/read-more footer. Unpictured posts use the dark grid treatment. Recent posts use compact dated rows. Mobile cards are flat and square-edged; desktop keeps tactile borders and offset shadows. Preserve the CMD navigation, mobile section picker and swipe-only mobile carousel.

## Important Stuff and election foundation (October 11)

Important Stuff brings together announcements, approved rules/documents and elections. Desktop retains a sidebar; mobile uses one filter button with a sheet. Calendar views and event details open as popups. The Study title is “You never liked scrolling anyways. Get what you need right here.”

The first election implementation uses verified email, a committee-approved email/matric roster, one final ballot per student with one choice or abstention per office, frozen scheduled ballots and officer-released results after closing. Ballots and participation are held separately with restricted application access; this is not cryptographic anonymity from the database owner. Committee rules, eligibility policy and live-service review remain pending. Voting is disabled by default at the server and database. See docs/ELECTIONS.md.
