/* ===== 出库记录 ===== */

/* 出库记录：由数据装盘页「光盘出库」生成，也可手动维护 */
const OUTBOUND_RECORDS = [
  { id:"OB-2026-0002", outboundTime:"2026-08-12 10:15", outboundUser:"张明", discCount:2, returnTime:"2026-08-15 16:40", returnUser:"张明",
    discs:[
      { carrierNo:"GD-2026-0052", carrierLocation:"1#库-槽位03", packageSize:3890537861 },
      { carrierNo:"GD-2026-0045", carrierLocation:"1#库-槽位07", packageSize:20342872064 },
    ]},
  { id:"OB-2026-0001", outboundTime:"2026-08-11 14:30", outboundUser:"李华", discCount:1, returnTime:"", returnUser:"",
    discs:[
      { carrierNo:"GD-2026-0050", carrierLocation:"离线柜A-2-04", packageSize:9021209088 },
    ]},
];

/* 初始化同步：以出库记录为唯一数据源，修正数据装盘页的载体状态——
   已出库未归还 → 「盘匣被拿出」；已归还 → 按载体位置恢复在库状态 */
(function () {
  if (typeof ENCAPS_PACKAGES === "undefined") return;
  function findEnc(carrierNo) {
    for (let i = 0; i < ENCAPS_PACKAGES.length; i++) {
      if (ENCAPS_PACKAGES[i].carrierNo && ENCAPS_PACKAGES[i].carrierNo === carrierNo) return ENCAPS_PACKAGES[i];
    }
    return null;
  }
  OUTBOUND_RECORDS.forEach(function (r) {
    (r.discs || []).forEach(function (d) {
      const p = findEnc(d.carrierNo);
      if (!p) return;
      if (r.returnTime) {
        p.carrierStatus = String(d.carrierLocation || "").indexOf("离线柜") >= 0 ? "盘匣在离线柜中" : "盘匣在设备中";
      } else {
        p.carrierStatus = "盘匣被拿出";
      }
    });
  });
})();

let outboundFilter = { keyword: "", status: "" };
let outboundSelected = new Set();

function outboundNow() {
  const d = new Date(), p = function(n) { return String(n).padStart(2, "0"); };
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}

function currentUserName() {
  if (typeof CURRENT_USER !== "undefined" && CURRENT_USER.name) return CURRENT_USER.name;
  return "保全管理员";
}

/* 数据装盘页「光盘出库」调用：将选中的光盘快照生成一条出库记录 */
function addOutboundRecord(discs) {
  let max = 0;
  OUTBOUND_RECORDS.forEach(function(r) {
    const n = parseInt(String(r.id).split("-").pop(), 10);
    if (n > max) max = n;
  });
  const rec = {
    id: "OB-" + outboundNow().slice(0, 4) + "-" + String(max + 1).padStart(4, "0"),
    outboundTime: outboundNow(),
    outboundUser: currentUserName(),
    discCount: discs.length,
    returnTime: "",
    returnUser: "",
    discs: discs.map(function(d) {
      return { carrierNo: d.carrierNo, carrierLocation: d.carrierLocation, packageSize: d.packageSize };
    })
  };
  OUTBOUND_RECORDS.unshift(rec);
  return rec;
}

