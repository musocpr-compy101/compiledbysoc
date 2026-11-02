"""Student-facing mockup surfaces. No live records, payments or submissions."""
from html import escape
from pathlib import Path
import json
import re
from reference_dom import Node, parse
from editorial_design import fragment, replace_node

ROOT = Path(__file__).resolve().parents[1]


def icon(name):
    paths = {
        'calendar': '<rect x="4" y="5" width="24" height="23" rx="2"/><path d="M4 12h24M10 2v6M22 2v6M10 18h4M19 18h3M10 23h4"/>',
        'folder': '<path d="M3 9V6h10l3 4h13v17H3V9Z"/><path d="M3 14h26M10 20h12"/>',
        'event': '<path d="m16 3 3 9 10 1-8 6 3 10-8-6-8 6 3-10-8-6 10-1Z"/>',
        'receipt': '<path d="M7 3h18v26l-4-3-5 3-5-3-4 3V3Z"/><path d="M12 10h8M12 15h8M12 20h4"/>',
    }
    return f'<svg viewBox="0 0 32 32" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true">{paths[name]}</svg>'


def action(label, href, cls='t-button'):
    return f'<a class="{cls}" href="{href}">{label}</a>'


def unavailable(label, message, cls='t-button'):
    return f'<button type="button" class="{cls}" data-unavailable="{escape(label, quote=True)}" data-unavailable-message="{escape(message, quote=True)}">{escape(label)}</button>'


def ad(slot, text='Your next customers are already on campus.', compact=False):
    return f'<aside class="t-ad {"t-ad--slim" if compact else ""}" data-ad-slot="{slot}" aria-label="Sponsored placement"><span class="t-tag">Sponsored · house ad</span><strong>{text}</strong><a href="/contact/#contact-form">Advertise with SOC</a></aside>'


def strip_eyebrows(html):
    """Remove eyebrow labels, including ones that contain nested tags."""
    start = re.compile(r'<(p|span|div) class="(?:t-eyebrow|eyebrow|nl-eyebrow)"[^>]*>')
    while True:
        m = start.search(html)
        if not m:
            return html
        tag, depth = m.group(1), 1
        for t in re.finditer(r'<(/?)' + tag + r'\b[^>]*>', html[m.end():]):
            depth += -1 if t.group(1) else 1
            if depth == 0:
                html = html[:m.start()] + html[m.end() + t.end():]
                break
        else:
            return html


def select_filters(prefix='study'):
    return f'''<div class="t-filters" data-preference-group="{prefix}"><label>Programme<select data-programme aria-label="Programme"><option value="all">All programmes</option><option value="cs">Computer Science</option><option value="se">Software Engineering</option><option value="cy">Cybersecurity</option></select></label><label>Level<select data-level aria-label="Level"><option value="all">All levels</option>{''.join(f'<option value="{n}">{n} level</option>' for n in (100,200,300,400))}</select></label></div>'''


