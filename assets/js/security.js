/* ===== 安全中心 · 数据巡检 / 系统预警 ===== */

/* 系统当前数据仅为信息包，巡检对象固定为信息包 */
const INSP_TYPES = [
  { key:"package", label:"信息包", icon:"archive", count:18, desc:"信息包结构与内容巡检" }
];

const INSP_STATUS = { running:"巡检中", stop:"巡检停止", done:"巡检完成" };
const INSP_STATUS_CLS = { running:"bg-blue-50 text-blue-700", stop:"bg-amber-50 text-amber-700", done:"bg-emerald-50 text-emerald-700" };
const INSP_MODE = { smart:"智能巡检", manual:"手动巡检", sample:"抽样巡检" };

let inspTab = "package";
let inspSampleRate = 10;
let inspInspecting = false;
let inspProgress = 0;
let inspFilter = { mode:"", status:"", keyword:"" };
let inspSelected = new Set();

const INSPECTION_RECORDS = [
  { id:"INS-20260812-001", createdTime:"2026-08-12 09:00", checkFileType:"信息包", checkType:"smart", dataClassificationName:"文书档案", shouldCount:1284, hasCount:1284, normalCount:1282, abnormalCount:2, status:"done", elapsedTime:"00:12:35", details:[
    { packageName:"2026年度文书档案（第3批）", packagePath:"/长久保存/信息包/2026年度/文书档案/", fileName:"发文_2026_0312.pdf", filePath:"/2026年度文书档案（第3批）/发文/", checkResult:"异常", processStatus:"已转入恢复", originalChecksum:"41e42a490dc90a65803afdb12818764601e3168323855d24e15b08697d0198df", currentChecksum:"30fe6ca45719d0182604449de190b817751efcb6de5863514f0d2d7ba4e77fa1" },
    { packageName:"2026年度文书档案（第3批）", packagePath:"/长久保存/信息包/2026年度/文书档案/", fileName:"批复_007.pdf", filePath:"/2026年度文书档案（第3批）/批复/", checkResult:"异常", processStatus:"已转入恢复", originalChecksum:"99ceb6dda00689f376840e25c34f7d277712f614665f74acec2114205154366c", currentChecksum:"ff0ad0de41b8a839575197af770146e9ce5b76e832cfca39096b2618836fb3c4" },
    { packageName:"2026年度文书档案（第2批）", packagePath:"/长久保存/信息包/2026年度/文书档案/", fileName:"登记表_汇总.xlsx", filePath:"/2026年度文书档案（第2批）/登记表/", checkResult:"正常", processStatus:"-", originalChecksum:"ed64ac6b1c241722d2bc9812beeae696547f0a9314c89a38f9804e73369069aa", currentChecksum:"ed64ac6b1c241722d2bc9812beeae696547f0a9314c89a38f9804e73369069aa" }
  ]},
  { id:"INS-20260812-002", createdTime:"2026-08-12 08:30", checkFileType:"信息包", checkType:"smart", dataClassificationName:"声像档案", shouldCount:368, hasCount:368, normalCount:367, abnormalCount:1, status:"done", elapsedTime:"00:05:12", details:[
    { packageName:"科研项目声像档案包A2087", packagePath:"/长久保存/信息包/2026年度/声像档案/", fileName:"现场影像_03.mp4", filePath:"/科研项目声像档案包A2087/影像/", checkResult:"异常", processStatus:"已转入恢复", originalChecksum:"b4e86a7fb4c12154c8090b76e7d4e16f77036ab61918c7aa5d056eeb71f70125", currentChecksum:"84d8c90522610e141e8780b50401a30320da50c6e098e0ceac6beab957c4f712" }
  ]},
  { id:"INS-20260812-003", createdTime:"2026-08-12 08:10", checkFileType:"信息包", checkType:"smart", dataClassificationName:"科技档案", shouldCount:458, hasCount:312, normalCount:0, abnormalCount:0, status:"running", elapsedTime:"-", details:[] },
  { id:"INS-20260811-004", createdTime:"2026-08-11 16:20", checkFileType:"信息包", checkType:"sample", dataClassificationName:"电子文件", shouldCount:5421, hasCount:5421, normalCount:5419, abnormalCount:2, status:"done", elapsedTime:"00:48:20", details:[
    { packageName:"不动产登记电子档案（第二批）", packagePath:"/长久保存/信息包/2026年度/", fileName:"登记表_0451.pdf", filePath:"/不动产登记电子档案（第二批）/登记/", checkResult:"异常", processStatus:"已转入恢复", originalChecksum:"4fe66444b91be026497c81861e4198ed5ecf10406e89c1746d7544cae2523bf1", currentChecksum:"2f3e877f971c807c125e052ecfd678b543cf303a8b4049810803255089ebc2f9" },
    { packageName:"不动产登记电子档案（第二批）", packagePath:"/长久保存/信息包/2026年度/", fileName:"权证_0892.pdf", filePath:"/不动产登记电子档案（第二批）/权证/", checkResult:"异常", processStatus:"已转入恢复", originalChecksum:"7bb5d7dc2097e9c2745d90210cea838768e19aada1b5b9bd247f00db041e8106", currentChecksum:"fb9ee838b825a0993681853f4fe12ab01f11e2134ab400dd83fa9fe7dba833e5" }
  ]},
  { id:"INS-20260811-005", createdTime:"2026-08-11 14:00", checkFileType:"信息包", checkType:"manual", dataClassificationName:"文书档案", shouldCount:1076, hasCount:642, normalCount:0, abnormalCount:0, status:"stop", elapsedTime:"00:08:30", details:[] },
  { id:"INS-20260810-006", createdTime:"2026-08-10 10:15", checkFileType:"信息包", checkType:"smart", dataClassificationName:"文书档案", shouldCount:8452, hasCount:8452, normalCount:8450, abnormalCount:2, status:"done", elapsedTime:"01:15:08", details:[
    { packageName:"政务服务电子文件归档包", packagePath:"/长久保存/信息包/", fileName:"审批表_122.pdf", filePath:"/政务服务电子文件归档包/审批/", checkResult:"异常", processStatus:"已转入恢复", originalChecksum:"01632279ec70e21aad782f227ef3261a23413d444cd83b9893d232b464bdabe1", currentChecksum:"9d872f93c0bc0bf4f9fba9459b29e18d7a7af3c42cb811a8b1cf880b79e36919" },
    { packageName:"政务服务电子文件归档包", packagePath:"/长久保存/信息包/", fileName:"回执_088.pdf", filePath:"/政务服务电子文件归档包/回执/", checkResult:"异常", processStatus:"已转入恢复", originalChecksum:"f1eff8d95a0aa725e1ff966432b75e2ae0994283a4aa4b2119552a7d56358e11", currentChecksum:"1ec6be6414cc39c2ca06cebf6ef6e555031fda9963b7b3c1752a24b5b2c180de" }
  ]},
  { id:"INS-20260810-007", createdTime:"2026-08-10 09:00", checkFileType:"信息包", checkType:"sample", dataClassificationName:"声像档案", shouldCount:642, hasCount:642, normalCount:640, abnormalCount:2, status:"done", elapsedTime:"00:08:45", details:[
    { packageName:"城市规划声像档案2016-2020", packagePath:"/长久保存/信息包/专题归档/", fileName:"勘察照片_117.jpg", filePath:"/城市规划声像档案2016-2020/勘察/", checkResult:"异常", processStatus:"已转入恢复", originalChecksum:"cc0ee3c652d39bae96cc537b36899e7e10dac7c2c250a6f57f730d3e731c1840", currentChecksum:"b9c7ba0cdd1cb8e5414b8b34c64c5a3aa08f3f2fa663169d288aa37c452231e2" }
  ]},
  { id:"INS-20260809-008", createdTime:"2026-08-09 15:30", checkFileType:"信息包", checkType:"smart", dataClassificationName:"科技档案", shouldCount:231, hasCount:180, normalCount:0, abnormalCount:0, status:"running", elapsedTime:"-", details:[] }
];


