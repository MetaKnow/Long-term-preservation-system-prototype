/* ===== 安全中心 · 数据巡检 / 系统预警 / 数据保全 ===== */

const INSP_TYPES = [
  { key:"file", label:"电子全文", icon:"file-text", count:24, desc:"电子原文文件完整性巡检" },
  { key:"package", label:"信息包", icon:"archive", count:18, desc:"信息包结构与内容巡检" },
  { key:"iso", label:"ISO包", icon:"disc", count:21, desc:"ISO标准封装包巡检" }
];

const INSP_STATUS = { running:"巡检中", stop:"巡检停止", done:"巡检完成" };
const INSP_STATUS_CLS = { running:"bg-blue-50 text-blue-700", stop:"bg-amber-50 text-amber-700", done:"bg-emerald-50 text-emerald-700" };
const INSP_MODE = { smart:"智能巡检", manual:"手动巡检", sample:"抽样巡检" };

let inspTab = "file";
let inspView = "dashboard";
let inspSampleRate = 10;
let inspInspecting = false;
let inspProgress = 0;
let inspFilter = { type:"", mode:"", status:"", keyword:"" };
let inspSelected = new Set();

const INSPECTION_RECORDS = [
  { id:"INS-20260812-001", createdTime:"2026-08-12 09:00", checkFileType:"信息包", checkType:"smart", dataClassificationName:"文书档案", shouldCount:1284, hasCount:1284, normalCount:1282, abnormalCount:2, status:"done", elapsedTime:"00:12:35", details:[
    { packageName:"2026年度文书档案（第3批）", packagePath:"/长久保存/信息包/2026年度/文书档案/", fileName:"发文_2026_0312.pdf", filePath:"/2026年度文书档案（第3批）/发文/", checkResult:"异常", processStatus:"已转入恢复" },
    { packageName:"2026年度文书档案（第3批）", packagePath:"/长久保存/信息包/2026年度/文书档案/", fileName:"批复_007.pdf", filePath:"/2026年度文书档案（第3批）/批复/", checkResult:"异常", processStatus:"已转入恢复" },
    { packageName:"2026年度文书档案（第2批）", packagePath:"/长久保存/信息包/2026年度/文书档案/", fileName:"登记表_汇总.xlsx", filePath:"/2026年度文书档案（第2批）/登记表/", checkResult:"正常", processStatus:"-" }
  ]},
  { id:"INS-20260812-002", createdTime:"2026-08-12 08:30", checkFileType:"电子全文", checkType:"smart", dataClassificationName:"声像档案", shouldCount:368, hasCount:368, normalCount:367, abnormalCount:1, status:"done", elapsedTime:"00:05:12", details:[
    { packageName:"科研项目声像档案包A2087", packagePath:"/长久保存/信息包/2026年度/声像档案/", fileName:"现场影像_03.mp4", filePath:"/科研项目声像档案包A2087/影像/", checkResult:"异常", processStatus:"已转入恢复" }
  ]},
  { id:"INS-20260812-003", createdTime:"2026-08-12 08:10", checkFileType:"信息包", checkType:"smart", dataClassificationName:"科技档案", shouldCount:458, hasCount:312, normalCount:0, abnormalCount:0, status:"running", elapsedTime:"-", details:[] },
  { id:"INS-20260811-004", createdTime:"2026-08-11 16:20", checkFileType:"包", checkType:"sample", dataClassificationName:"电子文件", shouldCount:5421, hasCount:5421, normalCount:5419, abnormalCount:2, status:"done", elapsedTime:"00:48:20", details:[
    { packageName:"不动产登记电子档案（第二批）", packagePath:"/长久保存/信息包/2026年度/", fileName:"登记表_0451.pdf", filePath:"/不动产登记电子档案（第二批）/登记/", checkResult:"异常", processStatus:"已转入恢复" },
    { packageName:"不动产登记电子档案（第二批）", packagePath:"/长久保存/信息包/2026年度/", fileName:"权证_0892.pdf", filePath:"/不动产登记电子档案（第二批）/权证/", checkResult:"异常", processStatus:"已转入恢复" }
  ]},
  { id:"INS-20260811-005", createdTime:"2026-08-11 14:00", checkFileType:"信息包", checkType:"manual", dataClassificationName:"文书档案", shouldCount:1076, hasCount:642, normalCount:0, abnormalCount:0, status:"stop", elapsedTime:"00:08:30", details:[] },
  { id:"INS-20260810-006", createdTime:"2026-08-10 10:15", checkFileType:"电子全文", checkType:"smart", dataClassificationName:"文书档案", shouldCount:8452, hasCount:8452, normalCount:8450, abnormalCount:2, status:"done", elapsedTime:"01:15:08", details:[
    { packageName:"政务服务电子文件归档包", packagePath:"/长久保存/信息包/", fileName:"审批表_122.pdf", filePath:"/政务服务电子文件归档包/审批/", checkResult:"异常", processStatus:"已转入恢复" },
    { packageName:"政务服务电子文件归档包", packagePath:"/长久保存/信息包/", fileName:"回执_088.pdf", filePath:"/政务服务电子文件归档包/回执/", checkResult:"异常", processStatus:"已转入恢复" }
  ]},
  { id:"INS-20260810-007", createdTime:"2026-08-10 09:00", checkFileType:"包", checkType:"sample", dataClassificationName:"声像档案", shouldCount:642, hasCount:642, normalCount:640, abnormalCount:2, status:"done", elapsedTime:"00:08:45", details:[
    { packageName:"城市规划声像档案2016-2020", packagePath:"/长久保存/信息包/专题归档/", fileName:"勘察照片_117.jpg", filePath:"/城市规划声像档案2016-2020/勘察/", checkResult:"异常", processStatus:"已转入恢复" }
  ]},
  { id:"INS-20260809-008", createdTime:"2026-08-09 15:30", checkFileType:"信息包", checkType:"smart", dataClassificationName:"科技档案", shouldCount:231, hasCount:180, normalCount:0, abnormalCount:0, status:"running", elapsedTime:"-", details:[] }
];


