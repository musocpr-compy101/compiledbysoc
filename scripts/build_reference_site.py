"""Adapt the full user-supplied SOC reference, retaining the original CLI hero."""
import ast
from datetime import datetime, timedelta
from html import escape
import json
from pathlib import Path
import re
from shutil import copyfile
from zoneinfo import ZoneInfo
from reference_dom import Node, parse
from editorial_design import apply_editorial, editorial_home, editorial_journal, clean_action_html

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "dist"
SOURCE = ROOT / "reference/soc"
ASSETS = PUBLIC / "assets/reference"
TEMPLATES = ROOT / "scripts/templates"
ASSET_MAP = {}
ROUTES = {
    "index.html": "/", "soc_homepage_v2_upgraded.html": "/",
    "soc_about_page.html": "/about/", "acad.html": "/academics/",
    "soc_academics_page.html": "/academics/", "soc_communities.html": "/communities/",
    "soc_news_events.html": "/news-events/", "soc_news_events_page.html": "/news-events/",
    "contact.html": "/contact/", "pay-dues.html": "/pay-dues/",
}
NAV = [
    ("Journal", "/#journal"), ("About", "/about/"), ("Academics", "/academics/"),
    ("Communities", "/communities/"), ("News & Events", "/news-events/"),
    ("Contact", "/contact/"), ("Pay Dues", "/pay-dues/"),
]
SEARCH_INDEX = []
ARTICLES = {}
EVENTS = []
# Date ranges, daily times, and venues supplied by the reference's event cards.
EVENT_DETAILS = {
    "ev1": {"endDate": "2026-05-02", "location": "School of Computing — All Levels"},
    "ev2": {"startTime": "09:00", "endTime": "18:00", "location": "MU Innovation Hub"},
    "ev3": {"startTime": "14:00", "endTime": "16:00", "location": "Lecture Hall A, SOC"},
    "ev4": {"endDate": "2026-06-21", "startTime": "09:00", "endTime": "17:00", "location": "SOC Seminar Room"},
}


def read(name):
    return (SOURCE / name).read_text(encoding="utf-8")


def nodes(html):
    return parse(html).children


def add_html(parent, html):
    for node in nodes(html):
        parent.append(node)


def parse_js_data(text):
    """Accept only nested object literals with string values, never execute JS."""
    literal = re.search(r"const articles\s*=\s*(\{.*?\n\});", text, re.S).group(1)
    literal = literal.replace("\\\\'", "\\'")
    tokens = re.findall(r"'(?:\\.|[^'\\])*'|[A-Za-z_]\w*|[{}:,]", literal)
    position = 0
    def obj():
        nonlocal position
        assert tokens[position] == "{"
        position += 1
        result = {}
        while tokens[position] != "}":
            key = tokens[position]
            position += 1
            assert tokens[position] == ":"
            position += 1
            if tokens[position] == "{":
                value = obj()
            else:
                value = ast.literal_eval(tokens[position])
                assert isinstance(value, str)
                position += 1
            result[key] = value
            if tokens[position] == ",":
                position += 1
        position += 1
        return result
    result = obj()
    assert position == len(tokens)
    return result


def font_sizes(text):
    return re.sub(r"font-size\s*:\s*(\d+(?:\.\d+)?)px", lambda m: "font-size:" + str(max(14, float(m[1]))).removesuffix(".0") + "px", text)


def scope_css(css, scope):
    css = re.sub(r"@import[^;]*;", "", css)
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = css.replace("'Inter'", "Arial").replace("'JetBrains Mono'", "Consolas")
    css = font_sizes(asset_urls(css))
    result = []
    index = 0
    while index < len(css):
        opening = css.find("{", index)
        if opening < 0:
            break
        selector = css[index:opening].strip()
        depth, end, quote = 1, opening + 1, None
        while end < len(css) and depth:
            char = css[end]
            if quote:
                if char == quote and css[end - 1] != "\\":
                    quote = None
            elif char in "'\"":
                quote = char
            elif char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
            end += 1
        body = css[opening + 1:end - 1]
        if selector.startswith(("@media", "@supports")):
            result.append(selector + "{" + scope_css(body, scope) + "}")
        elif selector.startswith("@"):
            result.append(selector + "{" + body + "}")
        else:
            selectors = []
            for item in selector.split(","):
                item = item.strip()
                if item in ("body", "html", ":root"):
                    selectors.append(scope)
                else:
                    selectors.append(scope + " " + item)
            result.append(",".join(selectors) + "{" + body + "}")
        index = end
    return "\n".join(result)


def asset_urls(text):
    for old, new in ASSET_MAP.items():
        for spelling in (old, old.replace(" ", "\\ ")):
            text = text.replace("./" + spelling, new)
            text = text.replace('"' + spelling + '"', '"' + new + '"')
            text = text.replace("'" + spelling + "'", "'" + new + "'")
    for old, new in ROUTES.items():
        text = text.replace("./" + old, new)
    return text


