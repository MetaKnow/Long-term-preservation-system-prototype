/* ===== 数据统计 ===== */

let statsCharts = {};

/* 统计 KPI 卡片（工作台与数据统计共用） */
function kpiCardsHTML() {
  const T = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    danger: "bg-red-50 text-red-600",
  };
  return `
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
    ${KPI.map(k => `
    <div class="card hover-rise p-5">
      <div class="flex items-start justify-between">
        <div class="w-10 h-10 rounded-xl ${T[k.tone]} flex items-center justify-center">
          <i data-lucide="${k.icon}" class="w-5 h-5"></i>
        </div>
        <span class="text-xs font-medium ${k.up?"text-emerald-600":"text-red-500"} flex items-center gap-0.5">
          <i data-lucide="${k.up?"trending-up":"trending-down"}" class="w-3.5 h-3.5"></i>${k.delta}
        </span>
      </div>
      <div class="mt-4">
        <div class="text-2xl font-bold text-ink font-num">${k.value}<span class="text-sm font-normal text-slate-400 ml-1">${k.unit}</span></div>
        <div class="text-sm text-slate-500 mt-1">${k.label}</div>
      </div>
    </div>`).join("")}
  </div>`;
}

/* 统计图表卡片（保存趋势 / 档案门类分布，工作台与数据统计共用；withExport 控制是否显示导出按钮） */
function statsChartsCardsHTML(withExport) {
  return `
  <div class="grid grid-cols-12 gap-5">
    <div class="card overflow-hidden col-span-12 xl:col-span-8">
      ${chartHeaderHTML("保存趋势", "trending-up", withExport ? "exportTrendExcel" : "")}
      <div class="px-4 pb-4 pt-2">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-slate-400">近 12 个月信息包数量与存储量</span>
          <div class="flex gap-1">
            <button class="btn-ghost stats-mode-btn px-2.5 py-1 rounded-md text-xs bg-slate-100 text-ink" data-mode="count" onclick="setStatsMode('count', this)">信息包数量</button>
            <button class="btn-ghost stats-mode-btn px-2.5 py-1 rounded-md text-xs text-slate-500" data-mode="storage" onclick="setStatsMode('storage', this)">存储量</button>
          </div>
        </div>
        <div class="h-56"><canvas id="trendChart"></canvas></div>
      </div>
    </div>
    <div class="card overflow-hidden col-span-12 md:col-span-6 xl:col-span-4">
      ${chartHeaderHTML("档案门类分布", "pie-chart", withExport ? "exportDistExcel" : "")}
      <div class="px-4 pb-4 pt-2">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-slate-400">按档案门类统计</span>
          <div class="flex gap-1">
            <button class="btn-ghost stats-mode-btn px-2.5 py-1 rounded-md text-xs bg-slate-100 text-ink" data-mode="count" onclick="setStatsMode('count', this)">信息包数量</button>
            <button class="btn-ghost stats-mode-btn px-2.5 py-1 rounded-md text-xs text-slate-500" data-mode="storage" onclick="setStatsMode('storage', this)">存储量</button>
          </div>
        </div>
        <div class="h-56"><canvas id="distChart"></canvas></div>
      </div>
    </div>
  </div>`;
}

function statsHTML() {
  return `
  <div class="p-6 space-y-5 animate-fade-in">
    ${kpiCardsHTML()}
    ${statsChartsCardsHTML(true)}

    <div class="grid grid-cols-12 gap-5">
      <div class="card overflow-hidden col-span-12 xl:col-span-8">
        ${chartHeaderHTML("数据巡检统计", "search-check")}
        <div class="px-4 pb-4 pt-2">
          <div class="mb-3">
            <span class="text-xs text-slate-400">各巡检模式的巡检次数与异常数量</span>
          </div>
          <div class="h-56"><canvas id="inspStatsChart"></canvas></div>
        </div>
      </div>
      <div class="card overflow-hidden col-span-12 md:col-span-6 xl:col-span-4">
        ${chartHeaderHTML("巡检状态分布", "activity")}
        <div class="px-4 pb-4 pt-2">
          <div class="h-56"><canvas id="inspStatusChart"></canvas></div>
        </div>
      </div>
      <div class="card overflow-hidden col-span-12">
        ${chartHeaderHTML("巡检数据量", "bar-chart-3")}
        <div class="px-4 pb-4 pt-2">
          <div class="mb-3">
            <span class="text-xs text-slate-400">按档案门类统计应巡检、已巡检与异常的数据量</span>
          </div>
          <div class="h-56"><canvas id="inspVolChart"></canvas></div>
        </div>
      </div>
    </div>
  </div>`;
}

