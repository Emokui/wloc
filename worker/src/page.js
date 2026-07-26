export function getPageHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>WLOC</title>
<meta name="color-scheme" content="light dark">
<meta name="theme-color" id="themeColor" content="#edf2f7">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="WLOC">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<script>
(() => {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('wloc_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') preference = saved;
  } catch (e) {}
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  document.getElementById('themeColor').content = resolved === 'dark' ? '#0b1018' : '#edf2f7';
})();
<\/script>
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
<style>
:root {
  color-scheme:light;
  --blue:#2563eb;
  --blue-dark:#1d4ed8;
  --blue-soft:#eef4ff;
  --green:#16a364;
  --red:#e5484d;
  --ink:#172033;
  --muted:#6b7485;
  --line:rgba(23,32,51,.09);
  --surface:rgba(255,255,255,.96);
  --soft:#f4f7fb;
  --bg:#edf2f7;
  --shadow:0 18px 50px rgba(35,55,80,.12);
  --body-bg:radial-gradient(circle at 15% 0%,rgba(37,99,235,.08),transparent 35%),linear-gradient(180deg,#f8fafc 0%,var(--bg) 100%);
  --map-bg:#dce5ef;
  --glass-border:rgba(255,255,255,.72);
  --layer-bg:rgba(255,255,255,.9);
  --layer-shadow:0 8px 30px rgba(20,35,55,.16);
  --layer-text:#4d586b;
  --zoom-bg:rgba(255,255,255,.92);
  --zoom-hover:#f2f5f8;
  --zoom-shadow:0 8px 24px rgba(20,35,55,.15);
  --attribution-text:#667085;
  --attribution-bg:rgba(255,255,255,.78);
  --attribution-link:#1d4ed8;
  --card-border:rgba(255,255,255,.75);
  --coords-text:#24406f;
  --coords-border:rgba(37,99,235,.1);
  --coords-bg:linear-gradient(135deg,var(--blue-soft),#f8fbff);
  --secondary-text:#344054;
  --secondary-active:#e8edf4;
  --placeholder:#98a2b3;
  --field-focus:#fff;
  --search-text:#fff;
  --search-bg:#172033;
  --search-active:#253147;
  --error-text:#8f2428;
  --error-border:rgba(229,72,77,.15);
  --error-bg:rgba(255,241,242,.96);
  --error-shadow:0 12px 36px rgba(120,30,35,.1);
  --toast-border:rgba(255,255,255,.12);
  --toast-bg:rgba(20,29,43,.9);
  --toast-shadow:0 12px 35px rgba(0,0,0,.2);
  --overlay-bg:rgba(12,19,31,.42);
  --modal-border:rgba(255,255,255,.8);
  --modal-bg:#fff;
  --modal-shadow:0 28px 80px rgba(10,20,35,.3);
  --hover-secondary:#edf1f6;
  --hover-favorite:#f0f4f9;
}
:root[data-theme="dark"] {
  color-scheme:dark;
  --blue:#60a5fa;
  --blue-dark:#2563eb;
  --blue-soft:rgba(59,130,246,.14);
  --green:#42d392;
  --red:#ff6b70;
  --ink:#eef3f9;
  --muted:#9aa6b5;
  --line:rgba(255,255,255,.1);
  --surface:rgba(18,25,36,.96);
  --soft:#17202d;
  --bg:#0b1018;
  --shadow:0 18px 50px rgba(0,0,0,.34);
  --body-bg:radial-gradient(circle at 15% 0%,rgba(59,130,246,.16),transparent 35%),linear-gradient(180deg,#111827 0%,var(--bg) 100%);
  --map-bg:#151d29;
  --glass-border:rgba(255,255,255,.1);
  --layer-bg:rgba(18,25,36,.9);
  --layer-shadow:0 8px 30px rgba(0,0,0,.34);
  --layer-text:#b8c2cf;
  --zoom-bg:rgba(18,25,36,.94);
  --zoom-hover:#202b39;
  --zoom-shadow:0 8px 24px rgba(0,0,0,.3);
  --attribution-text:#aeb8c5;
  --attribution-bg:rgba(18,25,36,.82);
  --attribution-link:#bfdbfe;
  --card-border:rgba(255,255,255,.08);
  --coords-text:#bfdbfe;
  --coords-border:rgba(96,165,250,.2);
  --coords-bg:linear-gradient(135deg,rgba(37,99,235,.16),#131c28);
  --secondary-text:#d6deea;
  --secondary-active:#202c3b;
  --placeholder:#758196;
  --field-focus:#111923;
  --search-text:#111827;
  --search-bg:#e6edf7;
  --search-active:#cdd7e4;
  --error-text:#fecaca;
  --error-border:rgba(255,107,112,.2);
  --error-bg:rgba(73,23,29,.92);
  --error-shadow:0 12px 36px rgba(0,0,0,.22);
  --toast-border:rgba(255,255,255,.1);
  --toast-bg:rgba(5,10,17,.92);
  --toast-shadow:0 12px 35px rgba(0,0,0,.4);
  --overlay-bg:rgba(3,7,13,.68);
  --modal-border:rgba(255,255,255,.1);
  --modal-bg:#111923;
  --modal-shadow:0 28px 80px rgba(0,0,0,.55);
  --hover-secondary:#202c3b;
  --hover-favorite:#1c2633;
}
* { margin:0; padding:0; box-sizing:border-box; }
html { background:var(--bg); }
body {
  min-height:100vh;
  color:var(--ink);
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Helvetica Neue",sans-serif;
  background:var(--body-bg);
  -webkit-font-smoothing:antialiased;
}
button,input,textarea { font:inherit; }
button { -webkit-tap-highlight-color:transparent; }
.map-shell { position:relative; background:var(--map-bg); overflow:hidden; }
#map { height:clamp(340px,52vh,580px); width:100%; }
.leaflet-top { padding-top:env(safe-area-inset-top); }
.layer-switch {
  position:absolute;
  right:14px;
  bottom:48px;
  z-index:1000;
  display:flex;
  gap:3px;
  padding:4px;
  border:1px solid var(--glass-border);
  border-radius:14px;
  background:var(--layer-bg);
  box-shadow:var(--layer-shadow);
  backdrop-filter:blur(18px) saturate(150%);
  -webkit-backdrop-filter:blur(18px) saturate(150%);
}
.layer-btn {
  border:0;
  padding:8px 11px;
  color:var(--layer-text);
  border-radius:10px;
  background:transparent;
  cursor:pointer;
  font-size:12px;
  font-weight:650;
  transition:background .2s,color .2s,transform .15s,box-shadow .2s;
  white-space:nowrap;
}
.layer-btn.active {
  color:#fff;
  background:linear-gradient(145deg,#3b82f6,var(--blue-dark));
  box-shadow:0 4px 10px rgba(37,99,235,.28);
}
.layer-btn:active { transform:scale(.95); }
.leaflet-control-zoom { border:0!important; border-radius:13px!important; overflow:hidden; box-shadow:var(--zoom-shadow)!important; }
.leaflet-control-zoom a { color:var(--ink)!important; border-color:var(--line)!important; background:var(--zoom-bg)!important; }
.leaflet-control-zoom a:hover { background:var(--zoom-hover)!important; }
.leaflet-control-attribution {
  padding:2px 5px!important;
  color:var(--attribution-text)!important;
  background:var(--attribution-bg)!important;
  font-size:9px!important;
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
}
.leaflet-control-attribution a { color:var(--attribution-link)!important; }
.panel {
  position:relative;
  z-index:1100;
  max-width:700px;
  margin:0 auto;
  padding:22px 16px calc(76px + env(safe-area-inset-bottom));
}
.card {
  margin-bottom:14px;
  padding:20px;
  border:1px solid var(--card-border);
  border-radius:22px;
  background:var(--surface);
  box-shadow:var(--shadow);
  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);
}
.card-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:14px; }
.card h3 { font-size:17px; font-weight:750; letter-spacing:-.02em; }
.card-heading p { margin-top:4px; color:var(--muted); font-size:12px; line-height:1.45; }
.coords {
  min-height:48px;
  display:flex;
  align-items:center;
  padding:13px 14px;
  color:var(--coords-text);
  border:1px solid var(--coords-border);
  border-radius:14px;
  background:var(--coords-bg);
  font-family:"SF Mono",ui-monospace,Menlo,monospace;
  font-size:13px;
  font-weight:600;
  line-height:1.5;
  word-break:break-all;
}
.row { display:flex; gap:9px; margin-top:12px; flex-wrap:wrap; }
.btn {
  flex:1;
  min-width:104px;
  min-height:44px;
  padding:11px 15px;
  border:1px solid transparent;
  border-radius:13px;
  cursor:pointer;
  font-size:14px;
  font-weight:650;
  transition:transform .15s,box-shadow .2s,background .2s,color .2s,opacity .2s;
}
.btn:disabled { opacity:.6; cursor:default; }
.btn-primary {
  color:#fff;
  background:linear-gradient(145deg,#3b82f6,var(--blue-dark));
  box-shadow:0 8px 18px rgba(37,99,235,.24);
}
.btn-primary:active { transform:scale(.98); box-shadow:0 4px 10px rgba(37,99,235,.2); }
.btn-secondary { color:var(--secondary-text); border-color:var(--line); background:var(--soft); }
.btn-secondary:active { background:var(--secondary-active); transform:scale(.98); }
.btn-danger { color:var(--red); border-color:rgba(229,72,77,.14); background:rgba(229,72,77,.08); }
.btn-danger:active { background:rgba(229,72,77,.14); transform:scale(.98); }
.btn.success { color:#fff; border-color:transparent; background:linear-gradient(145deg,#27b773,#128954); box-shadow:0 8px 18px rgba(22,163,100,.22); }
.btn-sm { flex:none; min-width:auto; min-height:36px; padding:8px 12px; border-radius:11px; font-size:12px; }
.input-row {
  display:grid;
  width:100%;
  grid-template-columns:minmax(0,1fr) auto;
  gap:10px;
  align-items:start;
}
.input-row textarea {
  width:100%;
  min-height:48px;
  height:48px;
  padding:13px 14px;
  color:var(--ink);
  border:1px solid var(--line);
  border-radius:14px;
  background:var(--soft);
  outline:none;
  resize:none;
  overflow-y:hidden;
  font-size:14px;
  line-height:1.5;
  transition:border-color .2s,box-shadow .2s,background .2s;
}
.input-row textarea::placeholder { color:var(--placeholder); }
.input-row textarea:focus { border-color:rgba(37,99,235,.5); background:var(--field-focus); box-shadow:0 0 0 4px rgba(37,99,235,.1); }
.search-btn { min-width:74px; min-height:48px; color:var(--search-text); background:var(--search-bg); box-shadow:none; }
.search-btn:active { background:var(--search-active); transform:scale(.98); }
.helper { margin-top:8px; color:var(--muted); font-size:11px; line-height:1.45; }
.error-banner {
  display:none;
  margin-bottom:14px;
  padding:16px 18px;
  color:var(--error-text);
  border:1px solid var(--error-border);
  border-radius:18px;
  background:var(--error-bg);
  box-shadow:var(--error-shadow);
  font-size:13px;
  line-height:1.6;
}
.error-banner b { display:block; margin-bottom:4px; font-size:15px; }
.toast {
  position:fixed;
  left:50%;
  bottom:calc(24px + env(safe-area-inset-bottom));
  z-index:20000;
  max-width:calc(100vw - 32px);
  padding:11px 18px;
  color:#fff;
  border:1px solid var(--toast-border);
  border-radius:99px;
  background:var(--toast-bg);
  box-shadow:var(--toast-shadow);
  backdrop-filter:blur(16px);
  -webkit-backdrop-filter:blur(16px);
  opacity:0;
  transform:translate(-50%,10px);
  pointer-events:none;
  font-size:13px;
  text-align:center;
  transition:opacity .25s,transform .25s;
}
.toast.show { opacity:1; transform:translate(-50%,0); }
.active-loc {
  padding:14px;
  color:var(--ink);
  border:1px solid var(--line);
  border-radius:14px;
  background:var(--soft);
  font-size:13px;
}
.active-loc .label { margin-bottom:6px; color:var(--muted); font-size:10px; font-weight:650; letter-spacing:.04em; text-transform:uppercase; }
.active-loc .value { font-family:"SF Mono",ui-monospace,Menlo,monospace; font-size:12px; line-height:1.5; }
.fav-list { max-height:260px; overflow-y:auto; }
.fav-item {
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:8px;
  padding:12px 13px;
  border:1px solid transparent;
  border-radius:14px;
  background:var(--soft);
  cursor:pointer;
  transition:background .18s,border-color .18s,transform .15s;
}
.fav-item:last-child { margin-bottom:0; }
.fav-item:active { background:var(--blue-soft); border-color:rgba(37,99,235,.1); transform:scale(.99); }
.fav-item .fav-info { flex:1; min-width:0; }
.fav-item .fav-name { overflow:hidden; color:var(--ink); font-size:14px; font-weight:650; text-overflow:ellipsis; white-space:nowrap; }
.fav-item .fav-coords { margin-top:3px; color:var(--muted); font-family:"SF Mono",ui-monospace,Menlo,monospace; font-size:10px; }
.fav-item .fav-active { margin-top:4px; color:var(--green); font-size:10px; font-weight:700; }
.fav-item .fav-del {
  flex:none;
  width:32px;
  height:32px;
  display:grid;
  place-items:center;
  color:var(--red);
  border:0;
  border-radius:50%;
  background:transparent;
  cursor:pointer;
  font-size:17px;
  transition:background .15s;
}
.fav-item .fav-del:hover { background:rgba(229,72,77,.09); }
.fav-empty { padding:22px 0 12px; color:var(--muted); font-size:12px; text-align:center; }
.fav-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
.fav-header h3 { margin:0; }
.modal-overlay {
  position:fixed;
  inset:0;
  z-index:30000;
  display:none;
  align-items:center;
  justify-content:center;
  padding:20px;
  background:var(--overlay-bg);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
}
.modal-overlay.show { display:flex; }
.modal {
  width:100%;
  max-width:360px;
  padding:22px;
  border:1px solid var(--modal-border);
  border-radius:24px;
  background:var(--modal-bg);
  box-shadow:var(--modal-shadow);
}
.modal h3 { margin-bottom:16px; font-size:18px; font-weight:750; text-align:center; letter-spacing:-.02em; }
.modal input {
  width:100%;
  margin-bottom:12px;
  padding:13px 14px;
  color:var(--ink);
  border:1px solid var(--line);
  border-radius:13px;
  background:var(--soft);
  outline:none;
  font-size:15px;
}
.modal input::placeholder { color:var(--placeholder); }
.modal input:focus { border-color:rgba(37,99,235,.5); background:var(--field-focus); box-shadow:0 0 0 4px rgba(37,99,235,.1); }
.modal .modal-btns { display:flex; gap:9px; }
.modal .modal-btns .btn { padding:11px; }
.theme-toggle {
  position:fixed;
  right:14px;
  bottom:calc(14px + env(safe-area-inset-bottom));
  z-index:15000;
  display:flex;
  align-items:center;
  gap:6px;
  min-height:38px;
  padding:8px 11px;
  color:var(--ink);
  border:1px solid var(--line);
  border-radius:99px;
  background:var(--surface);
  box-shadow:0 8px 28px rgba(0,0,0,.18);
  backdrop-filter:blur(16px) saturate(145%);
  -webkit-backdrop-filter:blur(16px) saturate(145%);
  cursor:pointer;
  font-size:11px;
  font-weight:700;
  line-height:1;
  transition:transform .15s,background .2s,color .2s,border-color .2s;
}
.theme-toggle:active { transform:scale(.96); }
.theme-icon { width:15px; font-size:15px; text-align:center; }
.btn:focus-visible,.layer-btn:focus-visible,.theme-toggle:focus-visible,.modal input:focus-visible,.input-row textarea:focus-visible { outline:3px solid rgba(37,99,235,.25); outline-offset:2px; }
@media (hover:hover) {
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 10px 22px rgba(37,99,235,.3); }
  .btn-secondary:hover { background:var(--hover-secondary); }
  .fav-item:hover { border-color:var(--line); background:var(--hover-favorite); }
  .theme-toggle:hover { transform:translateY(-1px); }
}
@media(max-width:540px) {
  #map { height:46vh; min-height:330px; }
  .panel { padding:18px 12px calc(72px + env(safe-area-inset-bottom)); }
  .card { padding:17px; border-radius:19px; }
  .layer-switch { right:12px; bottom:42px; }
  .layer-btn { padding:7px 9px; font-size:11px; }
  .input-row { grid-template-columns:1fr; }
  .input-row textarea { min-height:48px; height:48px; }
  .search-btn { width:100%; }
  .theme-toggle { right:12px; bottom:calc(12px + env(safe-area-inset-bottom)); }
}
</style>
</head>
<body>
<div class="map-shell">
<div id="map"></div>
<div class="layer-switch">
  <button type="button" class="layer-btn active" data-layer="satellite" onclick="switchLayer('satellite')">卫星</button>
  <button type="button" class="layer-btn" data-layer="street" onclick="switchLayer('street')">街道</button>
  <button type="button" class="layer-btn" data-layer="standard" onclick="switchLayer('standard')">标准</button>
</div>
</div>
<div class="panel">
  <div class="error-banner" id="errorBanner">
    <b>模块未生效</b>
    请检查以下配置：<br>
    1. 已安装并启用 WLOC 定位模块<br>
    2. MITM 已开启且信任证书<br>
    3. MITM 主机名包含 gs-loc.apple.com<br>
    4. 当前网络已走代理
  </div>
  <div class="card">
    <div class="card-heading">
      <div>
        <h3>搜索地点</h3>
        <p>输入地址、街道名称或邮政编码</p>
      </div>
    </div>
    <div class="input-row">
      <textarea id="searchInput" rows="1" placeholder="输入或粘贴地址" aria-label="地点或地址" autocomplete="street-address" enterkeyhint="search"></textarea>
      <button type="button" class="btn search-btn" onclick="searchPlace()">搜索</button>
    </div>
    <div class="helper">支持多行地址 · Shift + Enter 换行</div>
  </div>
  <div class="card">
    <div class="card-heading">
      <div>
        <h3>选择目标位置</h3>
        <p>搜索后微调标记，或直接轻触地图选点</p>
      </div>
    </div>
    <div class="coords" id="coords">尚未选择目标位置</div>
    <div class="row">
      <button type="button" class="btn btn-primary" id="saveBtn" onclick="save()">储存到设备</button>
      <button type="button" class="btn btn-secondary" onclick="addFav()">收藏位置</button>
      <button type="button" class="btn btn-secondary" onclick="locateMe()">当前位置</button>
    </div>
  </div>
  <div class="card">
    <div class="card-heading">
      <div>
        <h3>当前生效坐标</h3>
      </div>
    </div>
    <div class="active-loc" id="activeLoc">
      <div class="value" id="activeValue">查询中...</div>
    </div>
    <div class="row">
      <button type="button" class="btn btn-sm btn-secondary" onclick="queryActive()">刷新</button>
      <button type="button" class="btn btn-sm btn-danger" onclick="clearActive()">清除数据</button>
    </div>
  </div>
  <div class="card">
    <div class="fav-header">
      <h3>收藏的位置</h3>
      <button type="button" class="btn btn-sm btn-secondary" onclick="clearAllFav()" id="clearAllBtn" style="display:none">清空全部</button>
    </div>
    <div id="favList" class="fav-list"></div>
  </div>
</div>
<div class="toast" id="toast"></div>
<div class="modal-overlay" id="favModal" role="dialog" aria-modal="true" aria-labelledby="favModalTitle">
  <div class="modal">
    <h3 id="favModalTitle">收藏此位置</h3>
    <input id="favNameInput" placeholder="输入备注名称（如: 公司、家）" maxlength="30" />
    <div style="font-size:12px;color:var(--muted);margin-bottom:12px;text-align:center" id="favModalCoords"></div>
    <div class="modal-btns">
      <button type="button" class="btn btn-secondary" onclick="closeFavModal()">取消</button>
      <button type="button" class="btn btn-primary" onclick="confirmFav()">保存</button>
    </div>
  </div>
</div>
<button type="button" class="theme-toggle" id="themeToggle">
  <span class="theme-icon" id="themeIcon" aria-hidden="true">◐</span>
  <span id="themeLabel">自动</span>
</button>
<script>
const SAVE_API = 'https://gs-loc.apple.com/wloc-settings/save';
const FAV_KEY = 'wloc_favorites';
const THEME_KEY = 'wloc_theme';
let lat = null, lon = null;
let selected = false;
let activeLon = null, activeLat = null;

const themeMedia = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : {matches:false};
const themeModes = {
  system: {icon:'◐', label:'自动'},
  light: {icon:'☀', label:'亮色'},
  dark: {icon:'☾', label:'暗色'}
};
let themePreference = document.documentElement.dataset.themePreference || 'system';

function applyTheme(preference, persist) {
  if (!themeModes[preference]) preference = 'system';
  themePreference = preference;
  const resolved = preference === 'system' ? (themeMedia.matches ? 'dark' : 'light') : preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  document.getElementById('themeColor').content = resolved === 'dark' ? '#0b1018' : '#edf2f7';
  document.getElementById('themeIcon').textContent = themeModes[preference].icon;
  document.getElementById('themeLabel').textContent = themeModes[preference].label;
  const button = document.getElementById('themeToggle');
  button.setAttribute('aria-label', '当前主题：' + themeModes[preference].label + '，轻触切换');
  button.title = '主题：' + themeModes[preference].label;
  if (persist !== false) {
    try { localStorage.setItem(THEME_KEY, preference); } catch (e) {}
  }
}

function cycleTheme() {
  const order = ['system', 'light', 'dark'];
  const next = order[(order.indexOf(themePreference) + 1) % order.length];
  applyTheme(next, true);
}

document.getElementById('themeToggle').addEventListener('click', cycleTheme);
const handleSystemThemeChange = () => {
  if (themePreference === 'system') applyTheme('system', false);
};
if (themeMedia.addEventListener) {
  themeMedia.addEventListener('change', handleSystemThemeChange);
} else if (themeMedia.addListener) {
  themeMedia.addListener(handleSystemThemeChange);
}
applyTheme(themePreference, false);

const map = L.map('map').setView([20, 0], 2);
map.attributionControl.setPrefix(false);
const tiles = {
  satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {maxZoom:19, attribution:'ArcGIS'}),
  street: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {maxZoom:19, attribution:'ArcGIS'}),
  standard: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom:19,
    attribution:'\\u00a9 <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'
  })
};
let currentLayer = tiles.satellite;
currentLayer.addTo(map);
function switchLayer(name) {
  map.removeLayer(currentLayer);
  currentLayer = tiles[name];
  currentLayer.addTo(map);
  document.querySelectorAll('.layer-btn').forEach(b => b.classList.toggle('active', b.dataset.layer === name));
}