function currentInspStats() {
  const t = INSP_TYPES.find(t => t.key === inspTab);
  const total = t ? t.count : 63;
  if (inspInspecting) {
    const done = Math.floor(total * inspProgress / 100);
    return { lastTime: "巡检中...", should: total, has: done, normal: Math.floor(done * 0.98), abnormal: done - Math.floor(done * 0.98) };
  }
  return { lastTime: "2026-08-12 18:01:01", should: total, has: total, normal: total - 2, abnormal: 2 };
}

function inspectionHTML() {
  const st = currentInspStats();
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
        <div class="flex items-end justify-between mb-5">
          <div>
            <div class="text-2xl font-bold text-ink mb-1">定期巡检，清除风险</div>
            <div class="text-sm text-slate-500">通过自动化巡检机制，实时监测数据完整性与可用性</div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="switchInspView('dashboard')" class="px-3.5 py-1.5 rounded-lg text-sm transition-colors ${inspView==='dashboard'?'bg-primary text-white':'text-slate-600 hover:bg-slate-100'}">概览</button>
            <button onclick="switchInspView('records')" class="px-3.5 py-1.5 rounded-lg text-sm transition-colors ${inspView==='records'?'bg-primary text-white':'text-slate-600 hover:bg-slate-100'}">巡检记录</button>
          </div>
        </div>

        <div class="flex items-center gap-1 mb-5 flex-wrap">
          ${INSP_TYPES.map(t => `<button onclick="switchInspTab('${t.key}')" class="px-4 py-2 rounded-lg text-sm border transition-all ${inspTab===t.key?'bg-white border-primary text-primary font-medium shadow-sm':'border-transparent text-slate-600 hover:bg-white/60'}">${t.label}</button>`).join("")}
        </div>

        <div class="grid grid-cols-5 gap-4 mb-6">
          <div class="col-span-1">
            <div class="text-xs text-slate-400 mb-1">上次巡检时间</div>
            <div class="text-base font-semibold text-ink font-num">${st.lastTime}</div>
          </div>
          <div class="col-span-1">
            <div class="text-xs text-slate-400 mb-1">应监测数量</div>
            <div class="text-2xl font-bold text-primary font-num">${st.should}<span class="text-sm font-normal text-slate-500 ml-1">个</span></div>
          </div>
          <div class="col-span-1">
            <div class="text-xs text-slate-400 mb-1">已监测数量</div>
            <div class="text-2xl font-bold text-ink font-num">${st.has}<span class="text-sm font-normal text-slate-500 ml-1">个</span></div>
          </div>
          <div class="col-span-1">
            <div class="text-xs text-slate-400 mb-1">正常数量</div>
            <div class="text-2xl font-bold text-emerald-600 font-num">${st.normal}<span class="text-sm font-normal text-slate-500 ml-1">个</span></div>
          </div>
          <div class="col-span-1">
            <div class="text-xs text-slate-400 mb-1">异常</div>
            <div class="text-2xl font-bold text-red-600 font-num">${st.abnormal}<span class="text-sm font-normal text-slate-500 ml-1">个</span></div>
          </div>
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

        <div class="flex items-start gap-8 flex-wrap">
          <div class="flex flex-col gap-3">
            <button onclick="startManualInspection()" ${inspInspecting?'disabled':''} class="btn-primary px-8 py-3 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg shadow-primary/25">
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

          <div class="flex flex-col gap-4 pt-1">
            <div class="flex items-center gap-3">
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

    ${inspView === "records" ? inspectionRecordsHTML() : ""}
  </div>
  ${inspectionDetailModalHTML()}`;
}

function inspectionRecordsHTML() {
  const types = [["file","电子全文"],["package","信息包"],["iso","ISO包"]];
  const modes = [["smart","智能巡检"],["manual","手动巡检"],["sample","抽样巡检"]];
  const statuses = [["running","巡检中"],["stop","巡检停止"],["done","巡检完成"]];
  return `
  <div class="card overflow-hidden">
    <div class="flex items-center gap-3 p-4 border-b border-slate-100">
      <div class="text-sm font-semibold text-ink">巡检记录</div>
      <div class="ml-auto flex flex-wrap items-center gap-3">
        <select class="field px-3 py-2 text-sm" onchange="inspFilter.type=this.value; renderInspectionRows()">
          <option value="">全部巡检对象</option>
          ${types.map(t => `<option value="${t[0]}" ${inspFilter.type===t[0]?'selected':''}>${t[1]}</option>`).join("")}
        </select>
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
        <button onclick="inspFilter={type:'',mode:'',status:'',keyword:''}; renderInspectionRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
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

function switchInspView(v) {
  inspView = v;
  rerenderInspection();
}
function switchInspTab(k) {
  inspTab = k;
  rerenderInspection();
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
function startManualInspection() {
  startInspectionProcess("manual");
}
function startSampleInspection() {
  startInspectionProcess("sample");
}
function startInspectionProcess(mode) {
  inspInspecting = true;
  inspProgress = 0;
  rerenderInspection();
  toast((mode==="sample"?"抽样巡检":"手动巡检")+"已启动","info");
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
        const newRec = {
          id:"INS-NEW-"+Date.now(),
          createdTime:(function(){const d=new Date(),p=n=>String(n).padStart(2,"0");return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+" "+p(d.getHours())+":"+p(d.getMinutes());})(),
          checkFileType: t?t.label:"",
          checkType: mode,
          dataClassificationName: inspRange.has("archive")?"馆藏":"数字馆",
          shouldCount: t?t.count:63,
          hasCount: t?t.count:63,
          normalCount: (t?t.count:63) - 1,
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
  rerenderInspection();
  toast("巡检已停止","warn");
}

function rerenderInspection() {
  document.getElementById("view").innerHTML = inspectionHTML();
  lucide.createIcons();
  if (inspView === "records") renderInspectionRows();
}

const WARNING_RECORDS = [
  { id:"WARN-20260812-001", createdTime:"2026-08-12 08:30", objectType:"信息包", dataName:"2026年度文书档案（第3批）.zip", dataPath:"/长久保存/信息包/2026年度/文书档案/", abnormalReason:"备份文件内容异常", forewarningStatus:"manual" },
  { id:"WARN-20260812-002", createdTime:"2026-08-12 08:15", objectType:"电子全文", dataName:"现场影像_03.mp4", dataPath:"/长久保存/信息包/2026年度/声像档案/影像/", abnormalReason:"源文件内容异常", forewarningStatus:"repair" },
  { id:"WARN-20260811-003", createdTime:"2026-08-11 16:25", objectType:"信息包", dataName:"不动产登记电子档案（第二批）.zip", dataPath:"/长久保存/信息包/2026年度/", abnormalReason:"备份文件内容异常", forewarningStatus:"preserve" },
  { id:"WARN-20260811-004", createdTime:"2026-08-11 14:05", objectType:"包", dataName:"权证_0892.pdf", dataPath:"/长久保存/信息包/2026年度/权证/", abnormalReason:"源文件内容异常", forewarningStatus:"done" },
  { id:"WARN-20260811-005", createdTime:"2026-08-11 10:20", objectType:"电子全文", dataName:"审批表_122.pdf", dataPath:"/长久保存/信息包/审批/", abnormalReason:"备份文件内容异常", forewarningStatus:"manual" },
  { id:"WARN-20260810-006", createdTime:"2026-08-10 10:18", objectType:"信息包", dataName:"政务服务电子文件归档包.zip", dataPath:"/长久保存/信息包/", abnormalReason:"源文件内容异常", forewarningStatus:"done" },
  { id:"WARN-20260810-007", createdTime:"2026-08-10 09:05", objectType:"包", dataName:"勘察照片_117.jpg", dataPath:"/长久保存/信息包/专题归档/勘察/", abnormalReason:"备份文件内容异常", forewarningStatus:"repair" },
  { id:"WARN-20260809-008", createdTime:"2026-08-09 15:35", objectType:"信息包", dataName:"科研项目声像档案包A2087.zip", dataPath:"/长久保存/信息包/2026年度/声像档案/", abnormalReason:"源文件内容异常", forewarningStatus:"manual" }
];

const WARN_STATUS = { manual:"需手动处理", repair:"已转入修复", preserve:"已转入保全", done:"已处理" };
const WARN_STATUS_CLS = { manual:"bg-red-50 text-red-700", repair:"bg-amber-50 text-amber-700", preserve:"bg-blue-50 text-blue-700", done:"bg-slate-100 text-slate-500" };
let warnFilter = { status:"", reason:"", keyword:"" };
let warnSelected = new Set();

function warningHTML() {
  const statuses = [["manual","需手动处理"],["repair","已转入修复"],["preserve","已转入保全"],["done","已处理"]];
  const reasons = [["源文件内容异常","源文件内容异常"],["备份文件内容异常","备份文件内容异常"]];
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <select class="field px-3 py-2 text-sm" onchange="warnFilter.status=this.value; renderWarningRows()">
          <option value="">全部预警处理</option>
          ${statuses.map(s => `<option value="${s[0]}" ${warnFilter.status===s[0]?'selected':''}>${s[1]}</option>`).join("")}
        </select>
        <select class="field px-3 py-2 text-sm" onchange="warnFilter.reason=this.value; renderWarningRows()">
          <option value="">全部异常原因</option>
          ${reasons.map(r => `<option value="${r[0]}" ${warnFilter.reason===r[0]?'selected':''}>${r[1]}</option>`).join("")}
        </select>
        <div class="relative">
          <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
          <input type="text" class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="请输入巡检对象名称" oninput="warnFilter.keyword=this.value; renderWarningRows()" value="${warnFilter.keyword}" />
        </div>
        <button onclick="warnFilter={status:'',reason:'',keyword:''}; renderWarningRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left" style="min-width:880px">
          <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
            <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
            <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="warnAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleWarnAll(this.checked)" /></th>
            <th class="px-3 py-2 font-medium">巡检时间</th>
            <th class="px-3 py-2 font-medium">对象类型</th>
            <th class="px-3 py-2 font-medium">巡检对象名称</th>
            <th class="px-3 py-2 font-medium">巡检对象位置</th>
            <th class="px-3 py-2 font-medium">异常原因</th>
            <th class="px-3 py-2 font-medium">预警处理</th>
            <th class="px-3 py-2 font-medium text-right">操作</th>
          </tr></thead>
          <tbody id="warnBody"></tbody>
        </table>
      </div>
      <div id="warnEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无预警记录</div></div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="warnInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
    </div>
  </div>
  ${warningDetailModalHTML()}`;
}

function filteredWarning() {
  const q = warnFilter.keyword.trim().toLowerCase();
  return WARNING_RECORDS.filter(r => {
    if (warnFilter.status && r.forewarningStatus !== warnFilter.status) return false;
    if (warnFilter.reason && r.abnormalReason !== warnFilter.reason) return false;
    if (q && r.dataName.toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
}

function renderWarningRows() {
  const list = filteredWarning();
  const body = document.getElementById("warnBody");
  const empty = document.getElementById("warnEmpty");
  const info = document.getElementById("warnInfo");
  if (!body) return;
  syncWarnAll();
  if (!list.length) { body.innerHTML=""; empty.classList.remove("hidden"); if(info) info.textContent="共 0 条"; lucide.createIcons(); return; }
  empty.classList.add("hidden");
  body.innerHTML = list.map(function(r, idx){
    let actions = `<button onclick="openWarningDetail('${r.id}')" class="text-secondary hover:text-primary">详情</button>`;
    if (r.forewarningStatus === "manual") actions += `<button onclick="processWarning('${r.id}')" class="text-primary hover:text-blue-700 ml-2">处理</button>`;
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${r.id}" onchange="toggleWarnSelect('${r.id}',this.checked)" ${warnSelected.has(r.id)?'checked':''} /></td>
      <td class="px-3 py-2 font-num text-xs text-slate-500 whitespace-nowrap">${r.createdTime}</td>
      <td class="px-3 py-2 text-sm text-slate-600 whitespace-nowrap">${r.objectType}</td>
      <td class="px-3 py-2 text-sm text-ink max-w-[220px] truncate" title="${r.dataName}">${r.dataName}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-400 max-w-[200px] truncate" title="${r.dataPath}">${r.dataPath}</td>
      <td class="px-3 py-2 text-sm whitespace-nowrap"><span class="text-red-600">${r.abnormalReason}</span></td>
      <td class="px-3 py-2"><span class="tag ${WARN_STATUS_CLS[r.forewarningStatus]}">${WARN_STATUS[r.forewarningStatus]}</span></td>
      <td class="px-3 py-3 text-right text-xs whitespace-nowrap">${actions}</td>
    </tr>`;
  }).join("");
  if (info) info.textContent = "共 " + list.length + " 条";
  lucide.createIcons();
}

function toggleWarnSelect(id, checked) { if (checked) warnSelected.add(id); else warnSelected.delete(id); syncWarnAll(); }
function toggleWarnAll(checked) { const list = filteredWarning(); if (checked) list.forEach(r => warnSelected.add(r.id)); else list.forEach(r => warnSelected.delete(r.id)); renderWarningRows(); }
function syncWarnAll() { const all = document.getElementById("warnAll"); if (!all) return; const list = filteredWarning(); if (!list.length) { all.checked=false; all.indeterminate=false; return; } const sel = list.filter(r => warnSelected.has(r.id)).length; all.checked = sel === list.length; all.indeterminate = sel > 0 && sel < list.length; }
function processWarning(id) { const r = WARNING_RECORDS.find(x => x.id === id); if (r) r.forewarningStatus = "done"; toast("预警已处理","success"); renderWarningRows(); }

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
  const r = WARNING_RECORDS.find(x => x.id === id); if (!r) return;
  document.getElementById("warnDetailBody").innerHTML = `
  <div class="grid grid-cols-2 gap-x-6 gap-y-4">
    ${dtKV("巡检时间", '<span class="font-num">'+r.createdTime+'</span>')}
    ${dtKV("对象类型", r.objectType)}
    ${dtKV("巡检对象名称", r.dataName, "col-span-2")}
    ${dtKV("巡检对象位置", '<span class="font-num text-slate-600 break-all">'+r.dataPath+'</span>', "col-span-2")}
    ${dtKV("异常原因", '<span class="text-red-600">'+r.abnormalReason+'</span>')}
    ${dtKV("预警处理", '<span class="tag '+WARN_STATUS_CLS[r.forewarningStatus]+'">'+WARN_STATUS[r.forewarningStatus]+'</span>')}
  </div>`;
  const m = document.getElementById("warnDetailModal"); m.classList.remove("hidden"); m.classList.add("flex"); lucide.createIcons();
}
function closeWarningDetail() { const m = document.getElementById("warnDetailModal"); m.classList.add("hidden"); m.classList.remove("flex"); }
const SEC_PRESERVE_RECORDS = [
  { id:"SECP-20260812-001", createdTime:"2026-08-12 08:32", objectType:"电子全文", dataName:"现场影像_03.mp4", dataPath:"/长久保存/信息包/2026年度/声像档案/影像/", abnormalReason:"源文件内容异常", processStatus:"todo" },
  { id:"SECP-20260812-002", createdTime:"2026-08-12 08:20", objectType:"信息包", dataName:"2026年度文书档案（第3批）.zip", dataPath:"/长久保存/信息包/2026年度/文书档案/", abnormalReason:"备份文件内容异常", processStatus:"todo" },
  { id:"SECP-20260811-003", createdTime:"2026-08-11 16:28", objectType:"电子全文", dataName:"审批表_122.pdf", dataPath:"/长久保存/信息包/审批/", abnormalReason:"源文件内容异常", processStatus:"done" },
  { id:"SECP-20260811-004", createdTime:"2026-08-11 14:08", objectType:"包", dataName:"权证_0892.pdf", dataPath:"/长久保存/信息包/2026年度/权证/", abnormalReason:"备份文件内容异常", processStatus:"todo" },
  { id:"SECP-20260811-005", createdTime:"2026-08-11 10:22", objectType:"电子全文", dataName:"回执_088.pdf", dataPath:"/长久保存/信息包/回执/", abnormalReason:"源文件内容异常", processStatus:"done" },
  { id:"SECP-20260810-006", createdTime:"2026-08-10 10:20", objectType:"信息包", dataName:"政务服务电子文件归档包.zip", dataPath:"/长久保存/信息包/", abnormalReason:"备份文件内容异常", processStatus:"todo" },
  { id:"SECP-20260810-007", createdTime:"2026-08-10 09:08", objectType:"包", dataName:"勘察照片_117.jpg", dataPath:"/长久保存/信息包/专题归档/勘察/", abnormalReason:"源文件内容异常", processStatus:"done" },
  { id:"SECP-20260809-008", createdTime:"2026-08-09 15:38", objectType:"信息包", dataName:"科研项目声像档案包A2087.zip", dataPath:"/长久保存/信息包/2026年度/声像档案/", abnormalReason:"备份文件内容异常", processStatus:"todo" }
];

