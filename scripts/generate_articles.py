"""Generate the blog's static, independently linkable sample editorial pages."""
from pathlib import Path
from html import escape
import re

ROOT = Path(__file__).resolve().parents[1]
ARTICLES = [
    {
        'slug': 'start-before-ready',
        'category': "EDITOR'S NOTE",
        'title': 'You don’t need permission to build something.',
        'description': 'The side project. The wild idea. The thing you keep putting off until you know enough. This is your sign to start.',
        'body': '''
<p>There is a particular kind of project that lives forever in a notes app. It has a name, a list of features, maybe even a colour palette. It is always about to happen. Right after exams. Right after one more course. Right after you finally feel like a real developer.</p>
<p>The uncomfortable part is that “ready” does not send a notification. You can keep waiting for it, and the project can keep getting more impressive in your head without getting any more real.</p>
<h2>Make the first version embarrassingly small.</h2>
<p>If your idea is a campus marketplace, the first question is not how to build every feature a marketplace has ever had. It is whether one person can find something they need from another person. Start with that exchange. Understand it. Then build the smallest thing that makes it easier.</p>
<p>A small first version is not a lack of ambition. It is a way of giving your ambition something concrete to work with. A working page gives you better questions than a perfect plan does.</p>
<blockquote><p>You do not need to know everything. You need a next step small enough to take.</p></blockquote>
<h2>Let the work teach you.</h2>
<p>Building exposes the gaps that tutorials can politely hide. You discover that the button works until the connection drops, or that your beautifully named function makes no sense to your teammate. Those moments are not evidence that you should have waited. They are the point of doing the work.</p>
<p>Keep a short record of what surprised you. Write down the assumption that broke, the question you had to ask, and the trade-off you made. That record will become more useful than a list of technologies in your bio. It shows how you think when the answer is not already in front of you.</p>
<h2>Find one person to build for.</h2>
<p>“Everyone” is a difficult first user. Your coursemate who misses timetable updates is easier to understand. So is the student vendor who spends every evening repeating the same delivery information.</p>
<p>Watch what that person actually does. Ask what gets in their way. Show them an unfinished version and let their confusion improve it. You do not have to accept every suggestion, but you do have to learn the difference between what you imagined and what they need.</p>
<p>This journal starts with the same idea. We are making a place to share what we are learning while we are still learning it. Not after we have every answer. Now.</p>
<p>Open the folder. Make the first commit. Give the idea a chance to exist outside your head.</p>'''
    },
    {
        'slug': 'first-pull-request',
        'category': 'SOFTWARE ENGINEERING',
        'title': 'Your first pull request is a conversation.',
        'description': 'Good code matters. So does how you explain it to the next person.',
        'body': '''
<p>Your code works on your machine. You have checked the changes, taken a breath, and opened your first pull request. Now someone else has to understand what you changed—and, more importantly, why.</p>
<p>It helps to think of that request as the beginning of a conversation, not the delivery of a finished verdict. The code is one part of it. The context you give the reviewer is another.</p>
<h2>Start with the problem.</h2>
<p>A description that says “updated files” asks your reviewer to reconstruct your entire afternoon. A description that explains the broken behaviour, the intended outcome, and the approach you chose gives them somewhere useful to start.</p>
<p>Imagine a classmate opening the request between lectures. Can they tell what a user will experience differently? Can they see which part deserves the closest attention? Have you pointed out the thing you are still uncertain about?</p>
<blockquote><p>Make it easy for someone to understand your thinking, not just inspect your typing.</p></blockquote>
<h2>Keep the conversation focused.</h2>
<p>When a bug fix also renames half the project and changes the formatting of unrelated files, every extra change competes for attention. A small, coherent request is easier to discuss because its purpose stays visible.</p>
<p>This does not mean counting lines as a measure of quality. It means keeping the changes connected to the problem you are trying to solve. If a separate improvement can stand on its own, give it its own conversation.</p>
<h2>Show what you checked.</h2>
<p>Tell the reviewer how you checked the result. If you tried a particular input, describe it. If a layout changes, show the relevant state. If you could not check something, say so plainly. “I have not tested this on a slow connection” is more useful than an unqualified “works perfectly.”</p>
<p>Being precise about what you know is not a weakness. It gives your teammate a clear place to contribute instead of leaving them to guess what is missing.</p>
<h2>Separate the feedback from yourself.</h2>
<p>A question about a function is not a judgment on your future as an engineer. Read the question, check the context, and explain the choice. Sometimes your explanation will reveal that the code should change. Sometimes it will reveal that the reviewer needs information you forgot to include.</p>
<p>You can disagree respectfully. You can also say, “I had not considered that.” Both are part of learning to work with people.</p>
<p>The goal is not to make it through review untouched. The goal is for the shared work to become clearer, and for everyone involved to understand it a little better than they did before.</p>'''
    },
    {
        'slug': 'bug-in-the-brief',
        'category': 'PERSPECTIVES',
        'title': 'Sometimes, the bug is in the brief.',
        'description': 'Before you rewrite the function, make sure you’re solving the right problem.',
        'body': '''
<p>A team is asked to make a class announcement board. They build categories, notifications, and a polished screen for publishing updates. Everything behaves as planned. Students still miss the announcements.</p>
<p>This is a hypothetical project, but the uncomfortable question is familiar: what if the implementation is working and the original understanding is not?</p>
<h2>Listen past the requested feature.</h2>
<p>“We need a dashboard” describes a possible solution. It does not yet describe the problem. Perhaps people cannot find the latest information. Perhaps they do not know which source to trust. Perhaps the information arrives too late to act on.</p>
<p>Each of those situations asks for something different. Before drawing the dashboard, ask what someone was trying to do the last time the problem happened. A specific story is often easier to work with than a list of desired features.</p>
<blockquote><p>A working feature is not automatically a solved problem.</p></blockquote>
<h2>Write down the assumption.</h2>
<p>Every project carries a few sentences that everyone quietly treats as facts. Students will check the site each morning. The person posting updates will have a laptop. A message marked urgent will actually be urgent.</p>
<p>Put those assumptions where the team can see them. Ask which would hurt the idea most if it were wrong. That is a useful place to investigate before making the interface more elaborate.</p>
<p>Sometimes a short conversation will expose a gap. Sometimes you need to watch someone use the rough version. The point is not to eliminate uncertainty before starting; it is to notice which uncertainty you are building on.</p>
<h2>Agree on what better looks like.</h2>
<p>“Improve communication” can mean almost anything. “A student can find the most recent room change without asking three people” gives the team an outcome they can discuss and observe.</p>
<p>Keep that outcome close while making choices. Does another category help? Does the announcement need an expiry date? Should a correction replace the old message or appear beside it? A clear purpose makes these questions less arbitrary.</p>
<h2>Leave room to change your mind.</h2>
<p>Learning that the first idea was incomplete is not wasted work. Refusing to respond to that learning is more expensive. A prototype earns its keep when it teaches you something, even if what it teaches you is that the project needs a different direction.</p>
<p>The next time a feature seems technically correct but strangely unhelpful, pause before rewriting it. Walk back to the person, the situation, and the original question.</p>
<p>You might still find a bug in the code. You might also find a better problem to solve.</p>'''
    },
    {
        'slug': 'security-is-a-habit',
        'category': 'CYBERSECURITY',
        'title': 'Good security is a habit, not a hoodie.',
        'description': 'The quiet, everyday choices that deserve more attention than the aesthetic.',
        'body': '''
<p>Cybersecurity has an image problem. In a certain kind of picture, it is always midnight, the screen is always green, and someone is wearing a hoodie indoors. The everyday work is usually less cinematic.</p>
<p>It looks like noticing a surprising request. Checking who actually needs access. Thinking about what happens when an account is lost. Asking one more question before treating an unfamiliar message as trustworthy.</p>
<h2>Pay attention to the ordinary moments.</h2>
<p>For a student team, the interesting decisions often happen long before a dramatic incident. Who owns the project account? What happens when a teammate leaves? Where does the team document who can change a setting?</p>
<p>These questions are not glamorous, but they help a team understand its own responsibilities. If the only answer is “someone probably knows,” that uncertainty deserves attention.</p>
<blockquote><p>Take the responsibility seriously, even when the task feels ordinary.</p></blockquote>
<h2>Make asking questions normal.</h2>
<p>A healthy team gives people room to stop and verify something without feeling foolish. A request that seems unusual should be discussable, even if it appears to come from someone senior or arrives with a sense of urgency.</p>
<p>The culture matters here. If every question is treated as an inconvenience, people learn to keep their doubts to themselves. If careful questions are welcomed, uncertainty becomes something the team can work through together.</p>
<h2>Think beyond the successful demo.</h2>
<p>A prototype presentation naturally focuses on the happy path: the user signs in, the action succeeds, the result appears. A responsible builder also asks what happens when the expected sequence breaks.</p>
<p>What should someone see when access is denied? Who can help if a team account becomes unavailable? What information does the project actually need to collect? Those questions belong in the planning conversation, not only in a hurried cleanup afterward.</p>
<p>There is no single checklist that makes every project safe. Context matters, and unfamiliar situations are a reason to seek appropriate guidance. Being honest about the limits of your knowledge is part of taking the work seriously.</p>
<h2>Practise within permission.</h2>
<p>Curiosity is a good starting point for learning security. Responsibility has to travel with it. Use practice environments designed for learning, respect the scope you have been given, and ask before testing a system you do not own.</p>
<p>You do not need to perform an identity to care about security. You need patience, sound judgment, and the willingness to treat small decisions as real decisions.</p>
<p>The hoodie is optional. The care is not.</p>'''
    }
]


