"""Shared editorial cards based on the supplied mobile news references."""
from html import escape
import re
from reference_dom import Node, parse


def text(node, cls, default=''):
    found = node.find(cls=cls)
    return found.text() if found else default


def fragment(markup):
    return next(n for n in parse(markup).children if isinstance(n, Node))


def cover(category, date='', image='', symbol='C_', category_class=''):
    picture = f'<img src="{escape(image, quote=True)}" alt="" width="1200" height="675" loading="lazy" decoding="async">' if image else f'<span class="soc-cover-mark" aria-hidden="true">{escape(symbol)}</span>'
    meta = f'<div class="soc-cover-meta"><span class="soc-post-category {category_class}">{escape(category)}</span>'
    if date:
        meta += f'<span class="soc-cover-date">{escape(date)}</span>'
    return f'<div class="soc-post-cover{ " has-image" if image else ""}">{picture}{meta}</div></div>'


def footer(author, href=None, label='Read more'):
    end = f'<a href="{escape(href, quote=True)}" class="soc-post-read">{label}<span aria-hidden="true"> →</span></a>' if href else f'<span class="soc-post-read">{label}<span aria-hidden="true"> →</span></span>'
    return f'<div class="soc-post-footer"><span class="soc-post-author">{escape(author)}</span>{end}</div>'


def date_stamp(date):
    match = re.search(r'([A-Za-z]{3})[A-Za-z]*\s*(\d{1,2})', date)
    if match:
        month, day = match.groups()
        return f'<span class="soc-brief-date" aria-label="{escape(date, quote=True)}"><span>{month.upper()}</span><span>{day.zfill(2)}</span></span>'
    return f'<span class="soc-brief-date">{escape(date)}</span>'


def apply_post_design(html):
    if not any(c in html for c in ['class="news-card', 'class="feat-post', 'class="featured-story', 'class="t-feed-card']):
        return html
    root = parse(html)
    for card in [*root.all(cls='feat-post'), *root.all(cls='news-card')]:
        if card.has('soc-post'):
            continue
        feature = card.has('feat-post')
        prefix = 'feat' if feature else 'nc'
        category = text(card, prefix+'-label' if feature else 'nc-cat', card.attrs.get('data-cat','News').title())
        date = text(card, prefix+'-date')
        title = text(card, prefix+'-title')
        excerpt = text(card, prefix+'-excerpt')
        image = '/assets/tactile/frame-103.webp' if feature else ''
        if card.attrs.get('data-cat') == 'event':
            image = '/assets/tactile/topview.webp'
        card.add_class('soc-post')
        card.children = []
        card.append(fragment(cover(category, date, image, '✦' if category.lower()=='achievement' else 'C_')))
        body = Node('div', {'class': 'soc-post-body '+prefix+'-body'})
        body.append(Node('h3', {'class': 'soc-post-title '+prefix+'-title'}, [title]))
        if excerpt:
            body.append(Node('p', {'class': 'soc-post-excerpt '+prefix+'-excerpt'}, [excerpt]))
        body.append(fragment(footer('SOC Communications')))
        card.append(body)
    for row in root.all(cls='sidebar-item'):
        if row.has('soc-brief'):
            continue
        title,category,date = text(row,'sb-title'),text(row,'sb-cat'),text(row,'sb-date')
        row.add_class('soc-brief')
        row.children = []
        row.append(fragment(date_stamp(date)))
        copy = Node('div', {'class':'soc-brief-copy'})
        copy.append(Node('h3', {'class':'sb-title'}, [title]))
        copy.append(Node('span', {'class':'sb-cat'}, [category]))
        row.append(copy)
    for card in [*root.all(cls='featured-story'), *root.all(cls='story-card')]:
        if card.has('soc-post'):
            continue
        feature = card.has('featured-story')
        category = text(card,'story-category').split('—')[0].strip()
        title_node = card.find(tag='h3')
        title = title_node.text()
        href = title_node.find(tag='a').attrs['href']
        picture = card.find(tag='img')
        image = picture.attrs.get('src','') if picture else ''
        copy = card.find(cls='featured-copy') if feature else card
        paragraph = next((n for n in copy.children if isinstance(n,Node) and n.tag=='p'), None)
        excerpt = paragraph.text() if paragraph else ''
        card.add_class('soc-post')
        card.children = []
        card.append(fragment(cover(category,'3 min read',image,category_class='story-category')))
        body = Node('div', {'class':'soc-post-body'})
        heading = Node('h3', {'class':'soc-post-title'})
        heading.append(Node('a', {'href':href}, [title]))
        body.append(heading)
        body.append(Node('p', {'class':'soc-post-excerpt'}, [excerpt]))
        body.append(fragment(footer('SOC Editorial',href)))
        card.append(body)
    for i,card in enumerate(root.all(cls='t-feed-card')):
        if card.has('soc-post'):
            continue
        meta = card.find(cls='t-card-meta')
        category = meta.find(tag='span').text()
        heading = card.find(tag='h3')
        href = heading.find(tag='a').attrs['href']
        excerpt = card.find(tag='p').text()
        audience = card.find(cls='t-card-end').find(tag='span').text()
        images=['/assets/tactile/topview.webp','/assets/tactile/frame-103.webp','/assets/tactile/img-5577.webp','']
        card.add_class('soc-post')
        card.children=[]
        card.append(fragment(cover(category,'Sample post',images[i%len(images)])))
        heading.add_class('soc-post-title')
        body = Node('div', {'class':'soc-post-body'})
        body.append(heading)
        body.append(Node('p', {'class':'soc-post-excerpt'}, [excerpt]))
        body.append(fragment(footer(audience,href,'Read more')))
        card.append(body)
    return '<!doctype html>'+root.html()
