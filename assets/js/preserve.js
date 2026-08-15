/* ===== 长保中心 · 长久保存信息包 / ISO包 ===== */

/* ---- 测试数据：长久保存信息包 ---- */
const PRESERVE_PKG_TREE = [
  { name:"2026年度", type:"folder", children:[
    { name:"文书档案", type:"folder", children:[
      { name:"2026年度文书档案（第3批）.zip", type:"file", fileFormat:"zip", fileSize:3890537861, fileLocation:"主存储节点-SP01", filePath:"/长久保存/信息包/2026年度/文书档案/" },
      { name:"2026年度文书档案（第2批）.zip", type:"file", fileFormat:"zip", fileSize:3092376453, fileLocation:"主存储节点-SP01", filePath:"/长久保存/信息包/2026年度/文书档案/" },
      { name:"2026年度文书档案（第1批）.zip", type:"file", fileFormat:"zip", fileSize:2841502912, fileLocation:"主存储节点-SP02", filePath:"/长久保存/信息包/2026年度/文书档案/" }
    ]},
    { name:"声像档案", type:"folder", children:[
      { name:"科研项目声像档案包A2087.zip", type:"file", fileFormat:"zip", fileSize:13784238080, fileLocation:"主存储节点-SP03", filePath:"/长久保存/信息包/2026年度/声像档案/" },
      { name:"2026年度声像档案汇总.zip", type:"file", fileFormat:"zip", fileSize:8654212096, fileLocation:"主存储节点-SP03", filePath:"/长久保存/信息包/2026年度/声像档案/" }
    ]},
    { name:"不动产登记电子档案（第二批）.zip", type:"file", fileFormat:"zip", fileSize:9021209088, fileLocation:"主存储节点-SP02", filePath:"/长久保存/信息包/2026年度/" }
  ]},
  { name:"2025年度", type:"folder", children:[
    { name:"科技档案", type:"folder", children:[
      { name:"2025年度科技档案归档包.zip", type:"file", fileFormat:"zip", fileSize:2327839432, fileLocation:"归档存储-AR01", filePath:"/长久保存/信息包/2025年度/科技档案/" },
      { name:"2025年度水利科技档案.zip", type:"file", fileFormat:"zip", fileSize:5109247861, fileLocation:"归档存储-AR01", filePath:"/长久保存/信息包/2025年度/科技档案/" }
    ]},
    { name:"文书档案", type:"folder", children:[
      { name:"2025年度文书档案归档包.zip", type:"file", fileFormat:"zip", fileSize:2718394620, fileLocation:"归档存储-AR02", filePath:"/长久保存/信息包/2025年度/文书档案/" }
    ]}
  ]},
  { name:"专题归档", type:"folder", children:[
    { name:"城市规划声像档案2016-2020.zip", type:"file", fileFormat:"zip", fileSize:48542199808, fileLocation:"归档存储-AR03", filePath:"/长久保存/信息包/专题归档/" },
    { name:"文物保护专题档案包.zip", type:"file", fileFormat:"zip", fileSize:20342872064, fileLocation:"归档存储-AR03", filePath:"/长久保存/信息包/专题归档/" }
  ]},
  { name:"政务服务电子文件归档包.zip", type:"file", fileFormat:"zip", fileSize:2104523904, fileLocation:"主存储节点-SP01", filePath:"/长久保存/信息包/" }
];

