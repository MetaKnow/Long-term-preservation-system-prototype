/* ===== 长久保存系统 - 测试数据与菜单配置 ===== */

/* 菜单结构（一级 + 二级） */
const MENU = [
  { key: "dashboard", title: "工作台", icon: "layout-dashboard" },
  { key: "data", title: "长保中心", icon: "database", children: [
    { key: "data-reception", title: "数据接收", icon: "download" },
    { key: "data-encapsulation", title: "数据装盘", icon: "package" },
    { key: "data-outbound", title: "出库记录", icon: "upload-cloud" },
  ]},
  { key: "data-stats", title: "数据统计", icon: "bar-chart-3" },
  { key: "security", title: "安全中心", icon: "shield-check", children: [
    { key: "security-inspection", title: "数据巡检", icon: "search-check" },
    { key: "security-warning", title: "系统预警", icon: "alert-triangle" },
  ]},
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
  { key: "data-outbound", title: "出库记录", icon: "upload-cloud", tone: "accent" },
];

/* KPI 卡片 */
const KPI = [
  { label: "信息包总个数", value: "1,284", unit: "个", delta: "+8.2%", up: true, icon: "archive", tone: "primary" },
  { label: "存储总量", value: "1,624", unit: "TB", delta: "+12.5%", up: true, icon: "database", tone: "secondary" },
  { label: "存储使用率", value: "68.4", unit: "%", delta: "+2.1%", up: true, icon: "hard-drive", tone: "accent" },
  { label: "光盘使用状态", value: "128 / 32", unit: "张", delta: "+6 张", up: true, icon: "disc", tone: "danger" },
];

/* 保存趋势（近 12 个月，支持信息包数量 / 存储量两种统计） */
const TREND = {
  labels: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
  count:   [42,48,55,51,60,66,70,74,69,78,82,88],
  storage: [38.4,44.2,50.6,49.1,56.8,61.3,65.5,68.9,66.4,72.1,76.8,82.3],
};

/* 档案门类分布（信息包数量 / 存储量） */
const TYPE_DIST = [
  { name: "文书档案", count: 486, storage: 412.6, color: "#1E40AF" },
  { name: "声像档案", count: 232, storage: 523.8, color: "#3B82F6" },
  { name: "科技档案", count: 198, storage: 301.2, color: "#60A5FA" },
  { name: "电子文件", count: 246, storage: 218.4, color: "#F59E0B" },
  { name: "其他", count: 122, storage: 168.0, color: "#94A3B8" },
];

/* 预警列表（顶栏消息提醒） */
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