def home(journal):
    tiles = [('calendar','Timetable','Know where to be.','/academics/#tab-timetable'),('folder','Materials','A little less searching.','/academics/#tab-materials'),('event','Events','Make room for this.','/news-events/#tab-events'),('receipt','Dues','Keep it sorted.','/pay-dues/')]
    quick = ''.join(f'<a class="t-quick" href="{url}"><span class="t-quick-top">{icon(i)}<span>0{n}</span></span><strong>{label}</strong><span>{sub}</span></a>' for n,(i,label,sub,url) in enumerate(tiles,1))
    slides = [
        ('img-5577.webp','OUR PEOPLE. OUR IDEAS.','Meet the builders.','Student projects, experiments and things worth sharing.','/communities/#tab-builders','Explore the builders wall'),
        ('topview.webp','THE STUDY EDIT','Less searching.<br>More studying.','Find materials, past questions and course outlines.','/academics/#tab-materials','Open the library'),
        ('img-6291.webp','KEEP IT SORTED','One less thing<br>on your list.','Your dues, proof of payment and status in one place.','/pay-dues/','View dues'),
        ('sunset.webp','SPONSORED · HOUSE AD','Take SOC<br>with you.','Catch the next announcement on the WhatsApp channel.','channel','Join the channel')]
    carousel = ''
    for i,(img,eyebrow,title,desc,link,label) in enumerate(slides):
        source = f'src="/assets/tactile/{img}" fetchpriority="high"' if i == 0 else f'data-src="/assets/tactile/{img}" loading="lazy"'
        cta = unavailable(label,'The official WhatsApp channel link will be added by the PRO office.') if link=='channel' else action(label,link)
        alt = ['Students walking near campus buildings', 'An overhead view of Maduka University', 'A student holding a Maduka University card', 'Sunset over campus'][i]
        carousel += f'<article class="t-slide {"is-active" if i==0 else ""}" data-campus-slide aria-hidden="{str(i!=0).lower()}"{ " inert" if i else ""}{" data-ad-slot=\"2\"" if i==3 else ""}><img {source} width="1400" height="850" alt="{alt}" decoding="async"><div class="t-slide-copy"><span class="t-tag">{eyebrow}</span><h2>{title}</h2><p>{desc}</p>{cta}</div></article>'
    feed = ''.join(f'<article class="t-feed-card" data-feed-card data-programmes="{p}" data-levels="{l}"><div class="t-card-meta"><span>{tag}</span><span class="t-new">New</span></div><h3><a href="{url}">{title}</a></h3><p>{desc}</p><div class="t-card-end"><span>{audience}</span><span>Sample post</span></div></article>' for p,l,tag,title,desc,url,audience in [
        ('all','all','STUDENT LIFE','First week? Start here.','Registration, who to ask and the little things that help you settle in.','/about/#tab-freshers','All students'),
        ('cs se','200','STUDY / CSC 201','The revision folder, without the group-chat scroll.','A sample materials card showing how class-rep uploads will appear.','/academics/#tab-materials','CS + SE / 200 level'),
        ('cy','300','COMMUNITY','Find someone to learn security with.','Explore the club directory and peer tutoring.','/communities/#tab-groups','Cybersecurity / 300 level'),
        ('all','all','FROM THE PRO OFFICE','Help shape your student hub.','Try the feedback mockup and see how a suggestion moves through the queue.','/feedback/','All students')])
    return f'''<div class="t-home" id="student-desk"><section class="t-section t-desk"><div class="t-section-top"><span class="t-eyebrow">01 / THE STUDENT DESK</span><span class="t-stamp">BY STUDENTS.<br>FOR STUDENTS.</span></div><h2 class="t-display t-hands">SOC in your <span>Hands</span></h2><div class="t-quick-grid">{quick}</div>{ad(1)}</section>
<section class="t-section t-fresh" id="freshmen"><span class="t-shape t-shape--a" aria-hidden="true"></span><span class="t-shape t-shape--b" aria-hidden="true"></span><span class="t-shape t-shape--c" aria-hidden="true"></span><span class="t-shape t-shape--d" aria-hidden="true"></span><div class="t-fresh-icons" aria-hidden="true"><span class="t-ico" style="--x:6%;--y:7%;--r:-15deg;--s:50px;--c:#2d8a57;--mx:71px;--my:-87px;--d:0.00s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg></span><span class="t-ico" style="--x:86%;--y:5%;--r:10deg;--s:38px;--c:#e0533d;--mx:-53px;--my:-53px;--d:0.45s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="M8 10l3 2-3 2M13 15h4"/></svg></span><span class="t-ico" style="--x:47%;--y:2%;--r:8deg;--s:38px;--c:#8a5bb5;--mx:-32px;--my:-85px;--d:0.90s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4c-3 0-3 2-3 4s0 3-2 4c2 1 2 2 2 4s0 4 3 4M15 4c3 0 3 2 3 4s0 3 2 4c-2 1-2 2-2 4s0 4-3 4"/></svg></span><span class="t-ico" style="--x:21%;--y:27%;--r:2deg;--s:56px;--c:#d99a00;--mx:-45px;--my:-85px;--d:1.35s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg></span><span class="t-ico" style="--x:74%;--y:21%;--r:-21deg;--s:56px;--c:#2d8a57;--mx:-90px;--my:-76px;--d:1.80s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7v8"/><circle cx="6" cy="18" r="2.5"/><circle cx="6" cy="4.5" r="2.5"/><circle cx="18" cy="7" r="2.5"/><path d="M18 9.5c0 5-12 3-12 6"/></svg></span><span class="t-ico" style="--x:92%;--y:44%;--r:12deg;--s:38px;--c:#8a5bb5;--mx:33px;--my:-76px;--d:2.25s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg></span><span class="t-ico" style="--x:3%;--y:56%;--r:11deg;--s:38px;--c:#e0533d;--mx:-48px;--my:-64px;--d:2.70s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 8a3 3 0 016 0v7a3 3 0 01-6 0z"/><path d="M4 9l4 2M20 9l-4 2M3 15h5M21 15h-5M5 21l4-3M19 21l-4-3M10 5L8 3M14 5l2-2"/></svg></span><span class="t-ico" style="--x:40%;--y:45%;--r:10deg;--s:44px;--c:#d99a00;--mx:-66px;--my:-71px;--d:3.15s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h14M5 15h14M10 4L8 20M16 4l-2 16"/></svg></span><span class="t-ico" style="--x:63%;--y:63%;--r:-18deg;--s:44px;--c:#2d8a57;--mx:-53px;--my:-84px;--d:3.60s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4 4 0 010-8 5 5 0 019.6-1A4.5 4.5 0 0117 18z"/></svg></span><span class="t-ico" style="--x:13%;--y:81%;--r:12deg;--s:38px;--c:#8a5bb5;--mx:-69px;--my:-77px;--d:4.05s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6h14v9H5zM2 19h20"/></svg></span><span class="t-ico" style="--x:84%;--y:79%;--r:19deg;--s:56px;--c:#e0533d;--mx:79px;--my:-70px;--d:4.50s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12.5h6V16H9zM10 12.5V11a2 2 0 014 0v1.5"/></svg></span><span class="t-ico" style="--x:50%;--y:91%;--r:13deg;--s:56px;--c:#d99a00;--mx:53px;--my:-71px;--d:4.95s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a15 15 0 0120 0M5 12.5a10.5 10.5 0 0114 0M8.5 16a5.5 5.5 0 017 0M12 19.5h.01"/></svg></span><span class="t-ico" style="--x:30%;--y:64%;--r:-13deg;--s:44px;--c:#2d8a57;--mx:-35px;--my:-54px;--d:5.40s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="M8 10l3 2-3 2M13 15h4"/></svg></span><span class="t-ico" style="--x:68%;--y:40%;--r:9deg;--s:50px;--c:#e0533d;--mx:86px;--my:-69px;--d:5.85s" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg></span></div><div class="t-fresh-inner"><div class="t-heading-row"><div><h2 class="t-display t-display--section">HEY <span>FRESHMEN!</span></h2></div><span class="t-tag">Design preview</span></div><p class="t-fresh-intro">First week at the School of Computing? Four quick stops to get settled. Details are confirmed by the PRO office before launch.</p><div class="t-fresh-layout"><figure class="t-fresh-photo"><img src="/assets/tactile/topview.webp" alt="View over the Maduka University campus" loading="lazy" width="800" height="600"><figcaption>Welcome to campus</figcaption></figure><div class="t-fresh-path" data-fresh-path><a class="t-fresh-card t-fresh--sage" href="/about/"><span class="t-fresh-num">1</span><strong>Read the freshers’ guide</strong><span>Rules, dress code and what to expect.</span></a><a class="t-fresh-card t-fresh--butter" href="/academics/"><span class="t-fresh-num">2</span><strong>Find your timetable</strong><span>Pick your programme and level.</span></a><a class="t-fresh-card t-fresh--coral" href="/communities/"><span class="t-fresh-num">3</span><strong>Meet your people</strong><span>Clubs, reps and peer tutoring.</span></a><a class="t-fresh-card t-fresh--lilac" href="/pay-dues/"><span class="t-fresh-num">4</span><strong>Sort your dues</strong><span>Instructions and status check.</span></a><svg class="t-fresh-lines" aria-hidden="true"></svg></div></div></div></section>
<section class="t-campus" aria-roledescription="carousel" aria-label="Around SOC" tabindex="0" data-campus-carousel>{carousel}<div class="t-carousel-controls"><span data-slide-position aria-live="polite">01 / 04</span><div class="t-carousel-dots">{''.join(f'<button type="button" data-campus-dot="{i}" aria-label="Show slide {i+1}" aria-pressed="{str(i==0).lower()}"><span></span></button>' for i in range(4))}</div><button type="button" data-campus-pause aria-label="Pause carousel">Pause</button></div><button type="button" class="t-arrow t-arrow--prev" data-campus-prev aria-label="Previous slide"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><button type="button" class="t-arrow t-arrow--next" data-campus-next aria-label="Next slide"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></section>
<section class="t-section" id="your-feed"><div class="t-heading-row"><div><p class="t-eyebrow">02 / YOUR CORNER OF SOC</p><h2 class="t-display t-display--section">THE FEED<span class="t-period">.</span></h2></div><span class="t-tag">Sample feed · design preview</span></div><div class="t-feed-preferences"><p>Make it relevant to you.</p>{select_filters('feed')}</div><div class="t-feed-layout"><div><div class="t-feed-list">{feed}</div><p class="t-meta" data-feed-status role="status"></p></div><aside class="t-feed-aside"><article class="t-note t-note--pinned"><span class="t-eyebrow">PINNED / FROM THE PRO OFFICE</span><h3>One home for the things you keep asking for.</h3><p>This is the design preview. Current notices, timetables and payment details will appear after approval.</p>{action('Meet your representatives','/communities/#tab-people','t-text-link')}</article><article class="t-countdown"><span class="t-eyebrow">NEXT ON THE CALENDAR</span><h3>Keep a day<br>for SOC.</h3><div class="t-clock"><span><b>—</b>Days</span><span><b>—</b>Hours</span><span><b>—</b>Mins</span></div><p>Next event date awaiting confirmation.</p>{action('Explore events','/news-events/#tab-events','t-text-link')}</article></aside></div></section>
<section class="t-section t-pulse-section"><div><p class="t-eyebrow">03 / THE MONTHLY PULSE</p><h2 class="t-display t-display--section">YOUR TWO<br><span>CENTS.</span></h2><p>What would help you most this semester?</p></div>{poll()}</section>
<section class="t-channel"><div><span class="t-eyebrow">100+ STUDENTS. ONE CHANNEL.</span><h2>DON’T MISS<br>THE MEMO.</h2><p>SOC updates, straight to your WhatsApp.</p></div>{unavailable('Join the channel','The official WhatsApp channel link will be added by the PRO office.')}</section></div>{journal}'''