const SEC_PROC_STATUS = { todo:"待处理", done:"已处理" };
const SEC_PROC_STATUS_CLS = { todo:"bg-amber-50 text-amber-700", done:"bg-emerald-50 text-emerald-700" };
let secPFilter = { status:"", keyword:"" };
let secPSelected = new Set();

function securityPreserveHTML() {
  const statuses = [["todo","待处理"],["done","已处理"]];
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <button id="secPBatchBtn" onclick="handleSecPreserve()" class="btn-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="shield-check" class="w-4 h-4"></i>数据保全</button>
        <span id="secPSelInfo" class="text-xs text-slate-400"></span>
        <div class="ml-auto flex flex-wrap items-center gap-3">
          <select class="field px-3 py-2 text-sm" onchange="secPFilter.status=this.value; renderSecPreserveRows()">
            <option value="">全部处理情况</option>
            ${statuses.map(s => `<option value="${s[0]}" ${secPFilter.status===s[0]?'selected':''}>${s[1]}</option>`).join("")}
          </select>
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input type="text" class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="请输入巡检对象名称" oninput="secPFilter.keyword=this.value; renderSecPreserveRows()" value="${secPFilter.keyword}" />
          </div>
          <button onclick="secPFilter={status:'',keyword:''}; renderSecPreserveRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left" style="min-width:880px">
          <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
            <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
            <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="secPAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleSecPAll(this.checked)" /></th>
            <th class="px-3 py-2 font-medium">巡检时间</th>
            <th class="px-3 py-2 font-medium">对象类型</th>
            <th class="px-3 py-2 font-medium">巡检对象名称</th>
            <th class="px-3 py-2 font-medium">巡检对象位置</th>
            <th class="px-3 py-2 font-medium">异常原因</th>
            <th class="px-3 py-2 font-medium">处理情况</th>
            <th class="px-3 py-2 font-medium text-right">操作</th>
          </tr></thead>
          <tbody id="secPBody"></tbody>
        </table>
      </div>
      <div id="secPEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无数据保全记录</div></div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="secPInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
    </div>
  </div>
  ${secPreserveDetailModalHTML()}`;
}

function filteredSecPreserve() {
  const q = secPFilter.keyword.trim().toLowerCase();
  return SEC_PRESERVE_RECORDS.filter(r => {
    if (secPFilter.status && r.processStatus !== secPFilter.status) return false;
    if (q && r.dataName.toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
}

function renderSecPreserveRows() {
  const list = filteredSecPreserve();
  const body = document.getElementById("secPBody");
  const empty = document.getElementById("secPEmpty");
  const info = document.getElementById("secPInfo");
  if (!body) return;
  syncSecPAll();
  if (!list.length) { body.innerHTML=""; empty.classList.remove("hidden"); if(info) info.textContent="共 0 条"; updateSecPBatch(); lucide.createIcons(); return; }
  empty.classList.add("hidden");
  body.innerHTML = list.map(function(r, idx){
    let actions = `<button onclick="openSecPreserveDetail('${r.id}')" class="text-secondary hover:text-primary">详情</button>`;
    if (r.processStatus === "todo") actions += `<button onclick="handleSecPreserveSingle('${r.id}')" class="text-primary hover:text-blue-700 ml-2">数据保全</button>`;
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${r.id}" onchange="toggleSecPSelect('${r.id}',this.checked)" ${secPSelected.has(r.id)?'checked':''} /></td>
      <td class="px-3 py-2 font-num text-xs text-slate-500 whitespace-nowrap">${r.createdTime}</td>
      <td class="px-3 py-2 text-sm text-slate-600 whitespace-nowrap">${r.objectType}</td>
      <td class="px-3 py-2 text-sm text-ink max-w-[220px] truncate" title="${r.dataName}">${r.dataName}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-400 max-w-[200px] truncate" title="${r.dataPath}">${r.dataPath}</td>
      <td class="px-3 py-2 text-sm whitespace-nowrap"><span class="text-red-600">${r.abnormalReason}</span></td>
      <td class="px-3 py-2"><span class="tag ${SEC_PROC_STATUS_CLS[r.processStatus]}">${SEC_PROC_STATUS[r.processStatus]}</span></td>
      <td class="px-3 py-3 text-right text-xs whitespace-nowrap">${actions}</td>
    </tr>`;
  }).join("");
  if (info) info.textContent = "共 " + list.length + " 条";
  updateSecPBatch();
  lucide.createIcons();
}