function inspectionHTML() {
  const prog = inspInspecting ? inspProgress : 100;
  return `
  <div class="p-6 space-y-5 animate-fade-in">
    <div class="card overflow-hidden relative">
      <div class="absolute right-0 top-0 w-[420px] h-full pointer-events-none overflow-hidden">
        <div class="absolute -right-20 top-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full opacity-[0.06] bg-gradient-to-br from-primary to-secondary"></div>
        <div class="absolute -right-10 top-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border-2 border-primary/10"></div>
        <div class="absolute right-10 top-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border-2 border-primary/15"></div>
        <div class="absolute right-28 top-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full border-2 border-secondary/20"></div>
        <div class="absolute right-[138px] top-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm flex items-center justify-center">
          <i data-lucide="shield-check" class="w-8 h-8 text-primary"></i>
        </div>
        <svg class="absolute right-0 top-0 h-full opacity-[0.08]" viewBox="0 0 200 400" fill="none"><circle cx="100" cy="200" r="180" stroke="currentColor" stroke-dasharray="4 8" class="text-primary"/><circle cx="100" cy="200" r="140" stroke="currentColor" stroke-dasharray="3 6" class="text-secondary"/><circle cx="100" cy="200" r="100" stroke="currentColor" stroke-dasharray="2 4" class="text-primary"/></svg>
      </div>
      <div class="p-6 relative z-10">
        <div class="mb-5">
          <div class="text-2xl font-bold text-ink mb-1">定期巡检，清除风险</div>
          <div class="text-sm text-slate-500">通过自动化巡检机制，实时监测数据完整性与可用性</div>
        </div>

        ${inspInspecting ? `
        <div class="mb-6">
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span class="text-slate-500">巡检进度</span>
            <span class="font-num text-primary font-medium">${prog}%</span>
          </div>
          <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300" style="width:${prog}%"></div>
          </div>
        </div>` : ""}

        <div class="flex items-center gap-8 flex-wrap">
          <div class="flex items-center gap-3 flex-wrap">
            <button onclick="openInspSmart()" ${inspInspecting?'disabled':''} class="btn-primary px-8 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-secondary border-0">
              <i data-lucide="cpu" class="w-4 h-4"></i>智能巡检
            </button>
            <button onclick="openInspManual()" ${inspInspecting?'disabled':''} class="btn-primary px-8 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-primary/25">
              <i data-lucide="scan-line" class="w-4 h-4"></i>手动巡检
            </button>
            <button onclick="startSampleInspection()" ${inspInspecting?'disabled':''} class="btn-primary px-8 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-primary/25 bg-gradient-to-r from-secondary to-primary border-0">
              <i data-lucide="pie-chart" class="w-4 h-4"></i>抽样巡检
            </button>
            ${inspInspecting ? `
            <button onclick="stopInspectionProcess()" class="px-8 py-3 rounded-xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-2">
              <i data-lucide="square" class="w-4 h-4"></i>停止巡检
            </button>` : ""}
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-3 whitespace-nowrap">
              <span class="text-sm text-slate-600 w-16 shrink-0">抽样比例：</span>
              <div class="flex items-center gap-0 border border-slate-200 rounded-lg overflow-hidden">
                <button onclick="adjustSample(-5)" ${inspInspecting?'disabled':''} class="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"><i data-lucide="minus" class="w-3.5 h-3.5"></i></button>
                <input type="text" class="w-14 h-8 text-center text-sm border-0 border-x border-slate-200 focus:outline-none font-num" value="${inspSampleRate}" onchange="setSampleRate(this.value)" />
                <button onclick="adjustSample(5)" ${inspInspecting?'disabled':''} class="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"><i data-lucide="plus" class="w-3.5 h-3.5"></i></button>
                <span class="px-3 text-sm text-slate-500">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    ${inspectionRecordsHTML()}
  </div>
  ${inspectionDetailModalHTML()}
  ${inspManualModalHTML()}
  ${inspSmartModalHTML()}`;
}

