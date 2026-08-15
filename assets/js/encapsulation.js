/* ===== 数据装盘 ===== */

function encNow() {
  const d = new Date(), p = function(n) { return String(n).padStart(2, "0"); };
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}

const ENCAPS_PACKAGES = [
  { id:"EP-2026-01012", packageName:"iso-20260811-010012", classification:"年度归档", packageSize:3890537861, fully:1, fileCount:1284, fileTotalSize:4224727040, packageStatus:"succeed", evidenceStatus:1, carrierNo:"GD-2026-0012", carrierLocation:"1#库-槽位03", carrierStatus:"盘匣在设备中", createdTime:"2026-08-11 11:02", fileKey:"FK-7A3F9C7D8E21", evidenceCode:"a3f9c7d8e21c4b6f8a1d0e2c3b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2", evidenceSize:3890537861, evidenceTime:"2026-08-11 11:05" },
  { id:"EP-2026-01011", packageName:"iso-20260811-010011", classification:"项目归档", packageSize:13784238080, fully:1, fileCount:368, fileTotalSize:14985392256, packageStatus:"succeed", evidenceStatus:1, carrierNo:"GD-2026-0000", carrierLocation:"离线柜B-1-02", carrierStatus:"盘匣在离线柜中", createdTime:"2026-08-11 09:30", fileKey:"FK-B7E2D4A6C8F0", evidenceCode:"b7e2d4a6c8f0123456789abcdef0123456789abcdef0123456789abcdef0123", evidenceSize:13784238080, evidenceTime:"2026-08-11 09:33" },
  { id:"EP-2026-01010", packageName:"iso-20260810-010010", classification:"专题归档", packageSize:9021209088, fully:1, fileCount:5421, fileTotalSize:9814646784, packageStatus:"succeed", evidenceStatus:1, carrierNo:"GD-2026-0010", carrierLocation:"离线柜A-2-04", carrierStatus:"盘匣在离线柜中", createdTime:"2026-08-10 16:48", fileKey:"FK-C8F1A3B5D7E9", evidenceCode:"c8f1a3b5d7e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b", evidenceSize:9021209088, evidenceTime:"2026-08-10 16:52" },
  { id:"EP-2026-01009", packageName:"iso-20260809-010009", classification:"项目归档", packageSize:7203640729, fully:1, fileCount:458, fileTotalSize:7814356992, packageStatus:"running", evidenceStatus:0, carrierNo:"", createdTime:"2026-08-12 08:15", fileKey:"", evidenceCode:"", evidenceSize:0, evidenceTime:"" },
  { id:"EP-2026-01008", packageName:"iso-20260808-010008", classification:"季度归档", packageSize:4861835264, fully:1, fileCount:3892, fileTotalSize:5278195712, packageStatus:"succeed", evidenceStatus:0, carrierNo:"GD-2026-0008", carrierLocation:"离线柜A-2-06", carrierStatus:"盘匣被拿出", createdTime:"2026-08-08 17:40", fileKey:"FK-B3C6F8A0D2E4", evidenceCode:"b3c6f8a0d2e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0", evidenceSize:4861835264, evidenceTime:"2026-08-08 17:44" },
  { id:"EP-2026-01007", packageName:"iso-20260807-010007", classification:"专题归档", packageSize:20342872064, fully:1, fileCount:231, fileTotalSize:22085947392, packageStatus:"succeed", evidenceStatus:1, carrierNo:"GD-2026-0007", carrierLocation:"1#库-槽位07", carrierStatus:"盘匣在设备中", createdTime:"2026-08-07 14:50", fileKey:"FK-D5E8B0C2F4A6", evidenceCode:"d5e8b0c2f4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2", evidenceSize:20342872064, evidenceTime:"2026-08-07 14:55" },
  { id:"EP-2026-01006", packageName:"iso-20260806-010006", classification:"年度归档", packageSize:3092376453, fully:0, fileCount:1076, fileTotalSize:3358900224, packageStatus:"failed", evidenceStatus:0, carrierNo:"", createdTime:"2026-08-06 10:20", fileKey:"", evidenceCode:"", evidenceSize:0, evidenceTime:"" },
  { id:"EP-2026-01005", packageName:"iso-20260805-010005", classification:"专题归档", packageSize:48542199808, fully:1, fileCount:642, fileTotalSize:52711290880, packageStatus:"succeed", evidenceStatus:1, carrierNo:"GD-2026-0005", carrierLocation:"1#库-槽位05", carrierStatus:"异常", createdTime:"2026-08-05 15:12", fileKey:"FK-F1A4D6E8B0C2", evidenceCode:"f1a4d6e8b0c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8", evidenceSize:48542199808, evidenceTime:"2026-08-05 15:18" },
];