def poll():
    return '''<form class="t-poll" data-demo-poll><span class="t-tag">Preview poll</span><fieldset><legend class="sr-only">What would help most?</legend><label><input type="radio" name="pulse" value="materials" required> Easier access to materials</label><label><input type="radio" name="pulse" value="tutorials"> More peer tutorials</label><label><input type="radio" name="pulse" value="events"> More events & opportunities</label></fieldset><button type="submit" class="t-button">Cast a preview vote</button><p class="t-meta" role="status" data-poll-status>Your choice is a demo; no vote is submitted.</p></form>'''


def section(title, description, content, tag='STUDENT DESK'):
    return f'<section class="section t-workspace"><p class="t-eyebrow">{tag}</p><h2 class="t-section-title">{title}</h2><p class="t-intro">{description}</p>{content}</section>'


def add_tab(root, key, title, content, first=False):
    nav = root.find(cls='tab-nav') or root.find(cls='main-tabs')
    panels = root.find(cls='section-panels')
    btnclass='main-tab' if nav.has('main-tabs') else 'tab-btn'
    button=fragment(f'<button class="{btnclass}" type="button" data-tab-group="main" data-tab-target="tab-{key}" data-section-label="{title}"><span class="section-number" aria-hidden="true">+</span>{title}</button>')
    panel=fragment(f'<div class="tab-content" id="tab-{key}">{content}</div>')
    if first:
        for n in nav.all(tag='button'):
            n.attrs['class']=n.attrs.get('class','').replace(' active','')
        for n in panels.children:
            if isinstance(n,Node): n.attrs['class']=n.attrs.get('class','').replace(' active','')
        button.add_class('active'); panel.add_class('active')
        nav.children.insert(0,button);button.parent=nav
        panels.children.insert(0,panel);panel.parent=panels
    else:
        nav.append(button); panels.append(panel)


