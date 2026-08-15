import urllib.request, re

base = "http://js1.blockelite.cn:45074"
def fetch(n):
    u = base + "/assets/index.1782977883971" + n + ".js"
    return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent":"Mozilla/5.0"}), timeout=30).read().decode("utf-8","replace")
def decode_u(s):
    return re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1),16)), s)

for label, n in [("CODE chunk 140", "40"), ("STORAGE chunk 149", "49")]:
    c = decode_u(fetch(n))
    print("\n\n===== " + label + " (len " + str(len(c)) + ") =====")
    zh = re.findall(r'[\u4e00-\u9fff][\u4e00-\u9fff\w·\-/（）()【】%:：]{0,30}', c)
    seen=[]
    for z in zh:
        if z not in seen: seen.append(z)
    print("Chinese strings:")
    for z in seen: print("  ", z)
    cols = re.findall(r'prop:"([^"]+)"[^}]*?label:"([^"]*)"', c)
    print("\nColumns (prop,label):")
    for x in cols: print("  ", x)
    sub = re.findall(r'import\("\./(index\.[a-f0-9]+\.js)"\)', c)
    print("\nsub-imports:", sub)