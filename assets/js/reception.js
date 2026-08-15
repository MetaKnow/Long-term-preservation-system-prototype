/* ===== 数据接收 · 信息包 ===== */

const RECEPTION_PACKAGES = [
  { id:"IP-2026-008452", fileKey:"FK-7A3F9C7D8E21", fondsCode:"A001-001", fondsName:"市委办公厅", typeName:"文书档案", archivesArchivalCode:"WS·2026·DQ3·008452", packageName:"2026年度文书档案（第3批）", packageSize:3890537861, packageVersion:"v1.0", isoName:"iso-20260811-008452", carrierNo:"GD-2026-0052", createdTime:"2026-08-11 10:42", checkStatus:"1", status:"succeed", classification:"年度归档", evidenceStatus:1, fileName:"2026年度文书档案（第3批）.zip", evidenceCode:"a3f9c7d8e21c4b6f8a1d0e2c3b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2", evidenceSize:3890537861, evidenceTime:"2026-08-11 10:45", titleProper:"2026年度第三批文书档案归档数据，含发文、批复、会议纪要、登记表等。", folderPath:"/档案库/文书档案/2026/第3批" },
  { id:"IP-2026-008451", fileKey:"FK-B7E2D4A6C8F0", fondsCode:"A003-012", fondsName:"市科技研究院", typeName:"声像档案", archivesArchivalCode:"SX·2026·A2087·008451", packageName:"科研项目声像档案包 #A2087", packageSize:13784238080, packageVersion:"v2.1", isoName:"iso-20260811-008451", carrierNo:"GD-2026-0051", createdTime:"2026-08-11 09:15", checkStatus:"1", status:"succeed", classification:"项目归档", evidenceStatus:1, fileName:"科研项目声像档案包A2087.zip", evidenceCode:"b7e2d4a6c8f0123456789abcdef0123456789abcdef0123456789abcdef0123", evidenceSize:13784238080, evidenceTime:"2026-08-11 09:20", titleProper:"市科技研究院科研项目A2087声像档案，含现场影像、勘察照片及访谈录音。", folderPath:"/档案库/声像档案/科研项目/A2087" },
  { id:"IP-2026-008450", fileKey:"FK-C8F1A3B5D7E9", fondsCode:"A007-003", fondsName:"市不动产登记中心", typeName:"电子文件", archivesArchivalCode:"DZ·2026·BDC·008450", packageName:"不动产登记电子档案（第二批）", packageSize:9021209088, packageVersion:"v1.0", isoName:"iso-20260810-008450", carrierNo:"GD-2026-0050", createdTime:"2026-08-10 16:30", checkStatus:"1", status:"succeed", classification:"专题归档", evidenceStatus:1, fileName:"不动产登记电子档案第二批.zip", evidenceCode:"c8f1a3b5d7e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b", evidenceSize:9021209088, evidenceTime:"2026-08-10 16:38", titleProper:"市不动产登记中心移交的不动产登记电子文件，第二批。", folderPath:"/档案库/电子文件/不动产登记/2026/第二批" },
  { id:"IP-2026-008449", fileKey:"FK-D9E2B4C6F8A0", fondsCode:"A002-007", fondsName:"市科技局", typeName:"科技档案", archivesArchivalCode:"KJ·2025·GH·008449", packageName:"2025年度科技档案归档包", packageSize:2327839432, packageVersion:"v1.0", isoName:"iso-20260810-008449", carrierNo:"GD-2026-0052", createdTime:"2026-08-10 14:08", checkStatus:"1", status:"succeed", classification:"年度归档", evidenceStatus:1, fileName:"2025年度科技档案归档包.zip", evidenceCode:"d9e2b4c6f8a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6", evidenceSize:2327839432, evidenceTime:"2026-08-10 14:12", titleProper:"2025年度科技档案归档数据，含技术报告、图纸、数据表及附录。", folderPath:"/档案库/科技档案/2025" },
  { id:"IP-2026-008448", fileKey:"FK-E0F3C5D7A9B1", fondsCode:"A009-005", fondsName:"市行政审批局", typeName:"电子文件", archivesArchivalCode:"DZ·2026·ZWFW·008448", packageName:"政务服务电子文件归档包", packageSize:2104523904, packageVersion:"v1.2", isoName:"iso-20260810-008448", carrierNo:"", createdTime:"2026-08-10 11:22", checkStatus:"0", status:"back", classification:"实时归档", evidenceStatus:0, fileName:"政务服务电子文件归档包.zip", evidenceCode:"", evidenceSize:0, evidenceTime:"", titleProper:"市行政审批局政务服务事项电子文件归档包，因四性检测未通过已退回。", folderPath:"/接收暂存/电子文件/政务服务/2026" },
  { id:"IP-2026-008447", fileKey:"FK-F1A4D6E8B0C2", fondsCode:"A005-021", fondsName:"市自然资源局", typeName:"声像档案", archivesArchivalCode:"SX·2020·CSGH·008447", packageName:"城市规划声像档案 2016-2020", packageSize:48542199808, packageVersion:"v1.0", isoName:"iso-20260809-008447", carrierNo:"GD-2026-0047", createdTime:"2026-08-09 15:47", checkStatus:"1", status:"succeed", classification:"专题归档", evidenceStatus:1, fileName:"城市规划声像档案2016-2020.zip", evidenceCode:"f1a4d6e8b0c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8", evidenceSize:48542199808, evidenceTime:"2026-08-09 16:02", titleProper:"市自然资源局移交的城市规划声像档案，覆盖2016至2020年度。", folderPath:"/档案库/声像档案/城市规划/2016-2020" },
  { id:"IP-2026-008446", fileKey:"FK-A2B5E7F9C1D3", fondsCode:"A001-001", fondsName:"市委办公厅", typeName:"文书档案", archivesArchivalCode:"WS·2026·DQ2·008446", packageName:"2026年度文书档案（第2批）", packageSize:3092376453, packageVersion:"v1.0", isoName:"iso-20260809-008446", carrierNo:"GD-2026-0050", createdTime:"2026-08-09 09:30", checkStatus:"1", status:"succeed", classification:"年度归档", evidenceStatus:1, fileName:"2026年度文书档案（第2批）.zip", evidenceCode:"a2b5e7f9c1d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9", evidenceSize:3092376453, evidenceTime:"2026-08-09 09:35", titleProper:"2026年度第二批文书档案归档数据。", folderPath:"/档案库/文书档案/2026/第2批" },
  { id:"IP-2026-008445", fileKey:"FK-B3C6F8A0D2E4", fondsCode:"A010-002", fondsName:"市市场监督管理局", typeName:"电子文件", archivesArchivalCode:"DZ·2026·GS·008445", packageName:"工商登记电子档案（2026Q2）", packageSize:4861835264, packageVersion:"v1.0", isoName:"iso-20260808-008445", carrierNo:"GD-2026-0045", createdTime:"2026-08-08 17:12", checkStatus:"1", status:"succeed", classification:"季度归档", evidenceStatus:1, fileName:"工商登记电子档案2026Q2.zip", evidenceCode:"b3c6f8a0d2e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0", evidenceSize:4861835264, evidenceTime:"2026-08-08 17:20", titleProper:"市市场监督管理局移交的2026年第二季度工商登记电子档案。", folderPath:"/档案库/电子文件/工商登记/2026/Q2" },
  { id:"IP-2026-008444", fileKey:"FK-C4D7A9B1E3F5", fondsCode:"A004-009", fondsName:"市水利局", typeName:"科技档案", archivesArchivalCode:"KJ·2026·SL·008444", packageName:"水利工程技术档案包", packageSize:7203640729, packageVersion:"v3.0", isoName:"iso-20260808-008444", carrierNo:"", createdTime:"2026-08-08 10:05", checkStatus:"0", status:"failed", classification:"项目归档", evidenceStatus:0, fileName:"水利工程技术档案包.zip", evidenceCode:"", evidenceSize:0, evidenceTime:"", titleProper:"市水利局水利工程声像档案包，接收处理失败。", folderPath:"/接收暂存/科技档案/水利/2026" },
  { id:"IP-2026-008443", fileKey:"FK-D5E8B0C2F4A6", fondsCode:"A006-014", fondsName:"市文物局", typeName:"声像档案", archivesArchivalCode:"SX·2026·WB·008443", packageName:"文物保护勘察声像档案", packageSize:20342872064, packageVersion:"v1.0", isoName:"iso-20260807-008443", carrierNo:"GD-2026-0044", createdTime:"2026-08-07 14:20", checkStatus:"1", status:"succeed", classification:"专题归档", evidenceStatus:1, fileName:"文物保护勘察声像档案.zip", evidenceCode:"d5e8b0c2f4a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2", evidenceSize:20342872064, evidenceTime:"2026-08-07 14:30", titleProper:"市文物局移交的文物保护勘察声像档案。", folderPath:"/档案库/声像档案/文物保护/2026" },
];

