/* ===== 数据统计 ===== */

const STATS_YEAR = 2026;
const STATS_MODE = "month";

/* 馆藏文件容量 - 各年度数据 */
const COLLECTION_YEARS = [
  { year: 2024, size: 0, unit: "B" },
  { year: 2025, size: 0, unit: "B" },
  { year: 2026, size: 15.24, unit: "GB" }
];

/* 馆藏文件容量 - 月度数据 (GB) */
const COLLECTION_MONTHLY = [
  { month: 1, value: 0 }, { month: 2, value: 0.12 }, { month: 3, value: 0.45 },
  { month: 4, value: 1.2 }, { month: 5, value: 3.8 }, { month: 6, value: 6.5 },
  { month: 7, value: 9.2 }, { month: 8, value: 15.24 }
];

/* 馆藏文件容量 - 季度数据 (GB) */
const COLLECTION_QUARTERLY = [
  { q: "Q1", value: 0.57 }, { q: "Q2", value: 11.5 }, { q: "Q3", value: 24.44 }, { q: "Q4", value: 0 }
];

/* ISO包容量 - 年度数据 (GB) */
const ISO_YEARLY = [
  { year: 2022, value: 0.5 }, { year: 2023, value: 1.2 }, { year: 2024, value: 2.8 },
  { year: 2025, value: 4.5 }, { year: 2026, value: 12.8 }
];

/* ISO包容量 - 季度数据 (GB) */
const ISO_QUARTERLY = [
  { q: "Q1", value: 1.2 }, { q: "Q2", value: 3.5 }, { q: "Q3", value: 8.1 }, { q: "Q4", value: 0 }
];

/* ISO包容量 - 月度数据 (GB) */
const ISO_MONTHLY = [
  { month: 1, value: 0.3 }, { month: 2, value: 0.4 }, { month: 3, value: 0.5 },
  { month: 4, value: 0.9 }, { month: 5, value: 1.4 }, { month: 6, value: 1.2 },
  { month: 7, value: 3.2 }, { month: 8, value: 5.3 }
];

/* 恢复包统计 (GB) */
const RESTORE_MONTHLY = [
  { month: 1, value: 0 }, { month: 2, value: 0.12 }, { month: 3, value: 0.08 },
  { month: 4, value: 0.25 }, { month: 5, value: 0.42 }, { month: 6, value: 0.38 },
  { month: 7, value: 0.65 }, { month: 8, value: 0.9 }
];

/* 备份包统计 */
const BACKUP_YEARS = [
  { year: 2026, items: [{ name: "硬盘备份", value: 3, total: 10 }] },
  { year: 2025, items: [{ name: "硬盘备份", value: 0, total: 5 }] },
  { year: 2024, items: [{ name: "硬盘备份", value: 0, total: 5 }] },
  { year: 2023, items: [{ name: "硬盘备份", value: 0, total: 5 }] },
];

let statsState = {
  collectionYear: 2026,
  collectionMode: "month",
  isoMode: "year",
  isoType: "archive",
};

let statsCharts = {};

function statsHTML() {
  return `
  <div class="p-6 space-y-5 animate-fade-in">
    <div class="grid grid-cols-12 gap-5">

      <!-- 馆藏文件容量统计 -->
      <div class="card overflow-hidden col-span-12 xl:col-span-8">
        ${chartHeaderHTML("馆藏文件容量统计", "hard-drive")}
        <div class="px-4 pb-4 pt-2">
          <div class="grid grid-cols-2 gap-6 items-center">
            <div class="flex items-end justify-around gap-4 pt-6 pb-4">
              ${COLLECTION_YEARS.map(y => `
                <div class="flex flex-col items-center gap-2">
                  <div class="text-xs text-slate-500 font-medium">${y.year}</div>
                  <div class="relative w-24 h-28">
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 rounded-t-full bg-gradient-to-b from-secondary/30 to-primary/20 border-2 border-primary/30 flex items-start justify-center pt-2 overflow-hidden">
                      <div class="text-xs font-semibold text-primary font-num">${y.size} ${y.unit}</div>
                    </div>
                    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full bg-gradient-to-b from-primary/20 to-transparent"></div>
                    <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-full bg-slate-200/60"></div>
                  </div>
                </div>
              `).join("")}
            </div>
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-end gap-2">
                <select id="collYear" class="field px-3 py-1.5 text-xs w-24" onchange="statsState.collectionYear=parseInt(this.value); renderCollectionChart()">
                  <option value="2026" ${statsState.collectionYear===2026?'selected':''}>2026</option>
                  <option value="2025" ${statsState.collectionYear===2025?'selected':''}>2025</option>
                  <option value="2024" ${statsState.collectionYear===2024?'selected':''}>2024</option>
                </select>
                <div class="flex bg-slate-100 rounded-lg p-0.5">
                  <button onclick="setCollMode('month')" class="px-3 py-1 rounded-md text-xs transition-colors ${statsState.collectionMode==='month'?'bg-white text-primary font-medium shadow-sm':'text-slate-600'}">按月</button>
                  <button onclick="setCollMode('quarter')" class="px-3 py-1 rounded-md text-xs transition-colors ${statsState.collectionMode==='quarter'?'bg-white text-primary font-medium shadow-sm':'text-slate-600'}">按季</button>
                </div>
              </div>
              <div class="h-48">
                <canvas id="collChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 备份包统计 -->
      <div class="card overflow-hidden col-span-12 xl:col-span-4">
        ${chartHeaderHTML("备份包统计", "save")}
        <div class="px-4 pb-4 space-y-2.5">
          ${BACKUP_YEARS.map(y => `
            <div class="rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-100 p-4">
              <div class="text-sm font-semibold text-primary mb-3 font-num">${y.year}</div>
              ${y.items.map(it => {
                const pct = y.total ? Math.round(it.value / y.total * 100) : 0;
                return `
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-600">${it.name}</span>
                    <span class="font-num text-slate-500">${it.value}</span>
                  </div>
                  <div class="h-2 bg-white rounded-full border border-slate-200/80 overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style="width:${pct}%"></div>
                  </div>
                </div>`;
              }).join("")}
            </div>
          `).join("")}
        </div>
      </div>

      <!-- iso包容量统计 -->
      <div class="card overflow-hidden col-span-12 md:col-span-6 xl:col-span-4">
        ${chartHeaderHTML("ISO包容量统计", "disc")}
        <div class="px-4 pb-4 pt-2">
          <div class="flex items-center justify-between mb-3">
            <select id="isoType" class="field px-3 py-1.5 text-xs w-24" onchange="statsState.isoType=this.value; renderIsoChart()">
              <option value="archive" ${statsState.isoType==='archive'?'selected':''}>馆藏</option>
              <option value="digital" ${statsState.isoType==='digital'?'selected':''}>数字馆</option>
            </select>
            <div class="flex bg-slate-100 rounded-lg p-0.5">
              <button onclick="setIsoMode('year')" class="px-3 py-1 rounded-md text-xs transition-colors ${statsState.isoMode==='year'?'bg-white text-primary font-medium shadow-sm':'text-slate-600'}">按年</button>
              <button onclick="setIsoMode('quarter')" class="px-3 py-1 rounded-md text-xs transition-colors ${statsState.isoMode==='quarter'?'bg-white text-primary font-medium shadow-sm':'text-slate-600'}">按季</button>
              <button onclick="setIsoMode('month')" class="px-3 py-1 rounded-md text-xs transition-colors ${statsState.isoMode==='month'?'bg-white text-primary font-medium shadow-sm':'text-slate-600'}">按月</button>
            </div>
          </div>
          <div class="h-48">
            <canvas id="isoChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 恢复包统计 -->
      <div class="card overflow-hidden col-span-12 md:col-span-6 xl:col-span-4">
        ${chartHeaderHTML("恢复包统计", "rotate-ccw")}
        <div class="px-4 pb-4 pt-2">
          <div class="h-52">
            <canvas id="restoreChart"></canvas>
          </div>
        </div>
      </div>

      <!-- 空列占位 (保持grid平衡，3列布局) -->
      <div class="hidden xl:block xl:col-span-4"></div>

    </div>
  </div>`;
}

