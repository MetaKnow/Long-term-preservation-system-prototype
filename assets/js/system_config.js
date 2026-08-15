/* ===== 系统配置模块 ===== */

/* ---- 参数管理 ---- */
const PARAM_LIST = [
  { id:"PARAM-001", code:"SYS_NAME", name:"系统名称", value:"长久保存系统", remark:"系统显示名称", type:"input" },
  { id:"PARAM-002", code:"PAGE_SIZE", name:"默认分页条数", value:"20", remark:"列表默认每页显示条数", type:"input" },
  { id:"PARAM-003", code:"UPLOAD_MAX", name:"单文件上传最大(MB)", value:"500", remark:"单个文件上传大小限制", type:"input" },
  { id:"PARAM-004", code:"SESS_TIMEOUT", name:"会话超时时间(分钟)", value:"30", remark:"无操作后自动退出时间", type:"input" },
  { id:"PARAM-005", code:"PASSWORD_POLICY", name:"密码策略", value:"medium", remark:"密码强度要求", type:"select" },
  { id:"PARAM-006", code:"LOG_KEEP_DAYS", name:"日志保留天数", value:"180", remark:"系统日志保留时长", type:"input" },
  { id:"PARAM-007", code:"BACKUP_KEEP", name:"备份保留份数", value:"30", remark:"增量备份保留份数", type:"input" },
  { id:"PARAM-008", code:"DEFAULT_LANG", name:"默认语言", value:"zh-CN", remark:"系统默认显示语言", type:"select" }
];
let paramFilter = { keyword:"" };
let paramSelected = new Set();

function paramHTML() {
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <button onclick="openParamForm()" class="btn-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>新建参数</button>
        <span id="paramSelInfo" class="text-xs text-slate-400"></span>
        <div class="ml-auto flex flex-wrap items-center gap-3">
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="请输入参数名称" oninput="paramFilter.keyword=this.value; renderParamRows()" value="${paramFilter.keyword}" />
          </div>
          <button onclick="paramFilter={keyword:''}; renderParamRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left" style="min-width:880px">
          <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
            <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
            <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="paramAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleParamAll(this.checked)" /></th>
            <th class="px-3 py-2 font-medium">参数编码</th>
            <th class="px-3 py-2 font-medium">参数名称</th>
            <th class="px-3 py-2 font-medium">参数值</th>
            <th class="px-3 py-2 font-medium">参数设置方式</th>
            <th class="px-3 py-2 font-medium">参数说明</th>
            <th class="px-3 py-2 font-medium text-right">操作</th>
          </tr></thead>
          <tbody id="paramBody"></tbody>
        </table>
      </div>
      <div id="paramEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无参数</div></div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="paramInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
    </div>
  </div>`;
}

function renderParamRows() {
  const q = paramFilter.keyword.trim().toLowerCase();
  const list = PARAM_LIST.filter(p => !q || p.name.toLowerCase().indexOf(q) >= 0 || p.code.toLowerCase().indexOf(q) >= 0);
  const body = document.getElementById('paramBody');
  if (!body) return;
  const empty = document.getElementById('paramEmpty');
  const info = document.getElementById('paramInfo');
  if (!list.length) { body.innerHTML=''; if(empty) empty.classList.remove('hidden'); if(info) info.textContent='共 0 条'; return; }
  if(empty) empty.classList.add('hidden');
  body.innerHTML = list.map(function(p, idx){
    const typeText = p.type === 'select' ? '下拉框' : '输入框';
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${p.id}" onchange="toggleParamSelect('${p.id}',this.checked)" ${paramSelected.has(p.id)?'checked':''} /></td>
      <td class="px-3 py-2 font-num text-xs text-slate-500">${p.code}</td>
      <td class="px-3 py-2 text-sm text-ink font-medium">${p.name}</td>
      <td class="px-3 py-2 text-sm text-slate-600 font-num">${p.value}</td>
      <td class="px-3 py-2"><span class="tag bg-slate-100 text-slate-600">${typeText}</span></td>
      <td class="px-3 py-2 text-sm text-slate-500 max-w-[220px] truncate" title="${p.remark}">${p.remark||"-"}</td>
      <td class="px-3 py-3 text-right text-xs whitespace-nowrap">
        <button onclick="viewParam('${p.id}')" class="text-secondary hover:text-primary">查看</button>
        <button onclick="editParam('${p.id}')" class="text-primary hover:text-blue-700 ml-2">修改</button>
        <button onclick="deleteParam('${p.id}')" class="text-red-500 hover:text-red-700 ml-2">删除</button>
      </td>
    </tr>`;
  }).join('');
  if(info) info.textContent = '共 ' + list.length + ' 条';
  const si = document.getElementById('paramSelInfo');
  if (si) si.textContent = paramSelected.size ? '已选 ' + paramSelected.size + ' 项' : '';
  lucide.createIcons();
}