function updateSecPBatch() {
  const btn = document.getElementById("secPBatchBtn");
  const si = document.getElementById("secPSelInfo");
  const list = filteredSecPreserve();
  const selTodo = list.filter(r => secPSelected.has(r.id) && r.processStatus === "todo");
  if (btn) btn.disabled = selTodo.length === 0;
  if (si) si.textContent = secPSelected.size ? "已选 " + secPSelected.size + " 项" + (selTodo.length ? "（" + selTodo.length + " 项可保全）" : "") : "";
}

function toggleSecPSelect(id, checked) { if (checked) secPSelected.add(id); else secPSelected.delete(id); syncSecPAll(); updateSecPBatch(); }
function toggleSecPAll(checked) { const list = filteredSecPreserve(); if (checked) list.forEach(r => secPSelected.add(r.id)); else list.forEach(r => secPSelected.delete(r.id)); renderSecPreserveRows(); }
function syncSecPAll() { const all = document.getElementById("secPAll"); if (!all) return; const list = filteredSecPreserve(); if (!list.length) { all.checked=false; all.indeterminate=false; return; } const sel = list.filter(r => secPSelected.has(r.id)).length; all.checked = sel === list.length; all.indeterminate = sel > 0 && sel < list.length; }

function handleSecPreserve() {
  const list = filteredSecPreserve();
  const selTodo = list.filter(r => secPSelected.has(r.id) && r.processStatus === "todo");
  if (!selTodo.length) { toast("请选择待处理的数据","warn"); return; }
  selTodo.forEach(r => r.processStatus = "done");
  selTodo.forEach(r => secPSelected.delete(r.id));
  toast("数据保全处理成功（" + selTodo.length + " 项）","success");
  renderSecPreserveRows();
}
function handleSecPreserveSingle(id) { const r = SEC_PRESERVE_RECORDS.find(x => x.id === id); if (r) r.processStatus = "done"; secPSelected.delete(id); toast("数据保全处理成功","success"); renderSecPreserveRows(); }