if __name__ == '__main__':
    from editorial_design import clean_action_html
    homepage = (ROOT / 'dist' / 'index.html').read_text(encoding='utf-8')
    base_head = re.search(r'<head>(.*?)</head>', homepage, re.S).group(1)
    base_head = re.sub(r'\s*<link rel="preload"[^>]*>', '', base_head)
    header = (ROOT / 'scripts' / 'templates' / 'article-header.html').read_text(encoding='utf-8').strip()
    footer = re.search(r'<footer class="site-footer">.*?</footer>', homepage, re.S).group(0)
    dialogs = ''.join(re.findall(r'<dialog\b.*?</dialog>', homepage, re.S))
    for article in ARTICLES:
        head = re.sub(r'<title>.*?</title>', '<title>' + escape(article['title']) + ' — Compiled By SOC</title>', base_head)
        head = re.sub(r'<meta name="description"[^>]*>', '<meta name="description" content="' + escape(article['description'], quote=True) + '">', head)
        page = f'''<!doctype html>
<html lang="en"><head>{head}</head><body id="top">
<a class="skip-link" href="#article">Skip to article</a>{header}
<main class="article-shell" id="article">
<a class="article-back" href="/#journal">← Back to the journal</a>
<article><header class="article-header"><div class="story-category">{escape(article['category'])} <span>—</span> 3 MIN READ</div><h1>{escape(article['title'])}</h1><p class="article-deck">{escape(article['description'])}</p><div class="story-byline"><span class="author-mark" aria-hidden="true">S.</span><div><span>SOC Editorial</span><small>Vol. 001 · The first commit · Sample story</small></div></div></header>
<div class="article-body">{article['body']}</div></article>
<div class="article-end"><span>Compiled with curiosity. By SOC.</span><a href="/#journal">More from the journal ↗</a></div>
</main>{footer}{dialogs}</body></html>'''
        destination = ROOT / 'dist' / 'stories' / article['slug']
        destination.mkdir(parents=True, exist_ok=True)
        (destination / 'index.html').write_text(clean_action_html(page), encoding='utf-8')
    print(f'Generated {len(ARTICLES)} standalone article pages.')