def mark_unavailable(node, title, message=None):
    node.tag = "button"
    node.attrs.pop("href", None)
    node.attrs.pop("target", None)
    node.attrs.update({"type": "button", "data-unavailable": title})
    if message:
        node.attrs["data-unavailable-message"] = message


STUDENT_NAV = [
    ("Home", "/", [("The journal", "/#journal")]),
    ("Updates", "/news-events/", [("Announcements & news", "/news-events/#tab-news"), ("Events", "/news-events/#tab-events"), ("Student blog", "/#journal")]),
    ("Important Stuff", "/important-stuff/", [("Announcements", "/important-stuff/#announcements"), ("Rules", "/important-stuff/#rules"), ("Elections", "/important-stuff/#elections"), ("Calendar", "/important-stuff/?calendar=1")]),
    ("Study", "/academics/", [("Timetable", "/academics/#tab-timetable"), ("Materials", "/academics/#tab-materials"), ("Research", "/academics/#tab-research"), ("Peer tutoring", "/academics/#tab-tutoring")]),
    ("Pay", "/pay-dues/", []),
    ("About", "/about/", [("About SOC", "/about/#tab-overview"), ("Freshers’ guide", "/about/#tab-freshers"), ("Rules", "/about/#tab-rules"), ("Dress code", "/about/#tab-dresscode")]),
    ("Community", "/communities/", [("Groups & clubs", "/communities/#tab-groups"), ("Builders wall", "/communities/#tab-builders"), ("Student businesses", "/communities/#tab-businesses"), ("Feedback & welfare", "/feedback/")]),
    ("Contact", "/contact/", []),
]


def shared_header(active, terminal=False):
    hero_class = " cmd-header--hero" if terminal else ""
    pay_current = ' aria-current="page"' if active.startswith("/pay-dues/") else ""
    fallback = "".join(f'<a href="{href}">{label}</a>' for label, href, _ in STUDENT_NAV)
    return f'''<header class="cmd-header{hero_class}" data-cmd-header>
<a class="cmd-brand" href="/" aria-label="Compiled By SOC home"><span class="cmd-logo" aria-hidden="true">C<span>_</span></span><span class="cmd-brand-name" aria-hidden="true"><span>Compiled</span><span><span class="cmd-brand-by">By</span> SOC</span></span></a>
<div class="cmd-actions"><button class="cmd-search" type="button" data-site-search aria-label="Search the site"><svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="m15 15 6 6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button><a class="cmd-pay" href="/pay-dues/"{pay_current}>Pay Dues</a><button class="cmd-menu-toggle" type="button" data-cmd-menu aria-label="Open navigation" aria-expanded="false" aria-controls="cmd-navigation"><span class="cmd-menu-label">Menu</span><span class="cmd-menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button></div></header><noscript><nav class="cmd-fallback" aria-label="Main navigation">{fallback}</nav></noscript>'''


def navigation_dialog():
    groups = []
    for index, (label, href, children) in enumerate(STUDENT_NAV):
        links = "".join(f'<a href="{url}">{escape(text)}</a>' for text, url in children)
        sublinks = '<div class="cmd-group-links">' + links + '</div>' if links else ''
        groups.append(f'<section class="cmd-menu-group" style="--menu-order:{index}"><a class="cmd-group-title" data-nav-section="{label.lower()}" href="{href}"><span class="cmd-group-number" aria-hidden="true">{index + 1:02}</span>{label}</a>{sublinks}</section>')
    return '<dialog class="cmd-drawer" id="cmd-navigation" aria-labelledby="cmd-navigation-title"><div class="cmd-drawer-top"><h2 id="cmd-navigation-title">Navigation<span aria-hidden="true">_</span></h2><button class="cmd-menu-close" type="button" data-cmd-close aria-label="Close navigation" autofocus><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></button></div><nav class="cmd-drawer-links" aria-label="Main navigation">' + ''.join(groups) + '</nav><p class="cmd-drawer-footer">Student-run / PRO office<br>School of Computing, Maduka University</p></dialog>'


