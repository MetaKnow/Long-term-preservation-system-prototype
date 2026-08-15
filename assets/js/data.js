/* ===== 长久保存系统 - 测试数据与菜单配置 ===== */

/* 菜单结构（一级 + 二级） */
const MENU = [
  { key: "dashboard", title: "工作台", icon: "layout-dashboard" },
  { key: "data", title: "数据中心", icon: "database", children: [
    { key: "data-reception", title: "数据接收", icon: "download" },
    { key: "data-encapsulation", title: "数据装盘", icon: "package" },
    { key: "data-outbound", title: "数据出库", icon: "upload-cloud" },
  ]},
  { key: "preserve-center", title: "长保中心", icon: "boxes", children: [
    { key: "preserve-pkg", title: "长久保存信息包", icon: "archive" },
    { key: "preserve-iso", title: "ISO包", icon: "disc" },
  ]},
  { key: "security", title: "安全中心", icon: "shield-check", children: [
    { key: "security-inspection", title: "数据巡检", icon: "search-check" },
    { key: "security-warning", title: "系统预警", icon: "alert-triangle" },
    { key: "security-preserve", title: "数据保全", icon: "shield" },
  ]},
  { key: "data-stats", title: "数据统计", icon: "bar-chart-3" },
  { key: "system-settings", title: "系统设置", icon: "settings-2", children: [
    { key: "biz-config", title: "业务配置", icon: "settings", children: [
      { key: "storage-manage", title: "存储管理", icon: "server" },
      { key: "carrier-manage", title: "载体管理", icon: "hard-drive" },
      { key: "timing-task", title: "任务管理", icon: "clock" },
      { key: "data-dict", title: "数据字典", icon: "book-open" },
      { key: "detection-setting", title: "检测设置", icon: "sliders-horizontal" },
    ]},
    { key: "sys-config", title: "系统配置", icon: "cog", children: [
      { key: "param-manage", title: "参数管理", icon: "sliders" },
      { key: "org-manage", title: "机构管理", icon: "building-2" },
      { key: "user-manage", title: "用户管理", icon: "users" },
      { key: "role-permission", title: "角色权限", icon: "key-round" },
      { key: "log-manage", title: "日志管理", icon: "file-text" },
      { key: "interface-manage", title: "接口管理", icon: "plug" },
      { key: "security-manage", title: "安全管理", icon: "shield-check" },
    ]},
  ]},
];

/* 当前用户 */
const CURRENT_USER = {
  name: "保全管理员",
  role: "管理员 · 保管科",
  avatar: "保",
};

/* 快捷入口 */
const QUICK_ACCESS = [
  { key: "data-reception", title: "数据接收", icon: "download", tone: "primary" },
  { key: "data-encapsulation", title: "数据装盘", icon: "package", tone: "secondary" },
  { key: "data-outbound", title: "数据出库", icon: "upload-cloud", tone: "accent" },
  { key: "preserve-pkg", title: "长久保存信息包", icon: "archive", tone: "primary" },
  { key: "preserve-iso", title: "ISO包", icon: "disc", tone: "secondary" },
];

/* KPI 卡片 */
const KPI = [
  { label: "总保存数据量", value: "1,284,672", unit: "万条", delta: "+12.5%", up: true, icon: "database", tone: "primary" },
  { label: "今日接收", value: "8,452", unit: "条", delta: "+5.2%", up: true, icon: "download", tone: "secondary" },
  { label: "存储使用率", value: "68.4", unit: "%", delta: "+2.1%", up: true, icon: "hard-drive", tone: "accent" },
  { label: "待处理预警", value: "7", unit: "项", delta: "-3", up: false, icon: "alert-triangle", tone: "danger" },
];

/* 保存趋势（近 12 个月） */
const TREND = {
  labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  receive: [42,48,55,51,60,66,70,74,69,78,82,88],
  save:    [38,44,50,49,56,61,65,68,66,72,76,82],
};

/* 数据类型分布 */
const TYPE_DIST = [
  { name: "文书档案", value: 486, color: "#1E40AF" },
  { name: "声像档案", value: 232, color: "#3B82F6" },
  { name: "科技档案", value: 198, color: "#60A5FA" },
  { name: "电子文件", value: 246, color: "#F59E0B" },
  { name: "其他", value: 122, color: "#94A3B8" },
];

/* 存储池状态 */
const STORAGE = [
  { name: "主存储池", used: 462, total: 640, unit: "TB" },
  { name: "备份存储池", used: 388, total: 640, unit: "TB" },
  { name: "归档存储池", used: 521, total: 800, unit: "TB" },
  { name: "异灾存储池", used: 196, total: 640, unit: "TB" },
];

/* 最近活动 */
const ACTIVITIES = [
  { time: "10:42", user: "张明", action: "接收", target: "2024年度文书档案（第3批）", type: "receive" },
  { time: "10:15", user: "李华", action: "封装", target: "科研项目声像档案包 #A2087", type: "encapsulate" },
  { time: "09:58", user: "系统", action: "备份", target: "主存储池增量备份完成", type: "backup" },
  { time: "09:30", user: "王芳", action: "检测", target: "载体完整性检测（磁带库B）", type: "inspect" },
  { time: "09:12", user: "赵磊", action: "预警", target: "归档存储池容量达 88%", type: "warn" },
  { time: "08:50", user: "系统", action: "迁移", target: "冷数据迁移至归档池（1.2TB）", type: "migrate" },
  { time: "08:20", user: "孙静", action: "恢复", target: "恢复请求 #RR-2231 已完成", type: "restore" },
  { time: "昨日", user: "周强", action: "溯源", target: "档案 #D20240315 溯源链路校验", type: "trace" },
];

/* 预警列表 */
const ALERTS = [
  { level: "高", title: "归档存储池容量超过阈值", desc: "当前 88%，建议扩容或迁移冷数据", time: "09:12" },
  { level: "中", title: "磁带库B 出现读写重试", desc: "近 24 小时重试 12 次，请检查载体", time: "08:40" },
  { level: "中", title: "检测方案 SOP-07 待审批", desc: "提交人：李华，已等待 2 天", time: "昨日" },
  { level: "低", title: "定时任务延时执行", desc: "数据封装任务 #T-3391 延时 8 分钟", time: "昨日" },
];

/* 各模块中文名映射（占位页用） */
const MODULE_NAMES = {};
(function build(){
  function walk(items) {
    items.forEach(function(it) {
      if (it.children) { MODULE_NAMES[it.key] = it.title; walk(it.children); }
      else MODULE_NAMES[it.key] = it.title;
    });
  }
  MENU.forEach(m => {
    MODULE_NAMES[m.key] = m.title;
    if (m.children) walk(m.children);
  });
})();

/* 根据 key 查面包屑路径 */
function findMenuPath(key) {
  const path = [];
  function walk(items, trail) {
    for (const it of items) {
      const next = trail.concat([it.title]);
      if (it.key === key) { path.push(...next); return true; }
      if (it.children && walk(it.children, next)) return true;
    }
    return false;
  }
  walk(MENU, []);
  return path;
}