/* ---- 测试数据：ISO包 ---- */
const PRESERVE_ISO_TREE = [
  { name:"ISO_文书档案", type:"folder", children:[
    { name:"WS-2026-DQ3.iso", type:"file", fileFormat:"iso", fileSize:4294967296, fileLocation:"归档存储-AR01", filePath:"/长久保存/ISO包/ISO_文书档案/" },
    { name:"WS-2026-DQ2.iso", type:"file", fileFormat:"iso", fileSize:3355443200, fileLocation:"归档存储-AR01", filePath:"/长久保存/ISO包/ISO_文书档案/" },
    { name:"WS-2025-年度.iso", type:"file", fileFormat:"iso", fileSize:5368709120, fileLocation:"归档存储-AR02", filePath:"/长久保存/ISO包/ISO_文书档案/" }
  ]},
  { name:"ISO_声像档案", type:"folder", children:[
    { name:"SX-A2087.iso", type:"file", fileFormat:"iso", fileSize:15032385536, fileLocation:"归档存储-AR03", filePath:"/长久保存/ISO包/ISO_声像档案/" },
    { name:"SX-城市规划2016-2020.iso", type:"file", fileFormat:"iso", fileSize:53687091200, fileLocation:"归档存储-AR03", filePath:"/长久保存/ISO包/ISO_声像档案/" }
  ]},
  { name:"ISO_科技档案", type:"folder", children:[
    { name:"KJ-2025-GH.iso", type:"file", fileFormat:"iso", fileSize:2684354560, fileLocation:"归档存储-AR02", filePath:"/长久保存/ISO包/ISO_科技档案/" },
    { name:"KJ-水利项目.iso", type:"file", fileFormat:"iso", fileSize:5916581529, fileLocation:"归档存储-AR02", filePath:"/长久保存/ISO包/ISO_科技档案/" }
  ]},
  { name:"ISO_电子文件", type:"folder", children:[
    { name:"DZ-不动产第二批.iso", type:"file", fileFormat:"iso", fileSize:9663676416, fileLocation:"归档存储-AR04", filePath:"/长久保存/ISO包/ISO_电子文件/" },
    { name:"DZ-政务服务.iso", type:"file", fileFormat:"iso", fileSize:2415919104, fileLocation:"归档存储-AR04", filePath:"/长久保存/ISO包/ISO_电子文件/" }
  ]}
];

/* ---- 状态 ---- */
const preserveState = {
  pkg: { path: [], keyword: "", selected: new Set(), tree: PRESERVE_PKG_TREE, all:"pkgAll", body:"pkgBody", crumb:"pkgCrumb", count:"pkgCount", search:"pkgSearch", modal:"pkgDetailModal", detailBody:"pkgDetailBody" },
  iso: { path: [], keyword: "", selected: new Set(), tree: PRESERVE_ISO_TREE, all:"isoAll", body:"isoBody", crumb:"isoCrumb", count:"isoCount", search:"isoSearch", modal:"isoDetailModal", detailBody:"isoDetailBody" },
};

/* ---- 工具 ---- */
function preserveFileIcon(fmt) {
  const m = { zip:"file-archive", iso:"disc", pdf:"file-text", doc:"file-text", docx:"file-text", xlsx:"file-spreadsheet", xls:"file-spreadsheet", mp4:"file-video", mp3:"file-audio", jpg:"image", png:"image", jpeg:"image", txt:"file-text" };
  return m[String(fmt||"").toLowerCase()] || "file";
}

function preserveGetNode(tree, path) {
  let node = { children: tree };
  for (const name of path) {
    const next = (node.children || []).find(function(c){ return c.name === name && c.type === "folder"; });
    if (!next) return null;
    node = next;
  }
  return node;
}

function preserveCountFiles(items) {
  let n = 0;
  (items||[]).forEach(function(it){ if (it.type === "folder") n += preserveCountFiles(it.children); else n += 1; });
  return n;
}

function preserveCountDirs(items) {
  let n = 0;
  (items||[]).forEach(function(it){ if (it.type === "folder") { n += 1; n += preserveCountDirs(it.children); } });
  return n;
}

function preserveFlatten(items, base, out) {
  out = out || [];
  (items||[]).forEach(function(it){
    const fp = base ? base + "/" + it.name : it.name;
    if (it.type === "folder") preserveFlatten(it.children, fp, out);
    else out.push({ name: it.name, type:"file", fileFormat: it.fileFormat, fileSize: it.fileSize, fileLocation: it.fileLocation, filePath: it.filePath || fp, fullPath: fp });
  });
  return out;
}

function preserveCurrentItems(st) {
  if (st.keyword && st.keyword.trim()) {
    const kw = st.keyword.trim().toLowerCase();
    return preserveFlatten(st.tree).filter(function(f){ return f.name.toLowerCase().indexOf(kw) !== -1; });
  }
  const node = preserveGetNode(st.tree, st.path);
  return node ? (node.children || []) : [];
}

function preserveItemId(st, it) {
  if (it.fullPath) return it.fullPath;
  return (st.path.length ? st.path.join("/") + "/" : "/") + it.name;
}