def footer():
    return clean_action_html('''<footer class="site-footer"><div class="full-footer">
<div class="footer-identity"><a class="footer-brand" href="/" aria-label="Compiled By SOC home"><span class="site-logo" aria-hidden="true"><span class="site-logo-c">C</span><span class="site-logo-underscore">_</span></span></a><p>School of Computing<br>Maduka University</p><p>Along Nsukka–Enugu New Road<br>Ekwegbe, Enugu State, Nigeria</p><a href="mailto:soc@madukauniversity.edu.ng">soc@madukauniversity.edu.ng</a></div>
<div><h2>Study</h2><a href="/academics/#tab-timetable">Timetables</a><a href="/academics/#tab-materials">Materials & past questions</a><a href="/academics/#tab-courses">Course outlines</a><a href="/academics/#tab-research">Research</a><a href="/academics/#tab-tutoring">Peer tutoring</a><a href="/resources/rules/">Rules & downloads</a></div>
<div><h2>University</h2><a href="https://madukauniversity.edu.ng/" target="_blank" rel="noopener noreferrer">Main website ↗</a><button type="button" data-unavailable="Student portal">Student portal</button><button type="button" data-unavailable="E-learning">E-learning</button><button type="button" data-unavailable="University library">Library</button><a href="/about/#tab-rules">Rules & regulations</a><a href="/about/#tab-dresscode">Dress code</a></div>
<div><h2>Connect</h2><a href="/communities/#tab-faculty">Faculty & staff</a><a href="/communities/#tab-people">Student executives</a><a href="/communities/#tab-groups">Groups & clubs</a><a href="/communities/#tab-welfare">Welfare</a><a href="/news-events/">News & events</a><a href="/pay-dues/">Pay dues</a><a href="/contact/">Contact</a><a href="/staff/sign-in">Executive access</a><a href="/#journal">The journal</a></div>
</div><div class="footer-bottom"><span>© 2026 Compiled By SOC · A student-led platform of the PRO office.</span><a href="#top">Back to top</a><span>Built by <strong>Davies-Eke King Chukwuzitelu</strong></span></div><p class="reference-note">Design preview · Sample content, policies and directory entries await approval. Submissions and payments are not live.</p></footer><a class="t-feedback-float" href="/feedback/"><span aria-hidden="true">+</span> Feedback</a>''')


def dialogs():
    return navigation_dialog() + '''<dialog class="soc-dialog" id="site-search-dialog" aria-labelledby="search-title"><div class="dialog-top"><h2 id="search-title">Search Compiled By SOC</h2><button class="dialog-close" type="button" data-close-dialog aria-label="Close search">×</button></div><label class="sr-only" for="site-search-input">Search pages and topics</label><input id="site-search-input" class="dialog-input" type="search" placeholder="Courses, welfare, admissions…" autocomplete="off"><p class="dialog-hint" data-search-status role="status">Find a page, department, or topic.</p><div class="search-results" data-search-results></div></dialog>
<dialog class="soc-dialog" id="notice-dialog" aria-labelledby="notice-title"><div class="dialog-top"><h2 id="notice-title">More information</h2><button class="dialog-close" type="button" data-close-dialog aria-label="Close message">×</button></div><p id="notice-message"></p><a class="solid-action" href="/contact/">Contact SOC</a></dialog>
<dialog class="soc-dialog" id="pay-dialog" aria-labelledby="pay-title"><div class="dialog-top"><h2 id="pay-title">Pay departmental dues</h2><button class="dialog-close" type="button" data-close-dialog aria-label="Close payment form">×</button></div><p>2025/2026 session · Reference amount: ₦3,000</p><form data-payment-form><label>Full name<input name="name" autocomplete="name" required class="dialog-input"></label><label>Matric number<input name="matric" required class="dialog-input" placeholder="MU/EN/24/0000"></label><label>Email address<input name="email" type="email" autocomplete="email" required class="dialog-input"></label><p class="form-notice">Online payment is not connected yet. Confirm the current levy with SOC before paying.</p><button class="solid-action" type="submit">Check payment availability</button><p class="form-status" role="status"></p></form></dialog>'''


def page(title, body, route, style=None, description=None):
    favicon = re.search(r'<link rel="icon"[^>]*>', (PUBLIC / "index.html").read_text()).group(0)
    style_link = f'<link rel="stylesheet" href="/reference/{style}.css">' if style else ""
    html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#111111"><title>{escape(title)} — Compiled By SOC</title><meta name="description" content="{escape(description or title + ' at the School of Computing, Maduka University.', quote=True)}">{favicon}<link rel="stylesheet" href="/styles.css">{style_link}<link rel="stylesheet" href="/reference.css"><link rel="stylesheet" href="/editorial.css"><link rel="stylesheet" href="/cmd-navigation.css"><script src="/navigation.js" defer></script><script src="/reference.js" defer></script></head><body id="top" class="reference-page"><a class="skip-link" href="#main-content">Skip to content</a>{shared_header(route)}<main id="main-content">{clean_action_html(body)}</main>{footer()}{dialogs()}</body></html>'''
    destination = PUBLIC / route.strip("/")
    destination.mkdir(parents=True, exist_ok=True)
    (destination / "index.html").write_text(html, encoding="utf-8")


