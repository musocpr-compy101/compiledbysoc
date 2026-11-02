"""Presentation layer for the supplied SOC content; the terminal stays separate."""
from html import escape
import re
from reference_dom import Node, parse

PAGES = {
    "about": ("01", "About SOC", "Inside<br><em>SOC.</em>", "The people, principles, and purpose behind the School of Computing at Maduka University.", "topview.jpeg", "Maduka University campus", "Maduka University · Enugu State"),
    "academics": ("02", "Study", "You never liked scrolling anyways.<br><em>Get what you need right here.</em>", "Timetables, past questions, materials and a little help from your people.", "frame-103.png", "A laptop showing code beside books", "The shared folder, finally organised."),
    "communities": ("03", "Communities", "Find your<br><em>people.</em>", "Meet the faculty, student leaders, groups, and support teams that make the School of Computing a community.", "img-5577.jpg", "Students walking together on campus", "Life at the School of Computing"),
    "news-events": ("04", "Updates", "Word<br><em>on campus.</em>", "The notices, stories, opportunities and dates worth keeping up with.", None, None, None),
    "contact": ("05", "Contact", "Let's<br><em>talk.</em>", "Questions about academics, student life, or the school? Find the right contact or send us a message.", None, None, None),
    "pay-dues": ("06", "Pay Dues", "Departmental<br><em>dues.</em>", "Session details, payment options, and receipt instructions in one place.", None, None, None),
}


def fragment(html):
    return next(n for n in parse(html).children if isinstance(n, Node))


def replace_node(old, new):
    parent = old.parent
    parent.children[parent.children.index(old)] = new
    new.parent = parent


def clean_actions(root):
    """Keep visible action labels textual without changing their destinations."""
    for node in root.walk():
        if node.tag not in ("a", "button"):
            continue
        if "data-calendar-step" in node.attrs:
            node.replace_text("Previous" if node.attrs["data-calendar-step"] == "-1" else "Next")
            continue
        for child in [node, *node.walk()]:
            child.children = [re.sub(r"[↗↘↙↖↑↓←→↵]", "", x) if isinstance(x, str) else x for x in child.children]
        if not node.text() and node.attrs.get("aria-label", "").startswith("Read "):
            node.replace_text("Read story")
    return root


def clean_action_html(html):
    declaration = "<!doctype html>" if re.match(r"\s*<!doctype", html, re.I) else ""
    return declaration + clean_actions(parse(html)).html()