function chartHeaderHTML(title, icon, exportFn) {
  return `
  <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
    <div class="flex items-center gap-2">
      <div class="w-1 h-4 rounded bg-primary"></div>
      <span class="text-sm font-semibold text-ink">${title}</span>
    </div>
    <div class="flex items-center gap-1.5">
      ${exportFn ? `<button onclick="${exportFn}()" class="btn-ghost px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 border border-slate-200 text-slate-500 hover:text-ink"><i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i>导出Excel</button>` : ""}
      <button onclick="refreshStats()" class="btn-ghost w-7 h-7 rounded-lg flex items-center justify-center"><i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-slate-400"></i></button>
    </div>
  </div>`;
}

function initStatsCharts() {
  Object.values(statsCharts).forEach(c => c && c.destroy && c.destroy());
  statsCharts = {};
  renderTrendChart();
  renderDistChart();
  renderInspStatsChart();
  renderInspStatusChart();
  renderInspVolChart();
}

/* ---- 数据巡检统计（数据来源：安全中心巡检记录） ---- */
function inspStatsByMode() {
  const modes = [["smart", "智能巡检"], ["manual", "手动巡检"], ["sample", "抽样巡检"]];
  const records = (typeof INSPECTION_RECORDS !== "undefined") ? INSPECTION_RECORDS : [];
  return modes.map(function(m) {
    const rs = records.filter(function(r) { return r.checkType === m[0]; });
    const abnormal = rs.reduce(function(s, r) { return s + (r.status === "running" ? 0 : (Number(r.abnormalCount) || 0)); }, 0);
    return { label: m[1], count: rs.length, abnormal: abnormal };
  });
}

function inspStatusDist() {
  const records = (typeof INSPECTION_RECORDS !== "undefined") ? INSPECTION_RECORDS : [];
  return [
    { label: "巡检完成", value: records.filter(function(r) { return r.status === "done"; }).length, color: "#10B981" },
    { label: "巡检中", value: records.filter(function(r) { return r.status === "running"; }).length, color: "#3B82F6" },
    { label: "巡检停止", value: records.filter(function(r) { return r.status === "stop"; }).length, color: "#F59E0B" }
  ];
}

function renderInspStatsChart() {
  const ctx = document.getElementById("inspStatsChart");
  if (!ctx) return;
  if (statsCharts.insp) statsCharts.insp.destroy();
  const data = inspStatsByMode();
  statsCharts.insp = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(d => d.label),
      datasets: [
        { label: "巡检次数", data: data.map(d => d.count), backgroundColor: "rgba(30,64,175,.75)", borderRadius: 6, barPercentage: .55 },
        { label: "异常数量", data: data.map(d => d.abnormal), backgroundColor: "rgba(220,38,38,.7)", borderRadius: 6, barPercentage: .55 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, usePointStyle: true } } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#F1F5F9" }, ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" } },
        x: { grid: { display: false }, ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" } }
      }
    }
  });
}

function renderInspStatusChart() {
  const ctx = document.getElementById("inspStatusChart");
  if (!ctx) return;
  if (statsCharts.inspStatus) statsCharts.inspStatus.destroy();
  const data = inspStatusDist();
  statsCharts.inspStatus = new Chart(ctx, {
    type: "doughnut",
    data: { labels: data.map(d => d.label), datasets: [{ data: data.map(d => d.value), backgroundColor: data.map(d => d.color), borderWidth: 0, hoverOffset: 6 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { position: "bottom", labels: { boxWidth: 10, usePointStyle: true, padding: 12 } } } }
  });
}

/* 巡检数据量：按档案门类聚合应巡检 / 已巡检 / 异常数量 */
function inspVolumeByClass() {
  const records = (typeof INSPECTION_RECORDS !== "undefined") ? INSPECTION_RECORDS : [];
  const classes = [...new Set(records.map(r => r.dataClassificationName || "未分类"))];
  return classes.map(function(c) {
    const rs = records.filter(r => (r.dataClassificationName || "未分类") === c);
    return {
      label: c,
      should: rs.reduce(function(s, r) { return s + (Number(r.shouldCount) || 0); }, 0),
      has: rs.reduce(function(s, r) { return s + (Number(r.hasCount) || 0); }, 0),
      abnormal: rs.reduce(function(s, r) { return s + (r.status === "running" ? 0 : (Number(r.abnormalCount) || 0)); }, 0)
    };
  });
}

function renderInspVolChart() {
  const ctx = document.getElementById("inspVolChart");
  if (!ctx) return;
  if (statsCharts.inspVol) statsCharts.inspVol.destroy();
  const data = inspVolumeByClass();
  statsCharts.inspVol = new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map(d => d.label),
      datasets: [
        { label: "应巡检数量", data: data.map(d => d.should), backgroundColor: "rgba(148,163,184,.65)", borderRadius: 6, barPercentage: .6 },
        { label: "已巡检数量", data: data.map(d => d.has), backgroundColor: "rgba(30,64,175,.8)", borderRadius: 6, barPercentage: .6 },
        { label: "异常数量", data: data.map(d => d.abnormal), backgroundColor: "rgba(220,38,38,.75)", borderRadius: 6, barPercentage: .6 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, usePointStyle: true } } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#F1F5F9" }, ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" } },
        x: { grid: { display: false }, ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" } }
      }
    }
  });
}

