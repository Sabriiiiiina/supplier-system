/* ========== 供应商管理系统 · 路由渲染 + 界面设计器 ========== */
(function () {
  "use strict";

  // ---- 模块定义：名称 + 图标 + 空占位区块（不含业务数据）----
  var MODULES = {
    dashboard: {
      title: "工作台", icon: "▦",
      blocks: ["数据概览（待接入）", "待办事项（待接入）", "快捷入口（待接入）"]
    },
    suppliers: {
      title: "供应商管理", icon: "▤",
      blocks: ["供应商列表（待接入）", "筛选与搜索（待接入）", "新增/编辑表单（待接入）"]
    },
    approval: {
      title: "准入审批", icon: "✓",
      blocks: ["审批流程配置（待接入）", "待审批列表（待接入）", "审批记录（待接入）"]
    },
    performance: {
      title: "绩效评估", icon: "◔",
      blocks: ["评估指标（待接入）", "评分看板（待接入）", "评估周期（待接入）"]
    },
    contracts: {
      title: "合同管理", icon: "▣",
      blocks: ["合同台账（待接入）", "到期提醒（待接入）", "附件管理（待接入）"]
    },
    settings: {
      title: "系统设置", icon: "⚙",
      blocks: ["组织架构（待接入）", "角色权限（待接入）", "字段与字典配置（待接入）"]
    }
  };

  var DEFAULT_ROUTE = "dashboard";
  var STORAGE_KEY = "supplier-system-design-v1";

  // ---- 设计配置默认值 ----
  var DESIGN_DEFAULTS = {
    siteName: "供应商管理系统",
    logoMark: "供",
    primaryColor: "#2f6bff",
    theme: "light",
    navLabels: {
      dashboard: "工作台",
      suppliers: "供应商管理",
      approval: "准入审批",
      performance: "绩效评估",
      contracts: "合同管理",
      settings: "系统设置"
    }
  };

  var PRESET_COLORS = ["#2f6bff", "#00b4a0", "#7c5cff", "#22a06b", "#ff7a2f", "#e5484d"];

  // ---- DOM 引用 ----
  var pageContainer = document.getElementById("pageContainer");
  var breadcrumb = document.getElementById("breadcrumb");
  var sidebar = document.getElementById("sidebar");
  var menuToggle = document.getElementById("menuToggle");
  var navItems = Array.prototype.slice.call(document.querySelectorAll(".nav-item"));

  var designToggle = document.getElementById("designToggle");
  var designPanel = document.getElementById("designPanel");
  var designOverlay = document.getElementById("designOverlay");
  var designClose = document.getElementById("designClose");
  var designSiteName = document.getElementById("designSiteName");
  var designLogoMark = document.getElementById("designLogoMark");
  var designNavList = document.getElementById("designNavList");
  var colorSwatches = document.getElementById("colorSwatches");
  var designCustomColor = document.getElementById("designCustomColor");
  var designReset = document.getElementById("designReset");
  var designSave = document.getElementById("designSave");

  // ---- 配置读写 ----
  function loadConfig() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        var merged = {};
        var k, r;
        for (k in DESIGN_DEFAULTS) { merged[k] = DESIGN_DEFAULTS[k]; }
        for (k in saved) { merged[k] = saved[k]; }
        if (!merged.navLabels) { merged.navLabels = {}; }
        for (r in DESIGN_DEFAULTS.navLabels) {
          if (!merged.navLabels[r]) { merged.navLabels[r] = DESIGN_DEFAULTS.navLabels[r]; }
        }
        return merged;
      }
    } catch (e) { /* 忽略损坏数据 */ }
    return JSON.parse(JSON.stringify(DESIGN_DEFAULTS));
  }

  var config = loadConfig();

  function saveConfig() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch (e) {}
  }

  function hexToRgb(hex) {
    var h = hex.replace("#", "");
    if (h.length === 3) { h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; }
    var n = parseInt(h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function applyPrimary(hex) {
    var rgb = hexToRgb(hex);
    document.documentElement.style.setProperty("--primary", hex);
    if (config.theme === "dark") {
      document.documentElement.style.setProperty(
        "--primary-soft", "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.18)");
    } else {
      var r = Math.round(rgb.r + (255 - rgb.r) * 0.88);
      var g = Math.round(rgb.g + (255 - rgb.g) * 0.88);
      var b = Math.round(rgb.b + (255 - rgb.b) * 0.88);
      document.documentElement.style.setProperty("--primary-soft", "rgb(" + r + "," + g + "," + b + ")");
    }
  }

  function applyTheme() {
    document.body.setAttribute("data-theme", config.theme);
    applyPrimary(config.primaryColor);
  }

  function applySiteInfo() {
    document.getElementById("logo-mark").textContent = config.logoMark || "供";
    document.getElementById("logo-text").textContent = config.siteName || "供应商管理系统";
  }

  function applyNavLabels() {
    Object.keys(MODULES).forEach(function (route) {
      var label = config.navLabels[route] || DESIGN_DEFAULTS.navLabels[route];
      MODULES[route].title = label;
      var el = document.querySelector('.nav-item[data-route="' + route + '"] .nav-label');
      if (el) { el.textContent = label; }
    });
  }

  function applyDesign() {
    applyTheme();
    applySiteInfo();
    applyNavLabels();
    render();
  }

  // ---- 页面渲染 ----
  function renderEmptyState(route) {
    var mod = MODULES[route] || MODULES[DEFAULT_ROUTE];

    pageContainer.innerHTML = "";

    var wrap = document.createElement("div");
    wrap.className = "empty-state";

    var icon = document.createElement("div");
    icon.className = "empty-icon";
    icon.textContent = "▢";

    var title = document.createElement("h2");
    title.className = "empty-title";
    title.textContent = mod.title;

    var desc = document.createElement("p");
    desc.className = "empty-desc";
    desc.textContent = "此模块页面框架已就位，内容尚未填充。";

    var grid = document.createElement("div");
    grid.className = "empty-placeholder-grid";

    mod.blocks.forEach(function (label) {
      var card = document.createElement("div");
      card.className = "placeholder-card";
      card.textContent = label;
      grid.appendChild(card);
    });

    wrap.appendChild(icon);
    wrap.appendChild(title);
    wrap.appendChild(desc);
    wrap.appendChild(grid);
    pageContainer.appendChild(wrap);

    breadcrumb.textContent = mod.title;
    document.title = mod.title + " · " + config.siteName;
  }

  function setActiveNav(route) {
    navItems.forEach(function (item) {
      item.classList.toggle("active", item.dataset.route === route);
    });
  }

  function currentRoute() {
    var hash = window.location.hash || "";
    var route = hash.replace(/^#\/?/, "").split("?")[0];
    return MODULES[route] ? route : DEFAULT_ROUTE;
  }

  function render() {
    var route = currentRoute();
    setActiveNav(route);
    renderEmptyState(route);
  }

  // ---- 界面设计器 ----
  function buildDesignerUI() {
    // 导航名称输入
    designNavList.innerHTML = "";
    Object.keys(MODULES).forEach(function (route) {
      var label = document.createElement("label");
      label.className = "design-field";

      var span = document.createElement("span");
      span.textContent = MODULES[route].icon + " " + config.navLabels[route];

      var input = document.createElement("input");
      input.type = "text";
      input.dataset.route = route;
      input.value = config.navLabels[route] || "";

      input.addEventListener("input", function () {
        config.navLabels[route] = input.value || DESIGN_DEFAULTS.navLabels[route];
        applyNavLabels();
        render();
      });

      label.appendChild(span);
      label.appendChild(input);
      designNavList.appendChild(label);
    });

    // 预设色块
    colorSwatches.innerHTML = "";
    PRESET_COLORS.forEach(function (c) {
      var sw = document.createElement("button");
      sw.type = "button";
      sw.className = "color-swatch" + (c === config.primaryColor ? " active" : "");
      sw.style.background = c;
      sw.title = c;
      sw.addEventListener("click", function () {
        config.primaryColor = c;
        designCustomColor.value = c;
        applyPrimary(c);
        refreshSwatches();
      });
      colorSwatches.appendChild(sw);
    });

    // 主题按钮初始态
    refreshThemeOptions();
  }

  function refreshSwatches() {
    Array.prototype.slice.call(colorSwatches.querySelectorAll(".color-swatch")).forEach(function (sw) {
      sw.classList.toggle("active", sw.style.background.toLowerCase() === config.primaryColor.toLowerCase());
    });
  }

  function refreshThemeOptions() {
    Array.prototype.slice.call(document.querySelectorAll(".theme-option")).forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.themeChoice === config.theme);
    });
  }

  function fillDesignerInputs() {
    designSiteName.value = config.siteName;
    designLogoMark.value = config.logoMark;
    designCustomColor.value = config.primaryColor;
    refreshSwatches();
    refreshThemeOptions();
  }

  function openDesigner() {
    fillDesignerInputs();
    designPanel.classList.add("open");
    designOverlay.classList.add("show");
  }

  function closeDesigner() {
    designPanel.classList.remove("open");
    designOverlay.classList.remove("show");
  }

  // 实时预览：站点标题 / Logo / 自定义颜色 / 主题
  designSiteName.addEventListener("input", function () {
    config.siteName = designSiteName.value || DESIGN_DEFAULTS.siteName;
    applySiteInfo();
    render();
  });

  designLogoMark.addEventListener("input", function () {
    config.logoMark = designLogoMark.value || DESIGN_DEFAULTS.logoMark;
    applySiteInfo();
  });

  designCustomColor.addEventListener("input", function () {
    config.primaryColor = designCustomColor.value;
    applyPrimary(config.primaryColor);
    refreshSwatches();
  });

  Array.prototype.slice.call(document.querySelectorAll(".theme-option")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      config.theme = btn.dataset.themeChoice;
      applyTheme();
      refreshThemeOptions();
    });
  });

  designToggle.addEventListener("click", openDesigner);
  designClose.addEventListener("click", closeDesigner);
  designOverlay.addEventListener("click", closeDesigner);

  designSave.addEventListener("click", function () {
    saveConfig();
    closeDesigner();
    toast("已保存设计");
  });

  designReset.addEventListener("click", function () {
    if (!window.confirm("确定恢复默认设计？当前自定义内容将丢失。")) { return; }
    config = JSON.parse(JSON.stringify(DESIGN_DEFAULTS));
    localStorage.removeItem(STORAGE_KEY);
    buildDesignerUI();
    fillDesignerInputs();
    applyDesign();
    toast("已恢复默认");
  });

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("show"); }, 10);
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { t.remove(); }, 300);
    }, 1600);
  }

  // ---- 路由 & 侧边栏折叠 ----
  window.addEventListener("hashchange", render);
  menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("collapsed");
  });

  // ---- 初始化 ----
  buildDesignerUI();
  applyDesign();

  if (!window.location.hash) {
    window.location.hash = "#/" + DEFAULT_ROUTE;
  }
})();
