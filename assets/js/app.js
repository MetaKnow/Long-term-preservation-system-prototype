/* ===== 长久保存系统 - 应用逻辑 ===== */

if (!new URLSearchParams(location.search).has("demo") && !sessionStorage.getItem("pps_user")) { location.href = "login.html"; }

let currentKey = "dashboard";
let openGroups = new Set();

const TONE = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
  danger: "bg-red-50 text-red-600",
};

function greetStr(){ const h=new Date().getHours(); if(h<6)return"凌晨好"; if(h<9)return"早上好"; if(h<12)return"上午好"; if(h<14)return"中午好"; if(h<18)return"下午好"; return"晚上好"; }
function dateStr(){ const d=new Date(); const w=["日","一","二","三","四","五","六"][d.getDay()]; return d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日 星期"+w; }

function init() {
  renderMenu();
  window.addEventListener("hashchange", route);
  route();
  bindCollapse();
}

/* ---- 菜单渲染 ---- */
function renderMenu() {
  const html = MENU.map(function(m) {
    const containsCurrent = m.children && menuHasKey(m.children, currentKey);
    const open = openGroups.has(m.key) || containsCurrent;
    if (!m.children) {
      return `<a href="#/${m.key}" class="nav-item flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm mb-0.5 ${currentKey===m.key?"active":""}">
        <i data-lucide="${m.icon}" class="w-4 h-4 nav-icon shrink-0"></i>
        <span class="menu-text">${m.title}</span>
      </a>`;
    }
    return `<div class="nav-group ${open?"open":""}" data-group="${m.key}">
      <button class="nav-item w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm mb-0.5" onclick="toggleGroup('${m.key}')">
        <i data-lucide="${m.icon}" class="w-4 h-4 nav-icon shrink-0"></i>
        <span class="menu-text flex-1 text-left">${m.title}</span>
        <i data-lucide="chevron-right" class="w-3.5 h-3.5 nav-chev nav-icon shrink-0"></i>
      </button>
      <div class="nav-sub">
        ${m.children.map(function(c) { return renderMenuItem(c, 1, m.key); }).join("")}
      </div>
    </div>`;
  }).join("");
  document.getElementById("menu").innerHTML = html;
  lucide.createIcons();
}

function menuHasKey(children, key) {
  for (const c of children) {
    if (c.key === key) return true;
    if (c.children && menuHasKey(c.children, key)) return true;
  }
  return false;
}

function renderMenuItem(item, level, parentKey) {
  const groupKey = parentKey + "." + item.key;
  const hasChildren = item.children && item.children.length > 0;
  const containsCurrent = hasChildren && menuHasKey(item.children, currentKey);
  const open = openGroups.has(groupKey) || containsCurrent;
  const pl = level === 1 ? "pl-9" : "pl-14";
  if (hasChildren) {
    return `<div class="nav-group ${open?"open":""}" data-group="${groupKey}">
      <button class="nav-item w-full flex items-center gap-2.5 ${pl} pr-2.5 py-1.5 rounded-lg text-[13px] mb-0.5" onclick="toggleGroup('${groupKey}')">
        <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0 dot"></span>
        <span class="menu-text flex-1 text-left">${item.title}</span>
        <i data-lucide="chevron-right" class="w-3 h-3 nav-chev nav-icon shrink-0"></i>
      </button>
      <div class="nav-sub">
        ${item.children.map(function(sub) { return renderMenuItem(sub, level + 1, groupKey); }).join("")}
      </div>
    </div>`;
  }
  return `<a href="#/${item.key}" class="nav-item flex items-center gap-2.5 ${pl} pr-2.5 py-1.5 rounded-lg text-[13px] mb-0.5 ${currentKey===item.key?"active":""}">
    <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50 shrink-0 dot"></span>
    <span class="menu-text">${item.title}</span>
  </a>`;
}

function toggleGroup(key) {
  if (openGroups.has(key)) openGroups.delete(key); else openGroups.add(key);
  renderMenu();
}

/* ---- 路由 ---- */
function route() {
  const hash = location.hash.replace(/^#\//, "") || "dashboard";
  currentKey = hash;
  renderMenu();
  const view = document.getElementById("view");
  if (hash === "dashboard") {
    setTitle("工作台", "首页 / 工作台");
    view.innerHTML = dashboardHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderTrendChart();
    renderDistChart();
  } else if (hash === "data-reception") {
    setTitle("数据接收", "首页 / 长保中心 / 数据接收");
    view.innerHTML = receptionHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderPackageRows();
  } else if (hash === "data-encapsulation") {
    setTitle("数据装盘", "首页 / 长保中心 / 数据装盘");
    view.innerHTML = encapsulationHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderEncRows();
  } else if (hash === "data-outbound") {
    setTitle("出库记录", "首页 / 长保中心 / 出库记录");
    view.innerHTML = outboundHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderOutboundRows();
  } else if (hash === "security-inspection") {
    setTitle("数据巡检", "首页 / 安全中心 / 数据巡检");
    view.innerHTML = inspectionHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderInspectionRows();
  } else if (hash === "security-warning") {
    setTitle("系统预警", "首页 / 安全中心 / 系统预警");
    view.innerHTML = warningHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderWarningRows();
  } else if (hash === "data-stats") {
    setTitle("数据统计", "首页 / 数据统计");
    view.innerHTML = statsHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    initStatsCharts();
  } else if (hash === "carrier-manage") {
    setTitle("载体管理", "首页 / 系统设置 / 业务配置 / 载体管理");
    view.innerHTML = carrierHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderCarrierRows();
  } else if (hash === "timing-task") {
    setTitle("任务管理", "首页 / 系统设置 / 业务配置 / 任务管理");
    view.innerHTML = taskHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderTaskRows();
  } else if (hash === "data-dict") {
    setTitle("数据字典", "首页 / 系统设置 / 业务配置 / 数据字典");
    view.innerHTML = dictHTML();
    view.scrollTop = 0;
    lucide.createIcons();
  } else if (hash === "storage-manage") {
    setTitle("存储管理", "首页 / 系统设置 / 业务配置 / 存储管理");
    view.innerHTML = storageHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderStorageRows();
  } else if (hash === "detection-setting") {
    setTitle("检测设置", "首页 / 系统设置 / 业务配置 / 检测设置");
    view.innerHTML = detectionSettingHTML();
    view.scrollTop = 0;
    lucide.createIcons();
  } else if (hash === "param-manage") {
    setTitle("参数管理", "首页 / 系统设置 / 系统配置 / 参数管理");
    view.innerHTML = paramHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderParamRows();
  } else if (hash === "org-manage") {
    setTitle("机构管理", "首页 / 系统设置 / 系统配置 / 机构管理");
    view.innerHTML = orgHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderOrgRows();
  } else if (hash === "user-manage") {
    setTitle("用户管理", "首页 / 系统设置 / 系统配置 / 用户管理");
    view.innerHTML = userHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderUserRows();
  } else if (hash === "role-permission") {
    setTitle("角色权限", "首页 / 系统设置 / 系统配置 / 角色权限");
    view.innerHTML = rolePermHTML();
    view.scrollTop = 0;
    lucide.createIcons();
  } else if (hash === "log-manage") {
    setTitle("日志管理", "首页 / 系统设置 / 系统配置 / 日志管理");
    view.innerHTML = logHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderLogRows();
  } else if (hash === "interface-manage") {
    setTitle("接口管理", "首页 / 系统设置 / 系统配置 / 接口管理");
    view.innerHTML = interfaceHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderIfaceRows();
  } else if (hash === "security-manage") {
    setTitle("安全管理", "首页 / 系统设置 / 系统配置 / 安全管理");
    view.innerHTML = securityMgrHTML();
    view.scrollTop = 0;
    lucide.createIcons();
    renderSecRows();
  } else {
    const title = MODULE_NAMES[hash] || "功能";
    const mp = findMenuPath(hash);
    const crumb = mp.length ? ("首页 / " + mp.join(" / ")) : ("首页 / " + title);
    setTitle(title, crumb);
    view.innerHTML = placeholderHTML(hash, title);
    view.scrollTop = 0;
    lucide.createIcons();
  }
}

function setTitle(title, crumb) {
  document.getElementById("pageTitle").textContent = title;
  document.getElementById("breadcrumb").textContent = crumb;
}

/* ---- Dashboard ---- */
function dashboardHTML() {
  return `
  <div class="p-6 space-y-5 animate-fade-in">
      <div class="rounded-2xl overflow-hidden relative text-white" style="background:linear-gradient(120deg,#0B1F4D 0%,#1E40AF 60%,#2563EB 100%)">
        <div class="grid-overlay absolute inset-0 opacity-40"></div>
        <div class="absolute -right-10 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
        <div class="relative flex flex-wrap items-center gap-4 px-6 py-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <i data-lucide="shield-check" class="w-5 h-5 text-accent"></i>
            </div>
            <div class="min-w-0">
              <div class="text-base font-semibold">${greetStr()}，${CURRENT_USER.name}</div>
              <div class="text-xs text-blue-100/80">${dateStr()}</div>
            </div>
          </div>
          <div class="ml-auto flex items-center gap-4 text-sm">
            <div class="hidden sm:block text-right">
              <div class="text-[11px] text-blue-100/70">存储总量</div>
              <div class="font-num font-semibold">1,624 TB</div>
            </div>
            <div class="hidden sm:block w-px h-8 bg-white/15"></div>
            <div class="hidden sm:block text-right">
              <div class="text-[11px] text-blue-100/70">系统状态</div>
              <div class="font-semibold flex items-center gap-1.5 justify-end"><span class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>运行正常</div>
            </div>
            <a href="#/report" class="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer">
              <i data-lucide="file-bar-chart" class="w-4 h-4"></i>统计报表
            </a>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm font-semibold text-ink">快捷入口</h3>
            <p class="text-xs text-slate-400">常用功能一键直达</p>
          </div>
          <i data-lucide="layout-grid" class="w-4 h-4 text-slate-300"></i>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          ${QUICK_ACCESS.map(q => `
          <a href="#/${q.key}" class="group flex flex-col items-center gap-2 py-3.5 rounded-xl border border-slate-100 hover:border-primary/25 hover:bg-primary/[0.03] transition-all">
            <div class="w-10 h-10 rounded-lg ${TONE[q.tone]} flex items-center justify-center"><i data-lucide="${q.icon}" class="w-5 h-5"></i></div>
            <span class="text-xs text-slate-600 group-hover:text-primary">${q.title}</span>
          </a>`).join("")}
        </div>
      </div>

    ${kpiCardsHTML()}
    ${statsChartsCardsHTML()}
  </div>`;
}

/* ---- 顶栏消息提醒（预警信息） ---- */
function notifPanelHTML() {
  const list = ALERTS.slice(0, 6);
  return `
  <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="bell" class="w-4 h-4 text-primary"></i></div>
      <div>
        <div class="text-sm font-semibold text-ink">消息提醒</div>
        <div class="text-[11px] text-slate-400">共 ${ALERTS.length} 条预警信息</div>
      </div>
    </div>
    <span class="tag bg-red-50 text-red-700">${ALERTS.length}</span>
  </div>
  <div class="max-h-80 overflow-y-auto">
    ${list.map(a => { const cls = a.level === "高" ? "tag-high" : a.level === "中" ? "tag-mid" : "tag-low"; return `
    <div class="flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors cursor-pointer">
      <span class="tag ${cls} mt-0.5 shrink-0">${a.level}</span>
      <div class="min-w-0 flex-1">
        <div class="text-sm font-medium text-ink truncate">${a.title}</div>
        <div class="text-xs text-slate-500 mt-0.5 leading-relaxed">${a.desc}</div>
      </div>
      <div class="text-xs text-slate-400 shrink-0">${a.time}</div>
    </div>`; }).join("")}
  </div>
  <div class="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
    <a href="#/security-warning" onclick="closeNotifPanel()" class="text-xs text-secondary hover:text-primary font-medium">查看全部预警</a>
    <span class="text-[11px] text-slate-400">点击铃铛查看</span>
  </div>`;
}

function renderNotifPanel() {
  const panel = document.getElementById("notifPanel");
  if (!panel) return;
  panel.innerHTML = notifPanelHTML();
  lucide.createIcons();
}

function toggleNotifPanel(e) {
  if (e) e.stopPropagation();
  const panel = document.getElementById("notifPanel");
  if (!panel) return;
  if (panel.classList.contains("hidden")) {
    renderNotifPanel();
    panel.classList.remove("hidden");
  } else {
    panel.classList.add("hidden");
  }
}

function closeNotifPanel() {
  const panel = document.getElementById("notifPanel");
  if (panel) panel.classList.add("hidden");
}

document.addEventListener("click", function(e) {
  const wrap = document.getElementById("notifWrap");
  const panel = document.getElementById("notifPanel");
  if (!wrap || !panel) return;
  if (!wrap.contains(e.target)) panel.classList.add("hidden");
});

/* ---- 占位页（二级菜单） ---- */
function placeholderHTML(key, title) {
  const mp = findMenuPath(key);
  const parent = mp.length >= 2 ? mp[mp.length - 2] : "";
  const icon = mp.length ? getMenuIcon(key) : "layout-grid";
  return `
  <div class="h-full flex items-center justify-center p-8">
    <div class="text-center max-w-md animate-fade-in">
      <div class="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-6">
        <i data-lucide="${icon}" class="w-9 h-9 text-primary"></i>
      </div>
      <h2 class="text-xl font-bold text-ink">${title}</h2>
      <p class="text-sm text-slate-500 mt-2 leading-relaxed">该模块的界面尚待配置。告诉我你需要展示哪些字段、列表列、筛选条件与操作流程，我将按你的描述逐步实现。</p>
      <div class="mt-6 inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
        <i data-lucide="info" class="w-3.5 h-3.5"></i>
        模块标识：<span class="font-num text-slate-600">${key}</span>
        ${parent ? ` · 所属：<span class="text-slate-600">${parent}</span>` : ""}
      </div>
    </div>
  </div>`;
}

/* ---- 侧边栏折叠 ---- */
function bindCollapse() {
  const btn = document.getElementById("collapseBtn");
  const sn = document.getElementById("sidenav");
  const icon = document.getElementById("collapseIcon");
  btn.addEventListener("click", () => {
    sn.classList.toggle("collapsed");
    const c = sn.classList.contains("collapsed");
    icon.setAttribute("data-lucide", c ? "panel-left-open" : "panel-left-close");
    lucide.createIcons();
  });
}

function findMenuPath(key) {
  const path = [];
  function walk(items) {
    for (const it of items) {
      if (it.key === key) { path.push(it.title); return true; }
      if (it.children) {
        path.push(it.title);
        if (walk(it.children)) return true;
        path.pop();
      }
    }
    return false;
  }
  walk(MENU);
  return path;
}
function getMenuIcon(key) {
  function walk(items) {
    for (const it of items) {
      if (it.key === key) return it.icon;
      if (it.children) {
        const r = walk(it.children);
        if (r) return r;
      }
    }
    return null;
  }
  return walk(MENU) || "layout-grid";
}

init();

