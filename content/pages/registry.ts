// Every component-backed page and its editable fields (what /admin/content lists).
import {flatten,leavesFromRecord,type Leaf} from '@/lib/page-data';
import {aboutDefaults} from './about';
import {academicsDefaults} from './academics';
import {communitiesDefaults} from './communities';
import {contactDefaults} from './contact';
import {feedbackDefaults} from './feedback';
import {homeDefaults} from './home';
import {articlesDefaults} from './articles';
import {eventsDefaults} from './events';
import {news_eventsDefaults} from './news-events';
import {referencesDefaults} from './references';
import {resources_rulesDefaults} from './resources-rules';
import {stories_bug_in_the_briefDefaults} from './stories-bug-in-the-brief';
import {stories_first_pull_requestDefaults} from './stories-first-pull-request';
import {stories_security_is_a_habitDefaults} from './stories-security-is-a-habit';
import {stories_start_before_readyDefaults} from './stories-start-before-ready';
import {headerDefaults} from './chrome-header';
import {footerDefaults} from './chrome-footer';
import {navigationDefaults} from './chrome-navigation';
export type PageDef={title:string;leaves:Leaf[]};
export const pageRegistry:Record<string,PageDef>={
 '/about':{title:'About SOC',leaves:flatten(aboutDefaults)},
 "/academics":{title:"Academics — Compiled By SOC",leaves:leavesFromRecord(academicsDefaults)},
 "/communities":{title:"Communities — Compiled By SOC",leaves:leavesFromRecord(communitiesDefaults)},
 "/contact":{title:"Contact — Compiled By SOC",leaves:leavesFromRecord(contactDefaults)},
 "/feedback":{title:"Feedback & welfare — Compiled By SOC",leaves:leavesFromRecord(feedbackDefaults)},
 "/":{title:"Compiled By SOC — The School of Computing Journal",leaves:leavesFromRecord(homeDefaults)},
 "/news-events/a1":{title:"Course Registration for All Levels Closes March 25 — Complete Yours Now — Compiled By SOC",leaves:leavesFromRecord(articlesDefaults["/news-events/a1"])},
 "/news-events/a2":{title:"SOC Students Win First Place at National App Development Competition in Abuja — Compiled By SOC",leaves:leavesFromRecord(articlesDefaults["/news-events/a2"])},
 "/news-events/a3":{title:"Cybersecurity Research on Network Vulnerabilities in Nigerian Banks Published — Compiled By SOC",leaves:leavesFromRecord(articlesDefaults["/news-events/a3"])},
 "/news-events/a4":{title:"Google Cybersecurity Certificate Now Available to SOC Students Free of Charge — Compiled By SOC",leaves:leavesFromRecord(articlesDefaults["/news-events/a4"])},
 "/news-events/a5":{title:"SOC Students Fangirl Over Hot PRO 👀 — Compiled By SOC",leaves:leavesFromRecord(articlesDefaults["/news-events/a5"])},
 "/news-events/feat":{title:"School of Computing Partners with Leading Nigerian Tech Firms for Student Internship Programme — Compiled By SOC",leaves:leavesFromRecord(articlesDefaults["/news-events/feat"])},
 "/news-events/g1":{title:"SOC Students Win National App Development Competition — Compiled By SOC",leaves:leavesFromRecord(articlesDefaults["/news-events/g1"])},
 "/news-events/g2":{title:"Cybersecurity Research on Nigerian Bank Vulnerabilities Published — Compiled By SOC",leaves:leavesFromRecord(articlesDefaults["/news-events/g2"])},
 "/news-events/g3":{title:"Google Cybersecurity Certificate Now Free for SOC Students — Compiled By SOC",leaves:leavesFromRecord(articlesDefaults["/news-events/g3"])},
 "/news-events/ev1":{title:"Second Semester Examinations Begin — April 14 to May 2, 2026 — Compiled By SOC",leaves:leavesFromRecord(eventsDefaults["/news-events/ev1"])},
 "/news-events/ev2":{title:"Annual SOC Hackathon 2026 — \"Tech for Nigeria\" — Compiled By SOC",leaves:leavesFromRecord(eventsDefaults["/news-events/ev2"])},
 "/news-events/ev3":{title:"Industry Guest Lecture — AI in Nigerian Banking & Fintech — Compiled By SOC",leaves:leavesFromRecord(eventsDefaults["/news-events/ev3"])},
 "/news-events/ev4":{title:"Final Year Project Presentations — All Departments — Compiled By SOC",leaves:leavesFromRecord(eventsDefaults["/news-events/ev4"])},
 "/news-events":{title:"News & Events — Compiled By SOC",leaves:leavesFromRecord(news_eventsDefaults)},
 "/news-events/reference-10":{title:"New SOC Website Launched — Built by ZekaniK — Compiled By SOC",leaves:leavesFromRecord(referencesDefaults["/news-events/reference-10"])},
 "/news-events/reference-11":{title:"SOC Tech Talk: \"AI in Nigeria — Opportunities & Challenges\" — Compiled By SOC",leaves:leavesFromRecord(referencesDefaults["/news-events/reference-11"])},
 "/news-events/reference-4":{title:"SOC Welcome Week 2026 — Photos & Highlights — Compiled By SOC",leaves:leavesFromRecord(referencesDefaults["/news-events/reference-4"])},
 "/news-events/reference-5":{title:"Semester 2 Timetable Released — Check the Student Portal — Compiled By SOC",leaves:leavesFromRecord(referencesDefaults["/news-events/reference-5"])},
 "/news-events/reference-6":{title:"Departmental Dues Payment Deadline — January 31, 2026 — Compiled By SOC",leaves:leavesFromRecord(referencesDefaults["/news-events/reference-6"])},
 "/news-events/reference-7":{title:"SOC Students Secure Internships at Flutterwave and Paystack — Compiled By SOC",leaves:leavesFromRecord(referencesDefaults["/news-events/reference-7"])},
 "/news-events/reference-8":{title:"First Semester Exams Begin December 10 — Timetable Inside — Compiled By SOC",leaves:leavesFromRecord(referencesDefaults["/news-events/reference-8"])},
 "/news-events/reference-9":{title:"SOC Tech Talk Series: \"AI in Nigeria — Opportunities & Challenges\" — Compiled By SOC",leaves:leavesFromRecord(referencesDefaults["/news-events/reference-9"])},
 "/resources/rules":{title:"Rules & Regulations — Compiled By SOC",leaves:leavesFromRecord(resources_rulesDefaults)},
 "/stories/bug-in-the-brief":{title:"Sometimes, the bug is in the brief. — Compiled By SOC",leaves:leavesFromRecord(stories_bug_in_the_briefDefaults)},
 "/stories/first-pull-request":{title:"Your first pull request is a conversation. — Compiled By SOC",leaves:leavesFromRecord(stories_first_pull_requestDefaults)},
 "/stories/security-is-a-habit":{title:"Good security is a habit, not a hoodie. — Compiled By SOC",leaves:leavesFromRecord(stories_security_is_a_habitDefaults)},
 "/stories/start-before-ready":{title:"You don’t need permission to build something. — Compiled By SOC",leaves:leavesFromRecord(stories_start_before_readyDefaults)},
 "@header":{title:"Shared header",leaves:leavesFromRecord(headerDefaults)},
 "@footer":{title:"Shared footer",leaves:leavesFromRecord(footerDefaults)},
 "@navigation":{title:"Navigation & dialogs",leaves:leavesFromRecord(navigationDefaults)}
};