/* ---- 页面：头部 ---- */
function preserveHeaderHTML(title, desc, icon, totalFiles, totalDirs) {
  return `
  <div class="card p-5 flex items-center gap-4 flex-wrap">
    <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
      <i data-lucide="${icon}" class="w-6 h-6 text-primary"></i>
    </div>
    <div class="min-w-0 flex-1">
      <h2 class="text-base font-semibold text-ink">${title}</h2>
      <p class="text-xs text-slate-500 mt-1">${desc}</p>
    </div>
    <div class="flex items-center gap-5 pl-2">
      <div class="text-center"><div class="text-xs text-slate-400">文件总数</div><div class="text-xl font-semibold text-primary font-num">${totalFiles}</div></div>
      <div class="w-px h-9 bg-slate-100"></div>
      <div class="text-center"><div class="text-xs text-slate-400">目录总数</div><div class="text-xl font-semibold text-ink font-num">${totalDirs}</div></div>
    </div>
  </div>`;
}

/* ---- 页面：浏览器 ---- */
function preserveBrowserHTML(prefix) {
  return `
  <div class="card overflow-hidden">
    <div class="flex items-center gap-3 px-5 py-3 border-b border-slate-100 flex-wrap">
      <div class="flex items-center gap-1.5 text-sm min-w-0 flex-wrap" id="${prefix}Crumb"></div>
      <div class="ml-auto flex items-center gap-3">
        <span class="text-xs text-slate-400 whitespace-nowrap font-num" id="${prefix}Count"></span>
        <div class="relative">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input id="${prefix}Search" class="field pl-9 pr-3 py-1.5 text-sm w-56" placeholder="请输入文件名称" oninput="onPreserveSearch('${prefix}', this.value)" />
        </div>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm" style="min-width:920px">
        <thead><tr class="bg-slate-50/80 text-slate-500 text-xs">
          <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
          <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="${prefix}All" class="rounded border-slate-300 cursor-pointer" onchange="togglePreserveAll('${prefix}', this.checked)" /></th>
          <th class="px-3 py-2 font-medium">名称</th>
          <th class="px-3 py-2 font-medium w-20 text-center">类型</th>
          <th class="px-3 py-2 font-medium w-28 text-right">大小</th>
          <th class="px-3 py-2 font-medium w-20 text-center">格式</th>
          <th class="px-3 py-2 font-medium w-36">文件地址</th>
          <th class="px-3 py-2 font-medium">文件路径</th>
          <th class="px-3 py-2 font-medium w-16 text-right">操作</th>
        </tr></thead>
        <tbody id="${prefix}Body"></tbody>
      </table>
    </div>
  </div>`;
}

/* ---- 详情弹窗 ---- */
function preserveDetailModalHTML(prefix) {
  return `
  <div id="${prefix}DetailModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closePreserveDetail('${prefix}')"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="file-search" class="w-5 h-5 text-primary"></i></div>
          <h3 class="text-sm font-semibold text-ink">文件详情</h3>
        </div>
        <button onclick="closePreserveDetail('${prefix}')" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-5 py-4" id="${prefix}DetailBody"></div>
      <div class="flex items-center justify-end px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button onclick="closePreserveDetail('${prefix}')" class="btn-primary px-4 py-2 rounded-lg text-sm">关闭</button>
      </div>
    </div>
  </div>`;
}

/* ---- 入口 ---- */
function preservePkgHTML() {
  const tree = PRESERVE_PKG_TREE;
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    ${preserveBrowserHTML("pkg")}
    ${preserveDetailModalHTML("pkg")}
  </div>`;
}

function preserveIsoHTML() {
  const tree = PRESERVE_ISO_TREE;
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    ${preserveBrowserHTML("iso")}
    ${preserveDetailModalHTML("iso")}
  </div>`;
}

