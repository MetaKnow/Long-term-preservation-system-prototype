# -*- coding: utf-8 -*-
import os
ROOT = r"C:\Users\wenxi\Desktop\长久保存系统原型"

def insert_before_line(s, anchor, block):
    lines = s.split("\n")
    for i, line in enumerate(lines):
        if anchor in line:
            indent = line[:len(line) - len(line.lstrip())]
            new_lines = [indent + nl for nl in block.split("\n")]
            lines[i:i] = new_lines
            return "\n".join(lines)
    raise ValueError("anchor not found: " + anchor)

def insert_block_before(s, anchor, block):
    idx = s.index(anchor)
    return s[:idx] + block + s[idx:]

# ---------- reception.js ----------
new_th_rc = r'''<th class="px-3 py-3 font-medium w-12 text-center">序号</th>
<th class="px-3 py-3 w-10 text-center"><input type="checkbox" id="rcAll" class="rounded border-slate-300" onchange="toggleSelectAll(this.checked)" /></th>'''
new_td_rc = r'''<td class="px-3 py-3 text-center text-xs text-slate-400 font-num">${idx + 1}</td>
<td class="px-3 py-3 text-center"><input type="checkbox" class="pkg-check rounded border-slate-300" data-id="${p.id}" onchange="togglePkgSelect('${p.id}', this.checked)" ${receptionSelected.has(p.id)?'checked':''} /></td>'''
toggle_rc = """
function togglePkgSelect(id, checked) {
  if (checked) receptionSelected.add(id); else receptionSelected.delete(id);
  syncRcAll();
}
function toggleSelectAll(checked) {
  filteredPackages().forEach(function(p) {
    if (checked) receptionSelected.add(p.id); else receptionSelected.delete(p.id);
  });
  renderPackageRows();
}
function syncRcAll() {
  const all = document.getElementById("rcAll");
  if (!all) return;
  const list = filteredPackages();
  all.checked = list.length > 0 && list.every(function(p) { return receptionSelected.has(p.id); });
}

"""

p = os.path.join(ROOT, "assets", "js", "reception.js")
s = open(p, encoding="utf-8").read()
s = s.replace('let receptionFilter = { keyword: "", typeName: "", status: "" };',
              'let receptionFilter = { keyword: "", typeName: "", status: "" };\nlet receptionSelected = new Set();')
s = insert_before_line(s, '<th class="px-3 py-3 font-medium">全宗号</th>', new_th_rc)
s = s.replace('list.map(p => {', 'list.map((p, idx) => {', 1)
s = insert_before_line(s, '${p.fondsCode}</td>', new_td_rc)
s = s.replace('  if (!body) return;', '  if (!body) return;\n  syncRcAll();', 1)
s = insert_block_before(s, 'function refreshReception() {', toggle_rc)
open(p, "w", encoding="utf-8", newline="\n").write(s)
print("reception.js done:", len(s))

# ---------- encapsulation.js ----------
new_th_enc = r'''<th class="px-3 py-3 font-medium w-12 text-center">序号</th>
<th class="px-3 py-3 w-10 text-center"><input type="checkbox" id="encAll" class="rounded border-slate-300" onchange="toggleEncSelectAll(this.checked)" /></th>'''
new_td_enc = r'''<td class="px-3 py-3 text-center text-xs text-slate-400 font-num">${idx + 1}</td>
<td class="px-3 py-3 text-center"><input type="checkbox" class="enc-check rounded border-slate-300" data-id="${p.id}" onchange="toggleEncSelect('${p.id}', this.checked)" ${encSelected.has(p.id)?'checked':''} /></td>'''
toggle_enc = """
function toggleEncSelect(id, checked) {
  if (checked) encSelected.add(id); else encSelected.delete(id);
  syncEncAll();
}
function toggleEncSelectAll(checked) {
  filteredEncPackages().forEach(function(p) {
    if (checked) encSelected.add(p.id); else encSelected.delete(p.id);
  });
  renderEncRows();
}
function syncEncAll() {
  const all = document.getElementById("encAll");
  if (!all) return;
  const list = filteredEncPackages();
  all.checked = list.length > 0 && list.every(function(p) { return encSelected.has(p.id); });
}

"""

p = os.path.join(ROOT, "assets", "js", "encapsulation.js")
s = open(p, encoding="utf-8").read()
s = s.replace('let encFilter = { keyword: "", status: "", classification: "" };',
              'let encFilter = { keyword: "", status: "", classification: "" };\nlet encSelected = new Set();')
s = insert_before_line(s, '<th class="px-3 py-3 font-medium">包名称</th>', new_th_enc)
s = s.replace('list.map(p => {', 'list.map((p, idx) => {', 1)
s = insert_before_line(s, '${p.packageName}</td>', new_td_enc)
s = s.replace('  if (!body) return;', '  if (!body) return;\n  syncEncAll();', 1)
s = insert_block_before(s, 'function refreshEncapsulation() {', toggle_enc)
open(p, "w", encoding="utf-8", newline="\n").write(s)
print("encapsulation.js done:", len(s))