function toggleParamSelect(id, checked) { if (checked) paramSelected.add(id); else paramSelected.delete(id); renderParamRows(); }
function toggleParamAll(checked) { const q = paramFilter.keyword.trim().toLowerCase(); const list = PARAM_LIST.filter(p => !q || p.name.toLowerCase().indexOf(q) >= 0 || p.code.toLowerCase().indexOf(q) >= 0); if (checked) list.forEach(p => paramSelected.add(p.id)); else list.forEach(p => paramSelected.delete(p.id)); renderParamRows(); }
function openParamForm() { toast('新建参数（功能待实现）','info'); }
function viewParam(id) { toast('查看参数（功能待实现）','info'); }
function editParam(id) { toast('修改参数（功能待实现）','info'); }
function deleteParam(id) { const idx = PARAM_LIST.findIndex(x => x.id === id); if (idx >= 0) PARAM_LIST.splice(idx, 1); paramSelected.delete(id); toast('删除成功','success'); renderParamRows(); }

/* ---- 机构管理 ---- */
const ORG_LIST = [
  { id:"ORG-001", name:"市档案局", code:"DAJ", level:"单位", manageType:"集中管理", userCount:24, usable:1 },
  { id:"ORG-002", name:"保管科", code:"BGK", level:"部门", manageType:"分级管理", userCount:8, usable:1 },
  { id:"ORG-003", name:"技术科", code:"JSK", level:"部门", manageType:"分级管理", userCount:12, usable:1 },
  { id:"ORG-004", name:"利用科", code:"LYK", level:"部门", manageType:"分级管理", userCount:6, usable:1 },
  { id:"ORG-005", name:"法规科", code:"FGK", level:"部门", manageType:"分级管理", userCount:5, usable:1 },
  { id:"ORG-006", name:"办公室", code:"BGS", level:"部门", manageType:"分级管理", userCount:9, usable:0 }
];
let orgFilter = { keyword:'' };
let orgSelected = new Set();

function orgHTML() {
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <button onclick="openOrgForm()" class="btn-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>新增机构</button>
        <span id="orgSelInfo" class="text-xs text-slate-400"></span>
        <div class="ml-auto flex flex-wrap items-center gap-3">
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="请输入组织名称" oninput="orgFilter.keyword=this.value; renderOrgRows()" value="${orgFilter.keyword}" />
          </div>
          <button onclick="orgFilter={keyword:''}; renderOrgRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left" style="min-width:920px">
          <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
            <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
            <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="orgAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleOrgAll(this.checked)" /></th>
            <th class="px-3 py-2 font-medium">组织名称</th>
            <th class="px-3 py-2 font-medium">组织编码</th>
            <th class="px-3 py-2 font-medium">组织级别</th>
            <th class="px-3 py-2 font-medium">管理方式</th>
            <th class="px-3 py-2 font-medium text-right">用户数</th>
            <th class="px-3 py-2 font-medium">状态</th>
            <th class="px-3 py-2 font-medium text-right">操作</th>
          </tr></thead>
          <tbody id="orgBody"></tbody>
        </table>
      </div>
      <div id="orgEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无机构</div></div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="orgInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
    </div>
  </div>`;
}

function renderOrgRows() {
  const q = orgFilter.keyword.trim().toLowerCase();
  const list = ORG_LIST.filter(o => !q || o.name.toLowerCase().indexOf(q) >= 0 || o.code.toLowerCase().indexOf(q) >= 0);
  const body = document.getElementById('orgBody');
  if (!body) return;
  const empty = document.getElementById('orgEmpty');
  const info = document.getElementById('orgInfo');
  if (!list.length) { body.innerHTML=''; if(empty) empty.classList.remove('hidden'); if(info) info.textContent='共 0 条'; return; }
  if(empty) empty.classList.add('hidden');
  body.innerHTML = list.map(function(o, idx){
    const statusText = o.usable ? '启用' : '停用';
    const statusCls = o.usable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500';
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${o.id}" onchange="toggleOrgSelect('${o.id}',this.checked)" ${orgSelected.has(o.id)?'checked':''} /></td>
      <td class="px-3 py-2 text-sm text-ink font-medium"><div class="flex items-center gap-2"><i data-lucide="${o.level==='单位'?'building-2':'users'}" class="w-4 h-4 text-primary"></i>${o.name}</div></td>
      <td class="px-3 py-2 font-num text-xs text-slate-500">${o.code}</td>
      <td class="px-3 py-2 text-sm text-slate-600">${o.level}</td>
      <td class="px-3 py-2"><span class="tag bg-blue-50 text-blue-700">${o.manageType}</span></td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 text-right">${o.userCount} 人</td>
      <td class="px-3 py-2"><span class="tag ${statusCls}">${statusText}</span></td>
      <td class="px-3 py-3 text-right text-xs whitespace-nowrap">
        <button onclick="editOrg('${o.id}')" class="text-secondary hover:text-primary">修改</button>
        <button onclick="deleteOrg('${o.id}')" class="text-red-500 hover:text-red-700 ml-2">删除</button>
      </td>
    </tr>`;
  }).join('');
  if(info) info.textContent = '共 ' + list.length + ' 条';
  const si = document.getElementById('orgSelInfo');
  if (si) si.textContent = orgSelected.size ? '已选 ' + orgSelected.size + ' 项' : '';
  lucide.createIcons();
}