def common_adapt(root, slug):
    for node in list(root.walk()):
        for attr in list(node.attrs):
            if attr.startswith("on"):
                handler = node.attrs.pop(attr)
                tab = re.search(r"switch(Tab|Main|ReqTab|CourseTab)\('([^']+)'", handler)
                article = re.search(r"openArticle\('([^']+)'", handler)
                slide = re.search(r"goToSlide\((\d+)\)", handler)
                if tab:
                    kind, target = tab.groups()
                    target = ("tab-" + target) if kind in ("Tab", "Main") else target
                    if node.tag == "button":
                        node.attrs["data-tab-target"] = target
                        node.attrs["data-tab-group"] = {"Tab": "main", "Main": "main", "ReqTab": "requirements", "CourseTab": "courses"}[kind]
                    else:
                        node.attrs.update({"href": "#" + target, "data-panel-link": target})
                elif article:
                    node.tag = "a"
                    node.attrs["href"] = "/news-events/" + article[1] + "/"
                    node.attrs["data-news-id"] = article[1]
                elif slide:
                    node.attrs.update({"data-slide": slide[1], "aria-label": "Show slide " + str(int(slide[1]) + 1)})
                elif "filterNews(" in handler:
                    node.attrs["data-news-filter"] = re.search(r"filterNews\('([^']+)'", handler)[1]
                elif "searchNews(" in handler:
                    node.attrs.update({"data-news-search": "", "type": "search", "aria-label": "Search news"})
                elif "openModal()" in handler:
                    node.attrs["data-open-payment"] = ""
                elif "window.open('#'" in handler:
                    mark_unavailable(node, "Course materials", "The reference includes a course-drive section, but no drive address was supplied. Please request the current materials from SOC.")
        for attr in ("href", "src", "style"):
            if attr in node.attrs:
                node.attrs[attr] = asset_urls(node.attrs[attr])
        href = node.attrs.get("href", "")
        if href in ROUTES:
            node.attrs["href"] = ROUTES[href]
        if "style" in node.attrs:
            node.attrs["style"] = font_sizes(node.attrs["style"])
        if node.tag == "button":
            node.attrs.setdefault("type", "button")
        if node.tag == "img":
            node.attrs.setdefault("alt", "")
            node.attrs.setdefault("loading", "lazy")
            node.attrs["decoding"] = "async"
        if node.has("hero-heading"):
            node.tag = "h1"
        if any(node.has(c) for c in ("sec-title", "people-section-title", "s-title", "grid-title", "sidebar-title")):
            node.tag = "h2"
        if node.tag == "a" and node.attrs.get("target") == "_blank":
            node.attrs["rel"] = "noopener noreferrer"
        if node.tag == "a" and (not node.attrs.get("href") or node.attrs["href"] == "#"):
            text = node.text()
            if "@" in text and "madukauniversity.edu.ng" in text:
                match = re.search(r"[\w.+-]+@madukauniversity\.edu\.ng", text)
                node.attrs["href"] = "mailto:" + match[0]
            elif node.has("wc-btn"):
                category = "Suggestion" if "Suggestion" in text else "Complaint" if "Complaint" in text else "Feedback"
                node.attrs["href"] = "/contact/?category=" + category + "#contact-form"
                node.attrs.pop("target", None)
            elif node.has("join-link"):
                node.attrs["href"] = "/contact/?category=Student%20groups#contact-form"
                node.replace_text("Enquire about joining →")
            else:
                mark_unavailable(node, text[:100] or "This resource")
        if node.has("pdf-download"):
            node.tag = "a"
            node.attrs.update({"href": "/resources/rules/", "target": "_blank", "rel": "noopener"})
            node.replace_text("Print / save Rules & Regulations as PDF ↓")
        if node.has("admin-note"):
            node.remove()
        if node.has("wc-desc") and "anonymously if you prefer" in node.text():
            node.replace_text(node.text().replace(" — anonymously if you prefer", "") + " This preview opens an email draft; your email account will be visible to the recipient.")
    for panel in root.all(cls="tab-content"):
        heading = panel.find(cls="sec-title") or panel.find(cls="welfare-intro-title")
        title = heading.text() if heading else panel.attrs.get("id", "").removeprefix("tab-").title()
        SEARCH_INDEX.append({"title": title, "section": slug.replace("-", " ").title(), "url": "/" + slug + "/#" + panel.attrs["id"], "text": panel.text()[:1200]})
    return root


def build_page(slug, filename, start, end="<!-- FOOTER -->"):
    raw = read(filename)
    start_index = raw.index(start)
    end_index = raw.index(end, start_index)
    root = common_adapt(parse(raw[start_index:end_index]), slug)
    css = re.search(r"<style>(.*?)</style>", raw, re.S)[1]
    (PUBLIC / "reference" / (slug + ".css")).write_text(scope_css(css, ".reference-surface"), encoding="utf-8")
    return root