def adapt_page(root, slug):
    if slug=='academics':
        rows=''.join(f'<tr data-study-row data-programmes="{p}" data-levels="{l}"><td><span class="t-tag">{day}</span></td><td>{time}</td><td><strong>{code}</strong><span>{name}</span></td><td>{room}</td></tr>' for p,l,day,time,code,name,room in [
            ('cs se','200','MON','09:00–11:00','CSC 201','Sample computing class','Room pending'),('cy','300','TUE','11:00–13:00','CYB 301','Sample security class','Room pending'),('cs se cy','100','WED','09:00–11:00','COS 101','Sample introductory class','Room pending')])
        timetable=section('Know where to be.','Choose your programme and level. These sample entries show the layout, not the current class schedule.',select_filters()+f'<div class="t-tab-pills" role="group" aria-label="Timetable type"><button class="is-active" type="button" data-schedule="class" aria-pressed="true">Class timetable</button><button type="button" data-schedule="exam" aria-pressed="false">Exam timetable</button></div><div class="t-table-scroll" data-class-schedule><table class="t-table"><caption>Sample class timetable · not an approved schedule</caption><thead><tr><th>Day</th><th>Time</th><th>Course</th><th>Location</th></tr></thead><tbody>{rows}</tbody></table></div><p class="t-empty" data-exam-schedule hidden>Exam dates will appear when the approved timetable is uploaded.</p><p class="t-meta" data-study-status role="status"></p>'+ad(5,'A small space for student businesses.',True), 'STUDY / TIMETABLE')
        materials=section('The shared folder.','Past questions, notes and course outlines, organised by the people in your class.',ad(6,'Make your business part of the study break.',True)+select_filters('materials')+'<div class="t-resource-list">'+''.join(f'<article class="t-resource" data-material-card data-programmes="{p}" data-levels="{l}"><span class="t-file">{kind}</span><div><span class="t-eyebrow">{code} / {l} LEVEL</span><h3>{title}</h3><p>Sample listing · file awaiting class-rep upload</p></div>'+unavailable('View details','This is a sample material listing. No approved file has been uploaded yet.','t-button t-button--light')+'</article>' for p,l,kind,code,title in [('cs se','200','PDF','CSC 201','Past questions'),('all','100','PDF','COS 101','Lecture notes'),('se','300','PDF','SEN 301','Course outline'),('cy','300','PDF','CYB 301','Revision material')])+'</div><p class="t-meta" data-material-status role="status"></p>', 'STUDY / MATERIALS')
        tutoring=section('Learn it together.','Seniors can offer a little guidance on the courses they know.', '<div class="t-grid-two"><article class="t-paper"><span class="t-tag">PEER TUTORING</span><h3>Need a study partner?</h3><p>Approved tutor profiles will list courses, availability and a contact method.</p>'+unavailable('Find a tutor','Tutor names and available courses will appear after students opt in and the academics team approves them.')+'</article><article class="t-paper t-paper--grey"><h3>Know a course well?</h3><p>Offer your time and help someone a level behind you.</p>'+unavailable('Offer to tutor','The tutor submission form is part of the later build. This mockup does not collect your details.')+'</article></div>')
        add_tab(root,'tutoring','Peer tutoring',tutoring)
        add_tab(root,'materials','Materials',materials)
        add_tab(root,'timetable','Timetable',timetable,True)
        research=root.find(id='tab-research')
        research.children.insert(0,fragment('<div class="t-inline-note"><strong>Research needs its authors.</strong><p>Entries in this preview require verification and author consent before publication.</p>'+unavailable('Submit research','Research submissions will include title, abstract, authors, tags, PDF or link, and author consent. Nothing goes live before approval.')+'</div>'))
    elif slug=='news-events':
        add_tab(root,'opportunities','Opportunities',section('Keep your options open.','Internships, hackathons, scholarships and jobs. Only verified opportunities will be published.','<div class="t-grid-two">'+''.join(f'<article class="t-paper"><span class="t-tag">{kind}</span><h3>{title}</h3><p>Approved listings and deadline countdowns will appear here.</p><span class="t-meta">No live listing yet</span></article>' for kind,title in [('INTERNSHIPS','Your next place to learn.'),('HACKATHONS','Build something in a weekend.'),('SCHOLARSHIPS','Find support for your next step.'),('JOBS','Put your skills to work.')])+'</div>'))
        add_tab(root,'polls','Polls',section('A quick temperature check.','Try the monthly pulse interaction.',poll()))
        root.find(id='tab-events').children.insert(0,fragment(ad(4,'Presented by your next campus partner.',True)))
        root.find(id='tab-events').append(fragment('<div class="t-inline-note"><span class="t-tag">EVENT FLOW / PREVIEW</span><h3>RSVP, check in, tell us how it went.</h3><p>Dates in the reference archive are historical. Try an RSVP state without registering for an event.</p><button class="t-button" type="button" data-demo-rsvp>Preview RSVP</button><p class="t-meta" data-rsvp-status role="status"></p>'+action('Preview event feedback','/feedback/?type=event','t-text-link')+'</div>'))
        posts = [n for n in root.walk() if 'data-news-page-item' in n.attrs]
        if len(posts) >= 5:
            native = fragment(ad(3,'Built something? Get it in front of SOC.'))
            parent = posts[4].parent
            parent.children.insert(parent.children.index(posts[4])+1, native)
            native.parent = parent
    elif slug=='communities':
        add_tab(root,'builders','Builders wall',section('Made by someone<br>in your class.','A home for student projects, portfolios and works in progress.','<div class="t-builder-wall"><article class="t-project-card"><span class="t-eyebrow">PROJECT 001 / YOURS?</span><div class="t-project-type">HELLO,<br>WORLD<span>_</span></div><h3>Leave a little proof of what you can do.</h3><p>Approved projects will show a screenshot, the builders, tools used and a live link.</p>'+unavailable('Submit a project','Project submissions will go to the PRO approval queue. No files are collected by this mockup.')+'</article><div class="t-note"><span class="t-tag">THE STUDENT SPOTLIGHT</span><h3>A person.<br>A project.<br>A good story.</h3><p>We’ll feature students with their permission. No invented achievements or endorsements.</p>'+unavailable('Nominate a student','Nominations will be reviewed with the student before publication.')+'</div></div>'))
        add_tab(root,'businesses','Student businesses',section('Buy from your people.','A directory for the things students make, sell and do.',ad(8,'Your student business could be here.')+'<div class="t-paper"><h3>Make your first listing.</h3><p>Business name, what you offer, a photo and your preferred contact. Every listing goes through review.</p>'+unavailable('List your business','Business submissions are a planned feature. This preview does not collect or publish a listing.')+'</div>'))
        add_tab(root,'lost-found','Lost & found',section('Missing something?','Check found items or report what you have lost.','<div class="t-grid-two"><div class="t-paper"><span class="t-tag">LOST ITEMS</span><h3>Nothing listed yet.</h3><p>Describe the item and where it was last seen. Keep personal identifiers private.</p>'+unavailable('Report a lost item','Lost and found reports will be reviewed before they appear on this board.')+'</div><div class="t-paper t-paper--grey"><span class="t-tag">FOUND ITEMS</span><h3>Help it find its owner.</h3><p>Arrange the return through the designated school contact.</p>'+unavailable('Report a found item','The found-item form will be connected after the design is approved.')+'</div></div>'))
        add_tab(root,'ict','ICT & Wi-Fi',section('Get back online.','Report a connection problem, lab issue or broken device.',action('Open an ICT report','/feedback/?type=ict')+'<div class="t-note"><h3>Useful details to include</h3><p>The building or room, the time it happened, your device type and what you were trying to do. Never share your password.</p></div>'))
        welfare=root.find(id='tab-welfare')
        welfare.children=[fragment(section('You can speak here.','Choose anonymous or named feedback and see who it is intended for.',action('Open feedback & welfare','/feedback/?type=welfare')+'<div class="t-inline-note"><p>Complaints stay private. Course and lecturer feedback goes privately to the HOD; there are no public lecturer ratings.</p></div>'))]
    elif slug=='about':
        add_tab(root,'freshers','Freshers’ guide',section('New here?<br>Pull up a chair.','A practical first-week checklist. Confirm official registration steps with your class rep.','<div class="t-grid-two"><div class="t-checklist">'+''.join(f'<label><input type="checkbox" data-checklist="{i}"><span>{text}</span></label>' for i,text in enumerate(['Confirm registration requirements','Find your class representative','Check your class timetable','Join the SOC WhatsApp channel','Read the rules and dress code','Locate your classrooms and labs']))+'</div><article class="t-note"><span class="t-tag">WHO TO ASK</span><h3>You don’t have to figure it out alone.</h3><p>Class notices and materials: your class rep.<br>Dues and receipts: the finance executive.<br>Student welfare: the Welfare Officer.<br>Site updates: the PRO office.</p>'+action('Find your representatives','/communities/#tab-people','t-text-link')+'</article></div>'))
        add_tab(root,'constitution','NACOS constitution',section('Know how we’re organised.','Membership, executive roles and elections should be easy to understand.','<div class="t-paper"><span class="t-tag">AWAITING APPROVED DOCUMENT</span><h3>The constitution belongs here.</h3><p>The plain-language summary and full PDF will be added together once the approved constitution is supplied.</p>'+unavailable('View constitution','The approved NACOS constitution PDF has not been supplied. We will not invent its rules.')+'</div>'))
        overview=root.find(id='tab-overview')
        overview.children.insert(0,fragment('<div class="t-inline-note"><span class="t-tag">STUDENT-RUN / PRO OFFICE</span><h2>A useful place for everyday student life.</h2><p>Compiled By SOC brings the things students need into one place: updates, study resources, dues and community. The platform belongs to the PRO office and passes to each new team.</p><p>Built by Davies-Eke King Chukwuzitelu.</p></div>'))
    elif slug=='contact':
        form=root.find(id='contact-form')
        form.attrs['data-mockup-contact']=''
        for n in form.all(tag='button'):
            if n.attrs.get('type')=='submit':n.replace_text('Preview message')
        form.find(cls='form-notice').replace_text('Design preview. Use sample text; no message is sent or stored.')
    return root


