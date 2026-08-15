/* ===== 系统设置 · 载体管理 / 任务管理 ===== */

/* ============ 载体管理 ============ */

const CARRIER_DISK = [
  { id:"DK-001", name:"主存储池-硬盘01", code:"HD-MAIN-01", savePath:"/storage/main/disk01", saveType:"正本", totalSize:640, useSize:462, usable:1 },
  { id:"DK-002", name:"主存储池-硬盘02", code:"HD-MAIN-02", savePath:"/storage/main/disk02", saveType:"副本", totalSize:640, useSize:388, usable:1 },
  { id:"DK-003", name:"备份存储池-硬盘01", code:"HD-BAK-01", savePath:"/storage/backup/disk01", saveType:"正本", totalSize:640, useSize:388, usable:1 },
  { id:"DK-004", name:"备份存储池-硬盘02", code:"HD-BAK-02", savePath:"/storage/backup/disk02", saveType:"副本", totalSize:640, useSize:256, usable:1 },
  { id:"DK-005", name:"归档存储池-硬盘01", code:"HD-ARC-01", savePath:"/storage/archive/disk01", saveType:"正本", totalSize:800, useSize:521, usable:1 },
  { id:"DK-006", name:"归档存储池-硬盘02", code:"HD-ARC-02", savePath:"/storage/archive/disk02", saveType:"副本", totalSize:800, useSize:498, usable:0 },
];

const CARRIER_OPTICAL = [
  { id:"OC-001", name:"光盘库A-主柜", ip:"192.168.10.21", port:"8080", username:"admin", savePath:"/optical/libraryA", usable:1, vendor:"宏宇光存", totalSlots:200, usedSlots:142 },
  { id:"OC-002", name:"光盘库B-副柜", ip:"192.168.10.22", port:"8080", username:"admin", savePath:"/optical/libraryB", usable:1, vendor:"宏宇光存", totalSlots:200, usedSlots:87 },
];

const CARRIER_TAPE = [
  { id:"TP-001", name:"磁带库Alpha", ip:"192.168.20.31", port:"3494", username:"tapeuser", usable:1, vendor:"IBM", drives:4, tapes:120 },
  { id:"TP-002", name:"磁带库Beta", ip:"192.168.20.32", port:"3494", username:"tapeuser", usable:0, vendor:"IBM", drives:2, tapes:60 },
];

let carrierTab = "disk";
let carrierFilter = { keyword:"", usable:"" };
let carrierSelected = new Set();

function carrierHTML() {
  const tabs = [["disk","硬盘库","hard-drive"],["optical","光盘库","disc"],["tape","磁带库","cassette-tape"]];
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex items-center gap-1 p-4 border-b border-slate-100">
        ${tabs.map(t => `<button onclick="switchCarrierTab('${t[0]}')" class="px-4 py-2 rounded-lg text-sm border transition-all ${carrierTab===t[0]?'bg-primary text-white border-primary font-medium':'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'} flex items-center gap-2"><i data-lucide="${t[2]}" class="w-4 h-4"></i>${t[1]}</button>`).join("")}
      </div>
      ${carrierFilterBarHTML()}
      ${carrierTableHTML()}
      ${carrierPaginationHTML()}
    </div>
  </div>
  ${carrierFormModalHTML()}`;
}

function carrierFilterBarHTML() {
  const usableOpts = [["","全部状态"],["1","启用"],["0","停用"]];
  return `
  <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
    <button onclick="openCarrierForm()" class="btn-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>新增</button>
    <button id="carrierBatchDel" onclick="batchDeleteCarrier()" class="btn-ghost px-3 py-2 rounded-lg text-sm text-red-600 flex items-center gap-1.5 border border-red-100 hover:bg-red-50"><i data-lucide="trash-2" class="w-4 h-4"></i>批量删除</button>
    <span id="carrierSelInfo" class="text-xs text-slate-400"></span>
    <div class="ml-auto flex flex-wrap items-center gap-3">
      <select class="field px-3 py-2 text-sm" onchange="carrierFilter.usable=this.value; renderCarrierRows()">
        ${usableOpts.map(o => `<option value="${o[0]}" ${carrierFilter.usable===o[0]?'selected':''}>${o[1]}</option>`).join("")}
      </select>
      <div class="relative">
        <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
        <input class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="请输入名称" oninput="carrierFilter.keyword=this.value; renderCarrierRows()" value="${carrierFilter.keyword}" />
      </div>
      <button onclick="carrierFilter={keyword:'',usable:''}; renderCarrierRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
    </div>
  </div>`;
}

function carrierTableHTML() {
  if (carrierTab === "disk") {
    return `
  <div class="overflow-x-auto">
    <table class="w-full text-left" style="min-width:960px">
      <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
        <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
        <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="carrierAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleCarrierAll(this.checked)" /></th>
        <th class="px-3 py-2 font-medium">名称</th>
        <th class="px-3 py-2 font-medium">硬盘编码</th>
        <th class="px-3 py-2 font-medium">保存位置</th>
        <th class="px-3 py-2 font-medium">保存类型</th>
        <th class="px-3 py-2 font-medium">总容量</th>
        <th class="px-3 py-2 font-medium">已用容量</th>
        <th class="px-3 py-2 font-medium">启用</th>
        <th class="px-3 py-2 font-medium text-right">操作</th>
      </tr></thead>
      <tbody id="carrierBody"></tbody>
    </table>
  </div>
  <div id="carrierEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无数据</div></div>`;
  }
  if (carrierTab === "optical") {
    return `
  <div class="overflow-x-auto">
    <table class="w-full text-left" style="min-width:960px">
      <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
        <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
        <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="carrierAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleCarrierAll(this.checked)" /></th>
        <th class="px-3 py-2 font-medium">名称</th>
        <th class="px-3 py-2 font-medium">IP地址</th>
        <th class="px-3 py-2 font-medium">端口</th>
        <th class="px-3 py-2 font-medium">用户名</th>
        <th class="px-3 py-2 font-medium">卷池目录</th>
        <th class="px-3 py-2 font-medium">槽位使用</th>
        <th class="px-3 py-2 font-medium">启用</th>
        <th class="px-3 py-2 font-medium text-right">操作</th>
      </tr></thead>
      <tbody id="carrierBody"></tbody>
    </table>
  </div>
  <div id="carrierEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无数据</div></div>`;
  }
  return `
  <div class="overflow-x-auto">
    <table class="w-full text-left" style="min-width:880px">
      <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
        <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
        <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="carrierAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleCarrierAll(this.checked)" /></th>
        <th class="px-3 py-2 font-medium">名称</th>
        <th class="px-3 py-2 font-medium">IP地址</th>
        <th class="px-3 py-2 font-medium">端口</th>
        <th class="px-3 py-2 font-medium">用户名</th>
        <th class="px-3 py-2 font-medium">磁带机</th>
        <th class="px-3 py-2 font-medium">磁带数</th>
        <th class="px-3 py-2 font-medium">启用</th>
        <th class="px-3 py-2 font-medium text-right">操作</th>
      </tr></thead>
      <tbody id="carrierBody"></tbody>
    </table>
  </div>
  <div id="carrierEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无数据</div></div>`;
}

