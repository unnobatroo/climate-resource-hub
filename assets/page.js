/* Climate Resource Hub — rendering and search.
   Reads window.CLIMATE_LINKS (assets/data.js) and renders either:
   - home: one overview card per section, or
   - a section page: links grouped by category,
   plus a global search (all sections) available everywhere. */
(function () {
  "use strict";

  /* Each section has its own personality: colour, voice, emoji,
     and a pixel-art mascot drawn from the `art` string map. */
  const TOPICS = {
    Career: {
      page: "career.html",
      colorClass: "career",
      blurb: "Clock in for the planet — job boards, hiring climate-tech companies, and career pathways.",
      icon: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
      art: [
        "...DDDDDD...",
        "...D....D...",
        "DDDDDDDDDDDD",
        "DAAAAAAAAAAD",
        "DAAAADDAAAAD",
        "DAAAAAAAAAAD",
        "DAAAAAAAAAAD",
        "DDDDDDDDDDDD"
      ],
      palette: { D: "#92400e", A: "#f59e0b" }
    },
    Research: {
      page: "research.html",
      colorClass: "research",
      blurb: "Bring receipts — datasets, models, policy tools, and open-source climate science.",
      icon: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
      art: [
        ".........CC..",
        ".........CC..",
        "....MM...CC..",
        "....MM...CC..",
        "LL..MM...CC..",
        "LL..MM...CC..",
        "LL..MM...CC..",
        "DDDDDDDDDDDDD"
      ],
      palette: { L: "#67e8f9", M: "#22d3ee", C: "#0891b2", D: "#155e75" }
    },
    Education: {
      page: "education.html",
      colorClass: "education",
      blurb: "Zero to climate-literate — explainers, courses, and communities for learning the science.",
      icon: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
      art: [
        ".DDDDD.DDDDD.",
        "DPPPPPDPPPPPD",
        "DPPPPPDPPPPPD",
        "DPLLLPDPLLLPD",
        "DPPPPPDPPPPPD",
        "DPLLLPDPLLLPD",
        "DPPPPPDPPPPPD",
        ".DDDDDDDDDDD."
      ],
      palette: { D: "#15803d", P: "#ecfdf5", L: "#4ade80" }
    },
    Invest: {
      page: "invest.html",
      colorClass: "invest",
      blurb: "Plant money, grow futures — funds and organizations financing climate solutions.",
      icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
      art: [
        "..LL.....LL..",
        ".LLLL...LLLL.",
        ".LLLLL.LLLLL.",
        "...LL.S.LL...",
        "......S......",
        "......S......",
        "....GGGGG....",
        "...GGYYYGG...",
        "...GGYYYGG...",
        "....GGGGG...."
      ],
      palette: { L: "#22c55e", S: "#22c55e", G: "#d97706", Y: "#fbbf24" }
    }
  };
  const TOPIC_ORDER = ["Career", "Research", "Education", "Invest"];

  const ALL_LINKS = (window.CLIMATE_LINKS || []).slice()
    .sort((a, b) => a.title.localeCompare(b.title));

  /* ---------------- helpers ---------------- */

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  const GENERAL_SUBTOPIC = "General";

  function categoryLabel(name) {
    return name === GENERAL_SUBTOPIC ? "Start here" : name;
  }

  function sortCategories(names) {
    return names.sort((a, b) => a.localeCompare(b));
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

  function svgIcon(paths, className) {
    return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  }

  const EXTERNAL_ICON = svgIcon('<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>', "external-icon");
  const CLEAR_ICON = svgIcon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', "clear-icon");

  /* ---------------- card + group markup ---------------- */

  function linkCard(link) {
    const host = hostOf(link.url);
    return `
      <a class="link-card" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
        <span class="link-card-head">
          <img class="favicon" src="${escapeHtml(faviconOf(link.url))}" alt="" loading="lazy" width="20" height="20">
          <h3>${escapeHtml(link.title)}<span class="visually-hidden"> (opens in a new tab)</span></h3>
          ${EXTERNAL_ICON}
        </span>
        <p class="link-summary">${escapeHtml(link.summary || "")}</p>
        <span class="link-host">${escapeHtml(host)}</span>
      </a>`;
  }

  function group(title, links, colorClass, href, options) {
    const opts = options || {};
    const heading = href
      ? `<a href="${escapeHtml(href)}">${escapeHtml(title)}</a>`
      : escapeHtml(title);
    return `
      <section class="group group-${colorClass}${opts.className ? ` ${opts.className}` : ""}" id="${escapeHtml(opts.id || slugify(title))}">
        <div class="group-head">
          <h2>${heading}</h2>
          <span class="group-count">${links.length} ${links.length === 1 ? "link" : "links"}</span>
        </div>
        <div class="card-grid">${links.map(linkCard).join("")}</div>
      </section>`;
  }

  /* ---------------- views ---------------- */

  function homeOverview() {
    const cards = TOPIC_ORDER.map((topic) => {
      const cfg = TOPICS[topic];
      const links = ALL_LINKS.filter((l) => l.topic === topic);
      const categories = sortCategories([...new Set(links.map((l) => l.subtopic))]);
      const chips = categories.map((c) =>
        `<li><a href="${cfg.page}#${slugify(c)}">${escapeHtml(categoryLabel(c))}</a></li>`
      ).join("");
      return `
        <article class="topic-card topic-${cfg.colorClass}">
          ${svgIcon(cfg.icon, "topic-icon")}
          <h2><a class="topic-link" href="${cfg.page}">${topic}</a></h2>
          <p>${cfg.blurb}</p>
          <ul class="topic-cats" aria-label="${topic} categories">${chips}</ul>
          <span class="topic-count">${links.length} links →</span>
        </article>`;
    }).join("");

    return `<div class="topic-grid">${cards}</div>`;
  }

  function topicData(topic) {
    const links = ALL_LINKS.filter((l) => l.topic === topic);
    const bySubtopic = {};
    links.forEach((l) => {
      (bySubtopic[l.subtopic] = bySubtopic[l.subtopic] || []).push(l);
    });
    return {
      bySubtopic,
      subtopics: sortCategories(Object.keys(bySubtopic).filter((st) => st !== GENERAL_SUBTOPIC)),
      generalLinks: bySubtopic[GENERAL_SUBTOPIC] || [],
      colorClass: TOPICS[topic].colorClass,
      total: links.length
    };
  }

  function searchView(query) {
    const matches = ALL_LINKS.filter((l) => {
      const text = `${l.title} ${l.topic} ${l.subtopic} ${l.summary || ""} ${hostOf(l.url)}`.toLowerCase();
      return text.includes(query);
    });

    const byTopic = {};
    matches.forEach((l) => {
      (byTopic[l.topic] = byTopic[l.topic] || []).push(l);
    });

    const html = TOPIC_ORDER
      .filter((t) => byTopic[t])
      .map((t) => group(t, byTopic[t], TOPICS[t].colorClass, TOPICS[t].page))
      .join("");

    return { html, count: matches.length };
  }

  /* ---------------- decorative pixel art (hero mascots) ---------------- */

  const EARTH = [
    "....WWWWW....",
    "...WLLWWWW...",
    "..WLLLLWWWW..",
    ".WLLLLWWWWLW.",
    ".WWLLLWWLLLW.",
    "WWWWLLWWWLLWW",
    "WWWWWLWWWLLLW",
    "WWWWWWWWLLLWW",
    ".WWWLLWWWLWW.",
    ".WWWWLLLWWWW.",
    "..WWWWLLWWW..",
    "...WWWWWWW...",
    "....WWWWW...."
  ];
  const EARTH_PALETTE = { W: "var(--pixel-water)", L: "var(--pixel-land)" };

  /* Draws string-map pixel art as a single box-shadow — one element,
     no images, scales crisply. */
  function renderPixelArt(el, art, palette, P) {
    P = P || 8;
    const shadows = [];
    art.forEach((row, y) => {
      row.split("").forEach((ch, x) => {
        if (palette[ch]) shadows.push(`${x * P}px ${y * P}px 0 0 ${palette[ch]}`);
      });
    });
    el.style.width = el.style.height = `${P}px`;
    el.style.boxShadow = shadows.join(",");
  }

  function setupHeroArt(currentTopic) {
    const el = document.getElementById("pixelArt");
    if (!el) return;
    if (currentTopic && TOPICS[currentTopic]) {
      renderPixelArt(el, TOPICS[currentTopic].art, TOPICS[currentTopic].palette);
    } else {
      renderPixelArt(el, EARTH, EARTH_PALETTE);
    }
  }

  /* ---------------- page controller ---------------- */

  function init() {
    const content = document.getElementById("content");
    const status = document.getElementById("resultStatus");
    const searchInput = document.getElementById("searchInput");
    if (!content || !ALL_LINKS.length) return;

    const currentTopic = document.body.dataset.topic || null;

    /* Category filters (section pages): ordered list of toggled-on
       categories. Empty = show everything. Arriving with a #hash
       (e.g. from a home-page chip) pre-selects that category. */
    let selected = [];
    if (currentTopic && location.hash) {
      const hash = decodeURIComponent(location.hash.slice(1));
      const match = topicData(currentTopic).subtopics.find((st) => slugify(st) === hash);
      if (match) selected = [match];
    }

    function filterBar(data) {
      if (!data.subtopics.length) return "";
      const chips = data.subtopics.map((st) => `
        <button type="button" class="filter-chip" data-cat="${escapeHtml(st)}"
          aria-pressed="${selected.includes(st)}">
          ${escapeHtml(categoryLabel(st))}<span class="chip-count">${data.bySubtopic[st].length}</span>
        </button>`).join("");
      const clear = selected.length
        ? `<button type="button" class="filter-clear">${CLEAR_ICON}Show all</button>`
        : "";
      return `
        <div class="filter-bar" role="group" aria-label="Filter ${currentTopic} categories">
          ${chips}${clear}
        </div>`;
    }

    function renderTopicPage() {
      const data = topicData(currentTopic);
      const hasGeneral = data.generalLinks.length > 0;
      const pinnedGeneral = data.generalLinks.length
        ? group("Start here", data.generalLinks, data.colorClass, null, { id: "general", className: "group-plateau" })
        : "";
      // Toggled-on categories show alone, in the order they were picked.
      const shown = selected.length ? selected : data.subtopics;
      const shownCount = shown.reduce((n, st) => n + data.bySubtopic[st].length, 0) + data.generalLinks.length;

      content.innerHTML = filterBar(data) + pinnedGeneral +
        shown.map((st) => group(st, data.bySubtopic[st], data.colorClass)).join("");

      const catWord = data.subtopics.length === 1 ? "category" : "categories";
      if (selected.length) {
       status.textContent = hasGeneral
         ? `Showing ${shownCount} links in Start here plus ${selected.length} of ${data.subtopics.length} ${catWord}.`
         : `Showing ${shownCount} links in ${selected.length} of ${data.subtopics.length} ${catWord}.`;
      } else {
       status.textContent = hasGeneral
         ? `${data.total} links in Start here plus ${data.subtopics.length} ${catWord}.`
         : `${data.total} links in ${data.subtopics.length} ${catWord}.`;
      }
    }

    function renderDefault() {
      if (currentTopic) {
        renderTopicPage();
      } else {
        content.innerHTML = homeOverview();
        status.textContent = "";
      }
    }

    function render() {
      const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
      if (!query) {
        renderDefault();
        return;
      }
      const view = searchView(query);
      if (view.count === 0) {
        content.innerHTML = `
          <div class="empty-state">
            <p><strong>No links match “${escapeHtml(query)}”.</strong></p>
            <p>Try a broader word like “energy”, “data”, or “course”.</p>
          </div>`;
      } else {
        content.innerHTML = view.html;
      }
      status.textContent = `${view.count} ${view.count === 1 ? "link" : "links"} found across all sections.`;
    }

    /* Filter chip toggling (event delegation survives re-renders). */
    if (currentTopic) {
      content.addEventListener("click", (e) => {
        const chip = e.target.closest(".filter-chip");
        if (chip) {
          const cat = chip.dataset.cat;
          selected = selected.includes(cat)
            ? selected.filter((c) => c !== cat)
            : [...selected, cat];
          renderTopicPage();
          const again = content.querySelector(`.filter-chip[data-cat="${CSS.escape(cat)}"]`);
          if (again) again.focus();
          return;
        }
        if (e.target.closest(".filter-clear")) {
          selected = [];
          renderTopicPage();
          const first = content.querySelector(".filter-chip");
          if (first) first.focus();
        }
      });
    }

    /* Live total in the home hero badge, if present. */
    const totalEl = document.getElementById("linkTotal");
    if (totalEl) totalEl.textContent = String(ALL_LINKS.length);

    setupHeroArt(currentTopic);
    if (searchInput) searchInput.addEventListener("input", render);
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