function inspectionRecordsHTML() {
  const modes = [["smart","智能巡检"],["manual","手动巡检"],["sample","抽样巡检"]];
  const statuses = [["running","巡检中"],["stop","巡检停止"],["done","巡检完成"]];
  return `
  <div class="card overflow-hidden">
    <div class="flex items-center gap-3 p-4 border-b border-slate-100">
      <div class="text-sm font-semibold text-ink">巡检记录</div>
      <div class="ml-auto flex flex-wrap items-center gap-3">
        <select class="field px-3 py-2 text-sm" onchange="inspFilter.mode=this.value; renderInspectionRows()">
          <option value="">全部巡检模式</option>
          ${modes.map(m => `<option value="${m[0]}" ${inspFilter.mode===m[0]?'selected':''}>${m[1]}</option>`).join("")}
        </select>
        <select class="field px-3 py-2 text-sm" onchange="inspFilter.status=this.value; renderInspectionRows()">
          <option value="">全部巡检状态</option>
          ${statuses.map(s => `<option value="${s[0]}" ${inspFilter.status===s[0]?'selected':''}>${s[1]}</option>`).join("")}
        </select>
        <div class="relative">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input type="text" class="field pl-9 pr-3 py-2 text-sm w-52" placeholder="请输入巡检范围" oninput="inspFilter.keyword=this.value; renderInspectionRows()" value="${inspFilter.keyword}" />
        </div>
        <button onclick="inspFilter={mode:'',status:'',keyword:''}; renderInspectionRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left" style="min-width:1080px">
        <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
          <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
          <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="inspAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleInspAll(this.checked)" /></th>
          <th class="px-3 py-2 font-medium">巡检时间</th>
          <th class="px-3 py-2 font-medium">巡检对象</th>
          <th class="px-3 py-2 font-medium">巡检模式</th>
          <th class="px-3 py-2 font-medium">巡检范围</th>
          <th class="px-3 py-2 font-medium text-right">应巡检数量</th>
          <th class="px-3 py-2 font-medium text-right">已巡检数量</th>
          <th class="px-3 py-2 font-medium text-right">正常</th>
          <th class="px-3 py-2 font-medium text-right">异常</th>
          <th class="px-3 py-2 font-medium">巡检状态</th>
          <th class="px-3 py-2 font-medium">用时</th>
          <th class="px-3 py-2 font-medium text-right">操作</th>
        </tr></thead>
        <tbody id="inspBody"></tbody>
      </table>
    </div>
    <div id="inspEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无巡检记录</div></div>
    <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="inspInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
  </div>`;
}

function adjustSample(delta) {
  inspSampleRate = Math.max(1, Math.min(100, inspSampleRate + delta));
  rerenderInspection();
}
function setSampleRate(v) {
  const n = parseInt(v) || 10;
  inspSampleRate = Math.max(1, Math.min(100, n));
  rerenderInspection();
}

let __inspTimer = null;
/* 本次巡检检测的信息包数量（null 表示按巡检类型默认全量） */
let inspScopeCount = null;
function startSampleInspection() {
  startInspectionProcess("sample");
}
function startInspectionProcess(mode, scopeCount) {
  inspScopeCount = scopeCount || null;
  inspInspecting = true;
  inspProgress = 0;
  rerenderInspection();
  const extra = inspScopeCount ? "，本次检测 " + inspScopeCount + " 个信息包" : "";
  toast((mode==="sample"?"抽样巡检":"手动巡检")+"已启动"+extra,"info");
  if (__inspTimer) clearInterval(__inspTimer);
  __inspTimer = setInterval(function() {
    inspProgress += 5;
    if (inspProgress >= 100) {
      inspProgress = 100;
      clearInterval(__inspTimer);
      __inspTimer = null;
      setTimeout(function() {
        inspInspecting = false;
        const t = INSP_TYPES.find(t => t.key === inspTab);
        const total = inspScopeCount || (t ? t.count : 63);
        inspScopeCount = null;
        const newRec = {
          id:"INS-NEW-"+Date.now(),
          createdTime:(function(){const d=new Date(),p=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes());})(),
          checkFileType: t?t.label:"",
          checkType: mode,
          dataClassificationName: "馆藏",
          shouldCount: total,
          hasCount: total,
          normalCount: total - 1,
          abnormalCount: 1,
          status:"done",
          elapsedTime:"00:"+String(Math.floor(10+Math.random()*20)).padStart(2,"0")+":"+String(Math.floor(Math.random()*60)).padStart(2,"0"),
          details:[]
        };
        INSPECTION_RECORDS.unshift(newRec);
        rerenderInspection();
        toast("巡检完成，发现 1 项异常","warn");
      }, 300);
    } else {
      rerenderInspection();
    }
  }, 200);
}
function stopInspectionProcess() {
  if (__inspTimer) { clearInterval(__inspTimer); __inspTimer = null; }
  inspInspecting = false;
  inspScopeCount = null;
  rerenderInspection();
  toast("巡检已停止","warn");
}

function rerenderInspection() {
  document.getElementById("view").innerHTML = inspectionHTML();
  lucide.createIcons();
  renderInspectionRows();
}

/* ---- 系统预警 · 预警分类 ---- */
const WARN_CATEGORIES = [
  { key:"media", label:"介质异常", icon:"hard-drive" },
  { key:"data", label:"数据异常", icon:"file-warning" },
  { key:"system", label:"系统异常", icon:"server-cog" }
];

/* 各类别预警数据 */
const WARNING_DATA = {
  media: [
    { id:"WM-20260812-001", carrierNo:"GD-2026-0044", time:"2026-08-12 08:30", desc:"载体无法读取", handle:"manual" },
    { id:"WM-20260812-002", carrierNo:"GD-2026-0045", time:"2026-08-12 08:15", desc:"载体无法读取", handle:"done" },
    { id:"WM-20260811-003", carrierNo:"GD-2026-0050", time:"2026-08-11 16:25", desc:"载体无法读取", handle:"manual" },
    { id:"WM-20260811-004", carrierNo:"GD-2026-0052", time:"2026-08-11 14:05", desc:"载体无法读取", handle:"done" }
  ],
  data: [
    { id:"WD-20260812-001", code:"WS·2026·DQ3·008452", pkgName:"WS·2026·DQ3·008452.zip", carrierNo:"GD-2026-0052", time:"2026-08-12 08:30", desc:"信息包异常", handle:"recovered" },
    { id:"WD-20260812-002", code:"SX·2026·A2087·008451", pkgName:"SX·2026·A2087·008451.zip", carrierNo:"GD-2026-0051", time:"2026-08-12 08:15", desc:"信息包异常", handle:"pending" },
    { id:"WD-20260811-003", code:"DZ·2026·BDC·008450", pkgName:"DZ·2026·BDC·008450.zip", carrierNo:"GD-2026-0050", time:"2026-08-11 16:25", desc:"信息包异常", handle:"recovered" },
    { id:"WD-20260811-004", code:"KJ·2025·GH·008449", pkgName:"KJ·2025·GH·008449.zip", carrierNo:"GD-2026-0044", time:"2026-08-11 14:05", desc:"信息包异常", handle:"pending" }
  ],
  system: [
    { id:"WS-20260812-001", desc:"存储空间不足", time:"2026-08-12 09:12" },
    { id:"WS-20260812-002", desc:"内存不足", time:"2026-08-12 08:40" },
    { id:"WS-20260811-003", desc:"其他异常", time:"2026-08-11 16:20" }
  ]
};