def payment():
    return '''<div class="t-page"><header class="t-page-heading"><p class="t-eyebrow">PAY / KEEP IT SORTED</p><h1>DUES.<br><span>NO GUESSWORK.</span></h1><p>Transfer, submit your proof, check your status.</p><span class="t-tag">Design preview · no payment is processed</span></header><div class="t-payment-layout"><div><section class="t-paper" id="transfer"><span class="t-step">01</span><h2>Make a bank transfer.</h2><p>The finance executive will publish the confirmed session, amount and account here.</p><dl class="t-bank"><div><dt>Session</dt><dd>Awaiting confirmation</dd></div><div><dt>Amount</dt><dd>—</dd></div><div><dt>Bank / account</dt><dd>Not published yet</dd></div></dl></section><section class="t-paper" id="proof"><span class="t-step">02</span><h2>Attach your proof.</h2><p>Preview this step with a sample file. Nothing is uploaded.</p><form class="t-form" data-proof-preview><label>Matric number<input name="matric" placeholder="Use PREVIEW-001 to try this" required></label><label class="t-upload">Select a sample payment proof<input type="file" name="proof" accept="image/*,application/pdf" required><span>Image or PDF · stays on your device</span></label><p class="t-meta">In the live platform, payment proofs and matric numbers will be visible only to finance and admins.</p><button class="t-button" type="submit">Preview proof submission</button><p role="status" data-proof-status></p></form></section></div><aside><section class="t-paper t-payment-status" id="status"><span class="t-step">03</span><h2>Where does it stand?</h2><form class="t-form" data-payment-check><label>Matric number<input name="matric" placeholder="PREVIEW-001" required></label><button class="t-button" type="submit">Check preview status</button><p class="t-meta">Use PREVIEW-001 for a sample record.</p><div class="t-status-result" data-payment-result role="status" hidden></div></form></section><section class="t-note" id="transparency"><span class="t-tag">WHERE YOUR DUES GO</span><h3>You should be able to see it.</h3><p>Approved income and expense reports will be published here. No spending figures have been supplied yet.</p><p class="t-meta">Bank transfers first. Online card payments are planned for later.</p></section></aside></div></div>'''