/* ---- 页面 ---- */
function outboundHTML() {
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="flex items-center gap-2">
      <button id="btnReturnOutbound" onclick="returnOutbound()" class="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 opacity-50 cursor-not-allowed" disabled><i data-lucide="rotate-ccw" class="w-4 h-4"></i>归还</button>
    </div>
    <div class="card overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <select class="field px-3 py-2 text-sm" onchange="outboundFilter.status=this.value; renderOutboundRows()">
          <option value="">全部归还状态</option>
          <option value="0" ${outboundFilter.status==="0"?'selected':''}>未归还</option>
          <option value="1" ${outboundFilter.status==="1"?'selected':''}>已归还</option>
        </select>
        <div class="relative">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input type="text" class="field pl-9 pr-3 py-2 text-sm w-72" placeholder="请输入出库单号 / 出库人 / 载体编号" oninput="outboundFilter.keyword=this.value; renderOutboundRows()" value="${outboundFilter.keyword}" />
        </div>
        <button onclick="resetOutboundFilter()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
              <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
              <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="obAll" class="rounded border-slate-300" onchange="toggleOutboundSelectAll(this.checked)" /></th>
              <th class="px-3 py-2 font-medium">出库单号</th>
              <th class="px-3 py-2 font-medium">出库时间</th>
              <th class="px-3 py-2 font-medium">出库人</th>
              <th class="px-3 py-2 font-medium text-center">出库盘数</th>
              <th class="px-3 py-2 font-medium">归还时间</th>
              <th class="px-3 py-2 font-medium">归还人</th>
              <th class="px-3 py-2 font-medium text-center">归还状态</th>
              <th class="px-3 py-2 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody id="obBody"></tbody>
        </table>
      </div>
      <div id="obEmpty" class="hidden py-12 text-center text-sm text-slate-400">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无匹配的出库记录</div>
      </div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500">
        <span id="obInfo"></span>
        <div class="flex items-center gap-1">
          <button class="btn-ghost w-7 h-7 rounded flex items-center justify-center"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
          <span class="px-2 font-num text-slate-700">1 / 1</span>
          <button class="btn-ghost w-7 h-7 rounded flex items-center justify-center"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
        </div>
      </div>
    </div>
  </div>
  ${outboundDetailModalHTML()}`;
}

/* ---- 筛选 ---- */
function filteredOutbound() {
  const q = outboundFilter.keyword.trim().toLowerCase();
  return OUTBOUND_RECORDS.filter(function(r) {
    if (outboundFilter.status === "1" && !r.returnTime) return false;
    if (outboundFilter.status === "0" && r.returnTime) return false;
    if (q) {
      const discMatch = (r.discs || []).some(function(d) { return String(d.carrierNo || "").toLowerCase().indexOf(q) >= 0; });
      if (!(r.id.toLowerCase().indexOf(q) >= 0 || r.outboundUser.toLowerCase().indexOf(q) >= 0 || discMatch)) return false;
    }
    return true;
  });
}

/* ---- 渲染 ---- */
function renderOutboundRows() {
  const list = filteredOutbound();
  const body = document.getElementById("obBody");
  const empty = document.getElementById("obEmpty");
  const info = document.getElementById("obInfo");
  if (!body) return;
  syncOutboundAll();
  updateReturnBtn();
  if (!list.length) {
    body.innerHTML = "";
    empty.classList.remove("hidden");
    if (info) info.textContent = "共 0 条";
    lucide.createIcons();
    return;
  }
  empty.classList.add("hidden");
  body.innerHTML = list.map(function(r, idx) {
    const badge = r.returnTime
      ? `<span class="tag bg-emerald-50 text-emerald-700">已归还</span>`
      : `<span class="tag bg-amber-50 text-amber-700">未归还</span>`;
    return `
    <tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx + 1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="ob-check rounded border-slate-300" data-id="${r.id}" onchange="toggleOutboundSelect('${r.id}', this.checked)" ${outboundSelected.has(r.id)?'checked':''} /></td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${r.id}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${r.outboundTime}</td>
      <td class="px-3 py-2 text-sm text-slate-600 whitespace-nowrap">${r.outboundUser}</td>
      <td class="px-3 py-2 text-center font-num text-xs text-slate-600 whitespace-nowrap">${r.discCount} 张</td>
      <td class="px-3 py-2 font-num text-xs ${r.returnTime ? "text-slate-600" : "text-slate-300"} whitespace-nowrap">${r.returnTime || "—"}</td>
      <td class="px-3 py-2 text-sm ${r.returnUser ? "text-slate-600" : "text-slate-300"} whitespace-nowrap">${r.returnUser || "—"}</td>
      <td class="px-3 py-2 text-center">${badge}</td>
      <td class="px-3 py-2">
        <div class="flex items-center gap-2 justify-end text-xs whitespace-nowrap">
          <button onclick="openOutboundDetail('${r.id}')" class="text-secondary hover:text-primary">详情</button>
          ${!r.returnTime ? `<span class="text-slate-200">|</span><button onclick="returnOutboundById('${r.id}')" class="text-emerald-600 hover:text-emerald-700">归还</button>` : ""}
        </div>
      </td>
    </tr>`;
  }).join("");
  if (info) info.textContent = "共 " + list.length + " 条";
  lucide.createIcons();
}

/* ---- 选择 ---- */
function toggleOutboundSelect(id, checked) {
  if (checked) outboundSelected.add(id); else outboundSelected.delete(id);
  syncOutboundAll();
  updateReturnBtn();
}
function toggleOutboundSelectAll(checked) {
  filteredOutbound().forEach(function(r) {
    if (checked) outboundSelected.add(r.id); else outboundSelected.delete(r.id);
  });
  renderOutboundRows();
}
function syncOutboundAll() {
  const all = document.getElementById("obAll");
  if (!all) return;
  const list = filteredOutbound();
  all.checked = list.length > 0 && list.every(function(r) { return outboundSelected.has(r.id); });
}

/* ---- 归还 ---- */
function outboundReturnable(r) {
  return !r.returnTime;
}

function updateReturnBtn() {
  const btn = document.getElementById("btnReturnOutbound");
  if (!btn) return;
  const list = filteredOutbound();
  const selected = list.filter(function(r) { return outboundSelected.has(r.id); });
  const allReturnable = selected.length > 0 && selected.every(outboundReturnable);
  if (allReturnable) {
    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
  } else {
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
  }
}

/* 归还：记录归还时间/归还人，并同步恢复装盘页对应光盘的在库状态 */
function doReturnRecords(items) {
  items.forEach(function(r) {
    r.returnTime = outboundNow();
    r.returnUser = currentUserName();
    (r.discs || []).forEach(function(d) {
      if (typeof ENCAPS_PACKAGES === "undefined") return;
      ENCAPS_PACKAGES.forEach(function(p) {
        if (p.carrierNo && p.carrierNo === d.carrierNo && p.packageStatus === "succeed") {
          p.carrierStatus = String(d.carrierLocation || "").indexOf("离线柜") >= 0 ? "盘匣在离线柜中" : "盘匣在设备中";
        }
      });
    });
  });
}

function returnOutbound() {
  const list = filteredOutbound();
  const items = list.filter(function(r) { return outboundSelected.has(r.id) && outboundReturnable(r); });
  if (!items.length) { toast("请先勾选未归还的出库记录", "warn"); return; }
  if (!confirm("确认将选中的 " + items.length + " 条出库记录标记为已归还？")) return;
  doReturnRecords(items);
  toast("归还成功，共 " + items.length + " 条", "success");
  outboundSelected.clear();
  renderOutboundRows();
}

function returnOutboundById(id) {
  const r = OUTBOUND_RECORDS.find(function(x) { return x.id === id; });
  if (!r || r.returnTime) return;
  if (!confirm("确认将该出库记录标记为已归还？")) return;
  doReturnRecords([r]);
  toast("归还成功", "success");
  renderOutboundRows();
}

function refreshOutbound() {
  const view = document.getElementById("view");
  view.innerHTML = outboundHTML();
  view.scrollTop = 0;
  lucide.createIcons();
  renderOutboundRows();
}
function resetOutboundFilter() { outboundFilter = { keyword: "", status: "" }; refreshOutbound(); }

/* ---- 详情 ---- */
function outboundDetailModalHTML() {
  return `
  <div id="obDetailModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeOutboundDetail()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="package-open" class="w-5 h-5 text-primary"></i></div>
          <h3 class="text-sm font-semibold text-ink">出库记录详情</h3>
        </div>
        <button onclick="closeOutboundDetail()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-5 py-4" id="obDetailBody"></div>
      <div class="flex items-center justify-end px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button onclick="closeOutboundDetail()" class="btn-primary px-4 py-2 rounded-lg text-sm">关闭</button>
      </div>
    </div>
  </div>`;
}

/* 按载体编号关联数据接收模块中的信息包 */
function outboundInfoPackages(carrierNo) {
  if (typeof RECEPTION_PACKAGES === "undefined") return [];
  return RECEPTION_PACKAGES.filter(function(r) {
    return r.carrierNo && r.carrierNo === carrierNo;
  }).map(function(r) {
    return { code: r.archivesArchivalCode, name: r.packageName, size: r.packageSize, path: r.folderPath };
  });
}

function outboundDetailBodyHTML(r) {
  const discs = r.discs || [];
  const discsRows = discs.length
    ? discs.map(function(d) {
        return `<tr class="border-t border-slate-50">
          <td class="px-3 py-2 font-num text-slate-600 whitespace-nowrap">${d.carrierNo}</td>
          <td class="px-3 py-2 font-num text-xs text-slate-500 whitespace-nowrap">${d.carrierLocation || "-"}</td>
          <td class="px-3 py-2 font-num text-xs text-slate-600 text-right whitespace-nowrap">${formatFileUnit(d.packageSize)}</td>
        </tr>`;
      }).join("")
    : `<tr><td colspan="3" class="px-3 py-10 text-center text-xs text-slate-400"><i data-lucide="inbox" class="w-7 h-7 mx-auto mb-2 text-slate-300"></i><div>暂无光盘数据</div></td></tr>`;

  const pkgRows = [];
  discs.forEach(function(d) {
    outboundInfoPackages(d.carrierNo).forEach(function(f) {
      pkgRows.push(`<tr class="border-t border-slate-50">
        <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${d.carrierNo}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-600 whitespace-nowrap">${f.code}</td>
        <td class="px-3 py-2 text-sm text-slate-700 whitespace-nowrap">${f.name}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-500 text-right whitespace-nowrap">${formatFileUnit(f.size)}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-400 break-all">${f.path}</td>
        <td class="px-3 py-2 text-right whitespace-nowrap"><button onclick="browsePkg(event, '${f.code}')" class="text-slate-500 hover:text-ink">浏览</button></td>
      </tr>`);
    });
  });
  const pkgTable = pkgRows.length
    ? pkgRows.join("")
    : `<tr><td colspan="6" class="px-3 py-10 text-center text-xs text-slate-400"><i data-lucide="inbox" class="w-7 h-7 mx-auto mb-2 text-slate-300"></i><div>暂无关联信息包</div></td></tr>`;

  return `
  <div class="flex items-center gap-2 mb-3">
    <div class="w-1 h-4 rounded bg-primary"></div>
    <span class="text-sm font-semibold text-ink">出库信息</span>
  </div>
  <div class="grid grid-cols-2 gap-x-6 gap-y-4 mb-5">
    ${dtKV("出库单号", '<span class="font-num">' + r.id + '</span>')}
    ${dtKV("出库时间", '<span class="font-num">' + r.outboundTime + '</span>')}
    ${dtKV("出库人", r.outboundUser)}
    ${dtKV("出库盘数", '<span class="font-num">' + r.discCount + ' 张</span>')}
    ${dtKV("归还时间", r.returnTime ? '<span class="font-num">' + r.returnTime + '</span>' : '<span class="text-slate-300">未归还</span>')}
    ${dtKV("归还人", r.returnUser || '<span class="text-slate-300">—</span>')}
  </div>
  <div class="flex items-center gap-2 mb-3">
    <div class="w-1 h-4 rounded bg-primary"></div>
    <span class="text-sm font-semibold text-ink">数据详情</span>
    <span class="text-xs text-slate-400">（光盘清单 · 共 ${discs.length} 张）</span>
  </div>
  <div class="border border-slate-100 rounded-lg overflow-hidden mb-5">
    <table class="w-full text-left text-xs">
      <thead><tr class="bg-slate-50/80 text-slate-500"><th class="px-3 py-2 font-medium">载体编号</th><th class="px-3 py-2 font-medium">载体位置</th><th class="px-3 py-2 font-medium text-right">包大小</th></tr></thead>
      <tbody>${discsRows}</tbody>
    </table>
  </div>
  <div class="flex items-center gap-2 mb-3">
    <div class="w-1 h-4 rounded bg-primary"></div>
    <span class="text-sm font-semibold text-ink">信息包清单</span>
    <span class="text-xs text-slate-400">（共 ${pkgRows.length} 个信息包）</span>
  </div>
  <div class="border border-slate-100 rounded-lg overflow-hidden">
    <table class="w-full text-left text-xs">
      <thead><tr class="bg-slate-50/80 text-slate-500"><th class="px-3 py-2 font-medium">载体编号</th><th class="px-3 py-2 font-medium">档号</th><th class="px-3 py-2 font-medium">信息包名称</th><th class="px-3 py-2 font-medium text-right">大小</th><th class="px-3 py-2 font-medium">路径</th><th class="px-3 py-2 font-medium text-right">操作</th></tr></thead>
      <tbody>${pkgTable}</tbody>
    </table>
  </div>`;
}

function openOutboundDetail(id) {
  const r = OUTBOUND_RECORDS.find(function(x) { return x.id === id; });
  if (!r) return;
  document.getElementById("obDetailBody").innerHTML = outboundDetailBodyHTML(r);
  const m = document.getElementById("obDetailModal");
  m.classList.remove("hidden"); m.classList.add("flex");
  lucide.createIcons();
}
function closeOutboundDetail() {
  const m = document.getElementById("obDetailModal");
  m.classList.add("hidden"); m.classList.remove("flex");
}
