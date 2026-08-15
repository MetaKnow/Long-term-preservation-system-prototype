import urllib.request, re

base = "http://js1.blockelite.cn:45074"
def fetch(n):
    u = base + "/assets/index.1782977883971" + n + ".js"
    return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent":"Mozilla/5.0"}), timeout=30).read().decode("utf-8","replace")
def decode_u(s):
    return re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1),16)), s)

chunks = {
    "parameter (参数管理)": "44",
    "organization (组织管理)": "30",
    "user (用户管理)": "38",
    "role (角色管理)": "32",
    "log (日志管理)": "27",
    "interface (接口管理)": "43",
    "security (安全设置)": "33",
}

for label, n in chunks.items():
    try:
        c = decode_u(fetch(n))
        print("\n\n===== " + label + " (chunk " + n + ", len " + str(len(c)) + ") =====")
        zh = re.findall(r'[\u4e00-\u9fff][\u4e00-\u9fff\w·\-/（）()【】%:：]{0,30}', c)
        seen=[]
        for z in zh:
            if z not in seen: seen.append(z)
        print("Chinese strings (first 40):")
        for z in seen[:40]: print("  ", z)
        cols = re.findall(r'prop:"([^"]+)"[^}]*?label:"([^"]*)"', c)
        print("\nColumns (prop,label):")
        for x in cols: print("  ", x)
    except Exception as e:
        print(label, "ERROR:", e)