"""Small HTML tree used to adapt the supplied static pages without dependencies."""
from html import escape
from html.parser import HTMLParser

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class Node:
    def __init__(self, tag="", attrs=None, children=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        self.children = children or []
        self.parent = None

    def has(self, name):
        return name in self.attrs.get("class", "").split()

    def add_class(self, name):
        self.attrs["class"] = (self.attrs.get("class", "") + " " + name).strip()

    def walk(self):
        for child in self.children:
            if isinstance(child, Node):
                yield child
                yield from child.walk()

    def find(self, cls=None, tag=None, id=None):
        return next((n for n in self.walk() if (cls is None or n.has(cls)) and (tag is None or n.tag == tag) and (id is None or n.attrs.get("id") == id)), None)

    def all(self, cls=None, tag=None):
        return [n for n in self.walk() if (cls is None or n.has(cls)) and (tag is None or n.tag == tag)]

    def text(self):
        return "".join(c.text() if isinstance(c, Node) else c for c in self.children).strip()

    def replace_text(self, value):
        self.children = [value]

    def remove(self):
        if self.parent:
            self.parent.children.remove(self)

    def append(self, node):
        if isinstance(node, Node):
            node.parent = self
        self.children.append(node)

    def html(self):
        inner = "".join(c.html() if isinstance(c, Node) else escape(c, quote=False) for c in self.children)
        if not self.tag:
            return inner
        attrs = "".join(" " + ("viewBox" if k == "viewbox" else k) + ("" if v is None else '="' + escape(str(v), quote=True) + '"') for k, v in self.attrs.items())
        if self.tag in VOID:
            return "<" + self.tag + attrs + ">"
        return "<" + self.tag + attrs + ">" + inner + "</" + self.tag + ">"


class Tree(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, 0, -1):
            if self.stack[index].tag == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, data):
        self.stack[-1].append(data)


def parse(html):
    return Tree(html).root