def apply_editorial(root, slug):
    number, label, title, description, image, alt, caption = PAGES[slug]
    old = root.find(cls="page-hero") or root.find(cls="hero-photo")
    photo = f'<figure class="masthead-photo"><img src="/assets/reference/{image}" alt="{alt}" width="1200" height="900" decoding="async"><figcaption>{caption}</figcaption></figure>' if image else ''
    detail = '' if image else '<div class="masthead-note"><span>COMPILED BY SOC</span><p>School of Computing<br>Maduka University</p></div>'
    replace_node(old, fragment(f'<header class="editorial-masthead {"has-photo" if image else "type-only"}"><div class="masthead-copy"><p class="editorial-kicker"><span>{number} / {label}</span><span>Maduka University</span></p><h1>{title}</h1><p class="masthead-deck">{description}</p></div>{photo}{detail}</header>'))

    tab_nav = root.find(cls="tab-nav") or root.find(cls="main-tabs")
    if tab_nav:
        panels = [n for n in root.children if isinstance(n, Node) and n.has("tab-content")]
        container = Node("div", {"class": "editorial-body"})
        index = Node("aside", {"class": "section-index", "aria-label": label + " sections"})
        index.append(fragment('<p class="section-index-label">Explore this section</p>'))
        tab_nav.remove()
        for i, button in enumerate(tab_nav.all(tag="button"), 1):
            button.attrs["data-section-label"] = button.text()
            button.children.insert(0, fragment(f'<span class="section-number" aria-hidden="true">{i:02}</span>'))
        index.append(tab_nav)
        content = Node("div", {"class": "section-panels"})
        for panel in panels:
            panel.remove()
            content.append(panel)
        container.append(index)
        container.append(content)
        masthead = root.find(cls="editorial-masthead")
        root.children.insert(root.children.index(masthead) + 1, container)
        container.parent = root

    if slug == "academics":
        programmes = ("computer-science", "software-engineering", "cybersecurity")
        for key, detail, link in zip(programmes, root.all(cls="dept-detail"), root.all(cls="dhc-link")):
            detail.attrs["id"] = "programme-" + key
            link.tag = "a"
            link.attrs = {"class": "dhc-link", "href": "#programme-" + key}
            link.replace_text("Explore programme")
        for box in root.all(cls="drive-link-box"):
            box.add_class("editorial-resource")
    if slug == "about":
        for key, card in zip(("computer-science", "software-engineering", "cybersecurity"), root.all(cls="dept-card")):
            link = card if card.tag == "a" else card.find(tag="a")
            if link:
                link.attrs["href"] = "/academics/#programme-" + key
    if slug == "contact":
        for value in root.all(cls="contact-detail-text"):
            if "@" in value.text() and not value.find(tag="a"):
                address = value.text()
                value.children = []
                value.append(fragment(f'<a href="mailto:{escape(address, quote=True)}">{escape(address)}</a>'))
        for value in root.all(cls="contact-detail-text"):
            if value.text().startswith("["):
                value.replace_text("Contact details to be confirmed")
        for control in root.all(tag="button"):
            if "XXX" in control.text():
                control.replace_text("Number to be confirmed")
    if slug == "pay-dues":
        grid = root.find(cls="pay-intro-grid")
        columns = [n for n in grid.children if isinstance(n, Node)]
        columns[0].add_class("payment-main")
        columns[1].add_class("payment-sidebar")
        boxes = [n for n in columns[1].children if isinstance(n, Node)]
        boxes[0].add_class("payment-summary")
        boxes[1].add_class("payment-session")
        for row in boxes[0].children:
            if isinstance(row, Node):
                row.add_class("summary-row" if "justify-content" in row.attrs.get("style", "") else "summary-heading" if row.text() == "Payment Summary" else "summary-note")
        for amount in root.all(cls="pay-card-amount"):
            amount.replace_text("₦3,000")
        root.find(cls="btn-paystack").replace_text("Online payment options")

    # Remove inline type/color decisions; keep layout and meaningful colour swatches.
    for node in root.walk():
        style = node.attrs.get("style", "")
        if style and not node.has("swatch") and not node.has("swatch-label"):
            declarations = [d for d in style.split(";") if d.strip() and not re.match(r"\s*(?:font(?:-[\w-]+)?|color|letter-spacing|line-height)\s*:", d)]
            node.attrs["style"] = ";".join(declarations)
        if node.attrs.get("data-section-label"):
            continue
        if node.has("event-meta-icon") or node.has("contact-detail-icon"):
            node.attrs["aria-hidden"] = "true"
    return clean_actions(root)


def editorial_home(root):
    for i, dot in enumerate(root.all(cls="dot"), 1):
        dot.replace_text(f"{i:02}")
    photo = root.find(cls="hero-img-ph").find(tag="img")
    photo.attrs.pop("style", None)
    photo.attrs.update({"width": "1000", "height": "1000", "alt": "Buildings and landscape at Maduka University"})
    root.find(cls="hero").attrs["aria-label"] = "Discover the School of Computing"
    quote = root.find(cls="dean-q")
    quote.tag = "blockquote"
    quote.attrs["class"] = "dean-q"
    root.find(cls="s-ey").replace_text("Around the school")
    news = root.find(cls="news-sec")
    news.append(fragment('<a class="editorial-text-link" href="/news-events/">All news &amp; events</a>'))
    return clean_actions(root)


def editorial_journal(html):
    root = parse(html)
    art = root.find(cls="feature-art")
    art.children = []
    art.add_class("editorial-feature-image")
    art.append(fragment('<img src="/assets/reference/frame-103.png" width="1733" height="1034" alt="" loading="lazy" decoding="async">'))
    art.append(fragment('<span class="photo-caption">01 / The first commit</span>'))
    for i, (card, asset) in enumerate(zip(root.all(cls="story-cover"), ("frame-65.png", "img-5577.jpg", "nasa-q1p7bh3shj8-unsplash.jpg")), 2):
        card.children = []
        card.attrs["class"] = "story-cover editorial-story-image"
        card.append(fragment(f'<img src="/assets/reference/{asset}" alt="" width="900" height="650" loading="lazy" decoding="async">'))
        card.append(fragment(f'<span class="photo-caption">{i:02} / The journal</span>'))
    return clean_actions(root).html()