const REG_STATUS = { succeed:"成功", back:"已退回", failed:"失败" };
const REG_STATUS_CLS = { succeed:"bg-emerald-50 text-emerald-700", back:"bg-amber-50 text-amber-700", failed:"bg-red-50 text-red-700" };

let receptionFilter = { keyword: "", typeName: "", status: "", checkStatus: "", evidenceStatus: "", diskStatus: "" };
let receptionSelected = new Set();

function formatFileUnit(b) {
  b = Number(b) || 0;
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(2) + " KB";
  if (b < 1073741824) return (b / 1048576).toFixed(2) + " MB";
  return (b / 1073741824).toFixed(2) + " GB";
}

function evidenceState(p) {
  if (p.checkStatus !== "1") return { text: "-", cls: "text-slate-400", plain: true };
  if (p.evidenceStatus === 1) return { text: "已存证", cls: "bg-emerald-50 text-emerald-700" };
  return { text: "存证失败", cls: "bg-red-50 text-red-700" };
}

function receptionHTML() {
  const types = [...new Set(RECEPTION_PACKAGES.map(p => p.typeName))];
  const statuses = [["succeed","成功"],["back","已退回"],["failed","失败"]];
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="flex items-center gap-2">
      <button id="btnManualCheck" onclick="manualCheckEvidence()" class="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 opacity-50 cursor-not-allowed" disabled><i data-lucide="shield-check" class="w-4 h-4"></i>手动检测存证</button>
      <button id="btnReturnArchives" onclick="returnToArchives()" class="btn-ghost px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 border border-slate-200 opacity-50 cursor-not-allowed" disabled><i data-lucide="undo-2" class="w-4 h-4"></i>退回馆藏系统</button>
    </div>
    <div class="card p-3">
      <div class="flex flex-wrap items-center gap-3">
        <select class="field px-3 py-2 text-sm" onchange="receptionFilter.typeName=this.value; renderPackageRows()">
          <option value="">全部档案门类</option>
          ${types.map(t => `<option value="${t}" ${receptionFilter.typeName===t?'selected':''}>${t}</option>`).join("")}
        </select>
        <select class="field px-3 py-2 text-sm" onchange="receptionFilter.checkStatus=this.value; renderPackageRows()">
          <option value="">全部四性检测</option>
          <option value="1" ${receptionFilter.checkStatus==="1"?'selected':''}>通过</option>
          <option value="0" ${receptionFilter.checkStatus==="0"?'selected':''}>未通过</option>
        </select>
        <select class="field px-3 py-2 text-sm" onchange="receptionFilter.evidenceStatus=this.value; renderPackageRows()">
          <option value="">全部存证情况</option>
          <option value="1" ${receptionFilter.evidenceStatus==="1"?'selected':''}>已存证</option>
          <option value="0" ${receptionFilter.evidenceStatus==="0"?'selected':''}>未存证</option>
        </select>
        <select class="field px-3 py-2 text-sm" onchange="receptionFilter.diskStatus=this.value; renderPackageRows()">
          <option value="">全部装盘状态</option>
          <option value="1" ${receptionFilter.diskStatus==="1"?'selected':''}>已装盘</option>
          <option value="0" ${receptionFilter.diskStatus==="0"?'selected':''}>未装盘</option>
        </select>
        <div class="relative">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input type="text" class="field pl-9 pr-3 py-2 text-sm w-72" placeholder="请输入全宗号 / 全宗名称 / 档号" oninput="receptionFilter.keyword=this.value; renderPackageRows()" value="${receptionFilter.keyword}" />
        </div>
        <button onclick="resetReceptionFilter()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
              <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
              <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="rcAll" class="rounded border-slate-300" onchange="toggleSelectAll(this.checked)" /></th>
              <th class="px-3 py-2 font-medium">全宗号</th>
              <th class="px-3 py-2 font-medium">全宗名称</th>
              <th class="px-3 py-2 font-medium">档案门类</th>
              <th class="px-3 py-2 font-medium">档号</th>
              <th class="px-3 py-2 font-medium">信息包名称</th>
              <th class="px-3 py-2 font-medium">版本号</th>
              <th class="px-3 py-2 font-medium">载体编号</th>
              <th class="px-3 py-2 font-medium">登记时间</th>
              <th class="px-3 py-2 font-medium text-center">四性检测</th>
              <th class="px-3 py-2 font-medium">存证情况</th>
              <th class="px-3 py-2 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody id="rcBody"></tbody>
        </table>
      </div>
      <div id="rcEmpty" class="hidden py-12 text-center text-sm text-slate-400">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无匹配的信息包</div>
      </div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500">
        <span id="rcInfo"></span>
        <div class="flex items-center gap-1">
          <button class="btn-ghost w-7 h-7 rounded flex items-center justify-center"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
          <span class="px-2 font-num text-slate-700">1 / 1</span>
          <button class="btn-ghost w-7 h-7 rounded flex items-center justify-center"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
        </div>
      </div>
    </div>
  </div>
  ${evidenceModalHTML()}
  ${detailModalHTML()}`;
}

function filteredPackages() {
  const q = receptionFilter.keyword.trim().toLowerCase();
  return RECEPTION_PACKAGES.filter(p => {
    if (q && !(p.fondsCode.toLowerCase().indexOf(q) >= 0 || p.fondsName.toLowerCase().indexOf(q) >= 0 || p.archivesArchivalCode.toLowerCase().indexOf(q) >= 0)) return false;
    if (receptionFilter.typeName && p.typeName !== receptionFilter.typeName) return false;
    if (receptionFilter.checkStatus && p.checkStatus !== receptionFilter.checkStatus) return false;
    if (receptionFilter.evidenceStatus && String(p.evidenceStatus) !== receptionFilter.evidenceStatus) return false;
    if (receptionFilter.diskStatus === "1" && !p.carrierNo) return false;
    if (receptionFilter.diskStatus === "0" && p.carrierNo) return false;
    return true;
  });
}

function renderPackageRows() {
  const list = filteredPackages();
  const body = document.getElementById("rcBody");
  const empty = document.getElementById("rcEmpty");
  const info = document.getElementById("rcInfo");
  if (!body) return;
  syncRcAll();
  if (!list.length) {
    body.innerHTML = "";
    empty.classList.remove("hidden");
    if (info) info.textContent = "共 0 条";
    lucide.createIcons();
    return;
  }
  empty.classList.add("hidden");
  body.innerHTML = list.map((p, idx) => {
    const ev = evidenceState(p);
    const evBadge = ev.plain ? `<span class="${ev.cls}">${ev.text}</span>` : `<span class="tag ${ev.cls}">${ev.text}</span>`;
    const chkBadge = p.checkStatus === "1"
      ? `<span class="tag bg-emerald-50 text-emerald-700">通过</span>`
      : `<span class="tag bg-red-50 text-red-700">未通过</span>`;
    return `
    <tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx + 1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="pkg-check rounded border-slate-300" data-id="${p.id}" onchange="togglePkgSelect('${p.id}', this.checked)" ${receptionSelected.has(p.id)?'checked':''} /></td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${p.fondsCode}</td>
      <td class="px-3 py-2 text-sm text-slate-600 whitespace-nowrap">${p.fondsName}</td>
      <td class="px-3 py-2 text-sm text-slate-600 whitespace-nowrap">${p.typeName}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${p.archivesArchivalCode}</td>
      <td class="px-3 py-2 text-sm text-ink font-medium max-w-[260px] truncate" title="${p.archivesArchivalCode}-${p.packageVersion}">${p.archivesArchivalCode}-${p.packageVersion}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${p.packageVersion}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${p.carrierNo || "—"}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${p.createdTime}</td>
      <td class="px-3 py-2 text-center">${chkBadge}</td>
      <td class="px-3 py-2">${evBadge}</td>
      <td class="px-3 py-2">
        <div class="flex items-center gap-2 justify-end text-xs whitespace-nowrap">
          <button onclick="openEvidence('${p.id}')" class="text-secondary hover:text-primary">查看存证证明</button>
          <span class="text-slate-200">|</span>
          <button onclick="browsePkg(event, '${p.id}')" class="text-slate-500 hover:text-ink">浏览</button>
          <span class="text-slate-200">|</span>
          <button onclick="openDetail('${p.id}')" class="text-slate-500 hover:text-ink">详情</button>
        </div>
      </td>
    </tr>`;
  }).join("");
  if (info) info.textContent = "共 " + list.length + " 条";
  updateActionBtns();
  lucide.createIcons();
}

function updateActionBtns() {
  const list = filteredPackages();
  const selected = list.filter(p => receptionSelected.has(p.id));
  const allFailed = selected.length > 0 && selected.every(p => p.checkStatus === "0");
  const btn1 = document.getElementById("btnManualCheck");
  const btn2 = document.getElementById("btnReturnArchives");
  if (btn1) {
    if (allFailed) {
      btn1.disabled = false;
      btn1.classList.remove("opacity-50", "cursor-not-allowed");
    } else {
      btn1.disabled = true;
      btn1.classList.add("opacity-50", "cursor-not-allowed");
    }
  }
  if (btn2) {
    if (allFailed) {
      btn2.disabled = false;
      btn2.classList.remove("opacity-50", "cursor-not-allowed");
    } else {
      btn2.disabled = true;
      btn2.classList.add("opacity-50", "cursor-not-allowed");
    }
  }
}


function togglePkgSelect(id, checked) {
  if (checked) receptionSelected.add(id); else receptionSelected.delete(id);
  syncRcAll();
  updateActionBtns();
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

function refreshReception() {
  const view = document.getElementById("view");
  view.innerHTML = receptionHTML();
  view.scrollTop = 0;
  lucide.createIcons();
  renderPackageRows();
}
function resetReceptionFilter() { receptionFilter = { keyword: "", typeName: "", status: "", checkStatus: "", evidenceStatus: "", diskStatus: "" }; refreshReception(); }

function getSelectedOrAll() {
  const list = filteredPackages();
  if (receptionSelected.size > 0) {
    return list.filter(p => receptionSelected.has(p.id));
  }
  return list;
}

function manualCheckEvidence() {
  const list = filteredPackages();
  const items = list.filter(p => receptionSelected.has(p.id) && p.checkStatus === "0");
  if (!items.length) { toast("请先勾选四性检测未通过的信息包", "warn"); return; }
  items.forEach(p => {
    p.checkStatus = "1";
    if (p.evidenceStatus !== 1) { p.evidenceStatus = 1; p.evidenceTime = "2026-08-12 " + new Date().toTimeString().slice(0,5); }
  });
  toast("已手动检测并完成存证，共 " + items.length + " 条", "success");
  receptionSelected.clear();
  renderPackageRows();
}

function returnToArchives() {
  const list = filteredPackages();
  const items = list.filter(p => receptionSelected.has(p.id) && p.checkStatus === "0");
  if (!items.length) { toast("请先勾选四性检测未通过的信息包", "warn"); return; }
  if (!confirm("确认将选中的 " + items.length + " 条四性检测未通过的信息包退回馆藏系统？")) return;
  toast("已退回馆藏系统，共 " + items.length + " 条", "success");
}

/* ---- 存证证明 ---- */
function evidenceModalHTML() {
  return `
  <div id="evidenceModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeEvidence()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="shield-check" class="w-5 h-5 text-primary"></i></div>
          <h3 class="text-sm font-semibold text-ink">存证证明</h3>
        </div>
        <button onclick="closeEvidence()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-6 py-5" id="evBody"></div>
      <div class="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button onclick="toast('打印任务已创建','success')" class="btn-ghost px-3.5 py-2 rounded-lg text-sm flex items-center gap-1.5 border border-slate-200"><i data-lucide="printer" class="w-3.5 h-3.5"></i>打印</button>
        <button onclick="toast('报告下载已开始','success')" class="btn-ghost px-3.5 py-2 rounded-lg text-sm flex items-center gap-1.5 border border-slate-200"><i data-lucide="download" class="w-3.5 h-3.5"></i>下载</button>
        <button onclick="closeEvidence()" class="btn-primary px-4 py-2 rounded-lg text-sm">关闭</button>
      </div>
    </div>
  </div>`;
}

function evKV(k, v) {
  return `<div><div class="text-xs text-slate-400 mb-1">${k}</div><div class="text-sm text-ink break-all">${v}</div></div>`;
}

function evidenceBodyHTML(p) {
  const deposited = p.checkStatus === "1" && p.evidenceStatus === 1;
  if (!deposited) {
    return `
    <div class="text-center py-10">
      <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4"><i data-lucide="shield-x" class="w-7 h-7 text-slate-400"></i></div>
      <div class="text-sm font-medium text-slate-600">该信息包尚未完成存证</div>
      <div class="text-xs text-slate-400 mt-1">完成四性检测与存证后可查看存证证明</div>
    </div>`;
  }
  return `
  <div class="text-center mb-5 pb-4 border-b border-dashed border-slate-200">
    <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 mb-2"><i data-lucide="shield-check" class="w-6 h-6 text-primary"></i></div>
    <div class="text-lg font-semibold text-ink">存证证明</div>
    <div class="text-xs text-slate-400">Evidence Preservation Certificate</div>
  </div>
  <div class="space-y-4 mb-5">
    ${evKV("唯一标识", '<span class="font-num">' + (p.fileKey || p.id) + '</span>')}
    ${evKV("文件名称", p.fileName || p.packageName || "--")}
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

function openEvidence(id) {
  const p = RECEPTION_PACKAGES.find(x => x.id === id);
  if (!p) return;
  document.getElementById("evBody").innerHTML = evidenceBodyHTML(p);
  const m = document.getElementById("evidenceModal");
  m.classList.remove("hidden"); m.classList.add("flex");
  lucide.createIcons();
}
function closeEvidence() {
  const m = document.getElementById("evidenceModal");
  m.classList.add("hidden"); m.classList.remove("flex");
}

/* ---- 详情 ---- */
function detailModalHTML() {
  return `
  <div id="detailModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeDetail()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="info" class="w-5 h-5 text-primary"></i></div>
          <h3 class="text-sm font-semibold text-ink">详情</h3>
        </div>
        <button onclick="closeDetail()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-6 py-5" id="dtBody"></div>
      <div class="flex items-center justify-end px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button onclick="closeDetail()" class="btn-primary px-4 py-2 rounded-lg text-sm">关闭</button>
      </div>
    </div>
  </div>`;
}

function dtKV(k, v, cls) {
  return `<div class="${cls||''}"><div class="text-xs text-slate-400 mb-1">${k}</div><div class="text-sm text-ink break-all">${v}</div></div>`;
}

function detailBodyHTML(p) {
  return `
  <div class="grid grid-cols-2 gap-x-6 gap-y-4 mb-2">
    ${dtKV("全宗号", '<span class="font-num">' + p.fondsCode + '</span>')}
    ${dtKV("全宗名称", p.fondsName)}
    ${dtKV("档案门类", p.typeName)}
    ${dtKV("档号", '<span class="font-num">' + p.archivesArchivalCode + '</span>', "col-span-2")}
  </div>
  <div class="flex items-center gap-2 my-5">
    <div class="w-1 h-4 rounded bg-primary"></div>
    <span class="text-sm font-semibold text-ink">信息包</span>
  </div>
  <div class="grid grid-cols-2 gap-x-6 gap-y-4">
    ${dtKV("包名称", p.archivesArchivalCode + '-' + p.packageVersion)}
    ${dtKV("版本号", '<span class="font-num">' + p.packageVersion + '</span>')}
    ${dtKV("包大小", '<span class="font-num">' + formatFileUnit(p.packageSize) + '</span>')}
    ${dtKV("层级结构", '<span class="font-num text-slate-600">' + p.folderPath + '</span>')}
  </div>`;
}

function openDetail(id) {
  const p = RECEPTION_PACKAGES.find(x => x.id === id);
  if (!p) return;
  document.getElementById("dtBody").innerHTML = detailBodyHTML(p);
  const m = document.getElementById("detailModal");
  m.classList.remove("hidden"); m.classList.add("flex");
  lucide.createIcons();
}
function closeDetail() {
  const m = document.getElementById("detailModal");
  m.classList.add("hidden"); m.classList.remove("flex");
}

function browsePkg(e, id) {
  e.stopPropagation();
  let tip = document.getElementById("browseTip");
  if (tip && !tip.classList.contains("hidden")) {
    tip.classList.add("hidden");
    return;
  }
  if (!tip) {
    tip = document.createElement("div");
    tip.id = "browseTip";
    tip.className = "fixed z-[200] px-3 py-2 rounded-lg text-xs text-white bg-slate-800 shadow-lg max-w-[220px] leading-relaxed pointer-events-none";
    tip.style.opacity = "0";
    tip.style.transition = "opacity 0.15s ease";
    tip.innerHTML = '<div class="flex items-start gap-2"><i data-lucide="info" class="w-3.5 h-3.5 text-sky-300 shrink-0 mt-0.5"></i><span>点击浏览，使用文件浏览器打开保存信息包即可，与档案系统功能一致</span></div>';
    document.body.appendChild(tip);
    lucide.createIcons();
  }
  tip.style.visibility = "hidden";
  tip.classList.remove("hidden");
  tip.style.left = "0px";
  tip.style.top = "0px";
  const tipW = tip.offsetWidth;
  const tipH = tip.offsetHeight;
  const gap = 12;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mx = e.clientX;
  const my = e.clientY;
  const spaceRight = vw - mx;
  const spaceLeft = mx;
  const spaceBottom = vh - my;
  const spaceTop = my;
  let left, top;
  if (spaceRight >= spaceLeft) {
    left = mx + gap;
    if (left + tipW > vw) left = vw - tipW - 4;
  } else {
    left = mx - gap - tipW;
    if (left < 4) left = 4;
  }
  if (spaceBottom >= spaceTop) {
    top = my + gap;
    if (top + tipH > vh) top = vh - tipH - 4;
  } else {
    top = my - gap - tipH;
    if (top < 4) top = 4;
  }
  tip.style.left = left + "px";
  tip.style.top = top + "px";
  tip.style.visibility = "visible";
  requestAnimationFrame(function() { tip.style.opacity = "1"; });
}

document.addEventListener("click", function(e) {
  const tip = document.getElementById("browseTip");
  if (!tip || tip.classList.contains("hidden")) return;
  if (e.target.closest("button") && e.target.closest("button").innerText === "浏览") return;
  tip.style.opacity = "0";
  setTimeout(function() { tip.classList.add("hidden"); }, 150);
});

/* ---- utils ---- */
function copyText(t) {
  if (navigator.clipboard) navigator.clipboard.writeText(t);
  toast("已复制到剪贴板", "success");
}

function toast(msg, type) {
  type = type || "info";
  let t = document.getElementById("toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  const colors = { info: "bg-slate-800", success: "bg-emerald-600", warn: "bg-amber-500", error: "bg-red-600" };
  const icons = { info: "info", success: "check-circle-2", warn: "alert-triangle", error: "x-circle" };
  t.className = "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-lg text-sm text-white shadow-lg flex items-center gap-2 transition-opacity duration-300 opacity-0 " + (colors[type] || colors.info);
  t.innerHTML = '<i data-lucide="' + (icons[type] || icons.info) + '" class="w-4 h-4"></i>' + msg;
  lucide.createIcons();
  requestAnimationFrame(function() { t.classList.remove("opacity-0"); t.classList.add("opacity-100"); });
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(function() { t.classList.add("opacity-0"); t.classList.remove("opacity-100"); }, 2200);
}