function toggleOrgSelect(id, checked) { if (checked) orgSelected.add(id); else orgSelected.delete(id); renderOrgRows(); }
function toggleOrgAll(checked) { const q = orgFilter.keyword.trim().toLowerCase(); const list = ORG_LIST.filter(o => !q || o.name.toLowerCase().indexOf(q) >= 0 || o.code.toLowerCase().indexOf(q) >= 0); if (checked) list.forEach(o => orgSelected.add(o.id)); else list.forEach(o => orgSelected.delete(o.id)); renderOrgRows(); }
function openOrgForm() { toast('新增机构（功能待实现）','info'); }
function editOrg(id) { toast('修改机构（功能待实现）','info'); }
function deleteOrg(id) { const idx = ORG_LIST.findIndex(x => x.id === id); if (idx >= 0) ORG_LIST.splice(idx, 1); orgSelected.delete(id); toast('删除成功','success'); renderOrgRows(); }

/* ---- 用户管理 ---- */
const USER_LIST = [
  { id:"USR-001", loginName:"zhangming", name:"张明", gender:"男", org:"市档案局", role:"管理员", mobile:"13800138001", status:"有效" },
  { id:"USR-002", loginName:"lihua", name:"李华", gender:"男", org:"保管科", role:"保管员", mobile:"13800138002", status:"有效" },
  { id:"USR-003", loginName:"wangfang", name:"王芳", gender:"女", org:"技术科", role:"技术员", mobile:"13800138003", status:"有效" },
  { id:"USR-004", loginName:"zhaolei", name:"赵磊", gender:"男", org:"办公室", role:"办事员", mobile:"13800138004", status:"冻结" },
  { id:"USR-005", loginName:"sunjing", name:"孙静", gender:"女", org:"利用科", role:"科员", mobile:"13800138005", status:"有效" },
  { id:"USR-006", loginName:"zhouqiang", name:"周强", gender:"男", org:"法规科", role:"科员", mobile:"13800138006", status:"有效" },
  { id:"USR-007", loginName:"baoquan", name:"保全管理员", gender:"男", org:"保管科", role:"管理员", mobile:"13800138007", status:"有效" },
  { id:"USR-008", loginName:"chenli", name:"陈丽", gender:"女", org:"技术科", role:"科员", mobile:"13800138008", status:"注销" }
];
let userFilter = { keyword:'', status:'' };
let userSelected = new Set();

function userHTML() {
  const statuses = [['','全部状态'],['有效','有效'],['冻结','冻结'],['注销','注销']];
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <button class="btn-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>新增用户</button>
        <span id="userSelInfo" class="text-xs text-slate-400"></span>
        <div class="ml-auto flex flex-wrap items-center gap-3">
          <select class="field px-3 py-2 text-sm" onchange="userFilter.status=this.value; renderUserRows()">
            ${statuses.map(s => `<option value="${s[0]}" ${userFilter.status===s[0]?'selected':''}>${s[1]}</option>`).join('')}
          </select>
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="请输入姓名/登录名" oninput="userFilter.keyword=this.value; renderUserRows()" value="${userFilter.keyword}" />
          </div>
          <button onclick="userFilter={keyword:'',status:''}; renderUserRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left" style="min-width:1000px">
          <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
            <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
            <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="userAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleUserAll(this.checked)" /></th>
            <th class="px-3 py-2 font-medium">登录名</th>
            <th class="px-3 py-2 font-medium">用户姓名</th>
            <th class="px-3 py-2 font-medium">性别</th>
            <th class="px-3 py-2 font-medium">组织</th>
            <th class="px-3 py-2 font-medium">角色</th>
            <th class="px-3 py-2 font-medium">电话号码</th>
            <th class="px-3 py-2 font-medium">状态</th>
            <th class="px-3 py-2 font-medium text-right">操作</th>
          </tr></thead>
          <tbody id="userBody"></tbody>
        </table>
      </div>
      <div id="userEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无用户</div></div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="userInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
    </div>
  </div>`;
}

function renderUserRows() {
  const q = userFilter.keyword.trim().toLowerCase();
  const list = USER_LIST.filter(u => {
    if (userFilter.status && u.status !== userFilter.status) return false;
    if (q && u.name.toLowerCase().indexOf(q) < 0 && u.loginName.toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
  const body = document.getElementById('userBody');
  if (!body) return;
  const empty = document.getElementById('userEmpty');
  const info = document.getElementById('userInfo');
  if (!list.length) { body.innerHTML=''; if(empty) empty.classList.remove('hidden'); if(info) info.textContent='共 0 条'; return; }
  if(empty) empty.classList.add('hidden');
  const statusCls = { '有效':'bg-emerald-50 text-emerald-700', '冻结':'bg-amber-50 text-amber-700', '注销':'bg-slate-100 text-slate-500' };
  body.innerHTML = list.map(function(u, idx){
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${u.id}" onchange="toggleUserSelect('${u.id}',this.checked)" ${userSelected.has(u.id)?'checked':''} /></td>
      <td class="px-3 py-2 font-num text-xs text-slate-500">${u.loginName}</td>
      <td class="px-3 py-2 text-sm text-ink font-medium"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-semibold flex items-center justify-center">${u.name.charAt(0)}</div>${u.name}</div></td>
      <td class="px-3 py-2 text-sm text-slate-600">${u.gender}</td>
      <td class="px-3 py-2 text-sm text-slate-600">${u.org}</td>
      <td class="px-3 py-2"><span class="tag bg-blue-50 text-blue-700">${u.role}</span></td>
      <td class="px-3 py-2 font-num text-xs text-slate-500">${u.mobile}</td>
      <td class="px-3 py-2"><span class="tag ${statusCls[u.status]}">${u.status}</span></td>
      <td class="px-3 py-3 text-right text-xs whitespace-nowrap">
        <button class="text-secondary hover:text-primary">修改</button>
        <button class="text-primary hover:text-blue-700 ml-2">编辑角色</button>
        <button class="text-red-500 hover:text-red-700 ml-2">删除</button>
      </td>
    </tr>`;
  }).join('');
  if(info) info.textContent = '共 ' + list.length + ' 条';
  const si = document.getElementById('userSelInfo');
  if (si) si.textContent = userSelected.size ? '已选 ' + userSelected.size + ' 项' : '';
  lucide.createIcons();
}

