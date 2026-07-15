/* Climate Resource Hub — shared rendering, search, filters, and theme controls. */
(function () {
  "use strict";

  const TOPICS = {
    Career: {
      page: "career.html",
      className: "career",
      number: "01",
      eyebrow: "Work on the transition",
      blurb: "Job boards, teams, and practical entry points into climate work.",
      icon: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M9 12v2h6v-2"/>'
    },
    Research: {
      page: "research.html",
      className: "research",
      number: "02",
      eyebrow: "Work from evidence",
      blurb: "Datasets, models, policy tools, and open climate science.",
      icon: '<path d="M4 19V9M10 19V5M16 19v-7M22 19V3"/><path d="M2 19h22"/>'
    },
    Education: {
      page: "education.html",
      className: "education",
      number: "03",
      eyebrow: "Build climate literacy",
      blurb: "Courses, explainers, teaching material, and learning communities.",
      icon: '<path d="M3 5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H3z"/><path d="M21 5h-4a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h5z"/>'
    },
    Invest: {
      page: "invest.html",
      className: "invest",
      number: "04",
      eyebrow: "Fund climate solutions",
      blurb: "Funds and organizations moving capital into climate action.",
      icon: '<path d="m3 17 6-6 4 4 8-9"/><path d="M15 6h6v6"/>'
    }
  };

  const TOPIC_ORDER = Object.keys(TOPICS);
  const GENERAL = "General";
  const ALL_LINKS = (window.CLIMATE_LINKS || [])
    .slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function hostOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (_) {
      return "";
    }
  }

  function faviconOf(url) {
    const host = hostOf(url);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
  }

  function icon(paths, className) {
    return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  function categoryLabel(category) {
    return category === GENERAL ? "Start here" : category;
  }

  function categoriesFor(topic) {
    return [...new Set(ALL_LINKS.filter((link) => link.topic === topic).map((link) => link.subtopic))]
      .sort((a, b) => {
        if (a === GENERAL) return -1;
        if (b === GENERAL) return 1;
        return a.localeCompare(b);
      });
  }

  function topicData(topic) {
    const links = ALL_LINKS.filter((link) => link.topic === topic);
    const groups = {};
    links.forEach((link) => {
      (groups[link.subtopic] = groups[link.subtopic] || []).push(link);
    });
    const categories = categoriesFor(topic);
    return {
      links,
      groups,
      categories,
      filterable: categories.filter((category) => category !== GENERAL),
      general: groups[GENERAL] || []
    };
  }

  function resourceCard(link, index) {
    const config = TOPICS[link.topic];
    const host = hostOf(link.url);
    return `
      <a class="resource-card resource-${config.className}" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
        <span class="resource-card-top">
          <span class="resource-category">${escapeHtml(categoryLabel(link.subtopic))}</span>
          <span class="resource-number">${String(index + 1).padStart(2, "0")}</span>
        </span>
        <h3>${escapeHtml(link.title)}<span class="visually-hidden"> (opens in a new tab)</span></h3>
        <p>${escapeHtml(link.summary || "")}</p>
        <span class="resource-source">
          <img class="resource-favicon" src="${escapeHtml(faviconOf(link.url))}" alt="" loading="lazy" width="24" height="24">
          <span>${escapeHtml(host)}</span>
          <span class="resource-arrow" aria-hidden="true">↗</span>
        </span>
      </a>`;
  }

  function resourceGroup(title, links, topic, options) {
    const config = TOPICS[topic];
    const opts = options || {};
    const linkedTitle = opts.href
      ? `<a href="${escapeHtml(opts.href)}">${escapeHtml(title)}</a>`
      : escapeHtml(title);
    return `
      <section class="resource-group group-${config.className}${opts.featured ? " resource-group-featured" : ""}" id="${escapeHtml(opts.id || slugify(title))}">
        <div class="resource-group-heading">
          <div>
            <span class="group-kicker">${escapeHtml(config.eyebrow)}</span>
            <h2>${linkedTitle}</h2>
          </div>
          <span class="group-count">${links.length} ${links.length === 1 ? "resource" : "resources"}</span>
        </div>
        <div class="resource-grid">${links.map((link, index) => resourceCard(link, index)).join("")}</div>
      </section>`;
  }

  function homeOverview() {
    return `<div class="topic-grid">${TOPIC_ORDER.map((topic) => {
      const config = TOPICS[topic];
      const data = topicData(topic);
      const categoryLinks = data.categories.slice(0, 5).map((category) =>
        `<li><a href="${config.page}#${slugify(category)}">${escapeHtml(categoryLabel(category))}</a></li>`
      ).join("");
      return `
        <article class="topic-card topic-${config.className}">
          <div class="topic-card-top">
            <span class="topic-number">${config.number}</span>
            ${icon(config.icon, "topic-icon")}
          </div>
          <p class="topic-eyebrow">${escapeHtml(config.eyebrow)}</p>
          <h2><a class="topic-link" href="${config.page}">${escapeHtml(topic)}</a></h2>
          <p class="topic-description">${escapeHtml(config.blurb)}</p>
          <ul class="topic-categories" aria-label="${escapeHtml(topic)} categories">${categoryLinks}</ul>
          <div class="topic-card-footer">
            <span>${data.links.length} resources</span>
            <span aria-hidden="true">→</span>
          </div>
        </article>`;
    }).join("")}</div>`;
  }

  function searchResults(query) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = ALL_LINKS.filter((link) => {
      const haystack = `${link.title} ${link.topic} ${link.subtopic} ${link.summary || ""} ${hostOf(link.url)}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
    const groups = {};
    matches.forEach((link) => {
      (groups[link.topic] = groups[link.topic] || []).push(link);
    });
    const html = TOPIC_ORDER
      .filter((topic) => groups[topic])
      .map((topic) => resourceGroup(topic, groups[topic], topic, { href: TOPICS[topic].page }))
      .join("");
    return { matches, html };
  }

  function setupTheme() {
    const masthead = document.querySelector(".masthead");
    if (!masthead) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.innerHTML = '<span class="theme-icon" aria-hidden="true">◐</span><span class="theme-label">Theme</span>';
    masthead.appendChild(button);

    const saved = localStorage.getItem("climate-hub-theme");
    if (saved === "dark" || saved === "light") document.documentElement.dataset.theme = saved;

    function currentTheme() {
      if (document.documentElement.dataset.theme) return document.documentElement.dataset.theme;
      return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    function updateLabel() {
      const theme = currentTheme();
      button.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.querySelector(".theme-icon").textContent = theme === "dark" ? "☀" : "◐";
    }

    button.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("climate-hub-theme", next);
      updateLabel();
    });
    updateLabel();
  }

  function setupHero(currentTopic) {
    const hero = document.querySelector(".hero");
    const text = document.querySelector(".hero-text");
    const title = text && text.querySelector("h1");
    const art = document.querySelector(".hero-art");
    if (!hero || !text || !title || !art) return;

    const eyebrow = document.createElement("p");
    eyebrow.className = "hero-eyebrow";
    eyebrow.textContent = currentTopic ? TOPICS[currentTopic].eyebrow : "Independent climate field guide";
    text.insertBefore(eyebrow, title);

    const topicLinks = currentTopic ? ALL_LINKS.filter((link) => link.topic === currentTopic) : ALL_LINKS;
    const categoryCount = currentTopic ? categoriesFor(currentTopic).length : TOPIC_ORDER.length;
    const config = currentTopic ? TOPICS[currentTopic] : null;
    art.innerHTML = `
      <div class="signal-panel${config ? ` signal-${config.className}` : ""}">
        <div class="signal-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
        <p>${currentTopic ? escapeHtml(currentTopic) : "Climate Resource Hub"}</p>
        <strong>${topicLinks.length}</strong>
        <span>${currentTopic ? "curated resources" : "links across four routes"}</span>
        <div class="signal-meta">
          <span>${categoryCount} ${currentTopic ? "categories" : "paths"}</span>
          <span>Open access</span>
        </div>
      </div>`;
  }

  function setupSearch(searchInput, render) {
    const form = searchInput && searchInput.closest("form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      render();
    });

    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "search-clear";
    clear.setAttribute("aria-label", "Clear search");
    clear.textContent = "Clear";
    form.appendChild(clear);

    const shortcut = document.createElement("kbd");
    shortcut.className = "search-shortcut";
    shortcut.textContent = "/";
    form.appendChild(shortcut);

    const suggestions = document.createElement("div");
    suggestions.className = "quick-searches";
    suggestions.setAttribute("aria-label", "Quick searches");
    suggestions.innerHTML = '<span>Try:</span><button type="button" data-search="jobs">jobs</button><button type="button" data-search="datasets">datasets</button><button type="button" data-search="courses">courses</button><button type="button" data-search="energy">energy</button>';
    form.insertAdjacentElement("afterend", suggestions);

    function updateControls() {
      const hasValue = Boolean(searchInput.value.trim());
      clear.hidden = !hasValue;
      shortcut.hidden = hasValue;
    }

    clear.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      updateControls();
      render();
    });

    suggestions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-search]");
      if (!button) return;
      searchInput.value = button.dataset.search;
      searchInput.focus();
      updateControls();
      render();
    });

    searchInput.addEventListener("input", () => {
      updateControls();
      render();
    });

    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchInput.focus();
      }
      if (event.key === "Escape" && document.activeElement === searchInput && searchInput.value) {
        searchInput.value = "";
        updateControls();
        render();
      }
    });

    const initialQuery = new URLSearchParams(location.search).get("q");
    if (initialQuery) searchInput.value = initialQuery;
    updateControls();
  }

  function setupFooter() {
    const footer = document.querySelector(".site-footer .container");
    if (!footer) return;
    footer.innerHTML = `
      <div class="footer-primary">
        <p class="footer-label">Climate Resource Hub</p>
        <p>Curated by <a href="https://jalols.page">Jaloliddin Ismailov</a> with the YOUNGO Science Working Group.</p>
      </div>
      <div class="footer-links" aria-label="Project links">
        <a href="https://github.com/unnobatroo/climate-resource-hub">Source code</a>
        <a href="https://github.com/unnobatroo/climate-resource-hub/issues/new">Suggest a resource</a>
        <a href="https://github.com/unnobatroo/climate-resource-hub/compare">Contribute</a>
      </div>`;
  }

  function init() {
    const content = document.getElementById("content");
    const status = document.getElementById("resultStatus");
    const searchInput = document.getElementById("searchInput");
    if (!content || !status || !searchInput || !ALL_LINKS.length) return;

    const currentTopic = document.body.dataset.topic || null;
    let selected = [];
    if (currentTopic && location.hash) {
      const hash = decodeURIComponent(location.hash.slice(1));
      const match = categoriesFor(currentTopic).find((category) => slugify(category) === hash);
      if (match && match !== GENERAL) selected = [match];
    }

    setupTheme();
    setupHero(currentTopic);
    setupFooter();

    function filterBar(data) {
      if (!data.filterable.length) return "";
      const chips = data.filterable.map((category) => {
        const active = selected.includes(category);
        return `<button type="button" class="filter-chip" data-category="${escapeHtml(category)}" aria-pressed="${active}"><span>${escapeHtml(category)}</span><span class="filter-count">${data.groups[category].length}</span></button>`;
      }).join("");
      return `
        <section class="filter-panel" aria-labelledby="filter-title">
          <div class="filter-copy">
            <p class="filter-kicker">Narrow the field</p>
            <h2 id="filter-title">Choose one or more categories</h2>
          </div>
          <div class="filter-actions" role="group" aria-label="Filter ${escapeHtml(currentTopic)} resources">
            ${chips}
            <button type="button" class="filter-clear"${selected.length ? "" : " hidden"}>Show all</button>
          </div>
        </section>`;
    }

    function renderTopic() {
      const data = topicData(currentTopic);
      const visible = selected.length ? selected : data.filterable;
      const general = data.general.length
        ? resourceGroup("Start here", data.general, currentTopic, { id: "general", featured: true })
        : "";
      const groups = visible.map((category) =>
        resourceGroup(category, data.groups[category], currentTopic)
      ).join("");
      content.innerHTML = filterBar(data) + general + groups;

      const visibleCount = data.general.length + visible.reduce((sum, category) => sum + data.groups[category].length, 0);
      status.textContent = selected.length
        ? `${visibleCount} resources shown in Start here and ${selected.length} selected ${selected.length === 1 ? "category" : "categories"}.`
        : `${data.links.length} resources across ${data.categories.length} categories.`;
    }

    function renderDefault() {
      if (currentTopic) {
        renderTopic();
      } else {
        content.innerHTML = homeOverview();
        status.textContent = `${ALL_LINKS.length} independently curated resources. Choose a route or search the full directory.`;
      }
    }

    function render() {
      const query = searchInput.value.trim();
      const url = new URL(location.href);
      if (query) url.searchParams.set("q", query);
      else url.searchParams.delete("q");
      history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);

      if (!query) {
        renderDefault();
        return;
      }

      const results = searchResults(query);
      if (results.matches.length) {
        content.innerHTML = `<div class="search-heading"><p>Searching all four routes</p><h2>Results for “${escapeHtml(query)}”</h2></div>${results.html}`;
      } else {
        content.innerHTML = `<div class="empty-state"><span aria-hidden="true">0</span><h2>No match for “${escapeHtml(query)}”</h2><p>Try a shorter phrase or one of the suggested searches above.</p></div>`;
      }
      status.textContent = `${results.matches.length} ${results.matches.length === 1 ? "resource" : "resources"} found across the full directory.`;
    }

    content.addEventListener("click", (event) => {
      const chip = event.target.closest(".filter-chip");
      if (chip) {
        const category = chip.dataset.category;
        selected = selected.includes(category)
          ? selected.filter((item) => item !== category)
          : [...selected, category];
        renderTopic();
        const replacement = [...content.querySelectorAll(".filter-chip")]
          .find((button) => button.dataset.category === category);
        if (replacement) replacement.focus();
        return;
      }

      if (event.target.closest(".filter-clear")) {
        selected = [];
        renderTopic();
        const first = content.querySelector(".filter-chip");
        if (first) first.focus();
      }
    });

    const total = document.getElementById("linkTotal");
    if (total) total.textContent = String(ALL_LINKS.length);
    setupSearch(searchInput, render);
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
