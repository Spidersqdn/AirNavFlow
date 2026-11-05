"""Turn NOTAM emails dropped in notam/inbox/*.json (by the Google Apps Script) into
notam/NOTAMyyMMMdd.txt + notam/latest.txt, then delete NOTAM files older than 3 days.

Inbox JSON: {"subject", "filename", "mime", "date" (ISO, email time), "data" (base64)}.
Needs pandoc (docx) and pdftotext (pdf). Prints the names written, one per line.
"""
import base64, datetime as dt, glob, json, os, re, subprocess, sys, tempfile

NOTAM_DIR = "notam"
KEEP_DAYS = 3
BKK = dt.timezone(dt.timedelta(hours=7))
MONTHS = "JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC".split()


def parse_date(text):
    """'NOTAM 5 NOV 2026' / 'NOTAM_05NOV26.docx' -> date, or None."""
    for d, m, y in re.findall(r"(\d{1,2})\s*[-_ ]?\s*([A-Za-z]{3})[A-Za-z]*\.?\s*[-_ ]?\s*(\d{4}|\d{2})(?!\d)", text or ""):
        if m.upper() not in MONTHS:
            continue
        y = int(y) + (2000 if len(y) == 2 else 0)
        if y > 2500:  # Thai Buddhist year
            y -= 543
        try:
            return dt.date(y, MONTHS.index(m.upper()) + 1, int(d))
        except ValueError:
            pass
    return None


def notam_name(subject, filename, email_iso):
    s, f = parse_date(subject), parse_date(filename)
    day = max([x for x in (s, f) if x], default=None)
    if day is None:  # no date in subject or file name: day after the email arrived
        sent = dt.datetime.fromisoformat(email_iso.replace("Z", "+00:00")).astimezone(BKK)
        day = sent.date() + dt.timedelta(days=1)
    return "NOTAM%02d%s%02d" % (day.year % 100, MONTHS[day.month - 1], day.day), day


def to_text(path, mime, filename):
    if "pdf" in (mime or "") or filename.lower().endswith(".pdf"):
        return subprocess.run(["pdftotext", "-layout", path, "-"], check=True, capture_output=True, text=True).stdout
    return subprocess.run(["pandoc", "-f", "docx", "-t", "plain", "--wrap=none", path],
                          check=True, capture_output=True, text=True).stdout


def clean(text):
    """Keep only NOTAM blocks; drop Thai airfield headers (same as the Claude routine)."""
    start = re.compile(r"^\s*\(?[A-Z]\d{4}/\d{2}\s+NOTAM[NRC]")
    blocks, cur = [], None
    for l in (l.rstrip() for l in text.splitlines() if l.strip()):
        if start.match(l):
            if cur:
                blocks.append(cur)
            cur = [l]
        elif re.search(r"[฀-๿]", l):
            continue
        elif cur is not None:
            cur.append(l)
    if cur:
        blocks.append(cur)
    out = []
    for b in blocks:
        ends = [i for i, l in enumerate(b) if l.endswith(")")]
        out.append("\n".join(b[: (ends[-1] if ends else len(b) - 1) + 1]))
    return out


def import_inbox():
    written = []
    for jf in sorted(glob.glob(os.path.join(NOTAM_DIR, "inbox", "*.json"))):
        msg = json.load(open(jf, encoding="utf-8"))
        name, _ = notam_name(msg.get("subject", ""), msg.get("filename", ""), msg["date"])
        ext = ".pdf" if "pdf" in msg.get("mime", "") else ".docx"
        with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as t:
            t.write(base64.b64decode(msg["data"]))
        blocks = clean(to_text(t.name, msg.get("mime", ""), msg.get("filename", "")))
        os.unlink(t.name)
        if not blocks:
            sys.exit("No NOTAM blocks found in %s (%s)" % (jf, msg.get("subject")))
        body = '# %s (source: email "%s" from rtafbaseopr@gmail.com)\n%s\n' % (
            name, msg.get("subject", ""), "\n\n".join(blocks))
        for p in (os.path.join(NOTAM_DIR, name + ".txt"), os.path.join(NOTAM_DIR, "latest.txt")):
            open(p, "w", encoding="utf-8").write(body)
        os.remove(jf)
        written.append(name)
    return written


def remove_old(today):
    gone = []
    for p in glob.glob(os.path.join(NOTAM_DIR, "NOTAM*.txt")):
        m = re.fullmatch(r"NOTAM(\d\d)([A-Z]{3})(\d\d)\.txt", os.path.basename(p))
        if not m or m.group(2) not in MONTHS:
            continue
        day = dt.date(2000 + int(m.group(1)), MONTHS.index(m.group(2)) + 1, int(m.group(3)))
        if (today - day).days > KEEP_DAYS:
            os.remove(p)
            gone.append(os.path.basename(p)[:-4])
    return gone


if __name__ == "__main__":
    new = import_inbox()
    old = remove_old(dt.datetime.now(BKK).date())
    print(" ".join(new + ["-" + n for n in old]))