function toggleUserSelect(id, checked) { if (checked) userSelected.add(id); else userSelected.delete(id); renderUserRows(); }
function toggleUserAll(checked) { const q = userFilter.keyword.trim().toLowerCase(); const list = USER_LIST.filter(u => (!userFilter.status || u.status === userFilter.status) && (!q || u.name.toLowerCase().indexOf(q) >= 0 || u.loginName.toLowerCase().indexOf(q) >= 0)); if (checked) list.forEach(u => userSelected.add(u.id)); else list.forEach(u => userSelected.delete(u.id)); renderUserRows(); }

/* ---- 角色权限（占位） ---- */
function rolePermHTML() {
  return `
  <div class="h-full flex items-center justify-center p-8">
    <div class="text-center max-w-md animate-fade-in">
      <div class="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-6">
        <i data-lucide="user-cog" class="w-9 h-9 text-primary"></i>
      </div>
      <h2 class="text-xl font-bold text-ink">角色权限</h2>
      <p class="text-sm text-slate-500 mt-2 leading-relaxed">该模块的界面尚待配置。角色管理、权限分配、资源授权等功能将在后续逐步实现。</p>
      <div class="mt-6 inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
        <i data-lucide="info" class="w-3.5 h-3.5"></i>
        模块标识：<span class="font-num text-slate-600">role-permission</span>
      </div>
    </div>
  </div>`;
}

/* ---- 日志管理 ---- */
const LOG_TABS = ['login','operation']
let logTab = 'login';
let logFilter = { keyword:'', status:'' };

const LOGIN_LOGS = [
  { id:"LOG-001", name:"张明", time:"2026-08-12 09:01:23", op:"登录", browser:"Chrome 126", os:"Windows 11", ip:"192.168.1.101", status:"已审计" },
  { id:"LOG-002", name:"李华", time:"2026-08-12 08:45:10", op:"登录", browser:"Edge 125", os:"Windows 10", ip:"192.168.1.102", status:"已审计" },
  { id:"LOG-003", name:"baoquan", time:"2026-08-12 08:30:00", op:"登录", browser:"Chrome 126", os:"Windows 11", ip:"192.168.1.103", status:"已审计" },
  { id:"LOG-004", name:"王芳", time:"2026-08-11 17:52:44", op:"退出", browser:"Chrome 126", os:"Windows 11", ip:"192.168.1.104", status:"未审计" },
  { id:"LOG-005", name:"赵磊", time:"2026-08-11 16:20:11", op:"登录", browser:"Firefox 128", os:"Windows 10", ip:"192.168.1.105", status:"已审计" },
  { id:"LOG-006", name:"孙静", time:"2026-08-11 14:05:33", op:"登录", browser:"Safari 17", os:"macOS 14", ip:"192.168.1.106", status:"未审计" },
  { id:"LOG-007", name:"周强", time:"2026-08-11 10:12:47", op:"登录", browser:"Chrome 126", os:"Windows 11", ip:"192.168.1.107", status:"已审计" },
  { id:"LOG-008", name:"陈丽", time:"2026-08-10 09:30:00", op:"登录", browser:"Edge 125", os:"Windows 10", ip:"192.168.1.108", status:"已审计" }
];

const OP_LOGS = [
  { id:"OP-001", name:"张明", time:"2026-08-12 09:30:15", module:"数据接收", content:"接收信息包", result:"成功", ip:"192.168.1.101" },
  { id:"OP-002", name:"李华", time:"2026-08-12 09:15:22", module:"数据装盘", content:"创建装盘任务", result:"成功", ip:"192.168.1.102" },
  { id:"OP-003", name:"王芳", time:"2026-08-12 08:50:08", module:"载体管理", content:"新增硬盘库", result:"成功", ip:"192.168.1.104" },
  { id:"OP-004", name:"赵磊", time:"2026-08-11 17:30:45", module:"参数管理", content:"修改会话超时", result:"成功", ip:"192.168.1.105" },
  { id:"OP-005", name:"孙静", time:"2026-08-11 15:12:33", module:"用户管理", content:"新增用户", result:"成功", ip:"192.168.1.106" },
  { id:"OP-006", name:"baoquan", time:"2026-08-11 10:05:18", module:"任务管理", content:"执行巡检任务", result:"成功", ip:"192.168.1.103" },
  { id:"OP-007", name:"周强", time:"2026-08-10 14:22:09", module:"数据统计", content:"导出统计报表", result:"成功", ip:"192.168.1.107" }
];