let marker = null;
map.on('click', e => { setPos(e.latlng.lat, e.latlng.lng); });

function setPos(newLat, newLon) {
  lat = newLat; lon = newLon; selected = true;
  if (marker) {
    marker.setLatLng([lat, lon]);
  } else {
    marker = L.marker([lat, lon], {draggable:true}).addTo(map);
    marker.on('dragend', e => {
      const p = e.target.getLatLng();
      setPos(p.lat, p.lng);
    });
  }
  document.getElementById('coords').textContent = '经度 ' + lon.toFixed(6) + '  纬度 ' + lat.toFixed(6);
}

function moveTo(newLat, newLon, zoom) {
  setPos(newLat, newLon);
  map.setView([lat, lon], zoom || 15);
}

function toast(msg, ms) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms || 2500);
}

function showError(show) {
  document.getElementById('errorBanner').style.display = show ? 'block' : 'none';
}

/* ---- Favorites (localStorage) ---- */
function getFavs() {
  try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch(e) { return []; }
}
function saveFavs(favs) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

function renderFavs() {
  const favs = getFavs();
  const el = document.getElementById('favList');
  const clearBtn = document.getElementById('clearAllBtn');
  clearBtn.style.display = favs.length ? '' : 'none';
  if (!favs.length) {
    el.innerHTML = '<div class="fav-empty">暂无收藏，选好位置后点击「收藏位置」</div>';
    return;
  }
  el.innerHTML = favs.map((f, i) => {
    const isActive = activeLon !== null && Math.abs(f.lon - activeLon) < 0.000001 && Math.abs(f.lat - activeLat) < 0.000001;
    return '<div class="fav-item" onclick="loadFav(' + i + ')">' +
      '<div class="fav-info">' +
        '<div class="fav-name">' + escHtml(f.name) + '<\\/div>' +
        '<div class="fav-coords">' + f.lon.toFixed(6) + ', ' + f.lat.toFixed(6) + '<\\/div>' +
        (isActive ? '<div class="fav-active">\\u2713 当前生效<\\/div>' : '') +
      '<\\/div>' +
      '<button class="fav-del" onclick="event.stopPropagation();delFav(' + i + ')" title="删除">\\u00d7<\\/button>' +
    '<\\/div>';
  }).join('');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function addFav() {
  if (!selected) { toast('请先在地图上选择一个位置'); return; }
  document.getElementById('favModalCoords').textContent = lon.toFixed(6) + ', ' + lat.toFixed(6);
  document.getElementById('favNameInput').value = '';
  document.getElementById('favModal').classList.add('show');
  setTimeout(() => document.getElementById('favNameInput').focus(), 100);
}

function closeFavModal() {
  document.getElementById('favModal').classList.remove('show');
}

function confirmFav() {
  const name = document.getElementById('favNameInput').value.trim();
  if (!name) { toast('请输入备注名称'); return; }
  const favs = getFavs();
  favs.push({ name, lon, lat, time: new Date().toISOString() });
  saveFavs(favs);
  closeFavModal();
  renderFavs();
  toast('已收藏: ' + name);
}

function loadFav(i) {
  const favs = getFavs();
  if (!favs[i]) return;
  moveTo(favs[i].lat, favs[i].lon, 15);
  toast(favs[i].name + ' (' + favs[i].lon.toFixed(4) + ', ' + favs[i].lat.toFixed(4) + ')');
}

function delFav(i) {
  const favs = getFavs();
  if (!favs[i]) return;
  const name = favs[i].name;
  favs.splice(i, 1);
  saveFavs(favs);
  renderFavs();
  toast('已删除: ' + name);
}

function clearAllFav() {
  if (!confirm('确定清空所有收藏？')) return;
  saveFavs([]);
  renderFavs();
  toast('已清空所有收藏');
}

/* ---- Active location query ---- */
function queryActive() {
  const el = document.getElementById('activeValue');
  el.textContent = '查询中...';
  fetch(SAVE_API + '?action=query', { method:'GET', mode:'cors', cache:'no-store' })
    .then(r => r.json())
    .then(d => {
      const queriedLon = Number(d.longitude);
      const queriedLat = Number(d.latitude);
      if (d.success && Number.isFinite(queriedLon) && Number.isFinite(queriedLat)) {
        activeLon = queriedLon;
        activeLat = queriedLat;
        el.textContent = '经度 ' + activeLon.toFixed(6) + '  纬度 ' + activeLat.toFixed(6) + (d.accuracy ? '  精度 ' + d.accuracy + 'm' : '');
        moveTo(activeLat, activeLon, 15);
        renderFavs();
      } else {
        activeLon = null; activeLat = null;
        el.textContent = d.error || '未设置有效坐标';
        renderFavs();
      }
    })
    .catch(() => {
      el.textContent = '查询失败 (需要代理模块支持)';
    });
}

function clearActive() {
  if (!confirm('确定清除设备上已保存的坐标？清除后将使用模块默认参数或停止修改定位。')) return;
  fetch(SAVE_API + '?action=clear', { method:'GET', mode:'cors', cache:'no-store' })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        toast('已清除设备坐标，恢复模块参数');
        queryActive();
      } else { toast('清除失败: ' + (d.error || ''), 3000); }
    })
    .catch(() => { toast('清除失败 - 请检查模块配置', 3000); });
}