let warnCategory = "media";
let customWarningCategories = [];
let warnFilter = { keyword: "" };

function warnAllCategories() { return WARN_CATEGORIES.concat(customWarningCategories); }
function warnCurrentCategory() { return warnAllCategories().find(c => c.key === warnCategory) || WARN_CATEGORIES[0]; }
function warnCategoryRecords(key) {
  if (WARNING_DATA[key]) return WARNING_DATA[key];
  const c = customWarningCategories.find(x => x.key === key);
  return c ? c.records : [];
}
function warnCategoryMatches(rec) {
  const q = warnFilter.keyword.trim().toLowerCase();
  if (!q) return true;
  return Object.keys(rec).some(function(k) { return String(rec[k]).toLowerCase().indexOf(q) >= 0; });
}

/* 处理状态标签 */
function warnHandleTag(key, handle) {
  if (key === "media") return handle === "done"
    ? '<span class="tag bg-emerald-50 text-emerald-700">已处理</span>'
    : '<span class="tag bg-red-50 text-red-700">需人工检查处理</span>';
  if (key === "data") return handle === "recovered"
    ? '<span class="tag bg-emerald-50 text-emerald-700">已恢复</span>'
    : '<span class="tag bg-amber-50 text-amber-700">未处理</span>';
  return '<span class="text-slate-300">-</span>';
}

/* 各类别列表字段 */
function warnColumns(key) {
  if (key === "media") return [
    { h:"载体编号", v: r => '<span class="font-num text-xs text-slate-600">'+r.carrierNo+'</span>' },
    { h:"预警时间", v: r => '<span class="font-num text-xs text-slate-500">'+r.time+'</span>' },
    { h:"预警说明", v: r => '<span class="text-red-600">'+r.desc+'</span>' },
    { h:"预警处理", v: r => warnHandleTag("media", r.handle) }
  ];
  if (key === "data") return [
    { h:"档号", v: r => '<span class="font-num text-xs text-slate-600">'+r.code+'</span>' },
    { h:"信息包名称", v: r => '<span class="text-sm text-ink">'+r.pkgName+'</span>' },
    { h:"载体编号", v: r => '<span class="font-num text-xs text-slate-600">'+r.carrierNo+'</span>' },
    { h:"预警时间", v: r => '<span class="font-num text-xs text-slate-500">'+r.time+'</span>' },
    { h:"预警说明", v: r => '<span class="text-red-600">'+r.desc+'</span>' },
    { h:"预警处理", v: r => warnHandleTag("data", r.handle) }
  ];
  if (key === "system") return [
    { h:"预警说明", v: r => '<span class="text-slate-700">'+r.desc+'</span>' },
    { h:"预警时间", v: r => '<span class="font-num text-xs text-slate-500">'+r.time+'</span>' }
  ];
  return [
    { h:"预警时间", v: r => '<span class="font-num text-xs text-slate-500">'+(r.time||"-")+'</span>' },
    { h:"预警说明", v: r => '<span class="text-slate-700">'+(r.desc||"-")+'</span>' }
  ];
}

function warnRowActions(key, r) {
  let a = '<button onclick="openWarningDetail(\''+r.id+'\')" class="text-secondary hover:text-primary">详情</button>';
  if (key === "media" && r.handle !== "done") a += '<span class="text-slate-200">|</span><button onclick="handleWarn(\''+key+'\',\''+r.id+'\')" class="text-emerald-600 hover:text-emerald-700">标记已处理</button>';
  return a;
}

function warningHTML() {
  const cats = warnAllCategories();
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="flex items-start gap-3">
      <div class="card w-56 shrink-0 overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-100">
          <div class="text-sm font-semibold text-ink">预警分类</div>
          <div class="text-xs text-slate-400">共 ${cats.length} 类</div>
        </div>
        <div class="p-2 space-y-1">
          ${cats.map(c => `
          <button onclick="switchWarnCategory('${c.key}')" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${warnCategory===c.key?'bg-primary/10 text-primary font-medium':'text-slate-600 hover:bg-slate-50'}">
            <i data-lucide="${c.icon}" class="w-4 h-4 shrink-0"></i>
            <span class="flex-1 text-left">${c.label}</span>
            <span class="font-num text-xs ${warnCategory===c.key?'text-primary':'text-slate-400'}">${warnCategoryRecords(c.key).length}</span>
          </button>`).join("")}
        </div>
      </div>

      <div class="flex-1 min-w-0">
        ${warnCategoryCardHTML()}
      </div>
    </div>
  </div>
  ${warningDetailModalHTML()}`;
}

function warnCategoryCardHTML() {
  const cat = warnCurrentCategory();
  const cols = warnColumns(warnCategory);
  const hasAction = warnCategory !== "system";
  return `
  <div class="card overflow-hidden">
    <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <i data-lucide="${cat.icon}" class="w-4 h-4 text-primary"></i>
        <span class="text-sm font-semibold text-ink">${cat.label}</span>
        <span class="text-xs text-slate-400">预警记录</span>
      </div>
      <div class="ml-auto flex items-center gap-3">
        <div class="relative">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input type="text" class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="搜索预警记录" oninput="warnFilter.keyword=this.value; renderWarningRows()" value="${warnFilter.keyword}" />
        </div>
        <button onclick="warnFilter={keyword:''}; renderWarningRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left" style="min-width:720px">
        <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
          <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
          ${cols.map(c => `<th class="px-3 py-2 font-medium">${c.h}</th>`).join("")}
          ${hasAction ? '<th class="px-3 py-2 font-medium text-right">操作</th>' : ""}
        </tr></thead>
        <tbody id="warnBody"></tbody>
      </table>
    </div>
    <div id="warnEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无预警记录</div></div>
    <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="warnInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
  </div>`;
}

function renderWarningRows() {
  const key = warnCategory;
  const cols = warnColumns(key);
  const hasAction = key !== "system";
  const list = warnCategoryRecords(key).filter(warnCategoryMatches);
  const body = document.getElementById("warnBody");
  const empty = document.getElementById("warnEmpty");
  const info = document.getElementById("warnInfo");
  if (!body) return;
  if (!list.length) { body.innerHTML=""; empty.classList.remove("hidden"); if(info) info.textContent="共 0 条"; lucide.createIcons(); return; }
  empty.classList.add("hidden");
  body.innerHTML = list.map(function(r, idx){
    const cells = cols.map(function(c){ return '<td class="px-3 py-2 whitespace-nowrap">'+c.v(r)+'</td>'; }).join("");
    const actions = warnRowActions(key, r);
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      ${cells}
      ${hasAction ? '<td class="px-3 py-2 text-right text-xs whitespace-nowrap">'+actions+'</td>' : ""}
    </tr>`;
  }).join("");
  if (info) info.textContent = "共 " + list.length + " 条";
  lucide.createIcons();
}