/* ---- 渲染列表 ---- */
function renderPreserveItems(prefix) {
  const st = preserveState[prefix];
  const items = preserveCurrentItems(st).slice().sort(function(a,b){
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, "zh");
  });
  st._items = items;
  const body = document.getElementById(st.body);
  const searching = !!(st.keyword && st.keyword.trim());
  if (!items.length) {
    body.innerHTML = `<tr><td colspan="9" class="px-3 py-14 text-center text-sm text-slate-400"><div class="flex flex-col items-center gap-2"><i data-lucide="${searching ? "search-x" : "folder-open"}" class="w-8 h-8 text-slate-300"></i>${searching ? "未找到匹配的文件" : "该目录为空"}</div></td></tr>`;
  } else {
    body.innerHTML = items.map(function(it, idx){
      const isFolder = it.type === "folder";
      const itemId = preserveItemId(st, it);
      const checked = st.selected.has(itemId) ? "checked" : "";
      const icon = isFolder ? "folder" : preserveFileIcon(it.fileFormat);
      const iconCls = isFolder ? "text-amber-500" : "text-primary";
      const nameCell = isFolder
        ? `<button onclick="preserveEnter('${prefix}',${idx})" class="flex items-center gap-2 text-sm text-ink font-medium hover:text-primary group cursor-pointer"><i data-lucide="${icon}" class="w-4 h-4 ${iconCls} shrink-0"></i><span class="group-hover:underline truncate">${it.name}</span></button>`
        : `<div class="flex items-center gap-2 text-sm text-slate-700"><i data-lucide="${icon}" class="w-4 h-4 ${iconCls} shrink-0"></i><span class="truncate" title="${it.name}">${it.name}</span></div>`;
      const typeBadge = isFolder
        ? `<span class="tag bg-amber-50 text-amber-700">文件夹</span>`
        : `<span class="tag bg-blue-50 text-blue-700">文件</span>`;
      const size = isFolder
        ? `<span class="text-xs text-slate-400">${preserveCountFiles(it.children)} 项</span>`
        : `<span class="font-num text-xs text-slate-600">${formatFileUnit(it.fileSize)}</span>`;
      const fmt = isFolder
        ? `<span class="text-slate-300">-</span>`
        : `<span class="font-num text-xs text-slate-500">${(it.fileFormat||"-").toUpperCase()}</span>`;
      const loc = isFolder
        ? `<span class="text-slate-300">-</span>`
        : `<span class="text-xs text-slate-500">${it.fileLocation||"-"}</span>`;
      const pathStr = isFolder
        ? ((st.path.length ? st.path.join("/") + "/" : "/") + it.name)
        : (it.filePath || it.fullPath || "-");
      const action = isFolder
        ? `<button onclick="preserveEnter('${prefix}',${idx})" class="text-secondary hover:text-primary text-xs">打开</button>`
        : `<button onclick="openPreserveDetail('${prefix}',${idx})" class="text-secondary hover:text-primary text-xs">详情</button>`;
      return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
        <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
        <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${itemId}" onchange="togglePreserveSelect('${prefix}',this)" ${checked} /></td>
        <td class="px-3 py-3 max-w-[260px]">${nameCell}</td>
        <td class="px-3 py-2 text-center">${typeBadge}</td>
        <td class="px-3 py-3 text-right whitespace-nowrap">${size}</td>
        <td class="px-3 py-2 text-center">${fmt}</td>
        <td class="px-3 py-2">${loc}</td>
        <td class="px-3 py-3 max-w-[220px]"><span class="font-num text-xs text-slate-400 block truncate" title="${pathStr}">${pathStr}</span></td>
        <td class="px-3 py-3 text-right">${action}</td>
      </tr>`;
    }).join("");
  }
  document.getElementById(st.count).textContent = "共 " + items.length + " 个";
  renderPreserveCrumb(prefix, searching);
  syncPreserveAll(prefix);
  lucide.createIcons();
}

/* ---- 面包屑 ---- */
function renderPreserveCrumb(prefix, searching) {
  const st = preserveState[prefix];
  const el = document.getElementById(st.crumb);
  if (!el) return;
  if (searching) {
    el.innerHTML = `<span class="inline-flex items-center gap-1.5 text-xs text-accent bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md"><i data-lucide="search" class="w-3.5 h-3.5"></i>搜索结果</span><span class="text-xs text-slate-400 ml-1">"${st.keyword}"</span>`;
    return;
  }
  let html = `<button onclick="preserveGoto('${prefix}',-1)" class="flex items-center gap-1 text-slate-500 hover:text-primary cursor-pointer"><i data-lucide="folder-open" class="w-3.5 h-3.5"></i><span>全部文件</span></button>`;
  st.path.forEach(function(name, i){
    html += `<i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-300"></i>`;
    if (i < st.path.length - 1) {
      html += `<button onclick="preserveGoto('${prefix}',${i})" class="text-slate-500 hover:text-primary cursor-pointer">${name}</button>`;
    } else {
      html += `<span class="text-ink font-medium">${name}</span>`;
    }
  });
  if (st.path.length > 0) {
    html = `<button onclick="preserveBack('${prefix}')" class="btn-ghost px-2 py-1 rounded-md text-xs flex items-center gap-1 mr-1"><i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>返回上一级</button>` + html;
  }
  el.innerHTML = html;
}