def feedback():
    return '''<div class="t-page t-feedback-page"><header class="t-page-heading"><p class="t-eyebrow">COMMUNITY / FEEDBACK</p><h1>SAY YOUR<br><span>PIECE.</span></h1><p>A bug, an idea or something that needs attention. Start here.</p><span class="t-tag">Design preview · no feedback is sent or stored</span></header><div class="t-grid-two"><section class="t-paper"><h2>What’s on your mind?</h2><form class="t-form" data-feedback-preview><label>Feedback type<select name="type"><option value="suggestion">Suggestion</option><option value="bug">Site bug</option><option value="complaint">Complaint</option><option value="event">Event feedback</option><option value="welfare">Welfare</option><option value="dues">Dues</option><option value="course">Course or lecturer feedback</option><option value="ict">ICT or Wi-Fi issue</option></select></label><fieldset class="t-choice"><legend>How would you like to appear?</legend><label><input type="radio" name="identity" value="anonymous" checked> Anonymous</label><label><input type="radio" name="identity" value="named"> Named</label></fieldset><label data-feedback-name hidden>Your name<input name="name" autocomplete="off"></label><p class="t-routing" data-feedback-route>Intended recipient: PRO office.</p><label>Your message<textarea name="message" rows="5" placeholder="Use sample text to try the flow." required></textarea></label><label data-event-rating hidden>Event rating<select name="rating"><option value="">Choose a rating</option><option>1 / 5</option><option>2 / 5</option><option>3 / 5</option><option>4 / 5</option><option>5 / 5</option></select></label><button type="submit" class="t-button">Preview submission</button><div class="t-status-result" data-feedback-result role="status" hidden></div></form></section><aside><section class="t-note"><span class="t-tag">KEEP YOUR TRACKING CODE</span><h2>Check back.<br>Stay anonymous.</h2><form class="t-form" data-feedback-track><label>Tracking code<input name="code" placeholder="DEMO-1042" required></label><button type="submit" class="t-button t-button--light">Check preview status</button><p class="t-meta">Try DEMO-1042. Live submissions will each receive their own code.</p><div data-track-result role="status"></div></form></section><section class="t-paper"><h3>Privacy is part of the design.</h3><p>Complaints and welfare messages are private. The final access policy must be approved before this form goes live.</p><p>Course and lecturer feedback is anonymous and intended only for the HOD. Aggregate results require a minimum response count. No public lecturer ratings.</p></section></aside></div><section class="t-section t-community-voice" id="suggestions"><div><p class="t-eyebrow">THE OPEN SUGGESTIONS BOARD</p><h2 class="t-section-title">Good ideas can come<br>from anyone.</h2><p>Sample suggestion · votes below are only a preview.</p><article class="t-paper t-suggestion"><button type="button" data-demo-upvote aria-pressed="false" aria-label="Upvote sample suggestion">+ <span>0</span></button><div><span class="t-tag">EXAMPLE</span><h3>Keep past questions in one shared library.</h3><p>Make them easier to find by programme, level and course.</p></div></article></div><article class="t-note"><span class="t-tag">YOU SAID, WE DID</span><h3>A visible record<br>of what changes.</h3><p>Resolved feedback and approved changes will appear here. There are no published outcomes yet.</p></article></section></div>'''