function switchWarnCategory(key) { warnCategory = key; warnFilter = { keyword: "" }; refreshWarning(); }
function handleWarn(key, id) {
  if (key !== "media") return;
  const rec = warnCategoryRecords("media").find(r => r.id === id);
  if (!rec) return;
  rec.handle = "done";
  toast("已标记为已处理", "success");
  renderWarningRows();
}
function refreshWarning() {
  const view = document.getElementById("view");
  view.innerHTML = warningHTML();
  view.scrollTop = 0;
  lucide.createIcons();
  renderWarningRows();
}

function warningDetailModalHTML() {
  return `
  <div id="warnDetailModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeWarningDetail()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5"><div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center"><i data-lucide="alert-triangle" class="w-5 h-5 text-red-500"></i></div><h3 class="text-sm font-semibold text-ink">预警详情</h3></div>
        <button onclick="closeWarningDetail()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-5 py-4" id="warnDetailBody"></div>
      <div class="flex items-center justify-end px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl"><button onclick="closeWarningDetail()" class="btn-primary px-4 py-2 rounded-lg text-sm">关闭</button></div>
    </div>
  </div>`;
}

function openWarningDetail(id) {
  const key = warnCategory;
  const r = warnCategoryRecords(key).find(x => x.id === id); if (!r) return;
  let grid;
  if (key === "media") grid = dtKV("载体编号", '<span class="font-num">'+r.carrierNo+'</span>') + dtKV("预警时间", '<span class="font-num">'+r.time+'</span>') + dtKV("预警说明", '<span class="text-red-600">'+r.desc+'</span>') + dtKV("预警处理", warnHandleTag("media", r.handle));
  else if (key === "data") grid = dtKV("档号", '<span class="font-num">'+r.code+'</span>') + dtKV("信息包名称", r.pkgName) + dtKV("载体编号", '<span class="font-num">'+r.carrierNo+'</span>') + dtKV("预警时间", '<span class="font-num">'+r.time+'</span>') + dtKV("预警说明", '<span class="text-red-600">'+r.desc+'</span>') + dtKV("预警处理", warnHandleTag("data", r.handle));
  else if (key === "system") grid = dtKV("预警说明", r.desc) + dtKV("预警时间", '<span class="font-num">'+r.time+'</span>');
  else grid = dtKV("预警时间", '<span class="font-num">'+(r.time||"-")+'</span>') + dtKV("预警说明", r.desc||"-");
  document.getElementById("warnDetailBody").innerHTML = '<div class="grid grid-cols-2 gap-x-6 gap-y-4">'+grid+'</div>';
  const m = document.getElementById("warnDetailModal"); m.classList.remove("hidden"); m.classList.add("flex"); lucide.createIcons();
}
function closeWarningDetail() { const m = document.getElementById("warnDetailModal"); m.classList.add("hidden"); m.classList.remove("flex"); }
function filteredInspection() {
  const q = inspFilter.keyword.trim().toLowerCase();
  return INSPECTION_RECORDS.filter(r => {
    if (inspFilter.mode && r.checkType !== inspFilter.mode) return false;
    if (inspFilter.status && r.status !== inspFilter.status) return false;
    if (q && r.dataClassificationName.toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
}

function renderInspectionRows() {
  const list = filteredInspection();
  const body = document.getElementById("inspBody");
  const empty = document.getElementById("inspEmpty");
  const info = document.getElementById("inspInfo");
  if (!body) return;
  syncInspAll();
  if (!list.length) { body.innerHTML=""; empty.classList.remove("hidden"); if(info) info.textContent="共 0 条"; lucide.createIcons(); return; }
  empty.classList.add("hidden");
  body.innerHTML = list.map(function(r, idx){
    const running = r.status === "running";
    const normalCls = r.normalCount > 0 ? "text-emerald-600" : "text-slate-400";
    const abnormalCls = r.abnormalCount > 0 ? "text-red-600 font-semibold" : "text-slate-400";
    const cnt = running ? "-" : r.normalCount;
    const abn = running ? "-" : r.abnormalCount;
    let actions = `<button onclick="openInspectionDetail('${r.id}')" class="text-secondary hover:text-primary">巡检明细</button>`;
    if (running) actions += `<button onclick="stopInspectionRecord('${r.id}')" class="text-amber-600 hover:text-amber-700 ml-2">停止</button>`;
    else actions += `<button onclick="restartInspectionRecord('${r.id}')" class="text-secondary hover:text-primary ml-2">重新巡检</button>`;
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${r.id}" onchange="toggleInspSelect('${r.id}',this.checked)" ${inspSelected.has(r.id)?'checked':''} /></td>
      <td class="px-3 py-2 font-num text-xs text-slate-500 whitespace-nowrap">${r.createdTime}</td>
      <td class="px-3 py-2 text-sm text-slate-600 whitespace-nowrap">${r.checkFileType}</td>
      <td class="px-3 py-2 text-sm text-slate-600 whitespace-nowrap">${INSP_MODE[r.checkType]}</td>
      <td class="px-3 py-2 text-sm text-ink whitespace-nowrap">${r.dataClassificationName}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 text-right whitespace-nowrap">${r.shouldCount.toLocaleString()}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 text-right whitespace-nowrap">${r.hasCount.toLocaleString()}</td>
      <td class="px-3 py-2 font-num text-xs ${normalCls} text-right whitespace-nowrap">${cnt}</td>
      <td class="px-3 py-2 font-num text-xs ${abnormalCls} text-right whitespace-nowrap">${abn}</td>
      <td class="px-3 py-2"><span class="tag ${INSP_STATUS_CLS[r.status]}">${INSP_STATUS[r.status]}</span></td>
      <td class="px-3 py-2 font-num text-xs text-slate-500 whitespace-nowrap">${r.elapsedTime}</td>
      <td class="px-3 py-3 text-right text-xs whitespace-nowrap">${actions}</td>
    </tr>`;
  }).join("");
  if (info) info.textContent = "共 " + list.length + " 条";
  lucide.createIcons();
}

function toggleInspSelect(id, checked) { if (checked) inspSelected.add(id); else inspSelected.delete(id); syncInspAll(); }
function toggleInspAll(checked) { const list = filteredInspection(); if (checked) list.forEach(r => inspSelected.add(r.id)); else list.forEach(r => inspSelected.delete(r.id)); renderInspectionRows(); }
function syncInspAll() { const all = document.getElementById("inspAll"); if (!all) return; const list = filteredInspection(); if (!list.length) { all.checked=false; all.indeterminate=false; return; } const sel = list.filter(r => inspSelected.has(r.id)).length; all.checked = sel === list.length; all.indeterminate = sel > 0 && sel < list.length; }

function stopInspectionRecord(id) { const r = INSPECTION_RECORDS.find(x => x.id === id); if (r) r.status = "stop"; toast("巡检已停止","warn"); renderInspectionRows(); }
function restartInspectionRecord(id) {
  const r = INSPECTION_RECORDS.find(x => x.id === id); if (!r) return;
  r.status = "running"; r.hasCount = 0; r.normalCount = 0; r.abnormalCount = 0; r.elapsedTime = "-";
  toast("巡检已启动，请稍候","info"); renderInspectionRows();
  setTimeout(function() {
    if (location.hash.indexOf("security-inspection") < 0) return;
    r.status = "done"; r.hasCount = r.shouldCount; r.normalCount = r.shouldCount; r.abnormalCount = 0; r.elapsedTime = "00:09:42";
    renderInspectionRows(); toast("巡检完成，未发现异常","success");
  }, 2500);
}

function inspectionDetailModalHTML() {
  return `
  <div id="inspDetailModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeInspectionDetail()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5"><div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="clipboard-list" class="w-5 h-5 text-primary"></i></div><h3 class="text-sm font-semibold text-ink">巡检明细</h3></div>
        <button onclick="closeInspectionDetail()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-5 py-4" id="inspDetailBody"></div>
      <div class="flex items-center justify-end gap-2 px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button onclick="downloadInspDetail()" class="btn-ghost px-3.5 py-2 rounded-lg text-sm flex items-center gap-1.5 border border-slate-200"><i data-lucide="download" class="w-3.5 h-3.5"></i>下载明细</button>
        <button onclick="closeInspectionDetail()" class="btn-primary px-4 py-2 rounded-lg text-sm">关闭</button>
      </div>
    </div>
  </div>`;
}

function inspDetailBodyHTML(r) {
  /* 明细列表只显示异常数据 */
  const abnormal = (r.details||[]).filter(function(d){ return d.checkResult === "异常"; });
  const rows = abnormal.map(function(d){
    const resCls = "bg-red-50 text-red-700";
    const procTag = '<span class="tag bg-emerald-50 text-emerald-700">已恢复</span>';
    const ori = d.originalChecksum || "-";
    const cur = d.currentChecksum || "-";
    return '<tr class="border-t border-slate-50"><td class="px-3 py-2 text-slate-700">'+d.packageName+'</td><td class="px-3 py-2 font-num text-slate-400 break-all">'+d.packagePath+'</td><td class="px-3 py-2 text-slate-700">'+d.fileName+'</td><td class="px-3 py-2 font-num text-slate-400 break-all">'+d.filePath+'</td><td class="px-3 py-2"><code class="font-num text-[10px] text-slate-500 break-all" title="'+ori+'">'+ori.slice(0,16)+'…</code></td><td class="px-3 py-2"><code class="font-num text-[10px] text-slate-500 break-all" title="'+cur+'">'+cur.slice(0,16)+'…</code></td><td class="px-3 py-2 text-center"><span class="tag '+resCls+'">'+d.checkResult+'</span></td><td class="px-3 py-2 text-center">'+procTag+'</td></tr>';
  }).join("");
  return `
  <div class="flex items-center gap-2 mb-4"><div class="w-1 h-4 rounded bg-primary"></div><span class="text-sm font-semibold text-ink">巡检结论</span></div>
  <div class="grid grid-cols-3 gap-x-6 gap-y-4 mb-5 pb-5 border-b border-slate-100">
    ${dtKV("巡检时间", '<span class="font-num">'+r.createdTime+'</span>')}
    ${dtKV("巡检对象", r.checkFileType)}
    ${dtKV("巡检模式", INSP_MODE[r.checkType])}
    ${dtKV("巡检范围", r.dataClassificationName)}
    ${dtKV("应巡检数量", '<span class="font-num">'+r.shouldCount.toLocaleString()+' 个</span>')}
    ${dtKV("已巡检数量", '<span class="font-num">'+r.hasCount.toLocaleString()+' 个</span>')}
    ${dtKV("正常", '<span class="font-num text-emerald-600">'+(r.status==="running"?"-":r.normalCount)+'</span>')}
    ${dtKV("异常", '<span class="font-num text-red-600">'+(r.status==="running"?"-":r.abnormalCount)+'</span>')}
    ${dtKV("用时", '<span class="font-num">'+r.elapsedTime+'</span>')}
  </div>
  <div class="flex items-center gap-2 mb-3"><div class="w-1 h-4 rounded bg-primary"></div><span class="text-sm font-semibold text-ink">异常明细</span><span class="text-xs text-slate-400">（${abnormal.length} 条，仅显示异常数据）</span></div>
  <div class="border border-slate-100 rounded-lg overflow-x-auto">
    <table class="w-full text-left text-xs" style="min-width:900px">
      <thead><tr class="bg-slate-50/80 text-slate-500"><th class="px-3 py-2 font-medium">包名称</th><th class="px-3 py-2 font-medium">包位置</th><th class="px-3 py-2 font-medium">文件名称</th><th class="px-3 py-2 font-medium">文件位置</th><th class="px-3 py-2 font-medium">原始校验码</th><th class="px-3 py-2 font-medium">现存校验码</th><th class="px-3 py-2 font-medium text-center">巡检结果</th><th class="px-3 py-2 font-medium text-center">处理状态</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="8" class="px-3 py-6 text-center text-slate-400">暂无异常数据</td></tr>'}</tbody>
    </table>
  </div>`;
}

/* 当前查看的巡检记录（用于下载明细） */
let inspDetailCurrent = null;

function openInspectionDetail(id) {
  const r = INSPECTION_RECORDS.find(x => x.id === id); if (!r) return;
  inspDetailCurrent = r;
  document.getElementById("inspDetailBody").innerHTML = inspDetailBodyHTML(r);
  const m = document.getElementById("inspDetailModal"); m.classList.remove("hidden"); m.classList.add("flex"); lucide.createIcons();
}
function closeInspectionDetail() { const m = document.getElementById("inspDetailModal"); m.classList.add("hidden"); m.classList.remove("flex"); }

/* 下载：将本巡检记录的全部明细导出为 Excel 兼容表格 */
function downloadInspDetail() {
  const r = inspDetailCurrent;
  if (!r) return;
  const rows = (r.details || []).map(function(d) {
    const status = d.checkResult === "异常" ? "已恢复" : (d.processStatus === "-" ? "" : d.processStatus);
    return [d.packageName, d.packagePath, d.fileName, d.filePath, d.originalChecksum || "", d.currentChecksum || "", d.checkResult, status];
  });
  if (!rows.length) { toast("暂无明细数据可导出", "warn"); return; }
  const headers = ["包名称", "包位置", "文件名称", "文件位置", "原始校验码", "现存校验码", "巡检结果", "处理状态"];
  downloadTextFile("巡检明细_" + String(r.id) + ".csv", buildCSV(headers, rows));
  toast("巡检明细已导出，共 " + rows.length + " 条", "success");
}

/* ---- 智能巡检 · 任务调度配置 ---- */
let inspSmartCfg = { startDate: "", interval: 1, unit: "day", windowStart: "", windowEnd: "", range: "full" };

function inspSmartModalHTML() {
  return `
  <div id="inspSmartModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeInspSmart()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="cpu" class="w-5 h-5 text-primary"></i></div>
          <div><h3 class="text-sm font-semibold text-ink">智能巡检</h3><div class="text-[11px] text-slate-400">任务调度配置</div></div>
        </div>
        <button onclick="closeInspSmart()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-5 py-4">
        <div class="space-y-4">
          <div>
            <div class="text-xs text-slate-400 mb-2">巡检范围</div>
            <div class="flex items-center gap-5">
              <label class="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer"><input type="radio" name="inspSmartRange" value="full" onchange="inspSmartCfg.range=this.value" class="accent-primary" />巡检全量数据</label>
              <label class="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer"><input type="radio" name="inspSmartRange" value="increment" onchange="inspSmartCfg.range=this.value" class="accent-primary" />巡检增量数据</label>
            </div>
          </div>
          <div>
            <div class="text-xs text-slate-400 mb-1.5">开始执行日期</div>
            <input type="date" id="inspStartDate" class="field px-3 py-2 text-sm w-full" />
          </div>
          <div>
            <div class="text-xs text-slate-400 mb-1.5">执行频率</div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-slate-500">每</span>
              <input type="number" id="inspInterval" min="1" value="1" class="field px-2 py-2 text-sm w-20 text-center font-num" />
              <select id="inspIntervalUnit" class="field px-3 py-2 text-sm flex-1">
                <option value="day">天</option>
                <option value="week">周</option>
                <option value="month">月</option>
                <option value="year">年</option>
              </select>
              <span class="text-sm text-slate-500 whitespace-nowrap">执行一次</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-xs text-slate-400 mb-1.5">执行窗口开始时间</div>
              <input type="time" id="inspWindowStart" class="field px-3 py-2 text-sm w-full" />
            </div>
            <div>
              <div class="text-xs text-slate-400 mb-1.5">执行窗口结束时间</div>
              <input type="time" id="inspWindowEnd" class="field px-3 py-2 text-sm w-full" />
            </div>
          </div>
          <div class="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-3 text-xs text-slate-600 leading-relaxed flex gap-2">
            <i data-lucide="info" class="w-4 h-4 text-primary shrink-0 mt-0.5"></i>
            <span>智能巡检将按配置的调度计划自动执行，任务在设定的执行窗口内运行，无需人工干预。</span>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button onclick="closeInspSmart()" class="btn-ghost px-3.5 py-2 rounded-lg text-sm border border-slate-200">取消</button>
        <button onclick="saveInspSmart()" class="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="check" class="w-3.5 h-3.5"></i>保存配置</button>
      </div>
    </div>
  </div>`;
}

function openInspSmart() {
  const m = document.getElementById("inspSmartModal");
  if (!m) return;
  const d = document.getElementById("inspStartDate"); if (d) d.value = inspSmartCfg.startDate;
  const iv = document.getElementById("inspInterval"); if (iv) iv.value = inspSmartCfg.interval;
  const un = document.getElementById("inspIntervalUnit"); if (un) un.value = inspSmartCfg.unit;
  const ws = document.getElementById("inspWindowStart"); if (ws) ws.value = inspSmartCfg.windowStart;
  const we = document.getElementById("inspWindowEnd"); if (we) we.value = inspSmartCfg.windowEnd;
  const full = document.querySelector('input[name="inspSmartRange"][value="full"]');
  const incr = document.querySelector('input[name="inspSmartRange"][value="increment"]');
  if (full) full.checked = inspSmartCfg.range !== "increment";
  if (incr) incr.checked = inspSmartCfg.range === "increment";
  m.classList.remove("hidden"); m.classList.add("flex");
  lucide.createIcons();
}
function closeInspSmart() {
  const m = document.getElementById("inspSmartModal");
  if (m) { m.classList.add("hidden"); m.classList.remove("flex"); }
}
function saveInspSmart() {
  const startDate = document.getElementById("inspStartDate").value;
  const interval = parseInt(document.getElementById("inspInterval").value, 10) || 1;
  const unit = document.getElementById("inspIntervalUnit").value;
  const ws = document.getElementById("inspWindowStart").value;
  const we = document.getElementById("inspWindowEnd").value;
  const sel = document.querySelector('input[name="inspSmartRange"]:checked');
  const range = sel ? sel.value : "full";
  if (!startDate) { toast("请选择开始执行日期", "warn"); return; }
  if (!ws || !we) { toast("请设置执行窗口的开始与结束时间", "warn"); return; }
  if (ws >= we) { toast("执行窗口结束时间需晚于开始时间", "warn"); return; }
  inspSmartCfg = { startDate: startDate, interval: interval, unit: unit, windowStart: ws, windowEnd: we, range: range };
  const unitNames = { day: "天", week: "周", month: "月", year: "年" };
  const rangeNames = { full: "巡检全量数据", increment: "巡检增量数据" };
  toast("智能巡检任务已创建：" + rangeNames[range] + "，自 " + startDate + " 起每 " + interval + unitNames[unit] + "执行一次，窗口 " + ws + " - " + we, "success");
  closeInspSmart();
}

/* ---- 手动巡检 · 检测范围配置 ---- */
let inspManualFilter = { code: "", name: "", type: "", year: "" };

function inspManualModalHTML() {
  const types = [...new Set(RECEPTION_PACKAGES.map(p => p.typeName))];
  const years = [...new Set(RECEPTION_PACKAGES.map(p => String(p.createdTime).slice(0, 4)))].sort();
  return `
  <div id="inspManualModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeInspManual()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="scan-line" class="w-5 h-5 text-primary"></i></div>
          <div><h3 class="text-sm font-semibold text-ink">手动巡检</h3><div class="text-[11px] text-slate-400">检测范围配置</div></div>
        </div>
        <button onclick="closeInspManual()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-5 py-4">
        <div class="space-y-4">
          <div>
            <div class="text-xs text-slate-400 mb-2">检测范围</div>
            <div class="flex items-center gap-5">
              <label class="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer"><input type="radio" name="inspManualRange" value="all" checked onchange="onInspManualRange('all')" class="accent-primary" />全部信息包</label>
              <label class="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer"><input type="radio" name="inspManualRange" value="part" onchange="onInspManualRange('part')" class="accent-primary" />部分信息包</label>
            </div>
          </div>
          <div id="inspManualCond" class="hidden space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <div class="text-xs text-slate-400 mb-1.5">全宗号</div>
                <input type="text" id="inspMCode" class="field px-3 py-2 text-sm w-full" placeholder="如 A001" oninput="onInspManualFilter()" value="${inspManualFilter.code}" />
              </div>
              <div>
                <div class="text-xs text-slate-400 mb-1.5">全宗名称</div>
                <input type="text" id="inspMName" class="field px-3 py-2 text-sm w-full" placeholder="如 市委办公厅" oninput="onInspManualFilter()" value="${inspManualFilter.name}" />
              </div>
              <div>
                <div class="text-xs text-slate-400 mb-1.5">档案门类</div>
                <select id="inspMType" class="field px-3 py-2 text-sm w-full" onchange="onInspManualFilter()">
                  <option value="">全部门类</option>
                  ${types.map(t => `<option value="${t}" ${inspManualFilter.type===t?'selected':''}>${t}</option>`).join("")}
                </select>
              </div>
              <div>
                <div class="text-xs text-slate-400 mb-1.5">年度</div>
                <select id="inspMYear" class="field px-3 py-2 text-sm w-full" onchange="onInspManualFilter()">
                  <option value="">全部年度</option>
                  ${years.map(y => `<option value="${y}" ${inspManualFilter.year===y?'selected':''}>${y}</option>`).join("")}
                </select>
              </div>
            </div>
            <div id="inspMMatch" class="rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-2.5 text-xs text-slate-600 flex items-center gap-2">
              <i data-lucide="info" class="w-4 h-4 text-primary shrink-0"></i>
              <span>已匹配 <b class="font-num text-primary">0</b> 个信息包，将针对这些信息包进行检测</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
        <button onclick="closeInspManual()" class="btn-ghost px-3.5 py-2 rounded-lg text-sm border border-slate-200">取消</button>
        <button onclick="startManualInspect()" class="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="play" class="w-3.5 h-3.5"></i>开始检测</button>
      </div>
    </div>
  </div>`;
}

/* 按条件从数据接收的信息包中筛选 */
function inspManualMatched() {
  const f = inspManualFilter;
  return RECEPTION_PACKAGES.filter(function(p) {
    if (f.code && p.fondsCode.toLowerCase().indexOf(f.code.trim().toLowerCase()) < 0) return false;
    if (f.name && p.fondsName.toLowerCase().indexOf(f.name.trim().toLowerCase()) < 0) return false;
    if (f.type && p.typeName !== f.type) return false;
    if (f.year && String(p.createdTime).slice(0, 4) !== f.year) return false;
    return true;
  });
}

function onInspManualFilter() {
  inspManualFilter = {
    code: document.getElementById("inspMCode").value,
    name: document.getElementById("inspMName").value,
    type: document.getElementById("inspMType").value,
    year: document.getElementById("inspMYear").value,
  };
  const n = inspManualMatched().length;
  const el = document.getElementById("inspMMatch");
  if (el) {
    el.innerHTML = '<i data-lucide="info" class="w-4 h-4 text-primary shrink-0"></i><span>已匹配 <b class="font-num text-primary">' + n + '</b> 个信息包，将针对这些信息包进行检测</span>';
    lucide.createIcons();
  }
}

function onInspManualRange(v) {
  const cond = document.getElementById("inspManualCond");
  if (cond) cond.classList.toggle("hidden", v !== "part");
  if (v === "part") onInspManualFilter();
}

function openInspManual() {
  const m = document.getElementById("inspManualModal");
  if (!m) return;
  const code = document.getElementById("inspMCode"); if (code) code.value = inspManualFilter.code;
  const name = document.getElementById("inspMName"); if (name) name.value = inspManualFilter.name;
  const type = document.getElementById("inspMType"); if (type) type.value = inspManualFilter.type;
  const year = document.getElementById("inspMYear"); if (year) year.value = inspManualFilter.year;
  const all = document.querySelector('input[name="inspManualRange"][value="all"]');
  const part = document.querySelector('input[name="inspManualRange"][value="part"]');
  if (all) all.checked = true;
  if (part) part.checked = false;
  const cond = document.getElementById("inspManualCond");
  if (cond) cond.classList.add("hidden");
  m.classList.remove("hidden"); m.classList.add("flex");
  lucide.createIcons();
}
function closeInspManual() {
  const m = document.getElementById("inspManualModal");
  if (m) { m.classList.add("hidden"); m.classList.remove("flex"); }
}
function startManualInspect() {
  const sel = document.querySelector('input[name="inspManualRange"]:checked');
  const range = sel ? sel.value : "all";
  let matched;
  if (range === "all") {
    matched = RECEPTION_PACKAGES.slice();
  } else {
    matched = inspManualMatched();
    if (!matched.length) { toast("未找到符合条件的信息包，请调整条件", "warn"); return; }
  }
  closeInspManual();
  startInspectionProcess("manual", matched.length);
}