def prepare_contact(root):
    grid = root.find(cls="contact-grid")
    form = next(n for n in grid.children if isinstance(n, Node))
    form.tag = "form"
    form.attrs.update({"id": "contact-form", "data-contact-form": "", "data-inbox": "soc@madukauniversity.edu.ng"})
    fields = ["name", "email", "category", "subject", "message"]
    for name, field in zip(fields, [n for n in form.walk() if n.tag in ("input", "select", "textarea")]):
        field.attrs.update({"name": name, "id": "contact-" + name, "required": "", "maxlength": "4000" if name == "message" else "200"})
        label = field.parent.find(tag="label")
        if label:
            label.attrs["for"] = "contact-" + name
        if name in ("name", "email"):
            field.attrs["autocomplete"] = name
        if name == "category":
            for label_text in ("Suggestion", "Complaint", "Feedback", "Student groups", "Newsletter updates"):
                field.append(Node("option", children=[label_text]))
    button = form.find(cls="btn-send")
    button.attrs["type"] = "submit"
    button.replace_text("Continue to email →")
    add_html(form, '<p class="form-notice">This opens an email draft with your message. Review and send it from your email app. For welfare matters, the draft is addressed to the welfare team.</p><p class="form-status" role="status"></p>')
    for node in root.all(cls="map-ph"):
        node.children = []
        add_html(node, '<a class="map-directions" href="https://www.google.com/maps/search/?api=1&amp;query=Maduka%20University%20Ekwegbe%20Enugu" target="_blank" rel="noopener noreferrer"><span>Maduka University</span><strong>Find us in Ekwegbe,<br>Enugu State.</strong><span>Open directions in Google Maps ↗</span></a>')
    for node in root.all(cls="contact-card-name"):
        if "[HOD Name]" in node.text():
            node.replace_text("Dr. Onuoha M. Thomas")
    return root


def prepare_news(root):
    for node in root.walk():
        if node.attrs.get("data-news-id") and not node.attrs["data-news-id"].startswith("ev"):
            node.attrs["data-news-item"] = ""
            if node.has("news-card"):
                node.attrs["data-news-page-item"] = ""
    for event_node in root.all(cls="event-feat"):
        event_id = event_node.attrs["data-news-id"]
        article = ARTICLES[event_id]
        dt = datetime.strptime(article["date"], "%B %d, %Y")
        details = EVENT_DETAILS[event_id]
        EVENTS.append({"id": event_id, "title": article["title"], "date": dt.strftime("%Y-%m-%d"), "url": event_node.attrs["href"], **details})
        event_node.attrs.update({"data-event-date": dt.strftime("%Y-%m-%d"), "data-event-title": article["title"], "data-event-end-date": details.get("endDate", dt.strftime("%Y-%m-%d"))})
        # Card is one real link; remove nested interactive buttons from the mockup.
        for button in event_node.all(tag="button"):
            button.tag = "span"
            button.attrs.pop("type", None)
            button.replace_text("View event →")
    for node in root.walk():
        if node.text() == "Upcoming Events" and not any(isinstance(c, Node) for c in node.children):
            node.replace_text("Event schedule")
    for index, button in enumerate(root.all(cls="view-btn")):
        button.attrs["data-calendar-view"] = "list" if index == 0 else "calendar"
        button.attrs["aria-pressed"] = "true" if index == 0 else "false"
    event_layout = root.find(cls="events-layout")
    add_html(event_layout, '<section class="reference-calendar" data-calendar hidden><div class="calendar-toolbar"><h2 data-calendar-label></h2><div><button type="button" data-calendar-step="-1" aria-label="Previous month">←</button><button type="button" data-calendar-now>Today</button><button type="button" data-calendar-step="1" aria-label="Next month">→</button></div></div><div data-calendar-grid></div><p class="calendar-status" role="status"></p></section>')
    filter_bar = root.find(cls="filter-bar")
    filter_bar.parent.children.insert(filter_bar.parent.children.index(filter_bar) + 1, Node("p", {"class": "news-status", "data-news-status": "", "role": "status"}, ["All stories"]))
    for cls in ("nl-form", "subscribe-form"):
        for form in root.all(cls=cls):
            form.tag = "form"
            form.attrs["data-newsletter-form"] = ""
            field = form.find(tag="input")
            field.attrs.update({"name": "email", "required": "", "type": "email", "aria-label": "Your email address"})
            button = form.find(tag="button")
            button.attrs["type"] = "submit"
            button.replace_text("Request updates →")
            add_html(form, '<p class="newsletter-hint">Opens an email subscription request.</p>')
    grid_section = root.find(cls="news-grid-section")
    add_html(grid_section, '<nav class="news-pagination" data-news-pagination aria-label="News pages"></nav>')
    # Preserve the additional stories present in the other supplied news layout.
    canonical = parse(read("soc_news_events.html"))
    seen = set()
    grid = root.find(id="newsGrid")
    for card in canonical.walk():
        title = card.find(cls="pc-title") or card.find(cls="lp-title")
        if not title or not (card.has("post-card") or card.has("list-post")):
            continue
        title_text = title.text()
        if title_text in seen:
            continue
        seen.add(title_text)
        excerpt = card.find(cls="pc-excerpt") or card.find(cls="lp-excerpt")
        date_node = card.find(cls="post-date") or card.find(cls="lp-date")
        category = card.find(cls="post-tag")
        category_text = category.text() if category else "News"
        # Variants already covered by full-length entries remain in the source;
        # preserve all distinct remaining supplied stories as short news posts.
        if any(word in title_text for word in ("Partners", "Google Cybersecurity", "National App")):
            continue
        key = "reference-" + str(len(seen))
        ARTICLES[key] = {"title": title_text, "cat": category_text, "date": date_node.text() if date_node else "Reference edition", "author": "SOC Communications", "p1": excerpt.text() if excerpt else ""}
        add_html(grid, f'<a class="news-card" href="/news-events/{key}/" data-news-item data-news-page-item data-cat="{escape(category_text.lower())}"><div class="nc-img"><span class="nc-cat">{escape(category_text)}</span></div><div class="nc-body"><div class="nc-date">{escape(ARTICLES[key]["date"])}</div><h3 class="nc-title">{escape(title_text)}</h3><p class="nc-excerpt">{escape(ARTICLES[key]["p1"])}</p></div></a>')
    return root