function secPreserveDetailModalHTML() {
  return `
  <div id="secPDetailModal" class="hidden fixed inset-0 z-50 items-center justify-center p-4">
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onclick="closeSecPreserveDetail()"></div>
    <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[88vh] flex flex-col animate-fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div class="flex items-center gap-2.5"><div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="shield" class="w-5 h-5 text-primary"></i></div><h3 class="text-sm font-semibold text-ink">保全详情</h3></div>
        <button onclick="closeSecPreserveDetail()" class="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="overflow-y-auto px-5 py-4" id="secPDetailBody"></div>
      <div class="flex items-center justify-end px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl"><button onclick="closeSecPreserveDetail()" class="btn-primary px-4 py-2 rounded-lg text-sm">关闭</button></div>
    </div>
  </div>`;
}

function openSecPreserveDetail(id) {
  const r = SEC_PRESERVE_RECORDS.find(x => x.id === id); if (!r) return;
  document.getElementById("secPDetailBody").innerHTML = `
  <div class="grid grid-cols-2 gap-x-6 gap-y-4">
    ${dtKV("巡检时间", '<span class="font-num">'+r.createdTime+'</span>')}
    ${dtKV("对象类型", r.objectType)}
    ${dtKV("巡检对象名称", r.dataName, "col-span-2")}
    ${dtKV("巡检对象位置", '<span class="font-num text-slate-600 break-all">'+r.dataPath+'</span>', "col-span-2")}
    ${dtKV("异常原因", '<span class="text-red-600">'+r.abnormalReason+'</span>')}
    ${dtKV("处理情况", '<span class="tag '+SEC_PROC_STATUS_CLS[r.processStatus]+'">'+SEC_PROC_STATUS[r.processStatus]+'</span>')}
  </div>`;
  const m = document.getElementById("secPDetailModal"); m.classList.remove("hidden"); m.classList.add("flex"); lucide.createIcons();
}
function closeSecPreserveDetail() { const m = document.getElementById("secPDetailModal"); m.classList.add("hidden"); m.classList.remove("flex"); }
function filteredInspection() {
  const q = inspFilter.keyword.trim().toLowerCase();
  return INSPECTION_RECORDS.filter(r => {
    if (inspFilter.type) {
      const typeMap = { file:"电子全文", package:"信息包", iso:"ISO包" };
      if (r.checkFileType !== typeMap[inspFilter.type]) return false;
    }
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
      <div class="flex items-center justify-end px-5 py-2.5 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl"><button onclick="closeInspectionDetail()" class="btn-primary px-4 py-2 rounded-lg text-sm">关闭</button></div>
    </div>
  </div>`;
}

function inspDetailBodyHTML(r) {
  const rows = (r.details||[]).map(function(d){
    const resCls = d.checkResult === "正常" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700";
    const procTag = d.processStatus === "-" ? '<span class="text-slate-400">-</span>' : '<span class="tag bg-blue-50 text-blue-700">'+d.processStatus+'</span>';
    return '<tr class="border-t border-slate-50"><td class="px-3 py-2 text-slate-700">'+d.packageName+'</td><td class="px-3 py-2 font-num text-slate-400 break-all">'+d.packagePath+'</td><td class="px-3 py-2 text-slate-700">'+d.fileName+'</td><td class="px-3 py-2 font-num text-slate-400 break-all">'+d.filePath+'</td><td class="px-3 py-2 text-center"><span class="tag '+resCls+'">'+d.checkResult+'</span></td><td class="px-3 py-2 text-center">'+procTag+'</td></tr>';
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
  <div class="flex items-center gap-2 mb-3"><div class="w-1 h-4 rounded bg-primary"></div><span class="text-sm font-semibold text-ink">巡检明细</span><span class="text-xs text-slate-400">（${(r.details||[]).length} 条）</span></div>
  <div class="border border-slate-100 rounded-lg overflow-x-auto">
    <table class="w-full text-left text-xs" style="min-width:640px">
      <thead><tr class="bg-slate-50/80 text-slate-500"><th class="px-3 py-2 font-medium">包名称</th><th class="px-3 py-2 font-medium">包位置</th><th class="px-3 py-2 font-medium">文件名称</th><th class="px-3 py-2 font-medium">文件位置</th><th class="px-3 py-2 font-medium text-center">巡检结果</th><th class="px-3 py-2 font-medium text-center">处理状态</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="6" class="px-3 py-6 text-center text-slate-400">暂无明细数据</td></tr>'}</tbody>
    </table>
  </div>`;
}

function openInspectionDetail(id) {
  const r = INSPECTION_RECORDS.find(x => x.id === id); if (!r) return;
  document.getElementById("inspDetailBody").innerHTML = inspDetailBodyHTML(r);
  const m = document.getElementById("inspDetailModal"); m.classList.remove("hidden"); m.classList.add("flex"); lucide.createIcons();
}
function closeInspectionDetail() { const m = document.getElementById("inspDetailModal"); m.classList.add("hidden"); m.classList.remove("flex"); }