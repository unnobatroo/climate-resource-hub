(function () {
  const TOPICS = {
    Career: { icon: "bi-briefcase-fill", page: "career.html", colorClass: "career" },
    Research: { icon: "bi-bar-chart-fill", page: "research.html", colorClass: "research" },
    Education: { icon: "bi-mortarboard-fill", page: "education.html", colorClass: "education" },
    Invest: { icon: "bi-piggy-bank-fill", page: "invest.html", colorClass: "invest" }
  };

  const TOPIC_ORDER = ["Career", "Research", "Education", "Invest"];

  function hostFromUrl(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (_) {
      return "external link";
    }
  }

  function faviconUrl(url) {
    try {
      const host = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
    } catch (_) {
      return "https://www.google.com/s2/favicons?domain=example.com&sz=64";
    }
  }

  function formatDate(value) {
    if (!value) return "Unknown";
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) return "Unknown";
    return new Date(parsed).toISOString().slice(0, 10);
  }

  function summaryFor(link) {
    const key = `${link.topic}:${link.subtopic}`.toLowerCase();
    const templates = {
      "career:general": "A practical career resource for finding roles, companies, and climate work paths.",
      "career:water resources": "Focused on water-sector impact work, organizations, and sustainability careers.",
      "career:agriculture": "Climate-smart agriculture opportunities, tools, and market insights.",
      "career:co2": "Carbon measurement, reduction, removals, and emissions-tech company landscape.",
      "career:forestry": "Forestry intelligence and nature-focused climate mitigation opportunities.",
      "career:green energy": "Clean-energy companies, innovation, and transition-focused career ecosystem.",
      "career:marine": "Ocean and maritime climate solutions, monitoring, and resilience initiatives.",
      "research:general": "Core climate research datasets, trackers, and global monitoring resources.",
      "research:policy": "Policy-focused tools for scenario planning, governance, and emissions strategy.",
      "research:green energy": "Technical references and evidence for renewable and low-carbon energy systems.",
      "research:tech for climate": "Open tools, communities, and computational research for climate action.",
      "research:datasets": "Data catalogs and APIs for climate analysis, forecasting, and visualization.",
      "research:jupyter notebooks": "Notebook-based learning and reproducible workflows for climate science.",
      "education:general": "Accessible explainers and learning hubs to build climate literacy quickly.",
      "education:courses": "Structured courses and training paths to deepen climate expertise.",
      "invest:funds and organizations": "Climate funding organizations and networks for impact-oriented investing."
    };
    const fallback = `Useful ${link.topic.toLowerCase()} resource in ${link.subtopic.toLowerCase()} for climate action.`;
    return link.summary || templates[key] || fallback;
  }

  function keywordTagsFor(link) {
    const key = `${link.topic}:${link.subtopic}`.toLowerCase();
    const byScope = {
      "career:general": ["jobs", "hiring", "career-path", "climate-tech"],
      "career:water resources": ["water", "hydrology", "sanitation"],
      "career:agriculture": ["agriculture", "food-system", "agritech"],
      "career:co2": ["carbon", "co2", "removals", "emissions"],
      "career:forestry": ["forest", "nature", "land-use"],
      "career:green energy": ["renewables", "energy", "decarbonization"],
      "career:marine": ["ocean", "marine", "coastal"],
      "research:general": ["climate-data", "evidence", "monitoring"],
      "research:policy": ["policy", "scenario", "governance"],
      "research:green energy": ["solar", "power", "generation"],
      "research:tech for climate": ["opensource", "modeling", "tooling"],
      "research:datasets": ["datasets", "api", "observations"],
      "research:jupyter notebooks": ["python", "notebooks", "reproducible"],
      "education:general": ["learning", "intro", "awareness"],
      "education:courses": ["course", "training", "curriculum"],
      "invest:funds and organizations": ["funding", "venture", "grants", "impact"]
    };

    const host = hostFromUrl(link.url).replace(/\.[a-z]{2,}$/i, "").toLowerCase();

    return [
      link.topic.toLowerCase(),
      link.subtopic.toLowerCase(),
      host,
      ...(byScope[key] || [])
    ];
  }

  function cardClass(topic) {
    const color = TOPICS[topic] ? TOPICS[topic].colorClass : "career";
    return `card-${color}`;
  }
  function colClass(topic) {
    const color = TOPICS[topic] ? TOPICS[topic].colorClass : "career";
    return `col-${color}`;
  }
  function topicIcon(topic) {
    return TOPICS[topic] ? TOPICS[topic].icon : "bi-link-45deg";
  }
  function escapeAttr(text) {
    return String(text).replace(/"/g, "&quot;");
  }

  function buildCard(link, showTopic) {
    const host = hostFromUrl(link.url);
    const dateText = formatDate(link.date);
    const summary = summaryFor(link);
    const tags = keywordTagsFor(link);
    const visibleTags = tags.slice(0, 3);
    const aria = escapeAttr(`${link.title}. ${summary} ${link.topic} resource. Date ${dateText}. Tags: ${tags.join(", ")}. Opens in a new tab.`);
    const topicBadge = showTopic
      ? `<span class="resource-host"><i class="bi ${topicIcon(link.topic)}" aria-hidden="true"></i> ${link.topic} · ${link.subtopic}</span>`
      : `<span class="resource-host">${host}</span>`;
    return `
      <a class="resource-card ${cardClass(link.topic)}" href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${aria}">
        <div class="resource-head">
          <img class="favicon" src="${faviconUrl(link.url)}" alt="" aria-hidden="true" loading="lazy">
          <h3 class="resource-title">${link.title}</h3>
        </div>
        <p class="resource-summary">${summary}</p>
        <div class="resource-meta">
          ${topicBadge}
          <span class="resource-date">${dateText}</span>
        </div>
        <div class="tag-list" aria-label="Related tags">
          ${visibleTags.map((tag) => `<span class="tag-chip">#${tag}</span>`).join("")}
        </div>
      </a>
    `;
  }

  /* ----------------- Home sections grid ----------------- */
  function renderHome() {
    const container = document.getElementById("topicGrid");
    if (!container || !window.CLIMATE_LINKS) return;

    const counts = window.CLIMATE_LINKS.reduce((acc, item) => {
      acc[item.topic] = (acc[item.topic] || 0) + 1;
      return acc;
    }, {});

    container.innerHTML = TOPIC_ORDER.map((topic) => {
      const cfg = TOPICS[topic];
      const linksCount = counts[topic] || 0;
      return `
        <a class="resource-card home-topic-card ${cardClass(topic)}" href="${cfg.page}" aria-label="Open ${topic} page with ${linksCount} links">
          <div class="resource-head">
            <i class="bi ${cfg.icon}" aria-hidden="true"></i>
            <h2 class="resource-title">${topic}</h2>
          </div>
          <p class="resource-summary mb-0">${linksCount} links · open page →</p>
        </a>
      `;
    }).join("");
  }

  /* ----------------- Search + board ----------------- */
  function setupSearch() {
    const board = document.getElementById("kanbanBoard");
    const generalLane = document.getElementById("generalLane");
    const sectionsPanel = document.getElementById("sectionsPanel");
    const searchInput = document.getElementById("searchInput");
    const sectionSortToggle = document.getElementById("sectionSortToggle");
    const linkSortToggle = document.getElementById("linkSortToggle");
    const dateSortToggle = document.getElementById("dateSortToggle");
    const resultStatus = document.getElementById("resultStatus");
    if (!board || !searchInput || !sectionSortToggle || !linkSortToggle || !dateSortToggle || !resultStatus || !window.CLIMATE_LINKS) return;

    const currentTopic = document.body.dataset.topic || null;
    const allLinks = window.CLIMATE_LINKS;
    const topicLinks = currentTopic ? allLinks.filter((item) => item.topic === currentTopic) : [];

    const sortState = { section: "az", link: "az", date: "none" };
    const globalIndex = new Map(allLinks.map((item, idx) => [item.url, idx]));

    function dateIndex(link) {
      if (link.date) {
        const parsed = Date.parse(link.date);
        if (!Number.isNaN(parsed)) return parsed;
      }
      return globalIndex.has(link.url) ? globalIndex.get(link.url) : 0;
    }

    function compareLinks(a, b, linkMode, dateMode) {
      if (dateMode === "date-desc") return dateIndex(b) - dateIndex(a) || a.title.localeCompare(b.title);
      if (dateMode === "date-asc") return dateIndex(a) - dateIndex(b) || a.title.localeCompare(b.title);
      if (linkMode === "za") return b.title.localeCompare(a.title);
      return a.title.localeCompare(b.title);
    }

    function sortSubtopics(subtopics, grouped, sectionMode, dateMode) {
      if (dateMode === "date-desc") {
        return subtopics.sort((a, b) => Math.max(...grouped[b].map(dateIndex)) - Math.max(...grouped[a].map(dateIndex)) || a.localeCompare(b));
      }
      if (dateMode === "date-asc") {
        return subtopics.sort((a, b) => Math.min(...grouped[a].map(dateIndex)) - Math.min(...grouped[b].map(dateIndex)) || a.localeCompare(b));
      }
      if (sectionMode === "za") return subtopics.sort((a, b) => b.localeCompare(a));
      return subtopics.sort((a, b) => a.localeCompare(b));
    }

    function setToggleUI(toggle, valueText, icon) {
      const valueEl = toggle.querySelector(".sort-value");
      const iconEl = toggle.querySelector(".sort-icon");
      if (valueEl) valueEl.textContent = valueText;
      if (iconEl) iconEl.className = `sort-icon bi ${icon}`;
      toggle.setAttribute("aria-label", `${toggle.dataset.key} sort ${valueText}`);
    }

    function syncSortToggles() {
      setToggleUI(sectionSortToggle, sortState.section === "az" ? "A-Z" : "Z-A", sortState.section === "az" ? "bi-sort-alpha-down" : "bi-sort-alpha-up");
      setToggleUI(linkSortToggle, sortState.link === "az" ? "A-Z" : "Z-A", sortState.link === "az" ? "bi-sort-alpha-down" : "bi-sort-alpha-up");
      if (sortState.date === "date-asc") setToggleUI(dateSortToggle, "Old-New", "bi-sort-numeric-down");
      else if (sortState.date === "date-desc") setToggleUI(dateSortToggle, "New-Old", "bi-sort-numeric-up");
      else setToggleUI(dateSortToggle, "None", "bi-dash-circle");
    }

    function groupBy(links, keyFn) {
      return links.reduce((acc, link) => {
        const k = keyFn(link);
        if (!acc[k]) acc[k] = [];
        acc[k].push(link);
        return acc;
      }, {});
    }

    function matchesQuery(link, query) {
      if (!query) return true;
      const tags = keywordTagsFor(link);
      const text = `${link.title} ${link.topic} ${link.subtopic} ${link.url} ${summaryFor(link)} ${formatDate(link.date)} ${tags.join(" ")}`.toLowerCase();
      return text.includes(query);
    }

    /* Default topic view: subtopic columns + general lane (current topic only) */
    function renderTopicDefault() {
      if (sectionsPanel) sectionsPanel.classList.add("d-none");
      board.classList.remove("d-none");

      const grouped = groupBy(topicLinks, (l) => l.subtopic);
      const generalKey = Object.keys(grouped).find((s) => s.toLowerCase() === "general");
      const generalLinks = generalKey ? grouped[generalKey].slice() : [];
      const filteredGrouped = { ...grouped };
      if (generalKey) delete filteredGrouped[generalKey];
      const subtopics = sortSubtopics(Object.keys(filteredGrouped), filteredGrouped, sortState.section, sortState.date);

      if (generalLane && generalLinks.length > 0) {
        const cards = generalLinks.sort((a, b) => compareLinks(a, b, sortState.link, sortState.date)).map((l) => buildCard(l, false)).join("");
        generalLane.classList.remove("d-none");
        generalLane.innerHTML = `
          <h2 class="h6 fw-bold mb-2 d-flex align-items-center gap-2"><i class="bi bi-stars" aria-hidden="true"></i> General <span class="badge text-bg-light">${generalLinks.length}</span></h2>
          <div class="general-row" aria-label="General links row">${cards}</div>
        `;
      } else if (generalLane) {
        generalLane.classList.add("d-none");
        generalLane.innerHTML = "";
      }

      board.innerHTML = subtopics.map((subtopic) => {
        const cards = filteredGrouped[subtopic].sort((a, b) => compareLinks(a, b, sortState.link, sortState.date)).map((l) => buildCard(l, false)).join("");
        return `
          <section class="kanban-col ${colClass(currentTopic)}" aria-label="Subsection ${subtopic}">
            <h2>${subtopic} <span class="badge text-bg-light">${filteredGrouped[subtopic].length}</span></h2>
            ${cards}
          </section>
        `;
      }).join("");

      resultStatus.textContent = `${topicLinks.length} links in ${currentTopic}.`;
    }

    /* Global search: one column per topic, across the whole dataset */
    function renderGlobalSearch(query) {
      if (sectionsPanel) sectionsPanel.classList.add("d-none");
      if (generalLane) { generalLane.classList.add("d-none"); generalLane.innerHTML = ""; }
      board.classList.remove("d-none");

      const filtered = allLinks.filter((l) => matchesQuery(l, query));
      const grouped = groupBy(filtered, (l) => l.topic);
      let topics = TOPIC_ORDER.filter((t) => grouped[t] && grouped[t].length);
      if (sortState.section === "za") topics = topics.slice().reverse();

      if (filtered.length === 0) {
        board.innerHTML = "<section class='panel p-3'><p class='mb-0 fw-bold'>No links match your search. Try another word.</p></section>";
        resultStatus.textContent = `0 links found across all topics.`;
        return;
      }

      board.innerHTML = topics.map((topic) => {
        const cards = grouped[topic].sort((a, b) => compareLinks(a, b, sortState.link, sortState.date)).map((l) => buildCard(l, true)).join("");
        return `
          <section class="kanban-col ${colClass(topic)}" aria-label="${topic} results">
            <h2><i class="bi ${topicIcon(topic)}" aria-hidden="true"></i> ${topic} <span class="badge text-bg-light">${grouped[topic].length}</span></h2>
            ${cards}
          </section>
        `;
      }).join("");

      resultStatus.textContent = `${filtered.length} links found across all topics.`;
    }

    /* Home default: show the sections grid, hide board */
    function renderHomeDefault() {
      if (sectionsPanel) sectionsPanel.classList.remove("d-none");
      board.classList.add("d-none");
      board.innerHTML = "";
      if (generalLane) { generalLane.classList.add("d-none"); generalLane.innerHTML = ""; }
      resultStatus.textContent = "";
    }

    function render() {
      const query = searchInput.value.toLowerCase().trim();
      if (query.length === 0) {
        if (currentTopic) renderTopicDefault();
        else renderHomeDefault();
      } else {
        renderGlobalSearch(query);
      }
    }

    searchInput.addEventListener("input", render);
    sectionSortToggle.addEventListener("click", () => {
      sortState.section = sortState.section === "az" ? "za" : "az";
      syncSortToggles();
      render();
    });
    linkSortToggle.addEventListener("click", () => {
      sortState.link = sortState.link === "az" ? "za" : "az";
      syncSortToggles();
      render();
    });
    dateSortToggle.addEventListener("click", () => {
      if (sortState.date === "none") sortState.date = "date-asc";
      else if (sortState.date === "date-asc") sortState.date = "date-desc";
      else sortState.date = "none";
      syncSortToggles();
      render();
    });

    syncSortToggles();
    render();
  }

  function setupNav() {
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    if (!navToggle || !navMenu) return;
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHome();
    setupSearch();
    setupNav();
  });
})();