def prepare_home(root):
    for index, slide in enumerate(root.all(cls="slide")):
        for h in slide.all(tag="h1"):
            h.tag = "h2"
        slide.attrs.update({"role": "group", "aria-label": str(index + 1) + " of 4"})
        # Repair nested button/link pairs from the reference.
        for button in list(slide.all(tag="button")):
            anchor = button.find(tag="a")
            if anchor:
                button.tag = "a"
                button.attrs.pop("type", None)
                button.attrs["href"] = anchor.attrs["href"]
                button.children = anchor.children
    for node in root.all(cls="nfc"):
        node.tag = "a"
        node.attrs["href"] = "/news-events/ev2/"
    keys = ["feat", "a4", "a2", "a5"]
    for item, key in zip(root.all(cls="ns-item"), keys):
        item.tag = "a"
        item.attrs["href"] = "/news-events/" + key + "/"
    announce = root.find(cls="announce")
    announce.attrs["data-dated-notice"] = "2026-03-25"
    tag = announce.find(cls="ann-tag")
    tag.replace_text("Notice archive")
    # No second terminal-style decorative canvas outside the CLI hero.
    for node in list(root.walk()):
        if any(node.has(c) for c in ("tech-canvas", "bracket", "right-accent", "right-grid")):
            node.remove()
    return root


def write_article(key, article):
    paragraphs = "".join("<p>" + escape(article[k]) + "</p>" for k in ("p1", "p2", "p3") if article.get(k))
    extras = ""
    if key.startswith("ev"):
        extras = f'<div class="news-detail-actions"><a class="solid-action" href="/resources/events/{key}.ics" download>Add to calendar ↓</a><a class="text-action" href="/contact/?category=Events#contact-form">Event enquiries ↗</a></div>'
    body = f'''<article class="reference-article"><a class="article-back" href="/news-events/#{'tab-events' if key.startswith('ev') else 'tab-news'}">← Back to News & Events</a><div class="reference-article-meta">{escape(article["cat"])} · {escape(article["date"])} · {escape(article.get("author", "SOC Communications"))}</div><h1>{escape(article["title"])}</h1><p class="article-source-note">Reference edition · This supplied example is awaiting editorial confirmation.</p><div class="article-body">{paragraphs}</div>{extras}<div class="article-share"><span>Share this story</span><button type="button" data-share-link>Copy link</button><a href="/news-events/">More stories ↗</a><span role="status" data-share-status></span></div></article>'''
    page(article["title"], body, "/news-events/" + key + "/")
    SEARCH_INDEX.append({"title": article["title"], "section": article["cat"], "url": "/news-events/" + key + "/", "text": article.get("p1", "")})


def write_calendar_files():
    folder = PUBLIC / "resources/events"
    folder.mkdir(parents=True, exist_ok=True)

    def calendar_text(value):
        return value.replace("\\", "\\\\").replace(",", "\\,").replace(";", "\\;").replace("\n", "\\n")

    def fold_line(value):
        result, line = [], ""
        for char in value:
            if len((line + char).encode("utf-8")) > 75:
                result.append(line)
                line = " "
            line += char
        return "\r\n".join(result + [line])

    for event in EVENTS:
        date = datetime.strptime(event["date"], "%Y-%m-%d")
        last_day = datetime.strptime(event.get("endDate", event["date"]), "%Y-%m-%d")
        if "startTime" in event:
            def utc_time(key):
                local = datetime.fromisoformat(event["date"] + "T" + event[key]).replace(tzinfo=ZoneInfo("Africa/Lagos"))
                return local.astimezone(ZoneInfo("UTC")).strftime("%Y%m%dT%H%M%SZ")
            dates = ["DTSTART:" + utc_time("startTime"), "DTEND:" + utc_time("endTime")]
            if last_day > date:
                dates.append("RRULE:FREQ=DAILY;COUNT=" + str((last_day - date).days + 1))
        else:
            dates = ["DTSTART;VALUE=DATE:" + date.strftime("%Y%m%d"), "DTEND;VALUE=DATE:" + (last_day + timedelta(days=1)).strftime("%Y%m%d")]
        lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Compiled By SOC//Reference Schedule//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT", "UID:" + event["id"] + "@compiled-by-soc", "DTSTAMP:20260926T000000Z", *dates, "SUMMARY:" + calendar_text("[Reference example] " + event["title"]), "LOCATION:" + calendar_text(event["location"]), "DESCRIPTION:Illustrative event from the SOC reference. Confirm details with the school.", "STATUS:TENTATIVE", "END:VEVENT", "END:VCALENDAR", ""]
        value = "\r\n".join(fold_line(line) for line in lines)
        (folder / (event["id"] + ".ics")).write_text(value, encoding="utf-8", newline="")