/* ---- 保存趋势 / 档案门类分布（信息包数量 / 存储量两种统计方式） ---- */
let statsMode = "count"; /* "count" | "storage" */

function setStatsMode(mode, btn) {
  statsMode = mode;
  document.querySelectorAll(".stats-mode-btn").forEach(function(b) {
    const active = b.getAttribute("data-mode") === mode;
    b.classList.toggle("bg-slate-100", active);
    b.classList.toggle("text-ink", active);
    b.classList.toggle("text-slate-500", !active);
  });
  renderTrendChart();
  renderDistChart();
}

function trendSeries() {
  const count = statsMode === "count";
  return {
    label: count ? "信息包数量" : "存储量",
    data: count ? TREND.count : TREND.storage,
    color: count ? "#3B82F6" : "#1E40AF",
    bg: count ? "rgba(59,130,246,.12)" : "rgba(30,64,175,.08)"
  };
}

function renderTrendChart() {
  const ctx = document.getElementById("trendChart");
  if (!ctx) return;
  if (statsCharts.trend) statsCharts.trend.destroy();
  const s = trendSeries();
  statsCharts.trend = new Chart(ctx, {
    type: "line",
    data: { labels: TREND.labels, datasets: [
      { label: s.label, data: s.data, borderColor: s.color, backgroundColor: s.bg, fill: true, tension: .35, borderWidth: 2, pointRadius: 3, pointBackgroundColor: s.color }
    ]},
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10, usePointStyle: true } } },
      scales: {
        y: { grid: { color: "#F1F5F9" }, ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" } },
        x: { grid: { display: false }, ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" } }
      }
    }
  });
}

function renderDistChart() {
  const ctx = document.getElementById("distChart");
  if (!ctx) return;
  if (statsCharts.dist) statsCharts.dist.destroy();
  const count = statsMode === "count";
  const vals = count ? TYPE_DIST.map(x => x.count) : TYPE_DIST.map(x => x.storage);
  statsCharts.dist = new Chart(ctx, {
    type: "doughnut",
    data: { labels: TYPE_DIST.map(x => x.name), datasets: [{ data: vals, backgroundColor: TYPE_DIST.map(x => x.color), borderWidth: 0, hoverOffset: 6 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { position: "bottom", labels: { boxWidth: 10, usePointStyle: true, padding: 12 } } } }
  });
}

function refreshStats() {
  toast("数据已刷新", "success");
}

/* ---- 统计表导出（Excel 兼容 CSV） ---- */
function exportTrendExcel() {
  const headers = ["月份", "信息包数量(个)", "存储量(TB)"];
  const rows = TREND.labels.map(function(m, i) { return [m, TREND.count[i], TREND.storage[i]]; });
  downloadTextFile("保存趋势统计表_" + exportNow().slice(0, 10) + ".csv", buildCSV(headers, rows));
  toast("保存趋势统计表已导出", "success");
}

function exportDistExcel() {
  const headers = ["档案门类", "信息包数量(个)", "存储量(TB)"];
  const rows = TYPE_DIST.map(function(t) { return [t.name, t.count, t.storage]; });
  downloadTextFile("档案门类分布统计表_" + exportNow().slice(0, 10) + ".csv", buildCSV(headers, rows));
  toast("档案门类分布统计表已导出", "success");
}