function logHTML() {
  const tabs = [{k:'login',n:'登录日志'},{k:'operation',n:'操作日志'}];
  const statuses = logTab==='login'?[['','全部审计状态'],['已审计','已审计'],['未审计','未审计']]:[['','全部结果'],['成功','成功'],['失败','失败']];
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex items-center gap-1 p-4 border-b border-slate-100">
        ${tabs.map(t => `<button onclick="switchLogTab('${t.k}')" class="px-4 py-2 rounded-lg text-sm border transition-all ${logTab===t.k?'bg-primary text-white border-primary font-medium':'bg-transparent border-transparent text-slate-600 hover:bg-slate-50'}">${t.n}</button>`).join('')}
      </div>
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <div class="ml-auto flex flex-wrap items-center gap-3">
          <select class="field px-3 py-2 text-sm" onchange="logFilter.status=this.value; renderLogRows()">
            ${statuses.map(s => `<option value="${s[0]}" ${logFilter.status===s[0]?'selected':''}>${s[1]}</option>`).join('')}
          </select>
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="快速搜索" oninput="logFilter.keyword=this.value; renderLogRows()" value="${logFilter.keyword}" />
          </div>
          <button onclick="logFilter={keyword:'',status:''}; renderLogRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left" style="min-width:960px">
          <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
            <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
            <th class="px-3 py-2 font-medium" id="logCol1">列1</th>
            <th class="px-3 py-2 font-medium" id="logCol2">列2</th>
            <th class="px-3 py-2 font-medium" id="logCol3">列3</th>
            <th class="px-3 py-2 font-medium" id="logCol4">列4</th>
            <th class="px-3 py-2 font-medium" id="logCol5">列5</th>
            <th class="px-3 py-2 font-medium" id="logCol6">列6</th>
            <th class="px-3 py-2 font-medium" id="logCol7">列7</th>
          </tr></thead>
          <tbody id="logBody"></tbody>
        </table>
      </div>
      <div id="logEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无日志</div></div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="logInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
    </div>
  </div>`;
}

function switchLogTab(t) { logTab = t; logFilter = { keyword:'', status:'' }; rerenderLog(); }

function renderLogRows() {
  const q = logFilter.keyword.trim().toLowerCase();
  const isLogin = logTab === 'login';
  const list = isLogin ? LOGIN_LOGS : OP_LOGS;
  const filtered = list.filter(l => {
    if (logFilter.status) {
      if (isLogin && l.status !== logFilter.status) return false;
      if (!isLogin && l.result !== logFilter.status) return false;
    }
    if (q && l.name.toLowerCase().indexOf(q) < 0 && (isLogin ? true : l.module.toLowerCase().indexOf(q) < 0) && (isLogin ? true : l.content.toLowerCase().indexOf(q) < 0)) return false;
    return true;
  });
  const body = document.getElementById('logBody');
  if (!body) return;
  const empty = document.getElementById('logEmpty');
  const info = document.getElementById('logInfo');
  if (!filtered.length) { body.innerHTML=''; if(empty) empty.classList.remove('hidden'); if(info) info.textContent='共 0 条'; return; }
  if(empty) empty.classList.add('hidden');
  if (isLogin) {
    document.getElementById('logCol1').textContent = '登录人姓名';
    document.getElementById('logCol2').textContent = '登录时间';
    document.getElementById('logCol3').textContent = '登录类型';
    document.getElementById('logCol4').textContent = '浏览器版本';
    document.getElementById('logCol5').textContent = '操作系统';
    document.getElementById('logCol6').textContent = 'IP地址';
    document.getElementById('logCol7').textContent = '审计状态';
    body.innerHTML = filtered.map(function(l, idx){
      const statusCls = l.status==='已审计'?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700';
      return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
        <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
        <td class="px-3 py-2 text-sm text-ink font-medium">${l.name}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-500">${l.time}</td>
        <td class="px-3 py-2"><span class="tag bg-blue-50 text-blue-700">${l.op}</span></td>
        <td class="px-3 py-2 text-sm text-slate-600">${l.browser}</td>
        <td class="px-3 py-2 text-sm text-slate-600">${l.os}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-500">${l.ip}</td>
        <td class="px-3 py-2"><span class="tag ${statusCls}">${l.status}</span></td>
      </tr>`;
    }).join('');
  } else {
    document.getElementById('logCol1').textContent = '操作人';
    document.getElementById('logCol2').textContent = '操作时间';
    document.getElementById('logCol3').textContent = '操作模块';
    document.getElementById('logCol4').textContent = '操作内容';
    document.getElementById('logCol5').textContent = '操作结果';
    document.getElementById('logCol6').textContent = 'IP地址';
    document.getElementById('logCol7').textContent = '操作';
    body.innerHTML = filtered.map(function(l, idx){
      const resCls = l.result==='成功'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-700';
      return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
        <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
        <td class="px-3 py-2 text-sm text-ink font-medium">${l.name}</td>
        <td class="px-3 py-2 font-num text-xs text-slate-500">${l.time}</td>
        <td class="px-3 py-2"><span class="tag bg-slate-100 text-slate-600">${l.module}</span></td>
        <td class="px-3 py-2 text-sm text-slate-600 max-w-[200px] truncate">${l.content}</td>
        <td class="px-3 py-2"><span class="tag ${resCls}">${l.result}</span></td>
        <td class="px-3 py-2 font-num text-xs text-slate-500">${l.ip}</td>
        <td class="px-3 py-3 text-xs"><button class="text-secondary hover:text-primary">详情</button></td>
      </tr>`;
    }).join('');
  }
  if(info) info.textContent = '共 ' + filtered.length + ' 条';
  lucide.createIcons();
}

function rerenderLog() {
  document.getElementById('view').innerHTML = logHTML();
  lucide.createIcons();
  renderLogRows();
}

/* ---- 接口管理 ---- */
const INTERFACE_LIST = [
  { id:"IF-001", name:"文件接收接口", code:"RECV_001", url:"/api/receive/file", method:"POST", source:"本系统", method2:"POST", enable:1, accessCount:1246, latestStatus:"成功" },
  { id:"IF-002", name:"元数据查询", code:"META_002", url:"/api/meta/query", method:"GET", source:"本系统", method2:"GET", enable:1, accessCount:892, latestStatus:"成功" },
  { id:"IF-003", name:"存证上报", code:"EVI_003", url:"/api/evidence/report", method:"POST", source:"外部系统", method2:"POST", enable:0, accessCount:0, latestStatus:"失败" },
  { id:"IF-004", name:"档案借阅", code:"BORROW_004", url:"/api/borrow/apply", method:"POST", source:"本系统", method2:"POST", enable:1, accessCount:156, latestStatus:"成功" },
  { id:"IF-005", name:"用户同步", code:"USER_SYNC", url:"/api/sync/user", method:"POST", source:"外部系统", method2:"POST", enable:1, accessCount:408, latestStatus:"成功" },
  { id:"IF-006", name:"组织同步", code:"ORG_SYNC", url:"/api/sync/org", method:"GET", source:"外部系统", method2:"GET", enable:1, accessCount:212, latestStatus:"成功" },
  { id:"IF-007", name:"日志推送", code:"LOG_PUSH", url:"/api/log/push", method:"POST", source:"外部系统", method2:"POST", enable:0, accessCount:0, latestStatus:"失败" },
  { id:"IF-008", name:"文件下载", code:"DOWNLOAD", url:"/api/file/download", method:"GET", source:"本系统", method2:"GET", enable:1, accessCount:3254, latestStatus:"成功" }
];
let ifaceFilter = { keyword:'', source:'' };
let ifaceSelected = new Set();

function interfaceHTML() {
  const sources = [['','全部接口来源'],['本系统','本系统'],['外部系统','外部系统']];
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <button class="btn-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>新增</button>
        <span id="ifaceSelInfo" class="text-xs text-slate-400"></span>
        <div class="ml-auto flex flex-wrap items-center gap-3">
          <select class="field px-3 py-2 text-sm" onchange="ifaceFilter.source=this.value; renderIfaceRows()">
            ${sources.map(s => `<option value="${s[0]}" ${ifaceFilter.source===s[0]?'selected':''}>${s[1]}</option>`).join('')}
          </select>
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="请输入接口名称" oninput="ifaceFilter.keyword=this.value; renderIfaceRows()" value="${ifaceFilter.keyword}" />
          </div>
          <button onclick="ifaceFilter={keyword:'',source:''}; renderIfaceRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left" style="min-width:1080px">
          <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
            <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
            <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="ifaceAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleIfaceAll(this.checked)" /></th>
            <th class="px-3 py-2 font-medium">接口来源</th>
            <th class="px-3 py-2 font-medium">接口名称</th>
            <th class="px-3 py-2 font-medium">接口编码</th>
            <th class="px-3 py-2 font-medium">接口访问地址</th>
            <th class="px-3 py-2 font-medium">请求方法</th>
            <th class="px-3 py-2 font-medium">启用</th>
            <th class="px-3 py-2 font-medium text-right">被调用次数</th>
            <th class="px-3 py-2 font-medium">最新运行情况</th>
            <th class="px-3 py-2 font-medium text-right">操作</th>
          </tr></thead>
          <tbody id="ifaceBody"></tbody>
        </table>
      </div>
      <div id="ifaceEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无接口</div></div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="ifaceInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
    </div>
  </div>`;
}

function renderIfaceRows() {
  const q = ifaceFilter.keyword.trim().toLowerCase();
  const list = INTERFACE_LIST.filter(i => {
    if (ifaceFilter.source && i.source !== ifaceFilter.source) return false;
    if (q && i.name.toLowerCase().indexOf(q) < 0 && i.code.toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
  const body = document.getElementById('ifaceBody');
  if (!body) return;
  const empty = document.getElementById('ifaceEmpty');
  const info = document.getElementById('ifaceInfo');
  if (!list.length) { body.innerHTML=''; if(empty) empty.classList.remove('hidden'); if(info) info.textContent='共 0 条'; return; }
  if(empty) empty.classList.add('hidden');
  const methodCls = { GET:'bg-emerald-50 text-emerald-700', POST:'bg-blue-50 text-blue-700', PUT:'bg-violet-50 text-violet-700', DELETE:'bg-red-50 text-red-700' };
  const statusCls = { '成功':'bg-emerald-50 text-emerald-700', '失败':'bg-red-50 text-red-700' };
  body.innerHTML = list.map(function(i, idx){
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${i.id}" onchange="toggleIfaceSelect('${i.id}',this.checked)" ${ifaceSelected.has(i.id)?'checked':''} /></td>
      <td class="px-3 py-2"><span class="tag ${i.source==='本系统'?'bg-primary/10 text-primary':'bg-amber-50 text-amber-700'}">${i.source}</span></td>
      <td class="px-3 py-2 text-sm text-ink font-medium">${i.name}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-500">${i.code}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-500 max-w-[200px] truncate">${i.url}</td>
      <td class="px-3 py-2"><span class="tag ${methodCls[i.method]||'bg-slate-100 text-slate-600'}">${i.method}</span></td>
      <td class="px-3 py-2"><span class="tag ${i.enable?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-500'}">${i.enable?'启用':'停用'}</span></td>
      <td class="px-3 py-2 font-num text-xs text-slate-600 text-right">${i.accessCount.toLocaleString()}</td>
      <td class="px-3 py-2"><span class="tag ${statusCls[i.latestStatus]||'bg-slate-100 text-slate-500'}">${i.latestStatus}</span></td>
      <td class="px-3 py-3 text-right text-xs whitespace-nowrap">
        <button class="text-secondary hover:text-primary">修改</button>
        <button class="text-primary hover:text-blue-700 ml-2">运行明细</button>
      </td>
    </tr>`;
  }).join('');
  if(info) info.textContent = '共 ' + list.length + ' 条';
  const si = document.getElementById('ifaceSelInfo');
  if (si) si.textContent = ifaceSelected.size ? '已选 ' + ifaceSelected.size + ' 项' : '';
  lucide.createIcons();
}

function toggleIfaceSelect(id, checked) { if (checked) ifaceSelected.add(id); else ifaceSelected.delete(id); renderIfaceRows(); }
function toggleIfaceAll(checked) { const q = ifaceFilter.keyword.trim().toLowerCase(); const list = INTERFACE_LIST.filter(i => (!ifaceFilter.source || i.source === ifaceFilter.source) && (!q || i.name.toLowerCase().indexOf(q) >= 0 || i.code.toLowerCase().indexOf(q) >= 0)); if (checked) list.forEach(i => ifaceSelected.add(i.id)); else list.forEach(i => ifaceSelected.delete(i.id)); renderIfaceRows(); }

/* ---- 安全管理 ---- */
const SECURITY_RULES = [
  { id:"SEC-001", name:"默认IP白名单", type:"IP白名单", content:"192.168.1.1 - 192.168.1.255", beginTime:"2026-01-01 00:00", endTime:"2099-12-31 23:59" },
  { id:"SEC-002", name:"运维网段访问", type:"IP白名单", content:"10.0.0.1 - 10.0.0.255", beginTime:"2026-01-01 00:00", endTime:"2099-12-31 23:59" },
  { id:"SEC-003", name:"恶意IP封锁-0812", type:"IP黑名单", content:"203.0.113.45", beginTime:"2026-08-12 10:00", endTime:"2026-08-13 10:00" },
  { id:"SEC-004", name:"MAC绑定-服务器", type:"MAC绑定", content:"00:1A:2B:3C:4D:5E", beginTime:"2026-01-01 00:00", endTime:"2099-12-31 23:59" },
  { id:"SEC-005", name:"临时访问-测试用户", type:"IP白名单", content:"192.168.2.100", beginTime:"2026-08-10 09:00", endTime:"2026-08-20 18:00" },
  { id:"SEC-006", name:"密码规则配置", type:"密码策略", content:"中等强度/8位以上", beginTime:"2026-01-01 00:00", endTime:"2099-12-31 23:59" }
];
let secFilter = { keyword:'', type:'' };
let secSelected = new Set();

function securityMgrHTML() {
  const types = [['','全部规则类型'],['IP白名单','IP白名单'],['IP黑名单','IP黑名单'],['MAC绑定','MAC绑定'],['密码策略','密码策略']];
  return `
  <div class="p-4 space-y-3 animate-fade-in">
    <div class="card overflow-hidden">
      <div class="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
        <button class="btn-primary px-3 py-2 rounded-lg text-sm flex items-center gap-1.5"><i data-lucide="plus" class="w-4 h-4"></i>新增</button>
        <span id="secMgrSelInfo" class="text-xs text-slate-400"></span>
        <div class="ml-auto flex flex-wrap items-center gap-3">
          <select class="field px-3 py-2 text-sm" onchange="secFilter.type=this.value; renderSecRows()">
            ${types.map(t => `<option value="${t[0]}" ${secFilter.type===t[0]?'selected':''}>${t[1]}</option>`).join('')}
          </select>
          <div class="relative">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input class="field pl-9 pr-3 py-2 text-sm w-56" placeholder="请输入规则名称" oninput="secFilter.keyword=this.value; renderSecRows()" value="${secFilter.keyword}" />
          </div>
          <button onclick="secFilter={keyword:'',type:''}; renderSecRows()" class="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>重置</button>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left" style="min-width:1000px">
          <thead><tr class="bg-slate-50/80 text-xs text-slate-500 border-b border-slate-100 whitespace-nowrap">
            <th class="px-3 py-2 font-medium w-12 text-center">序号</th>
            <th class="px-3 py-2 w-10 text-center"><input type="checkbox" id="secMgrAll" class="rounded border-slate-300 cursor-pointer" onchange="toggleSecMgrAll(this.checked)" /></th>
            <th class="px-3 py-2 font-medium">名称</th>
            <th class="px-3 py-2 font-medium">规则类型</th>
            <th class="px-3 py-2 font-medium">规格内容</th>
            <th class="px-3 py-2 font-medium">起效时间</th>
            <th class="px-3 py-2 font-medium">失效时间</th>
            <th class="px-3 py-2 font-medium text-right">操作</th>
          </tr></thead>
          <tbody id="secMgrBody"></tbody>
        </table>
      </div>
      <div id="secMgrEmpty" class="hidden py-12 text-center text-sm text-slate-400"><i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i><div>暂无安全规则</div></div>
      <div class="flex items-center justify-between px-3 py-2 border-t border-slate-100 text-xs text-slate-500"><span id="secMgrInfo"></span><span class="font-num text-slate-700">1 / 1</span></div>
    </div>
  </div>`;
}

function renderSecRows() {
  const q = secFilter.keyword.trim().toLowerCase();
  const list = SECURITY_RULES.filter(r => {
    if (secFilter.type && r.type !== secFilter.type) return false;
    if (q && r.name.toLowerCase().indexOf(q) < 0) return false;
    return true;
  });
  const body = document.getElementById('secMgrBody');
  if (!body) return;
  const empty = document.getElementById('secMgrEmpty');
  const info = document.getElementById('secMgrInfo');
  if (!list.length) { body.innerHTML=''; if(empty) empty.classList.remove('hidden'); if(info) info.textContent='共 0 条'; return; }
  if(empty) empty.classList.add('hidden');
  const typeCls = { 'IP白名单':'bg-emerald-50 text-emerald-700', 'IP黑名单':'bg-red-50 text-red-700', 'MAC绑定':'bg-blue-50 text-blue-700', '密码策略':'bg-violet-50 text-violet-700' };
  body.innerHTML = list.map(function(r, idx){
    return `<tr class="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
      <td class="px-3 py-2 text-center text-xs text-slate-400 font-num">${idx+1}</td>
      <td class="px-3 py-2 text-center"><input type="checkbox" class="rounded border-slate-300 cursor-pointer" data-id="${r.id}" onchange="toggleSecMgrSelect('${r.id}',this.checked)" ${secSelected.has(r.id)?'checked':''} /></td>
      <td class="px-3 py-2 text-sm text-ink font-medium">${r.name}</td>
      <td class="px-3 py-2"><span class="tag ${typeCls[r.type]||'bg-slate-100 text-slate-600'}">${r.type}</span></td>
      <td class="px-3 py-2 font-num text-xs text-slate-600">${r.content}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-500">${r.beginTime}</td>
      <td class="px-3 py-2 font-num text-xs text-slate-500">${r.endTime}</td>
      <td class="px-3 py-3 text-right text-xs whitespace-nowrap">
        <button class="text-secondary hover:text-primary">修改</button>
        <button class="text-red-500 hover:text-red-700 ml-2">删除</button>
      </td>
    </tr>`;
  }).join('');
  if(info) info.textContent = '共 ' + list.length + ' 条';
  const si = document.getElementById('secMgrSelInfo');
  if (si) si.textContent = secSelected.size ? '已选 ' + secSelected.size + ' 项' : '';
  lucide.createIcons();
}

function toggleSecMgrSelect(id, checked) { if (checked) secSelected.add(id); else secSelected.delete(id); renderSecRows(); }
function toggleSecMgrAll(checked) { const q = secFilter.keyword.trim().toLowerCase(); const list = SECURITY_RULES.filter(r => (!secFilter.type || r.type === secFilter.type) && (!q || r.name.toLowerCase().indexOf(q) >= 0)); if (checked) list.forEach(r => secSelected.add(r.id)); else list.forEach(r => secSelected.delete(r.id)); renderSecRows(); }
