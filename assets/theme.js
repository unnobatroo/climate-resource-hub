(function () {
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function getSaved() {
    // localStorage may be unavailable in private browsing or when blocked by security policies
    try { return localStorage.getItem("theme"); } catch (_) { return null; }
  }

  function setSaved(theme) {
    // Silently skip persistence if localStorage is unavailable (private browsing, storage quota)
    try { localStorage.setItem("theme", theme); } catch (_) {}
  }

  // Apply saved preference or fall back to system preference (no-FOUC)
  var saved = getSaved();
  var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (systemDark ? "dark" : "light"));

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;

    function syncBtn() {
      var isDark = root.getAttribute("data-theme") === "dark";
      var icon = btn.querySelector("i");
      if (icon) {
        icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-fill";
      }
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("aria-pressed", String(isDark));
    }

    syncBtn();

    btn.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      applyTheme(next);
      setSaved(next);
      syncBtn();
    });

    // Track system preference changes when user has no explicit override
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (!getSaved()) {
          applyTheme(e.matches ? "dark" : "light");
          syncBtn();
        }
      });
    }
  });
})();