def main():
    global ARTICLES
    (PUBLIC / "reference").mkdir(exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    asset_source = SOURCE / "assets"
    for file in asset_source.iterdir():
        name = re.sub(r"[^a-z0-9]+", "-", file.stem.lower()).strip("-") + file.suffix.lower()
        ASSET_MAP[file.name] = "/assets/reference/" + name
        copyfile(file, ASSETS / name)
    ARTICLES = parse_js_data(read("soc_news_events_page.html"))
    pages = [
        ("about", "About SOC", "soc_about_page.html", "<!-- PAGE HERO -->", "<!-- FOOTER -->"),
        ("academics", "Academics", "acad.html", "<!-- HERO —", "<!-- FOOTER -->"),
        ("communities", "Communities", "soc_communities.html", "<!-- HERO -->", "<!-- FOOTER -->"),
        ("news-events", "News & Events", "soc_news_events_page.html", "<!-- HERO -->", "<!-- FOOTER -->"),
        ("contact", "Contact", "contact.html", "<!-- Hero -->", "<!-- Footer -->"),
        ("pay-dues", "Pay Dues", "soc_pay_contact_pages.html", "  <!-- Hero -->", "  <!-- Footer -->"),
    ]
    page_trees = {}
    for slug, title, filename, start, end in pages:
        tree = build_page(slug, filename, start, end)
        if slug == "contact":
            tree = prepare_contact(tree)
        elif slug == "news-events":
            tree = prepare_news(tree)
        elif slug == "communities":
            photo = tree.find(cls="hero-photo-ph")
            photo.children = []
            photo.attrs["style"] = "background-image:url('/assets/reference/img-5577.jpg');background-size:cover;background-position:center 60%"
            # Keep all directory slots without inventing identities or memberships.
            for n in tree.walk():
                if not any(isinstance(c, Node) for c in n.children):
                    text = n.text()
                    if text in ("Student Name", "Student Name Here", "Lecturer Name", "Staff Name Placeholder", "Group / Club Name", "Affiliation Name"):
                        n.replace_text("Details to be confirmed")
                    elif "Editable by admins" in text or "editable by admins" in text:
                        n.replace_text("Details will be published when confirmed by the School of Computing.")
        elif slug == "pay-dues":
            intro = tree.find(cls="pay-intro")
            intro.children.insert(0, Node("p", {"class": "payment-preview-note"}, ["Reference payment details · The ₦3,000 amount and 2025/2026 session are from the supplied mockup. Online checkout and bank details await confirmation."]))
            for n in tree.walk():
                if not any(isinstance(c, Node) for c in n.children):
                    if n.text() in ("[Bank Name]", "[Account Name]", "[0000000000]", "[+234 XXX XXX XXXX]"):
                        n.replace_text("Awaiting confirmed details")
                    elif "Payments are processed securely via Paystack" in n.text():
                        n.replace_text("Online checkout will use the confirmed SOC payment channel when connected. No payment is processed in this preview.")
        tree = apply_editorial(tree, slug)
        from tactile_design import adapt_page
        tree = adapt_page(tree, slug)
        from desktop_navigation import enhance_navigation
        tree = enhance_navigation(tree, slug)
        page_trees[slug] = tree
        surface = '<div class="reference-surface reference-' + slug + '">' + tree.html().strip() + "</div>"
        if slug == 'pay-dues':
            from tactile_design import payment
            surface = payment()
        page(title, surface, "/" + slug + "/", slug)
        SEARCH_INDEX.append({"title": title, "section": "Page", "url": "/" + slug + "/", "text": tree.text()[:500]})
    for key, article in ARTICLES.items():
        write_article(key, article)
    write_calendar_files()
    (PUBLIC / "reference/events.json").write_text(json.dumps(EVENTS, ensure_ascii=False), encoding="utf-8")
    home_tree = editorial_home(prepare_home(build_page("home", "index.html", "<!-- HERO -->")))
    hero = (TEMPLATES / "home-terminal.html").read_text()
    hero = re.sub(r'<header class="terminal-session".*?</header>', shared_header("/#journal", True), hero, flags=re.S)
    journal = editorial_journal((TEMPLATES / "journal.html").read_text())
    homepage = (PUBLIC / "index.html").read_text()
    head = re.search(r"<head>(.*?)</head>", homepage, re.S)[1]
    head = re.sub(r'<link rel="stylesheet" href="/hub.css">\s*', "", head)
    head = re.sub(r'<link rel="stylesheet" href="/reference(?:/home)?.css">\s*', "", head)
    head = re.sub(r'<script src="/reference.js" defer></script>\s*', "", head)
    head = re.sub(r'<link rel="stylesheet" href="/editorial.css">\s*', "", head)
    head = re.sub(r'<link rel="stylesheet" href="/cmd-navigation.css">\s*', "", head)
    head += '<link rel="stylesheet" href="/reference/home.css"><link rel="stylesheet" href="/reference.css"><link rel="stylesheet" href="/editorial.css"><link rel="stylesheet" href="/cmd-navigation.css"><script src="/reference.js" defer></script>'
    directory = '''<nav class="home-directory" aria-label="Explore SOC"><a href="/about/"><span>01</span>About SOC ↗</a><a href="/academics/"><span>02</span>Academics ↗</a><a href="/communities/"><span>03</span>Communities ↗</a><a href="/news-events/"><span>04</span>News & Events ↗</a><a href="/contact/"><span>05</span>Contact ↗</a><a href="/pay-dues/"><span>06</span>Pay Dues ↗</a></nav>'''
    from tactile_design import home, feedback
    body = f'<a class="skip-link" href="#student-desk">Skip to the student desk</a><main>{hero}{home(journal)}</main>{footer()}{dialogs()}<script src="/hero.js" defer></script><script src="/journal.js" defer></script>'
    (PUBLIC / "index.html").write_text("<!doctype html><html lang=\"en\"><head>" + head + "</head><body id=\"top\">" + body + "</body></html>", encoding="utf-8")
    (TEMPLATES / "article-header.html").write_text(shared_header("/#journal"), encoding="utf-8")
    for alias, destination in (("community", "/communities/"), ("events", "/news-events/#tab-events")):
        page("Continue to " + alias.title(), f'<div class="route-alias"><h1>{alias.title()}</h1><a class="solid-action" href="{destination}">Continue →</a></div><script>location.replace({json.dumps(destination)});</script>', "/" + alias + "/")
    rules = page_trees["about"].find(id="tab-rules")
    dress = page_trees["about"].find(id="tab-dresscode")
    print_body = '<div class="reference-surface reference-about printable-rules"><div class="print-toolbar"><button class="solid-action" type="button" data-print>Print / save PDF</button><a href="/about/#tab-rules">Back to About SOC</a></div><h1>SOC Rules & Regulations</h1><p class="article-source-note">Draft from the supplied website reference. Confirm with SOC before relying on this as official policy.</p>' + rules.html() + dress.html() + '</div>'
    page("Rules & Regulations", print_body, "/resources/rules/", "about")
    page("Feedback & welfare", feedback(), "/feedback/")
    SEARCH_INDEX.extend([{"title": "The journal", "section": "Stories", "url": "/#journal", "text": "Editorial, engineering, perspectives, cybersecurity."}])
    for title, url, terms in [
        ('Timetable', '/academics/#tab-timetable', 'Class exam timetable schedule programme level'),
        ('Materials & past questions', '/academics/#tab-materials', 'CSC 201 COS 101 SEN 301 CYB 301 PDF notes library'),
        ('Peer tutoring', '/academics/#tab-tutoring', 'Study help senior tutor'),
        ('Opportunities', '/news-events/#tab-opportunities', 'Internships hackathons scholarships jobs deadlines'),
        ('Freshers guide', '/about/#tab-freshers', 'Registration first week checklist'),
        ('NACOS constitution', '/about/#tab-constitution', 'Membership executive roles elections PDF'),
        ('Builders wall', '/communities/#tab-builders', 'Student projects portfolio spotlight'),
        ('Student businesses', '/communities/#tab-businesses', 'Student business directory shop services'),
        ('Lost & found', '/communities/#tab-lost-found', 'Lost item found property'),
        ('ICT & Wi-Fi', '/communities/#tab-ict', 'Network connection lab issue report'),
        ('Feedback & welfare', '/feedback/', 'Anonymous complaint suggestion course lecturer feedback status tracking'),
    ]:
        SEARCH_INDEX.append({'title':title,'section':'Student desk','url':url,'text':terms})
    (PUBLIC / "reference/search.json").write_text(json.dumps(SEARCH_INDEX, ensure_ascii=False), encoding="utf-8")
    for file in PUBLIC.rglob("*.html"):
        file.write_text(re.sub(r"(?m)^[ \t]+$", "", file.read_text(encoding="utf-8")), encoding="utf-8")
    coverage = {slug: [n.attrs.get("data-section-label", n.text()) for n in tree.walk() if n.attrs.get("data-tab-group") == "main"] for slug, tree in page_trees.items()}
    (ROOT / "reference/coverage.json").write_text(json.dumps(coverage, indent=2), encoding="utf-8")
    print(f"Built the full reference: {len(pages)} core pages, {len(ARTICLES)} news detail pages, {len(EVENTS)} event downloads.")


if __name__ == "__main__":
    main()