(function () {
  const uniq = [];
  (typeof RECEPTION_PACKAGES !== "undefined" ? RECEPTION_PACKAGES : []).forEach(function (r) {
    if (r.checkStatus === "1" && r.carrierNo && uniq.indexOf(r.carrierNo) < 0) uniq.push(r.carrierNo);
  });
  let k = 0;
  ENCAPS_PACKAGES.forEach(function (p) {
    if (p.carrierNo) { p.carrierNo = uniq[k] || p.carrierNo; k++; }
  });
})();

const PACK_STATUS = { running:"装盘中", failed:"装盘失败", succeed:"已装盘" };
const PACK_STATUS_CLS = { running:"bg-blue-50 text-blue-700", failed:"bg-red-50 text-red-700", succeed:"bg-emerald-50 text-emerald-700" };

let encFilter = { keyword: "", diskStatus: "", evidenceStatus: "" };
let encSelected = new Set();

function encEvidenceState(p) {
  if (p.packageStatus !== "succeed") return { text: "-", cls: "text-slate-400", plain: true };
  if (p.evidenceStatus === 1) return { text: "已存证", cls: "bg-emerald-50 text-emerald-700" };
  return { text: "存证失败", cls: "bg-red-50 text-red-700" };
}

function encapsulationHTML() {
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="flex items-center gap-2">
      <button id="btnManualEvidence" onclick="manualEncEvidence()" class="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 opacity-50 cursor-not-allowed" disabled><i data-lucide="shield-check" class="w-4 h-4"></i>手动存证</button>
    </div>
    <div class="card overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <select class="field px-3 py-2 text-sm" onchange="encFilter.diskStatus=this.value; renderEncRows()">
          <option value="">全部装盘状态</option>
          <option value="1" ${encFilter.diskStatus==="1"?'selected':''}>已装盘</option>
          <option value="0" ${encFilter.diskStatus==="0"?'selected':''}>未装盘</option>
        </select>
        <select class="field px-3 py-2 text-sm" onchange="encFilter.evidenceStatus=this.value; renderEncRows()">
          <option value="">全部存证情况</option>
          <option value="1" ${encFilter.evidenceStatus==="1"?'selected':''}>已存证</option>
          <option value="0" ${encFilter.evidenceStatus==="0"?'selected':''}>未存证</option>
        </select>
        <div class="relative">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input type="text" class="field pl-9 pr-3 py-2 text-sm w-60" placeholder="请输入载体编号" oninput="encFilter.keyword=this.value; renderEncRows()" value="${encFilter.keyword}" />
        </div>
        <button onclick="resetEncFilter()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
              <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
              <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="encAll" class="rounded border-slate-300" onchange="toggleEncSelectAll(this.checked)" /></th>
              <th class="px-3 py-2 font-medium">载体编号</th>
              <th class="px-3 py-2 font-medium">载体位置</th>
              <th class="px-3 py-2 font-medium">载体状态</th>
              <th class="px-3 py-2 font-medium">包大小</th>
              <th class="px-3 py-2 font-medium text-right">文件数量</th>
              <th class="px-3 py-2 font-medium">存证情况</th>
              <th class="px-3 py-2 font-medium">创建时间</th>
              <th class="px-3 py-2 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody id="encBody"></tbody>
        </table>
      </div>
      <div id="encEmpty" class="hidden py-12 text-center text-sm text-slate-400">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无匹配的装盘记录</div>
      </div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500">
        <span id="encInfo"></span>
        <div class="flex items-center gap-1">
          <button class="btn-ghost w-7 h-7 rounded flex items-center justify-center"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
          <span class="px-2 font-num text-slate-700">1 / 1</span>
          <button class="btn-ghost w-7 h-7 rounded flex items-center justify-center"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
        </div>
      </div>
    </div>
  </div>
  ${encEvidenceModalHTML()}
  ${encDetailModalHTML()}`;
}

function encCarrierState(p) {
  if (!p.carrierNo) return { text: "-", cls: "text-slate-400", plain: true };
  const m = {
    "盘匣在设备中": "bg-blue-50 text-blue-700",
    "盘匣在离线柜中": "bg-slate-100 text-slate-600",
    "盘匣被拿出": "bg-amber-50 text-amber-700",
    "异常": "bg-red-50 text-red-700"
  };
  return { text: p.carrierStatus || "-", cls: m[p.carrierStatus] || "bg-slate-100 text-slate-600" };
}

function filteredEncPackages() {
  const q = encFilter.keyword.trim().toLowerCase();
  return ENCAPS_PACKAGES.filter(p => {
    if (!p.carrierNo) return false;
    if (q && p.carrierNo.toLowerCase().indexOf(q) < 0) return false;
    if (encFilter.diskStatus === "1" && !p.carrierNo) return false;
    if (encFilter.diskStatus === "0" && p.carrierNo) return false;
    if (encFilter.evidenceStatus === "1" && p.evidenceStatus !== 1) return false;
    if (encFilter.evidenceStatus === "0" && p.evidenceStatus === 1) return false;
    return true;
  });
}

function renderEncRows() {
  const list = filteredEncPackages();
  const body = document.getElementById("encBody");
  const empty = document.getElementById("encEmpty");
  const info = document.getElementById("encInfo");
  if (!body) return;
  syncEncAll();
  updateEncEvidenceBtn();
  if (!list.length) {
    body.innerHTML = "";
    empty.classList.remove("hidden");
    if (info) info.textContent = "共 0 条";
    lucide.createIcons();
    return;
  }
  empty.classList.add("hidden");
  body.innerHTML = list.map((p, idx) => {
    const ev = encEvidenceState(p);
    const evBadge = ev.plain ? `<span class="${ev.cls}">${ev.text}</span>` : `<span class="tag ${ev.cls}">${ev.text}</span>`;
    const cs = encCarrierState(p);
    const cBadge = cs.plain ? `<span class="${cs.cls}">${cs.text}</span>` : `<span class="tag ${cs.cls}">${cs.text}</span>`;
    const fullTag = p.fully === 1 ? `<span class="tag bg-slate-100 text-slate-500 ml-1">已满</span>` : (p.packageStatus === "succeed" ? `<span class="tag bg-amber-50 text-amber-700 ml-1">未满</span>` : ``);
    return `
    <tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx + 1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="enc-check rounded border-slate-300" data-id="${p.id}" onchange="toggleEncSelect('${p.id}', this.checked)" ${encSelected.has(p.id)?'checked':''} /></td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${p.carrierNo || "—"}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${p.carrierLocation || "-"}</td>
      <td class="px-3 py-2 whitespace-nowrap">${cBadge}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${p.packageStatus === "running" ? "—" : formatFileUnit(p.packageSize)}${p.packageStatus === "running" ? "" : fullTag}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 text-right whitespace-nowrap">${p.packageStatus === "running" ? "—" : p.fileCount.toLocaleString()}</td>
      <td class="px-3 py-2">${evBadge}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${p.createdTime}</td>
      <td class="px-3 py-2">
        <div class="flex items-center gap-2 justify-end text-xs whitespace-nowrap">
          <button onclick="openEncDetail('${p.id}')" class="text-secondary hover:text-primary">数据明细</button>
          <span class="text-slate-200">|</span>
          <button onclick="openEncEvidence('${p.id}')" class="text-slate-500 hover:text-ink">存证报告</button>
          ${p.packageStatus === "failed" ? `<span class="text-slate-200">|</span><button onclick="encRepack('${p.id}')" class="text-amber-600 hover:text-amber-700">重新装盘</button>` : ``}
        </div>
      </td>
    </tr>`;
  }).join("");
  if (info) info.textContent = "共 " + list.length + " 条";
  lucide.createIcons();
}


function toggleEncSelect(id, checked) {
  if (checked) encSelected.add(id); else encSelected.delete(id);
  syncEncAll();
  updateEncEvidenceBtn();
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

/* 已装盘且未存证的记录可手动存证 */
function encEvidenceEligible(p) {
  return p.packageStatus === "succeed" && p.evidenceStatus !== 1;
}

function updateEncEvidenceBtn() {
  const btn = document.getElementById("btnManualEvidence");
  if (!btn) return;
  const list = filteredEncPackages();
  const selected = list.filter(p => encSelected.has(p.id));
  const allEligible = selected.length > 0 && selected.every(encEvidenceEligible);
  if (allEligible) {
    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
  } else {
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
  }
}

function manualEncEvidence() {
  const list = filteredEncPackages();
  const items = list.filter(p => encSelected.has(p.id) && encEvidenceEligible(p));
  if (!items.length) { toast("请先勾选已装盘且未存证的记录", "warn"); return; }
  items.forEach(p => {
    p.evidenceStatus = 1;
    if (!p.fileKey) p.fileKey = "FK-" + Math.random().toString(16).slice(2, 14).toUpperCase();
    if (!p.evidenceCode) p.evidenceCode = (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 64).padEnd(64, "0");
    p.evidenceSize = p.packageSize;
    p.evidenceTime = encNow();
  });
  toast("已手动完成存证，共 " + items.length + " 条", "success");
  encSelected.clear();
  renderEncRows();
}

function refreshEncapsulation() {
  const view = document.getElementById("view");
  view.innerHTML = encapsulationHTML();
  view.scrollTop = 0;
  lucide.createIcons();
  renderEncRows();
}
function resetEncFilter() { encFilter = { keyword: "", diskStatus: "", evidenceStatus: "" }; refreshEncapsulation(); }

function encRepack(id) {
  const p = ENCAPS_PACKAGES.find(function(x) { return x.id === id; });
  if (!p) return;
  p.packageStatus = "running";
  refreshEncapsulation();
  toast("正在重新装盘…", "info");
  setTimeout(function() {
    const q = ENCAPS_PACKAGES.find(function(x) { return x.id === id; });
    if (!q) return;
    q.packageStatus = "succeed";
    q.evidenceStatus = 1;
    if (!q.fileKey) q.fileKey = "FK-" + Math.random().toString(16).slice(2, 14).toUpperCase();
    if (!q.evidenceCode) q.evidenceCode = (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)).slice(0, 64).padEnd(64, "0");
    q.evidenceSize = q.packageSize;
    q.evidenceTime = encNow();
    if (location.hash.indexOf("data-encapsulation") >= 0) { refreshEncapsulation(); toast("重新装盘完成：" + id, "success"); }
  }, 2500);
}

/* ---- 存证报告 ---- */
function encEvidenceModalHTML() {
  return `
  <div id="encEvModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeEncEvidence()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="shield-check" class="w-5 h-5 text-primary"></i></div>
          <h3 class="text-sm font-semibold text-ink">存证报告</h3>
        </div>
        <button onclick="closeEncEvidence()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-5 py-4" id="encEvBody"></div>
      <div class="flex items-center justify-end gap-2 px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button onclick="toast('打印任务已创建','success')" class="btn-ghost px-3.5 py-2 rounded-lg text-sm flex items-center gap-1.5 border border-slate-200"><i data-lucide="printer" class="w-3.5 h-3.5"></i>打印</button>
        <button onclick="toast('报告下载已开始','success')" class="btn-ghost px-3.5 py-2 rounded-lg text-sm flex items-center gap-1.5 border border-slate-200"><i data-lucide="download" class="w-3.5 h-3.5"></i>下载</button>
        <button onclick="closeEncEvidence()" class="btn-primary px-4 py-2 rounded-lg text-sm">关闭</button>
      </div>
    </div>
  </div>`;
}

function encEvidenceBodyHTML(p) {
  const deposited = p.packageStatus === "succeed" && p.evidenceStatus === 1;
  if (!deposited) {
    return `
    <div class="text-center py-10">
      <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4"><i data-lucide="shield-x" class="w-7 h-7 text-slate-400"></i></div>
      <div class="text-sm font-medium text-slate-600">该装盘尚未完成存证</div>
      <div class="text-xs text-slate-400 mt-1">装盘完成并完成存证后可查看存证报告</div>
    </div>`;
  }
  return `
  <div class="text-center mb-5 pb-4 border-b border-dashed border-slate-200">
    <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 mb-2"><i data-lucide="shield-check" class="w-6 h-6 text-primary"></i></div>
    <div class="text-lg font-semibold text-ink">存证报告</div>
    <div class="text-xs text-slate-400">Evidence Preservation Report</div>
  </div>
  <div class="space-y-4 mb-5">
    ${evKV("唯一标识", '<span class="font-num">' + (p.fileKey || p.id) + '</span>')}
    ${evKV("包名称", p.packageName)}
    <div>
      <div class="text-xs text-slate-400 mb-1">存证哈希</div>
      <div class="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2.5">
        <code class="font-num text-xs text-slate-700 break-all flex-1">${p.evidenceCode}</code>
        <button onclick="copyText('${p.evidenceCode}')" class="text-slate-400 hover:text-primary shrink-0"><i data-lucide="copy" class="w-4 h-4"></i></button>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-x-6">
      ${evKV("存证大小", '<span class="font-num">' + formatFileUnit(p.evidenceSize) + '</span>')}
      ${evKV("存证时间", '<span class="font-num">' + p.evidenceTime + '</span>')}
    </div>
  </div>
  <div class="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-3 text-xs text-slate-600 leading-relaxed flex gap-2">
    <i data-lucide="info" class="w-4 h-4 text-primary shrink-0 mt-0.5"></i>
    <span>此报告证明业务数据已按照其关联的存证数据结构在保全中心进行存证，以保证其完整性和不可篡改性。</span>
  </div>`;
}

function openEncEvidence(id) {
  const p = ENCAPS_PACKAGES.find(function(x) { return x.id === id; });
  if (!p) return;
  document.getElementById("encEvBody").innerHTML = encEvidenceBodyHTML(p);
  const m = document.getElementById("encEvModal");
  m.classList.remove("hidden"); m.classList.add("flex");
  lucide.createIcons();
}
function closeEncEvidence() {
  const m = document.getElementById("encEvModal");
  m.classList.add("hidden"); m.classList.remove("flex");
}

/* ---- 数据明细 ---- */
function encDetailModalHTML() {
  return `
  <div id="encDetailModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeEncDetail()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="folder-search" class="w-5 h-5 text-primary"></i></div>
          <h3 class="text-sm font-semibold text-ink">数据明细</h3>
        </div>
        <button onclick="closeEncDetail()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-5 py-4" id="encDetailBody"></div>
      <div class="flex items-center justify-end px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button onclick="closeEncDetail()" class="btn-primary px-4 py-2 rounded-lg text-sm">关闭</button>
      </div>
    </div>
  </div>`;
}

/* 按载体编号关联数据接收模块中的信息包 */
function encInfoPackages(p) {
  if (typeof RECEPTION_PACKAGES === "undefined") return [];
  return RECEPTION_PACKAGES.filter(function(r) {
    return r.carrierNo && r.carrierNo === p.carrierNo;
  }).map(function(r) {
    return { code: r.archivesArchivalCode, name: r.packageName, size: r.packageSize, path: r.folderPath };
  });
}

function encDetailBodyHTML(p) {
  const pkgs = encInfoPackages(p);
  const rows = pkgs.length
    ? pkgs.map(function(f) {
        return `<tr class="border-t border-slate-50"><td class="px-3 py-2 font-num text-slate-500 whitespace-nowrap">${f.code}</td><td class="px-3 py-2 text-slate-700 whitespace-nowrap">${f.name}</td><td class="px-3 py-2 font-num text-slate-500 text-right whitespace-nowrap">${formatFileUnit(f.size)}</td><td class="px-3 py-2 font-num text-slate-400 break-all">${f.path}</td><td class="px-3 py-2 text-right whitespace-nowrap"><button onclick="browsePkg(event, '${f.code}')" class="text-slate-500 hover:text-ink">浏览</button></td></tr>`;
      }).join("")
    : `<tr><td colspan="5" class="px-3 py-10 text-center text-xs text-slate-400"><i data-lucide="inbox" class="w-7 h-7 mx-auto mb-2 text-slate-300"></i><div>暂无关联信息包</div></td></tr>`;
  return `
  <div class="flex items-center gap-2 mb-3">
    <div class="w-1 h-4 rounded bg-primary"></div>
    <span class="text-sm font-semibold text-ink">信息包清单</span>
    <span class="text-xs text-slate-400">（共 ${pkgs.length} 个信息包）</span>
  </div>
  <div class="border border-slate-100 rounded-lg overflow-hidden">
    <table class="w-full text-left text-xs">
      <thead><tr class="bg-slate-50/80 text-slate-500"><th class="px-3 py-2 font-medium">档号</th><th class="px-3 py-2 font-medium">信息包名称</th><th class="px-3 py-2 font-medium text-right">大小</th><th class="px-3 py-2 font-medium">路径</th><th class="px-3 py-2 font-medium text-right">操作</th></tr></thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>`;
}

function openEncDetail(id) {
  const p = ENCAPS_PACKAGES.find(function(x) { return x.id === id; });
  if (!p) return;
  document.getElementById("encDetailBody").innerHTML = encDetailBodyHTML(p);
  const m = document.getElementById("encDetailModal");
  m.classList.remove("hidden"); m.classList.add("flex");
  lucide.createIcons();
}
function closeEncDetail() {
  const m = document.getElementById("encDetailModal");
  m.classList.add("hidden"); m.classList.remove("flex");
}