function carrierPaginationHTML() {
  return `<div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="carrierInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>`;
}

function currentCarrierList() {
  const kw = carrierFilter.keyword.trim().toLowerCase();
  let list = carrierTab === "disk" ? CARRIER_DISK : (carrierTab === "optical" ? CARRIER_OPTICAL : CARRIER_TAPE);
  if (carrierFilter.usable) list = list.filter(c => String(c.usable) === carrierFilter.usable);
  if (kw) list = list.filter(c => c.name.toLowerCase().indexOf(kw) >= 0);
  return list;
}

function renderCarrierRows() {
  const list = currentCarrierList();
  const body = document.getElementById("carrierBody");
  const empty = document.getElementById("carrierEmpty");
  const info = document.getElementById("carrierInfo");
  if (!body) return;
  syncCarrierAll();
  if (!list.length) { body.innerHTML=""; empty.classList.remove("hidden"); if(info) info.textContent="共 0 条"; if(document.getElementById("carrierSelInfo")) document.getElementById("carrierSelInfo").textContent=""; lucide.createIcons(); return; }
  empty.classList.add("hidden");
  let rows;
  if (carrierTab === "disk") {
    rows = list.map(function(c, idx){
      const pct = Math.round(c.useSize / c.totalSize * 100);
      return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
        <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
        <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${c.id}" onchange="toggleCarrierSelect('${c.id}',this.checked)" ${carrierSelected.has(c.id)?'checked':''} /></td>
        <td class="px-3 py-2 text-sm text-ink font-medium">${c.name}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-500">${c.code}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-400 max-w-[180px] truncate" title="${c.savePath}">${c.savePath}</td>
        <td class="px-3 py-2"><span class="tag ${c.saveType==='正本'?'bg-blue-50 text-blue-700':'bg-slate-100 text-slate-600'}">${c.saveType}</span></td>
        <td class="px-3 py-2 font-num text-xs text-slate-600">${c.totalSize} GB</td>
        <td class="px-3 py-2">
          <div class="flex items-center gap-2">
            <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full ${pct>80?'bg-red-500':pct>60?'bg-amber-500':'bg-emerald-500'} rounded-full" style="width:${pct}%"></div></div>
            <span class="font-num text-xs text-slate-500 w-14 text-right">${c.useSize} GB</span>
          </div>
        </td>
        <td class="px-3 py-2">
          <button onclick="toggleCarrierUsable('${c.id}')" class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${c.usable?'bg-primary':'bg-slate-300'} cursor-pointer">
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${c.usable?'translate-x-4':'translate-x-0.5'}"></span>
          </button>
        </td>
        <td class="px-3 py-3 text-right text-xs whitespace-nowrap">
          <button onclick="editCarrier('${c.id}')" class="text-secondary hover:text-primary">修改</button>
          <button onclick="deleteCarrier('${c.id}')" class="text-red-500 hover:text-red-700 ml-2">删除</button>
        </td>
      </tr>`;
    }).join("");
  } else if (carrierTab === "optical") {
    rows = list.map(function(c, idx){
      const pct = Math.round(c.usedSlots / c.totalSlots * 100);
      return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
        <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
        <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${c.id}" onchange="toggleCarrierSelect('${c.id}',this.checked)" ${carrierSelected.has(c.id)?'checked':''} /></td>
        <td class="px-3 py-2 text-sm text-ink font-medium">${c.name}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-500">${c.ip}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-500">${c.port}</td>
        <td class="px-3 py-2 text-sm text-slate-600">${c.username}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-400">${c.savePath}</td>
        <td class="px-3 py-2">
          <div class="flex items-center gap-2">
            <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-primary rounded-full" style="width:${pct}%"></div></div>
            <span class="font-num text-xs text-slate-500 w-16 text-right">${c.usedSlots}/${c.totalSlots}</span>
          </div>
        </td>
        <td class="px-3 py-2">
          <button onclick="toggleCarrierUsable('${c.id}')" class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${c.usable?'bg-primary':'bg-slate-300'} cursor-pointer">
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${c.usable?'translate-x-4':'translate-x-0.5'}"></span>
          </button>
        </td>
        <td class="px-3 py-3 text-right text-xs whitespace-nowrap">
          <button onclick="editCarrier('${c.id}')" class="text-secondary hover:text-primary">修改</button>
          <button onclick="deleteCarrier('${c.id}')" class="text-red-500 hover:text-red-700 ml-2">删除</button>
        </td>
      </tr>`;
    }).join("");
  } else {
    rows = list.map(function(c, idx){
      return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
        <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
        <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${c.id}" onchange="toggleCarrierSelect('${c.id}',this.checked)" ${carrierSelected.has(c.id)?'checked':''} /></td>
        <td class="px-3 py-2 text-sm text-ink font-medium">${c.name}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-500">${c.ip}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-500">${c.port}</td>
        <td class="px-3 py-2 text-sm text-slate-600">${c.username}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-600 text-center">${c.drives} 台</td>
        <td class="px-3 py-2 font-num text-xs text-slate-600 text-center">${c.tapes} 盘</td>
        <td class="px-3 py-2">
          <button onclick="toggleCarrierUsable('${c.id}')" class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${c.usable?'bg-primary':'bg-slate-300'} cursor-pointer">
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${c.usable?'translate-x-4':'translate-x-0.5'}"></span>
          </button>
        </td>
        <td class="px-3 py-3 text-right text-xs whitespace-nowrap">
          <button onclick="editCarrier('${c.id}')" class="text-secondary hover:text-primary">修改</button>
          <button onclick="deleteCarrier('${c.id}')" class="text-red-500 hover:text-red-700 ml-2">删除</button>
        </td>
      </tr>`;
    }).join("");
  }
  body.innerHTML = rows;
  if (info) info.textContent = "共 " + list.length + " 条";
  const si = document.getElementById("carrierSelInfo");
  if (si) si.textContent = carrierSelected.size ? "已选 " + carrierSelected.size + " 项" : "";
  lucide.createIcons();
}

function switchCarrierTab(t) { carrierTab = t; carrierSelected.clear(); rerenderCarrier(); }
function toggleCarrierSelect(id, checked) { if (checked) carrierSelected.add(id); else carrierSelected.delete(id); renderCarrierRows(); }
function toggleCarrierAll(checked) { const list = currentCarrierList(); if (checked) list.forEach(c => carrierSelected.add(c.id)); else list.forEach(c => carrierSelected.delete(c.id)); renderCarrierRows(); }
function syncCarrierAll() { const all = document.getElementById("carrierAll"); if (!all) return; const list = currentCarrierList(); if (!list.length) { all.checked=false; all.indeterminate=false; return; } const sel = list.filter(c => carrierSelected.has(c.id)).length; all.checked = sel === list.length; all.indeterminate = sel > 0 && sel < list.length; }

function toggleCarrierUsable(id) {
  let arr = carrierTab==="disk"?CARRIER_DISK:(carrierTab==="optical"?CARRIER_OPTICAL:CARRIER_TAPE);
  const c = arr.find(x => x.id === id); if (!c) return;
  c.usable = c.usable ? 0 : 1;
  toast(c.usable ? "已启用" : "已停用", "success");
  renderCarrierRows();
}

function deleteCarrier(id) {
  let arr = carrierTab==="disk"?CARRIER_DISK:(carrierTab==="optical"?CARRIER_OPTICAL:CARRIER_TAPE);
  const idx = arr.findIndex(x => x.id === id);
  if (idx >= 0) arr.splice(idx, 1);
  carrierSelected.delete(id);
  toast("删除成功", "success");
  renderCarrierRows();
}

function batchDeleteCarrier() {
  if (!carrierSelected.size) { toast("请选择要删除的数据","warn"); return; }
  let arr = carrierTab==="disk"?CARRIER_DISK:(carrierTab==="optical"?CARRIER_OPTICAL:CARRIER_TAPE);
  for (const id of carrierSelected) {
    const idx = arr.findIndex(x => x.id === id);
    if (idx >= 0) arr.splice(idx, 1);
  }
  const n = carrierSelected.size;
  carrierSelected.clear();
  toast("删除成功（" + n + " 项）","success");
  renderCarrierRows();
}

/* ---- 载体表单弹窗（简化版） ---- */
let carrierFormMode = "add";
let carrierFormId = "";

function carrierFormModalHTML() {
  return `
  <div id="carrierFormModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeCarrierForm()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5"><div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="edit-3" class="w-5 h-5 text-primary"></i></div><h3 class="text-sm font-semibold text-ink" id="carrierFormTitle">新增</h3></div>
        <button onclick="closeCarrierForm()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-5 py-4">
        <div id="carrierFormBody" class="space-y-4"></div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button onclick="closeCarrierForm()" class="btn-ghost px-4 py-2 rounded-lg text-sm">关闭</button>
        <button onclick="saveCarrierForm()" class="btn-primary px-4 py-2 rounded-lg text-sm">保存</button>
      </div>
    </div>
  </div>`;
}

function openCarrierForm() { carrierFormMode = "add"; carrierFormId = ""; showCarrierForm(); }
function editCarrier(id) { carrierFormMode = "edit"; carrierFormId = id; showCarrierForm(); }

function showCarrierForm() {
  document.getElementById("carrierFormTitle").textContent = (carrierFormMode==="add"?"新增":"修改") + (carrierTab==="disk"?"硬盘库":(carrierTab==="optical"?"光盘库":"磁带库"));
  let fields = "";
  if (carrierTab === "disk") {
    const c = carrierFormMode==="edit" ? CARRIER_DISK.find(x=>x.id===carrierFormId) : {name:"",code:"",savePath:"",saveType:"正本",totalSize:"",useSize:"",usable:1};
    fields = `
      <div><label class="text-xs text-slate-500 mb-1 block">名称</label><input class="field w-full px-3 py-2 text-sm" id="cf_name" value="${c.name}" placeholder="请输入名称" /></div>
      <div><label class="text-xs text-slate-500 mb-1 block">硬盘编码</label><input class="field w-full px-3 py-2 text-sm" id="cf_code" value="${c.code}" placeholder="请输入硬盘编码" /></div>
      <div><label class="text-xs text-slate-500 mb-1 block">保存位置</label><input class="field w-full px-3 py-2 text-sm" id="cf_savePath" value="${c.savePath}" placeholder="请选择路径" /></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs text-slate-500 mb-1 block">保存类型</label><select class="field w-full px-3 py-2 text-sm" id="cf_saveType"><option value="正本" ${c.saveType==='正本'?'selected':''}>正本</option><option value="副本" ${c.saveType==='副本'?'selected':''}>副本</option></select></div>
        <div><label class="text-xs text-slate-500 mb-1 block">总容量 (GB)</label><input class="field w-full px-3 py-2 text-sm" id="cf_totalSize" value="${c.totalSize}" type="number" /></div>
      </div>
      <div><label class="text-xs text-slate-500 mb-1 block">已用容量 (GB)</label><input class="field w-full px-3 py-2 text-sm" id="cf_useSize" value="${c.useSize}" type="number" /></div>`;
  } else if (carrierTab === "optical") {
    const c = carrierFormMode==="edit" ? CARRIER_OPTICAL.find(x=>x.id===carrierFormId) : {name:"",ip:"",port:"",username:"",savePath:"",vendor:"宏宇光存",usable:1};
    fields = `
      <div><label class="text-xs text-slate-500 mb-1 block">名称</label><input class="field w-full px-3 py-2 text-sm" id="cf_name" value="${c.name}" placeholder="请输入名称" /></div>
      <div><label class="text-xs text-slate-500 mb-1 block">供应商</label><select class="field w-full px-3 py-2 text-sm" id="cf_vendor"><option>宏宇光存</option><option>其他</option></select></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs text-slate-500 mb-1 block">IP地址</label><input class="field w-full px-3 py-2 text-sm font-num" id="cf_ip" value="${c.ip}" placeholder="请输入光盘存储系统IP" /></div>
        <div><label class="text-xs text-slate-500 mb-1 block">端口</label><input class="field w-full px-3 py-2 text-sm font-num" id="cf_port" value="${c.port}" placeholder="请输入端口" /></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs text-slate-500 mb-1 block">用户名</label><input class="field w-full px-3 py-2 text-sm" id="cf_username" value="${c.username}" placeholder="请输入用户名" /></div>
        <div><label class="text-xs text-slate-500 mb-1 block">密码</label><input class="field w-full px-3 py-2 text-sm" type="password" placeholder="请输入密码" /></div>
      </div>
      <div><label class="text-xs text-slate-500 mb-1 block">卷池目录</label><input class="field w-full px-3 py-2 text-sm font-num" id="cf_savePath" value="${c.savePath}" placeholder="请输入卷池目录" /></div>`;
  } else {
    const c = carrierFormMode==="edit" ? CARRIER_TAPE.find(x=>x.id===carrierFormId) : {name:"",ip:"",port:"",username:"",vendor:"IBM",drives:"",tapes:"",usable:1};
    fields = `
      <div><label class="text-xs text-slate-500 mb-1 block">名称</label><input class="field w-full px-3 py-2 text-sm" id="cf_name" value="${c.name}" placeholder="请输入名称" /></div>
      <div><label class="text-xs text-slate-500 mb-1 block">供应商</label><select class="field w-full px-3 py-2 text-sm" id="cf_vendor"><option>IBM</option><option>其他</option></select></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs text-slate-500 mb-1 block">IP地址</label><input class="field w-full px-3 py-2 text-sm font-num" id="cf_ip" value="${c.ip}" placeholder="请输入磁带存储系统IP" /></div>
        <div><label class="text-xs text-slate-500 mb-1 block">端口</label><input class="field w-full px-3 py-2 text-sm font-num" id="cf_port" value="${c.port}" placeholder="请输入端口" /></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="text-xs text-slate-500 mb-1 block">用户名</label><input class="field w-full px-3 py-2 text-sm" id="cf_username" value="${c.username}" placeholder="请输入用户名" /></div>
        <div><label class="text-xs text-slate-500 mb-1 block">磁带机数量</label><input class="field w-full px-3 py-2 text-sm" id="cf_drives" type="number" value="${c.drives}" /></div>
      </div>
      <div><label class="text-xs text-slate-500 mb-1 block">磁带数量</label><input class="field w-full px-3 py-2 text-sm" id="cf_tapes" type="number" value="${c.tapes}" /></div>`;
  }
  document.getElementById("carrierFormBody").innerHTML = fields;
  const m = document.getElementById("carrierFormModal");
  m.classList.remove("hidden"); m.classList.add("flex");
  lucide.createIcons();
}

function saveCarrierForm() {
  const name = document.getElementById("cf_name").value;
  if (!name) { toast("请输入名称","warn"); return; }
  let arr = carrierTab==="disk"?CARRIER_DISK:(carrierTab==="optical"?CARRIER_OPTICAL:CARRIER_TAPE);
  if (carrierFormMode === "add") {
    const newItem = { id: "CR-" + Date.now(), name, usable: 1 };
    if (carrierTab === "disk") {
      newItem.code = document.getElementById("cf_code").value;
      newItem.savePath = document.getElementById("cf_savePath").value;
      newItem.saveType = document.getElementById("cf_saveType").value;
      newItem.totalSize = parseInt(document.getElementById("cf_totalSize").value) || 0;
      newItem.useSize = parseInt(document.getElementById("cf_useSize").value) || 0;
    } else if (carrierTab === "optical") {
      newItem.ip = document.getElementById("cf_ip").value;
      newItem.port = document.getElementById("cf_port").value;
      newItem.username = document.getElementById("cf_username").value;
      newItem.savePath = document.getElementById("cf_savePath").value;
      newItem.vendor = document.getElementById("cf_vendor").value;
      newItem.totalSlots = 200; newItem.usedSlots = 0;
    } else {
      newItem.ip = document.getElementById("cf_ip").value;
      newItem.port = document.getElementById("cf_port").value;
      newItem.username = document.getElementById("cf_username").value;
      newItem.vendor = document.getElementById("cf_vendor").value;
      newItem.drives = parseInt(document.getElementById("cf_drives").value) || 0;
      newItem.tapes = parseInt(document.getElementById("cf_tapes").value) || 0;
    }
    arr.unshift(newItem);
  } else {
    const c = arr.find(x => x.id === carrierFormId);
    if (c) {
      c.name = name;
      if (carrierTab === "disk") {
        c.code = document.getElementById("cf_code").value;
        c.savePath = document.getElementById("cf_savePath").value;
        c.saveType = document.getElementById("cf_saveType").value;
        c.totalSize = parseInt(document.getElementById("cf_totalSize").value) || 0;
        c.useSize = parseInt(document.getElementById("cf_useSize").value) || 0;
      } else if (carrierTab === "optical") {
        c.ip = document.getElementById("cf_ip").value;
        c.port = document.getElementById("cf_port").value;
        c.username = document.getElementById("cf_username").value;
        c.savePath = document.getElementById("cf_savePath").value;
        c.vendor = document.getElementById("cf_vendor").value;
      } else {
        c.ip = document.getElementById("cf_ip").value;
        c.port = document.getElementById("cf_port").value;
        c.username = document.getElementById("cf_username").value;
        c.vendor = document.getElementById("cf_vendor").value;
        c.drives = parseInt(document.getElementById("cf_drives").value) || 0;
        c.tapes = parseInt(document.getElementById("cf_tapes").value) || 0;
      }
    }
  }
  closeCarrierForm();
  toast("保存成功","success");
  renderCarrierRows();
}

function closeCarrierForm() { const m = document.getElementById("carrierFormModal"); m.classList.add("hidden"); m.classList.remove("flex"); }

function rerenderCarrier() {
  document.getElementById("view").innerHTML = carrierHTML();
  lucide.createIcons();
  renderCarrierRows();
}

/* ============ 任务管理 ============ */

const TASK_STRATEGY_TYPES = [
  { key:"encapsulation", label:"封装策略", icon:"package" },
  { key:"backup", label:"备份策略", icon:"save" },
  { key:"inspection", label:"巡检策略", icon:"search-check" },
  { key:"sincerity", label:"四性检测策略", icon:"file-check" },
  { key:"restore", label:"恢复策略", icon:"rotate-ccw" },
  { key:"monitor", label:"介质监控策略", icon:"activity" },
];

const TASK_DATA = {
  encapsulation: [
    { id:"TASK-ENC-001", name:"每天-文书自动封装", strategy:"封装策略", pkgSize:"4 GB", createdTime:"2026-07-15 10:30", lastRunTime:"2026-08-12 02:00", lastStatus:"success", nextRunTime:"2026-08-13 02:00", status:"running" },
    { id:"TASK-ENC-002", name:"每周一-声像封装备份", strategy:"封装策略", pkgSize:"10 GB", createdTime:"2026-06-20 14:20", lastRunTime:"2026-08-11 03:00", lastStatus:"success", nextRunTime:"2026-08-18 03:00", status:"running" },
    { id:"TASK-ENC-003", name:"每月-政务服务归档包封装", strategy:"封装策略", pkgSize:"2 GB", createdTime:"2026-05-10 09:15", lastRunTime:"2026-08-01 00:00", lastStatus:"failed", nextRunTime:"2026-09-01 00:00", status:"running" },
    { id:"TASK-ENC-004", name:"每天-科技档案封装", strategy:"封装策略", pkgSize:"5 GB", createdTime:"2026-04-01 11:00", lastRunTime:"-", lastStatus:"-", nextRunTime:"-", status:"stopped" },
  ],
  backup: [
    { id:"TASK-BAK-001", name:"每日增量备份", strategy:"备份策略", backupType:"硬盘", createdTime:"2026-01-10 10:00", lastRunTime:"2026-08-12 01:30", lastStatus:"success", nextRunTime:"2026-08-13 01:30", status:"running" },
    { id:"TASK-BAK-002", name:"每周全量备份", strategy:"备份策略", backupType:"硬盘+光盘", createdTime:"2026-01-15 14:30", lastRunTime:"2026-08-11 02:00", lastStatus:"success", nextRunTime:"2026-08-18 02:00", status:"running" },
    { id:"TASK-BAK-003", name:"每月磁带归档备份", strategy:"备份策略", backupType:"磁带", createdTime:"2026-02-20 16:00", lastRunTime:"2026-08-01 00:00", lastStatus:"success", nextRunTime:"2026-09-01 00:00", status:"running" },
  ],
  inspection: [
    { id:"TASK-INS-001", name:"每小时全量巡检", strategy:"巡检策略", checkType:"全量巡检", createdTime:"2026-03-01 08:00", lastRunTime:"2026-08-12 17:00", lastStatus:"success", nextRunTime:"2026-08-12 18:00", status:"running" },
    { id:"TASK-INS-002", name:"每周抽样巡检", strategy:"巡检策略", checkType:"抽样巡检 (10%)", createdTime:"2026-04-15 10:00", lastRunTime:"2026-08-10 04:00", lastStatus:"success", nextRunTime:"2026-08-17 04:00", status:"running" },
    { id:"TASK-INS-003", name:"每天-文书巡检", strategy:"巡检策略", checkType:"全量巡检", createdTime:"2026-05-20 09:30", lastRunTime:"2026-08-12 05:00", lastStatus:"failed", nextRunTime:"2026-08-13 05:00", status:"running" },
  ],
  sincerity: [
    { id:"TASK-SIN-001", name:"每日四性检测", strategy:"四性检测策略", createdTime:"2026-02-10 10:00", lastRunTime:"2026-08-12 03:30", lastStatus:"success", nextRunTime:"2026-08-13 03:30", status:"running" },
    { id:"TASK-SIN-002", name:"每周专项检测", strategy:"四性检测策略", createdTime:"2026-03-05 14:00", lastRunTime:"2026-08-09 02:00", lastStatus:"success", nextRunTime:"2026-08-16 02:00", status:"running" },
  ],
  restore: [
    { id:"TASK-RES-001", name:"定期恢复演练-月度", strategy:"恢复策略", firstSource:"主存储池", secondSource:"备份存储池", createdTime:"2026-01-20 11:00", lastRunTime:"2026-08-05 06:00", lastStatus:"success", nextRunTime:"2026-09-05 06:00", status:"running" },
    { id:"TASK-RES-002", name:"季度全量恢复测试", strategy:"恢复策略", firstSource:"主存储池", secondSource:"磁带库", createdTime:"2026-02-01 08:00", lastRunTime:"2026-06-15 02:00", lastStatus:"success", nextRunTime:"2026-09-15 02:00", status:"stopped" },
  ],
  monitor: [
    { id:"TASK-MON-001", name:"硬盘容量监控", strategy:"介质监控策略", carrierType:"硬盘库", firstThreshold:"80%", secondThreshold:"90%", createdTime:"2026-01-10 10:00", lastRunTime:"2026-08-12 18:00", lastStatus:"success", nextRunTime:"2026-08-12 19:00", status:"running" },
    { id:"TASK-MON-002", name:"光盘库运行监控", strategy:"介质监控策略", carrierType:"光盘库", firstThreshold:"50%", secondThreshold:"80%", createdTime:"2026-03-20 14:30", lastRunTime:"2026-08-12 18:00", lastStatus:"success", nextRunTime:"2026-08-12 19:00", status:"running" },
    { id:"TASK-MON-003", name:"磁带库容量预警", strategy:"介质监控策略", carrierType:"磁带库", firstThreshold:"70%", secondThreshold:"90%", createdTime:"2026-04-01 09:00", lastRunTime:"2026-08-12 18:00", lastStatus:"success", nextRunTime:"2026-08-12 19:00", status:"running" },
  ],
};

const TASK_STATUS = { running:"运行中", stopped:"停止" };
const TASK_STATUS_CLS = { running:"bg-emerald-50 text-emerald-700", stopped:"bg-slate-100 text-slate-500" };
const TASK_LAST = { success:"正常", failed:"异常", "-":"-" };
const TASK_LAST_CLS = { success:"text-emerald-600", failed:"text-red-600", "-":"text-slate-400" };

let taskTab = "encapsulation";
let taskFilter = { keyword:"", status:"" };
let taskSelected = new Set();

function taskHTML() {
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex items-center gap-1 p-4 border-b border-slate-100 flex-wrap">
        ${TASK_STRATEGY_TYPES.map(t => `<button onclick="switchTaskTab('${t.key}')" class="px-3.5 py-2 rounded-lg text-sm transition-all ${taskTab===t.key?'bg-primary text-white font-medium':'text-slate-600 hover:bg-slate-50'} flex items-center gap-1.5"><i data-lucide="${t.icon}" class="w-4 h-4"></i>${t.label}</button>`).join("")}
      </div>
      ${taskFilterBarHTML()}
      ${taskTableHTML()}
      ${carrierPaginationHTML().replace("carrierInfo","taskInfo").replace("carrier","task")}
    </div>
  </div>`;
}

function taskFilterBarHTML() {
  return `
  <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
    <button onclick="openTaskForm()" class="btn-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>新增任务</button>
    <span id="taskSelInfo" class="text-xs text-slate-400"></span>
    <div class="ml-auto flex flex-wrap items-center gap-3">
      <select class="field px-3 py-2 text-sm" onchange="taskFilter.status=this.value; renderTaskRows()">
        <option value="">全部状态</option>
        <option value="running" ${taskFilter.status==='running'?'selected':''}>运行中</option>
        <option value="stopped" ${taskFilter.status==='stopped'?'selected':''}>停止</option>
      </select>
      <div class="relative">
        <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
        <input class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="请输入任务名称" oninput="taskFilter.keyword=this.value; renderTaskRows()" value="${taskFilter.keyword}" />
      </div>
      <button onclick="taskFilter={keyword:'',status:''}; renderTaskRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
    </div>
  </div>`;
}

function taskTableHTML() {
  const t = TASK_STRATEGY_TYPES.find(x => x.key === taskTab);
  const cols = t ? taskColumns(taskTab) : [];
  const headCols = cols.map(c => `<th class="px-3 py-2 font-medium">${c.label}</th>`).join("");
  return `
  <div class="overflow-x-auto">
    <table class="w-full text-left" style="min-width:1080px">
      <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
        <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
        <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="taskAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleTaskAll(this.checked)" /></th>
        ${headCols}
        <th class="px-3 py-2 font-medium">上次运行时间</th>
        <th class="px-3 py-2 font-medium">上次运行结果</th>
        <th class="px-3 py-2 font-medium">下次运行时间</th>
        <th class="px-3 py-2 font-medium">状态</th>
        <th class="px-3 py-2 font-medium text-right">操作</th>
      </tr></thead>
      <tbody id="taskBody"></tbody>
    </table>
  </div>
  <div id="taskEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无任务</div></div>`;
}

function taskColumns(tab) {
  const base = [
    { key:"name", label:"任务名称" },
  ];
  switch (tab) {
    case "encapsulation": return [...base, {key:"pkgSize",label:"封装容量"}];
    case "backup": return [...base, {key:"backupType",label:"备份类型"}];
    case "inspection": return [...base, {key:"checkType",label:"巡检类型"}];
    case "sincerity": return [...base];
    case "restore": return [...base, {key:"firstSource",label:"优先恢复数据源"}];
    case "monitor": return [...base, {key:"carrierType",label:"载体类型"}, {key:"firstThreshold",label:"第一级阈值"}];
    default: return base;
  }
}

function taskCell(tab, item, key) {
  switch (key) {
    case "name": return `<span class="text-sm text-ink font-medium">${item.name}</span>`;
    case "pkgSize": return `<span class="font-num text-xs text-slate-600">${item.pkgSize}</span>`;
    case "backupType": return `<span class="tag bg-blue-50 text-blue-700">${item.backupType}</span>`;
    case "checkType": return `<span class="text-sm text-slate-600">${item.checkType}</span>`;
    case "firstSource": return `<span class="text-sm text-slate-600">${item.firstSource} <span class="text-slate-400">→</span> ${item.secondSource}</span>`;
    case "carrierType": return `<span class="text-sm text-slate-600">${item.carrierType}</span>`;
    case "firstThreshold": return `<span class="font-num text-xs text-slate-600">${item.firstThreshold} / ${item.secondThreshold}</span>`;
    default: return `<span class="text-sm text-slate-600">${item[key]||"-"}</span>`;
  }
}

function renderTaskRows() {
  const list = currentTaskList();
  const body = document.getElementById("taskBody");
  const empty = document.getElementById("taskEmpty");
  const info = document.getElementById("taskInfo");
  if (!body) return;
  syncTaskAll();
  if (!list.length) { body.innerHTML=""; empty.classList.remove("hidden"); if(info) info.textContent="共 0 条"; if(document.getElementById("taskSelInfo")) document.getElementById("taskSelInfo").textContent=""; lucide.createIcons(); return; }
  empty.classList.add("hidden");
  const cols = taskColumns(taskTab);
  body.innerHTML = list.map(function(item, idx){
    const lastCls = TASK_LAST_CLS[item.lastStatus] || "text-slate-400";
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${item.id}" onchange="toggleTaskSelect('${item.id}',this.checked)" ${taskSelected.has(item.id)?'checked':''} /></td>
      ${cols.map(c => `<td class="px-3 py-2">${taskCell(taskTab,item,c.key)}</td>`).join("")}
      <td class="px-3 py-2 font-num text-xs text-slate-500 whitespace-nowrap">${item.lastRunTime}</td>
      <td class="px-3 py-2"><span class="${lastCls} text-sm">${TASK_LAST[item.lastStatus] || item.lastStatus}</span></td>
      <td class="px-3 py-2 font-num text-xs text-slate-500 whitespace-nowrap">${item.nextRunTime}</td>
      <td class="px-3 py-2"><span class="tag ${TASK_STATUS_CLS[item.status]}">${TASK_STATUS[item.status]}</span></td>
      <td class="px-3 py-3 text-right text-xs whitespace-nowrap">
        <button onclick="runTaskOnce('${item.id}')" class="text-secondary hover:text-primary">执行</button>
        <button onclick="toggleTaskStatus('${item.id}')" class="text-primary hover:text-blue-700 ml-2">${item.status==='running'?'停止':'启用'}</button>
        <button onclick="viewTaskLog('${item.id}')" class="text-slate-500 hover:text-ink ml-2">日志</button>
        <button onclick="deleteTask('${item.id}')" class="text-red-500 hover:text-red-700 ml-2">删除</button>
      </td>
    </tr>`;
  }).join("");
  if (info) info.textContent = "共 " + list.length + " 条";
  const si = document.getElementById("taskSelInfo");
  if (si) si.textContent = taskSelected.size ? "已选 " + taskSelected.size + " 项" : "";
  lucide.createIcons();
}

function currentTaskList() {
  const kw = taskFilter.keyword.trim().toLowerCase();
  let list = TASK_DATA[taskTab] || [];
  if (taskFilter.status) list = list.filter(t => t.status === taskFilter.status);
  if (kw) list = list.filter(t => t.name.toLowerCase().indexOf(kw) >= 0);
  return list;
}

function switchTaskTab(t) { taskTab = t; taskSelected.clear(); rerenderTask(); }
function toggleTaskSelect(id, checked) { if (checked) taskSelected.add(id); else taskSelected.delete(id); renderTaskRows(); }
function toggleTaskAll(checked) { const list = currentTaskList(); if (checked) list.forEach(t => taskSelected.add(t.id)); else list.forEach(t => taskSelected.delete(t.id)); renderTaskRows(); }
function syncTaskAll() { const all = document.getElementById("taskAll"); if (!all) return; const list = currentTaskList(); if (!list.length) { all.checked=false; all.indeterminate=false; return; } const sel = list.filter(t => taskSelected.has(t.id)).length; all.checked = sel === list.length; all.indeterminate = sel > 0 && sel < list.length; }

function toggleTaskStatus(id) {
  const arr = TASK_DATA[taskTab] || [];
  const t = arr.find(x => x.id === id); if (!t) return;
  t.status = t.status === "running" ? "stopped" : "running";
  toast(t.status==="running"?"任务已启用":"任务已停止", "success");
  renderTaskRows();
}

function runTaskOnce(id) {
  const arr = TASK_DATA[taskTab] || [];
  const t = arr.find(x => x.id === id); if (!t) return;
  toast("任务执行中...","info");
  setTimeout(function(){
    t.lastStatus = "success";
    const now = new Date(), p = n => String(n).padStart(2,"0");
    t.lastRunTime = now.getFullYear()+"-"+p(now.getMonth()+1)+"-"+p(now.getDate())+" "+p(now.getHours())+":"+p(now.getMinutes());
    renderTaskRows();
    toast("任务执行成功","success");
  }, 1500);
}

function viewTaskLog(id) {
  toast("查看运行日志（功能待实现）","info");
}

function deleteTask(id) {
  const arr = TASK_DATA[taskTab] || [];
  const idx = arr.findIndex(x => x.id === id);
  if (idx >= 0) arr.splice(idx, 1);
  taskSelected.delete(id);
  toast("删除成功","success");
  renderTaskRows();
}

function openTaskForm() { toast("新增任务（功能待实现）","info"); }

function rerenderTask() {
  document.getElementById("view").innerHTML = taskHTML();
  lucide.createIcons();
  renderTaskRows();
}
/* ============ 数据字典 ============ */

const DICT_CATEGORIES = [
  { key:"system", label:"系统编码" },
  { key:"business", label:"业务编码" },
];

const DICT_SYSTEM = [
  { id:"SYS-001", name:"档案门类", code:"ARCHIVE_TYPE", hidden:0, items:[
    { id:"AT-01", name:"文书档案", code:"WS" },
    { id:"AT-02", name:"声像档案", code:"SX" },
    { id:"AT-03", name:"科技档案", code:"KJ" },
    { id:"AT-04", name:"电子文件", code:"DZ" },
    { id:"AT-05", name:"其他", code:"QT" },
  ]},
  { id:"SYS-002", name:"保存类型", code:"SAVE_TYPE", hidden:0, items:[
    { id:"ST-01", name:"正本", code:"ORIGINAL" },
    { id:"ST-02", name:"副本", code:"COPY" },
  ]},
  { id:"SYS-003", name:"存储介质", code:"MEDIA_TYPE", hidden:0, items:[
    { id:"MT-01", name:"硬盘", code:"DISK" },
    { id:"MT-02", name:"光盘", code:"OPTICAL" },
    { id:"MT-03", name:"磁带", code:"TAPE" },
  ]},
  { id:"SYS-004", name:"巡检模式", code:"INSP_MODE", hidden:0, items:[
    { id:"IM-01", name:"全量巡检", code:"FULL" },
    { id:"IM-02", name:"抽样巡检", code:"SAMPLE" },
  ]},
  { id:"SYS-005", name:"任务状态", code:"TASK_STATUS", hidden:0, items:[
    { id:"TS-01", name:"运行中", code:"RUNNING" },
    { id:"TS-02", name:"停止", code:"STOPPED" },
  ]},
  { id:"SYS-006", name:"预警级别", code:"WARN_LEVEL", hidden:0, items:[
    { id:"WL-01", name:"高", code:"HIGH" },
    { id:"WL-02", name:"中", code:"MID" },
    { id:"WL-03", name:"低", code:"LOW" },
  ]},
];

const DICT_BUSINESS = [
  { id:"BIZ-001", name:"全宗号规则", code:"FONDS_RULE", hidden:0, items:[] },
  { id:"BIZ-002", name:"档号规则", code:"ARCHIVAL_RULE", hidden:0, items:[] },
  { id:"BIZ-003", name:"数据分类", code:"DATA_CLASS", hidden:0, items:[] },
  { id:"BIZ-004", name:"密级", code:"SEC_LEVEL", hidden:0, items:[] },
  { id:"BIZ-005", name:"保管期限", code:"RETENTION", hidden:0, items:[] },
];

let dictCategory = "system";
let dictKeyword = "";
let dictActiveId = "SYS-001";

function dictHTML() {
  const list = dictCategory === "system" ? DICT_SYSTEM : DICT_BUSINESS;
  const filtered = list.filter(d => !dictKeyword || d.name.toLowerCase().indexOf(dictKeyword.toLowerCase()) >= 0 || d.code.toLowerCase().indexOf(dictKeyword.toLowerCase()) >= 0);
  const active = list.find(d => d.id === dictActiveId) || list[0];
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="grid grid-cols-12 gap-4">
      <div class="card overflow-hidden col-span-12 md:col-span-4 xl:col-span-3">
        <div class="flex items-center gap-2 p-3 border-b border-slate-100">
          <div class="flex bg-slate-100 rounded-lg p-0.5 w-full">
            ${DICT_CATEGORIES.map(c => `<button onclick="switchDictCategory('${c.key}')" class="flex-1 px-3 py-1.5 rounded-md text-xs transition-colors ${dictCategory===c.key?'bg-white text-primary font-medium shadow-sm':'text-slate-600'}">${c.label}</button>`).join("")}
          </div>
        </div>
        <div class="p-2 border-b border-slate-100">
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"></i>
            <input class="field pl-8 pr-3 py-1.5 text-xs w-full" placeholder="快速搜索" oninput="dictKeyword=this.value; renderDictList()" value="${dictKeyword}" />
          </div>
        </div>
        <div class="max-h-[560px] overflow-y-auto" id="dictList">
          ${filtered.map(d => `
            <div onclick="selectDict('${d.id}')" class="flex items-center gap-2 px-3 py-2.5 cursor-pointer rounded-lg mx-1 mb-0.5 transition-colors ${dictActiveId===d.id?'bg-primary/10 text-primary':'hover:bg-slate-50 text-slate-700'}">
              <i data-lucide="${d.items.length?'folder':'file-text'}" class="w-4 h-4 shrink-0 ${dictActiveId===d.id?'text-primary':'text-slate-400'}"></i>
              <div class="min-w-0 flex-1">
                <div class="text-sm truncate">${d.name}</div>
                <div class="text-[11px] text-slate-400 font-num truncate">${d.code}</div>
              </div>
              <span class="text-[11px] text-slate-400 shrink-0">${d.items.length} 项</span>
            </div>
          `).join("")}
          ${filtered.length === 0 ? '<div class="py-10 text-center text-sm text-slate-400">暂无匹配的编码</div>' : ""}
        </div>
        <div class="p-3 border-t border-slate-100">
          <button onclick="openDictForm()" class="w-full btn-primary px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>新增</button>
        </div>
      </div>

      <div class="card overflow-hidden col-span-12 md:col-span-8 xl:col-span-9">
        <div class="flex items-center justify-between p-4 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <div class="w-1 h-4 rounded bg-primary"></div>
            <span class="text-sm font-semibold text-ink">编码项设置</span>
            ${active ? `<span class="text-xs text-slate-400">${active.name}（${active.code}）</span>` : ""}
          </div>
          ${active && active.items.length ? `<button onclick="toggleDictHidden('${active.id}')" class="text-xs text-secondary hover:text-primary">${active.hidden?"开启显示":"隐藏显示"}</button>` : ""}
        </div>
        ${active ? (active.items.length ? `
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
              <th class="px-4 py-3 font-medium w-12 text-center">序号</th>
              <th class="px-4 py-3 font-medium">编码项名称</th>
              <th class="px-4 py-3 font-medium">编码项值</th>
              <th class="px-4 py-3 font-medium">备注</th>
              <th class="px-4 py-3 font-medium">显示</th>
              <th class="px-4 py-3 font-medium text-right">操作</th>
            </tr></thead>
            <tbody>
              ${active.items.map(function(it,idx){
                return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                  <td class="px-4 py-3 text-center text-xs text-slate-400 font-num">${idx+1}</td>
                  <td class="px-4 py-3 text-sm text-ink">${it.name}</td>
                  <td class="px-4 py-3 font-num text-xs text-slate-600">${it.code}</td>
                  <td class="px-4 py-3 text-sm text-slate-500">${it.remark||"-"}</td>
                  <td class="px-4 py-3"><span class="tag bg-emerald-50 text-emerald-700">显示</span></td>
                  <td class="px-4 py-3 text-right text-xs whitespace-nowrap">
                    <button class="text-secondary hover:text-primary">修改</button>
                    <button class="text-red-500 hover:text-red-700 ml-2">删除</button>
                  </td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>` : `
        <div class="py-16 text-center">
          <div class="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
            <i data-lucide="folder-open" class="w-6 h-6 text-slate-300"></i>
          </div>
          <div class="text-sm text-slate-500 mb-1">请选择编码后查看编码项</div>
          <div class="text-xs text-slate-400">${dictCategory==='business'?"业务编码无需设置编码项":"该编码暂无编码项数据"}</div>
        </div>`) : `
        <div class="py-16 text-center text-sm text-slate-400">请选择一个编码</div>`}
      </div>
    </div>
  </div>`;
}

function switchDictCategory(c) {
  dictCategory = c;
  const list = c === "system" ? DICT_SYSTEM : DICT_BUSINESS;
  dictActiveId = list[0]?.id || "";
  rerenderDict();
}

function selectDict(id) {
  dictActiveId = id;
  rerenderDict();
}

function toggleDictHidden(id) {
  const list = dictCategory === "system" ? DICT_SYSTEM : DICT_BUSINESS;
  const d = list.find(x => x.id === id); if (!d) return;
  d.hidden = d.hidden ? 0 : 1;
  toast(d.hidden ? "已隐藏显示" : "已开启显示", "success");
  rerenderDict();
}

function openDictForm() { toast("新增编码（功能待实现）","info"); }

function renderDictList() { rerenderDict(); }

function rerenderDict() {
  document.getElementById("view").innerHTML = dictHTML();
  lucide.createIcons();
}

/* ============ 存储管理 ============ */

const STORAGE_LIST = [
  { id:"STG-001", storageName:"主存储池", storageLocation:"/storage/main", dataClass:"主存储", remark:"系统主数据存储池，承载在线访问数据" },
  { id:"STG-002", storageName:"备份存储池", storageLocation:"/storage/backup", dataClass:"备份存储", remark:"定时备份目标存储池" },
  { id:"STG-003", storageName:"归档存储池", storageLocation:"/storage/archive", dataClass:"归档存储", remark:"冷数据归档长期保存" },
  { id:"STG-004", storageName:"异灾存储池", storageLocation:"/storage/disaster", dataClass:"容灾存储", remark:"异地容灾备份存储" },
  { id:"STG-005", storageName:"光盘存储", storageLocation:"/optical/libraryA", dataClass:"其他存储", remark:"光盘库A柜离线存储" },
];

let storageFilter = { keyword:"", dataClass:"" };
let storageSelected = new Set();

function storageHTML() {
  const classes = [...new Set(STORAGE_LIST.map(s => s.dataClass))];
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <button onclick="openStorageForm()" class="btn-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>新增</button>
        <span id="storageSelInfo" class="text-xs text-slate-400"></span>
        <div class="ml-auto flex flex-wrap items-center gap-3">
          <select class="field px-3 py-2 text-sm" onchange="storageFilter.dataClass=this.value; renderStorageRows()">
            <option value="">全部数据分类</option>
            ${classes.map(c => `<option value="${c}" ${storageFilter.dataClass===c?'selected':''}>${c}</option>`).join("")}
          </select>
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="请输入存储名称" oninput="storageFilter.keyword=this.value; renderStorageRows()" value="${storageFilter.keyword}" />
          </div>
          <button onclick="storageFilter={keyword:'',dataClass:''}; renderStorageRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left" style="min-width:880px">
          <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
            <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
            <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="storageAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleStorageAll(this.checked)" /></th>
            <th class="px-3 py-2 font-medium">存储名称</th>
            <th class="px-3 py-2 font-medium">存储路径</th>
            <th class="px-3 py-2 font-medium">数据分类</th>
            <th class="px-3 py-2 font-medium">存储说明</th>
            <th class="px-3 py-2 font-medium text-right">操作</th>
          </tr></thead>
          <tbody id="storageBody"></tbody>
        </table>
      </div>
      <div id="storageEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无存储数据</div></div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="storageInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
    </div>
  </div>`;
}

function filteredStorage() {
  const q = storageFilter.keyword.trim().toLowerCase();
  return STORAGE_LIST.filter(s => {
    if (storageFilter.dataClass && s.dataClass !== storageFilter.dataClass) return false;
    if (q && s.storageName.toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
}

function renderStorageRows() {
  const list = filteredStorage();
  const body = document.getElementById("storageBody");
  const empty = document.getElementById("storageEmpty");
  const info = document.getElementById("storageInfo");
  if (!body) return;
  syncStorageAll();
  if (!list.length) { body.innerHTML=""; empty.classList.remove("hidden"); if(info) info.textContent="共 0 条"; if(document.getElementById("storageSelInfo")) document.getElementById("storageSelInfo").textContent=""; lucide.createIcons(); return; }
  empty.classList.add("hidden");
  body.innerHTML = list.map(function(s, idx){
    const classTagCls = { "主存储":"bg-blue-50 text-blue-700", "备份存储":"bg-green-50 text-emerald-700", "归档存储":"bg-violet-50 text-violet-700", "容灾存储":"bg-amber-50 text-amber-700", "其他存储":"bg-slate-100 text-slate-600" };
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${s.id}" onchange="toggleStorageSelect('${s.id}',this.checked)" ${storageSelected.has(s.id)?'checked':''} /></td>
      <td class="px-3 py-2 text-sm text-ink font-medium"><div class="flex items-center gap-2"><i data-lucide="hard-drive" class="w-4 h-4 text-primary"></i>${s.storageName}</div></td>
      <td class="px-3 py-2 font-num text-xs text-slate-500">${s.storageLocation}</td>
      <td class="px-3 py-2"><span class="tag ${classTagCls[s.dataClass] || 'bg-slate-100 text-slate-600'}">${s.dataClass}</span></td>
      <td class="px-3 py-2 text-sm text-slate-500 max-w-[280px] truncate" title="${s.remark}">${s.remark||"-"}</td>
      <td class="px-3 py-3 text-right text-xs whitespace-nowrap">
        <button onclick="editStorage('${s.id}')" class="text-secondary hover:text-primary">修改</button>
        <button onclick="deleteStorage('${s.id}')" class="text-red-500 hover:text-red-700 ml-2">删除</button>
      </td>
    </tr>`;
  }).join("");
  if (info) info.textContent = "共 " + list.length + " 条";
  const si = document.getElementById("storageSelInfo");
  if (si) si.textContent = storageSelected.size ? "已选 " + storageSelected.size + " 项" : "";
  lucide.createIcons();
}

function toggleStorageSelect(id, checked) { if (checked) storageSelected.add(id); else storageSelected.delete(id); renderStorageRows(); }
function toggleStorageAll(checked) { const list = filteredStorage(); if (checked) list.forEach(s => storageSelected.add(s.id)); else list.forEach(s => storageSelected.delete(s.id)); renderStorageRows(); }
function syncStorageAll() { const all = document.getElementById("storageAll"); if (!all) return; const list = filteredStorage(); if (!list.length) { all.checked=false; all.indeterminate=false; return; } const sel = list.filter(s => storageSelected.has(s.id)).length; all.checked = sel === list.length; all.indeterminate = sel > 0 && sel < list.length; }

function deleteStorage(id) {
  const idx = STORAGE_LIST.findIndex(x => x.id === id);
  if (idx >= 0) STORAGE_LIST.splice(idx, 1);
  storageSelected.delete(id);
  toast("删除成功","success");
  renderStorageRows();
}

function editStorage(id) { toast("修改存储（功能待实现）","info"); }
function openStorageForm() { toast("新增存储（功能待实现）","info"); }
/* ============ 检测设置（说明页） ============ */
function detectionSettingHTML() {
  return `
  <div class="p-6 animate-fade-in">
    <div class="card p-8 max-w-2xl mx-auto mt-8">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <i data-lucide="sliders-horizontal" class="w-6 h-6 text-primary"></i>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-ink">检测设置</h2>
          <p class="text-xs text-slate-400 mt-0.5">四性检测方案配置</p>
        </div>
      </div>
      <div class="rounded-lg bg-blue-50/60 border border-blue-100 p-5 flex gap-3">
        <i data-lucide="info" class="w-5 h-5 text-primary shrink-0 mt-0.5"></i>
        <div class="text-sm text-slate-600 leading-relaxed">
          本模块与其他系统的四性检测模块功能一致，仅检测环节由原"归档环节"改为<span class="text-primary font-medium">长久保存环节</span>。
          包含真实性、完整性、可用性、安全性四项检测的方案配置、检测规则与执行策略。
        </div>
      </div>
      <div class="mt-5 grid grid-cols-2 gap-4">
        <div class="rounded-lg border border-slate-100 p-4 bg-slate-50/50">
          <div class="text-xs text-slate-400 mb-1">检测环节</div>
          <div class="text-sm font-medium text-ink">长久保存环节</div>
        </div>
        <div class="rounded-lg border border-slate-100 p-4 bg-slate-50/50">
          <div class="text-xs text-slate-400 mb-1">检测维度</div>
          <div class="text-sm font-medium text-ink">真实 · 完整 · 可用 · 安全</div>
        </div>
      </div>
    </div>
  </div>`;
}