def enhance_output(public):
    """Run after all page generators so every route receives the same skin."""
    for file in public.rglob('*.html'):
        html=file.read_text()
        html=re.sub(r'<link rel="stylesheet" href="/tactile.css">','',html)
        html=re.sub(r'<script src="/tactile.js" defer></script>','',html)
        html=re.sub(r'<link rel="stylesheet" href="/soft.css">','',html)
        html=re.sub(r'<script src="/soft-select.js" defer></script>','',html)
        html=re.sub(r'<script src="/section-picker.js" defer></script>','',html)
        html=re.sub(r'<link rel="stylesheet" href="/posts.css">','',html)
        html=re.sub(r'<nav class="t-tabbar".*?</nav>','',html,flags=re.S)
        html=html.replace('</head>','<link rel="stylesheet" href="/tactile.css"><link rel="stylesheet" href="/soft.css"><script src="/tactile.js" defer></script><script src="/soft-select.js" defer></script><script src="/section-picker.js" defer></script></head>')
        if 'class="t-feedback-float"' not in html:
            html=html.replace('</body>','<a class="t-feedback-float" href="/feedback/"><span aria-hidden="true">+</span> Feedback</a></body>')

        # Assets are compressed copies; the supplied artwork stays intact.
        for name in ['img-5577','topview','frame-103','frame-65','frame-98','sunset','img-6291','about-hero','nasa-q1p7bh3shj8-unsplash','macbook-pro-14-7','mu-man']:
            html=re.sub(r'/assets/reference/'+name+r'\.(?:png|jpe?g|jfif)',f'/assets/tactile/{name}.webp',html)
        if '/stories/' in str(file) or '/news-events/' in str(file) and file.parent.name!='news-events':
            html=re.sub(r'<aside class="t-ad [^"]*" data-ad-slot="7".*?</aside>','',html,flags=re.S)
            html=html.replace('</main>',ad(7,'Something worth sharing with your next reader.')+'</main>')
        # Eyebrow labels (small kicker text above headings) are removed everywhere.
        html=strip_eyebrows(html)
        html=re.sub(r'<p class="editorial-kicker">.*?</p>','',html,flags=re.S)
        html=re.sub(r'<span class="photo-caption">\d+ / [^<]*</span>','',html)
        html=re.sub(r'<p class="edition">.*?</p>','',html,flags=re.S)
        html=re.sub(r'<span class="section-number"[^>]*>[^<]*</span>','',html)
        html=html.replace('Vol. 001 · The first commit · ','')
        from post_design import apply_post_design
        html=apply_post_design(html)
        html=html.replace('</head>','<link rel="stylesheet" href="/posts.css"></head>')
        file.write_text(html)


if __name__=='__main__':
    enhance_output(ROOT/'dist')