/* ---- 导航 ---- */
function preserveEnter(prefix, idx) {
  const st = preserveState[prefix];
  const it = st._items[idx];
  if (!it || it.type !== "folder") return;
  st.path.push(it.name);
  st.keyword = "";
  const si = document.getElementById(st.search);
  if (si) si.value = "";
  renderPreserveItems(prefix);
}

function preserveBack(prefix) {
  const st = preserveState[prefix];
  if (st.path.length) st.path.pop();
  renderPreserveItems(prefix);
}

function preserveGoto(prefix, idx) {
  const st = preserveState[prefix];
  if (idx < 0) st.path = [];
  else st.path = st.path.slice(0, idx + 1);
  st.keyword = "";
  const si = document.getElementById(st.search);
  if (si) si.value = "";
  renderPreserveItems(prefix);
}

function onPreserveSearch(prefix, val) {
  const st = preserveState[prefix];
  st.keyword = val;
  renderPreserveItems(prefix);
}

/* ---- 选择 ---- */
function togglePreserveSelect(prefix, el) {
  const st = preserveState[prefix];
  const id = el.getAttribute("data-id");
  if (el.checked) st.selected.add(id); else st.selected.delete(id);
  syncPreserveAll(prefix);
}

function togglePreserveAll(prefix, checked) {
  const st = preserveState[prefix];
  (st._items||[]).forEach(function(it){
    const id = preserveItemId(st, it);
    if (checked) st.selected.add(id); else st.selected.delete(id);
  });
  renderPreserveItems(prefix);
}

function syncPreserveAll(prefix) {
  const st = preserveState[prefix];
  const all = document.getElementById(st.all);
  if (!all) return;
  const items = st._items || [];
  if (!items.length) { all.checked = false; all.indeterminate = false; return; }
  let sel = 0;
  items.forEach(function(it){ if (st.selected.has(preserveItemId(st, it))) sel++; });
  all.checked = sel === items.length;
  all.indeterminate = sel > 0 && sel < items.length;
}

/* ---- 详情 ---- */
function openPreserveDetail(prefix, idx) {
  const st = preserveState[prefix];
  const it = st._items[idx];
  if (!it) return;
  const body = document.getElementById(st.detailBody);
  body.innerHTML = `
  <div class="flex items-center gap-3 mb-5 p-3 rounded-lg bg-slate-50 border border-slate-100">
    <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><i data-lucide="${preserveFileIcon(it.fileFormat)}" class="w-5 h-5 text-primary"></i></div>
    <div class="min-w-0"><div class="text-sm font-medium text-ink truncate">${it.name}</div><div class="text-xs text-slate-400 mt-0.5 font-num">${(it.fileFormat||"").toUpperCase()} · ${formatFileUnit(it.fileSize)}</div></div>
  </div>
  <div class="grid grid-cols-2 gap-x-6 gap-y-4">
    ${dtKV("文件名称", it.name, "col-span-2")}
    ${dtKV("文件大小", '<span class="font-num">' + formatFileUnit(it.fileSize) + '</span>')}
    ${dtKV("文件格式", '<span class="font-num">' + (it.fileFormat||"-").toUpperCase() + '</span>')}
    ${dtKV("文件地址", it.fileLocation||"-")}
    ${dtKV("文件路径", '<span class="font-num text-slate-600 break-all">' + (it.filePath||it.fullPath||"-") + '</span>', "col-span-2")}
  </div>`;
  const m = document.getElementById(st.modal);
  m.classList.remove("hidden"); m.classList.add("flex");
  lucide.createIcons();
}

function closePreserveDetail(prefix) {
  const st = preserveState[prefix];
  const m = document.getElementById(st.modal);
  m.classList.add("hidden"); m.classList.remove("flex");
}