function chartHeaderHTML(title, icon) {
  return `
  <div class="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
    <div class="flex items-center gap-2">
      <div class="w-1 h-4 rounded bg-primary"></div>
      <span class="text-sm font-semibold text-ink">${title}</span>
    </div>
    <button onclick="refreshStats()" class="btn-ghost w-7 h-7 rounded-lg flex items-center justify-center"><i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-slate-400"></i></button>
  </div>`;
}

function setCollMode(m) { statsState.collectionMode = m; renderCollectionChart(); }
function setIsoMode(m) { statsState.isoMode = m; renderIsoChart(); }

function renderCollectionChart() {
  const ctx = document.getElementById("collChart");
  if (!ctx) return;
  if (statsCharts.coll) statsCharts.coll.destroy();
  const data = statsState.collectionMode === "month" ? COLLECTION_MONTHLY : COLLECTION_QUARTERLY;
  const labels = statsState.collectionMode === "month"
    ? data.map(d => d.month + "月")
    : data.map(d => d.q);
  const values = data.map(d => d.value);
  statsCharts.coll = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "容量 (GB)",
        data: values,
        borderColor: "#1E40AF",
        backgroundColor: "rgba(59, 130, 246, 0.12)",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#1E40AF",
        pointBorderWidth: 2,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#F1F5F9" },
          ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" }
        }
      }
    }
  });
}

function renderIsoChart() {
  const ctx = document.getElementById("isoChart");
  if (!ctx) return;
  if (statsCharts.iso) statsCharts.iso.destroy();
  let data, labels;
  if (statsState.isoMode === "year") {
    data = ISO_YEARLY;
    labels = data.map(d => d.year);
  } else if (statsState.isoMode === "quarter") {
    data = ISO_QUARTERLY;
    labels = data.map(d => d.q);
  } else {
    data = ISO_MONTHLY;
    labels = data.map(d => d.month + "月");
  }
  const values = data.map(d => d.value);
  statsCharts.iso = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "容量 (GB)",
        data: values,
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.12)",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#10B981",
        pointBorderWidth: 2,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#F1F5F9" },
          ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8", callback: function(v){ return v + "G"; } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" }
        }
      }
    }
  });
}

function renderRestoreChart() {
  const ctx = document.getElementById("restoreChart");
  if (!ctx) return;
  if (statsCharts.restore) statsCharts.restore.destroy();
  const labels = RESTORE_MONTHLY.map(d => d.month + "月");
  const values = RESTORE_MONTHLY.map(d => d.value);
  statsCharts.restore = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "容量 (GB)",
        data: values,
        borderColor: "#1E40AF",
        backgroundColor: "rgba(30, 64, 175, 0.06)",
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#1E40AF",
        pointBorderWidth: 2,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: "#F1F5F9" },
          ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" }
        },
        x: {
          grid: { display: false },
          ticks: { font: { family: "Fira Code", size: 10 }, color: "#94A3B8" }
        }
      }
    }
  });
}

function initStatsCharts() {
  Object.values(statsCharts).forEach(c => c && c.destroy && c.destroy());
  statsCharts = {};
  renderCollectionChart();
  renderIsoChart();
  renderRestoreChart();
}

function refreshStats() {
  toast("数据已刷新", "success");
}