/* ---- Save to device ---- */
async function save() {
  if (!selected) { toast('请先在地图上选择一个位置'); return; }
  const btn = document.getElementById('saveBtn');
  btn.textContent = '储存中...'; btn.disabled = true;
  showError(false);
  try {
    const r = await fetch(SAVE_API + '?lon=' + lon + '&lat=' + lat + '&acc=25', {
      method: 'GET', mode: 'cors', cache: 'no-store'
    });
    const d = await r.json();
    if (d.success) {
      activeLon = lon; activeLat = lat;
      btn.textContent = '\\u2713 已储存'; btn.className = 'btn btn-primary success';
      document.getElementById('activeValue').textContent = '经度 ' + lon.toFixed(6) + '  纬度 ' + lat.toFixed(6) + '  精度 25m';
      renderFavs();
      toast('\\u2713 坐标已写入设备，下次定位生效');
      setTimeout(() => { btn.textContent='储存到设备'; btn.className='btn btn-primary'; btn.disabled=false; }, 2500);
    } else {
      throw new Error(d.error || '写入失败');
    }
  } catch(e) {
    btn.textContent = '储存到设备'; btn.className = 'btn btn-primary'; btn.disabled = false;
    showError(true);
    toast('\\u2717 储存失败 - 请检查模块配置', 4000);
  }
}

