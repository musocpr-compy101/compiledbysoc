"""Desktop section navigation; mobile keeps its existing horizontal tabs."""
from reference_dom import Node
from editorial_design import fragment

PAGE_COPY = {
    'about': ('Get to know SOC.', 'Your guide to life in the school.'),
    'academics': ('Make study simpler.', 'Find what you need for your next step.'),
    'communities': ('Find your people.', 'A place to connect, build and get support.'),
    'news-events': ('Stay in the loop.', 'Catch up on what matters around SOC.'),
}
DETAILS = {
    'overview': ('home', 'Start with the bigger picture.'),
    'values': ('spark', 'The principles we share.'),
    'vision': ('spark', 'Where the school is headed.'),
    'mission': ('flag', 'What we work towards.'),
    'departments': ('grid', 'Explore the three programmes.'),
    'rules': ('book', 'Know what is expected.'),
    'dresscode': ('person', 'A guide to campus dress.'),
    'whyus': ('spark', 'See what makes SOC different.'),
    'freshers': ('flag', 'Your first-week checklist.'),
    'constitution': ('book', 'Membership, roles and elections.'),
    'timetable': ('calendar', 'Plan your classes and exams.'),
    'facilities': ('grid', 'Get to know your learning spaces.'),
    'admission': ('book', 'Entry requirements by programme.'),
    'research': ('search', 'Explore ideas and student work.'),
    'courses': ('book', 'Find your programme’s courses.'),
    'careers': ('flag', 'See where your skills can take you.'),
    'tutoring': ('people', 'Find support or offer a hand.'),
    'materials': ('folder', 'Notes, resources and past questions.'),
    'faculty': ('person', 'Meet the people who teach you.'),
    'people': ('people', 'Find your student representatives.'),
    'affiliations': ('grid', 'Explore the wider computing community.'),
    'groups': ('people', 'Find a group that feels like you.'),
    'welfare': ('heart', 'Reach out when you need support.'),
    'builders': ('code', 'Discover what students are making.'),
    'businesses': ('grid', 'Explore student-run businesses.'),
    'lost-found': ('search', 'Lost something? Start here.'),
    'ict': ('code', 'Get help with connection and lab issues.'),
    'news': ('book', 'Read the latest stories and notices.'),
    'events': ('calendar', 'Browse dates and campus activities.'),
    'opportunities': ('flag', 'Look out for your next opportunity.'),
    'polls': ('grid', 'Have a say in student life.'),
}
ICONS = {
    'home': '<path d="m3 10 9-7 9 7v10H3zM9 20v-7h6v7"/>',
    'spark': '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',
    'flag': '<path d="M5 21V3h14l-3 5 3 5H5"/>',
    'grid': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    'book': '<path d="M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z"/>',
    'person': '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    'people': '<circle cx="9" cy="7" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M16 4a3 3 0 0 1 0 6M18 13a6 6 0 0 1 4 6v2"/>',
    'calendar': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M7 15h3M14 15h3"/>',
    'search': '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
    'folder': '<path d="M3 6h7l3 3h8v11H3z"/>',
    'heart': '<path d="M12 21 3.5 12.5C-2 7 6 0 12 7c6-7 14 0 8.5 5.5Z"/>',
    'code': '<path d="m8 6-6 6 6 6M16 6l6 6-6 6M14 3l-4 18"/>',
}


def enhance_navigation(root, slug):
    index = root.find(cls='section-index')
    if not index or slug not in PAGE_COPY:
        return root
    title, intro = PAGE_COPY[slug]
    header = Node('div', {'class': 'desktop-index-intro'})
    header.append(Node('h2', children=[title]))
    header.append(Node('p', children=[intro]))
    index.children.insert(0, header)
    header.parent = index
    for button in index.all(tag='button'):
        target = button.attrs.get('data-tab-target', '').removeprefix('tab-')
        if not target:
            continue
        kind, description = DETAILS.get(target, ('grid', 'Explore this part of SOC.'))
        button.append(fragment('<span class="desktop-index-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + ICONS[kind] + '</svg></span>'))
        button.append(Node('span', {'class': 'desktop-index-description', 'aria-hidden': 'true'}, [description]))
    return root
