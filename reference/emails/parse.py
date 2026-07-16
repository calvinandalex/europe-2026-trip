import email, glob, os, re
from email import policy
from html import unescape

def strip_html(html):
    html = re.sub(r'<br\s*/?>', '\n', html, flags=re.I)
    html = re.sub(r'</p>', '\n\n', html, flags=re.I)
    html = re.sub(r'</(td|tr|li|h[1-6])>', '\n', html, flags=re.I)
    html = re.sub(r'<[^>]+>', '', html)
    html = unescape(html)
    html = re.sub(r'\n\s*\n\s*\n+', '\n\n', html)
    lines = [l.strip() for l in html.split('\n')]
    return '\n'.join(l for l in lines if l)

def dump(msg, depth=0):
    out = []
    for h in ('From','To','Subject','Date'):
        v = msg.get(h)
        if v:
            out.append(f"{'  '*depth}{h}: {v}")
    # get body
    if msg.is_multipart():
        for p in msg.iter_parts():
            ct = p.get_content_type()
            if ct == 'message/rfc822':
                out.append(f"{'  '*depth}--- FORWARDED ---")
                inner = p.get_payload()[0] if isinstance(p.get_payload(), list) else p.get_payload()
                out.extend(dump(inner, depth+1))
            elif ct == 'multipart/alternative' or ct.startswith('multipart/'):
                out.extend(dump(p, depth))
            elif ct == 'text/plain':
                try:
                    body = p.get_content()
                    if body.strip():
                        out.append(f"{'  '*depth}[PLAIN]\n{body[:8000]}")
                except: pass
            elif ct == 'text/html':
                try:
                    body = p.get_content()
                    if body.strip():
                        out.append(f"{'  '*depth}[HTML->TEXT]\n{strip_html(body)[:8000]}")
                except: pass
    else:
        ct = msg.get_content_type()
        try:
            body = msg.get_content()
            if ct == 'text/html':
                out.append(f"[HTML->TEXT]\n{strip_html(body)[:8000]}")
            else:
                out.append(f"[BODY]\n{body[:8000]}")
        except: pass
    return out

for f in sorted(glob.glob('*.eml')):
    print("="*80)
    print(f"FILE: {f}")
    print("="*80)
    with open(f, 'rb') as fh:
        msg = email.message_from_bytes(fh.read(), policy=policy.default)
    print('\n'.join(dump(msg)))
    print()