function locateMe() {
  if (!navigator.geolocation) return toast('浏览器不支持定位');
  toast('获取位置中...');
  navigator.geolocation.getCurrentPosition(
    pos => { moveTo(pos.coords.latitude, pos.coords.longitude, 16); toast('已获取当前位置'); },
    err => toast('定位失败: ' + err.message, 3000),
    { enableHighAccuracy:true, timeout:10000 }
  );
}

async function searchPlace() {
  const raw = document.getElementById('searchInput').value.trim();
  if (!raw) return toast('请输入地点或地址');
  const q = raw.split(/\\r?\\n/).map(part => part.trim()).filter(Boolean).join(', ');
  toast('搜索中...');
  try {
    const r = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&q='+encodeURIComponent(q));
    const results = await r.json();
    if (!results.length) { toast('未找到: ' + q, 3000); return; }
    const p = results[0];
    moveTo(parseFloat(p.lat), parseFloat(p.lon), 15);
    toast(p.display_name.slice(0, 40));
  } catch(e) { toast('搜索失败', 3000); }
}

const searchInput = document.getElementById('searchInput');
function resizeSearchInput() {
  searchInput.style.height = '48px';
  const nextHeight = Math.min(Math.max(searchInput.scrollHeight, 48), 132);
  searchInput.style.height = nextHeight + 'px';
  searchInput.style.overflowY = searchInput.scrollHeight > 132 ? 'auto' : 'hidden';
}
searchInput.addEventListener('input', resizeSearchInput);
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    searchPlace();
  }
});
document.getElementById('favNameInput').addEventListener('keydown', e => { if(e.key==='Enter') confirmFav(); });

renderFavs();
queryActive();
<\/script>
</body>
</html>`;
}
