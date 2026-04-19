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
      return new URL(url).hostname;
    } catch (_) {
      return "external link";
    }
  }

  function faviconUrl(url) {
    const host = hostFromUrl(url);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
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

    const host = hostFromUrl(link.url)
      .replace(/^www\./, "")
      .replace(/\.[a-z]{2,}$/i, "")
      .toLowerCase();

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
        <div class="col-12 col-md-6">
          <a class="resource-card home-topic-card ${cardClass(topic)} h-100" href="${cfg.page}" aria-label="Open ${topic} page with ${linksCount} links">
            <div class="resource-head">
              <i class="bi ${cfg.icon}" aria-hidden="true"></i>
              <h2 class="resource-title">${topic}</h2>
            </div>
            <p class="resource-summary">${linksCount} links counted</p>
            <p class="resource-host mb-0"><i>Open dedicated page</i></p>
          </a>
        </div>
      `;
    }).join("");
  }

  function renderTopicPage() {
    const board = document.getElementById("kanbanBoard");
    const generalLane = document.getElementById("generalLane");
    const searchInput = document.getElementById("searchInput");
    const sectionSortToggle = document.getElementById("sectionSortToggle");
    const linkSortToggle = document.getElementById("linkSortToggle");
    const dateSortToggle = document.getElementById("dateSortToggle");
    const resultStatus = document.getElementById("resultStatus");
    if (!board || !generalLane || !searchInput || !sectionSortToggle || !linkSortToggle || !dateSortToggle || !resultStatus || !window.CLIMATE_LINKS) return;

    const currentTopic = document.body.dataset.topic;
    const topicLinks = window.CLIMATE_LINKS.filter((item) => item.topic === currentTopic);

    const sortState = {
      section: "az",
      link: "az",
      date: "none"
    };

    const globalIndex = new Map(window.CLIMATE_LINKS.map((item, idx) => [item.url, idx]));

    function dateIndex(link) {
      if (link.date) {
        const parsed = Date.parse(link.date);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
      return globalIndex.has(link.url) ? globalIndex.get(link.url) : 0;
    }

    function compareLinks(a, b, linkMode, dateMode) {
      if (dateMode === "date-desc") {
        return dateIndex(b) - dateIndex(a) || a.title.localeCompare(b.title);
      }
      if (dateMode === "date-asc") {
        return dateIndex(a) - dateIndex(b) || a.title.localeCompare(b.title);
      }
      if (linkMode === "az") {
        return a.title.localeCompare(b.title);
      }
      if (linkMode === "za") {
        return b.title.localeCompare(a.title);
      }
      return a.title.localeCompare(b.title);
    }

    function sortSubtopics(subtopics, grouped, sectionMode, dateMode) {
      if (dateMode === "date-desc") {
        return subtopics.sort((a, b) => {
          const newestA = Math.max(...grouped[a].map(dateIndex));
          const newestB = Math.max(...grouped[b].map(dateIndex));
          return newestB - newestA || a.localeCompare(b);
        });
      }
      if (dateMode === "date-asc") {
        return subtopics.sort((a, b) => {
          const oldestA = Math.min(...grouped[a].map(dateIndex));
          const oldestB = Math.min(...grouped[b].map(dateIndex));
          return oldestA - oldestB || a.localeCompare(b);
        });
      }
      if (sectionMode === "za") {
        return subtopics.sort((a, b) => b.localeCompare(a));
      }
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

      if (sortState.date === "date-asc") {
        setToggleUI(dateSortToggle, "Old-New", "bi-sort-numeric-down");
      } else if (sortState.date === "date-desc") {
        setToggleUI(dateSortToggle, "New-Old", "bi-sort-numeric-up");
      } else {
        setToggleUI(dateSortToggle, "None", "bi-dash-circle");
      }
    }

    function groupedLinks(filteredLinks) {
      return filteredLinks.reduce((acc, link) => {
        if (!acc[link.subtopic]) acc[link.subtopic] = [];
        acc[link.subtopic].push(link);
        return acc;
      }, {});
    }

    function render() {
      const query = searchInput.value.toLowerCase().trim();
      const sectionMode = sortState.section;
      const linkMode = sortState.link;
      const dateMode = sortState.date;
      const filtered = topicLinks.filter((link) => {
        const tags = keywordTagsFor(link);
        const text = `${link.title} ${link.subtopic} ${link.url} ${summaryFor(link)} ${formatDate(link.date)} ${tags.join(" ")}`.toLowerCase();
        return query.length === 0 || text.includes(query);
      });

      const grouped = groupedLinks(filtered);
      const generalKey = Object.keys(grouped).find((sub) => sub.toLowerCase() === "general");
      const generalLinks = generalKey ? grouped[generalKey].slice() : [];
      const filteredGrouped = { ...grouped };
      if (generalKey) {
        delete filteredGrouped[generalKey];
      }
      const subtopics = sortSubtopics(Object.keys(filteredGrouped), filteredGrouped, sectionMode, dateMode);

      if (subtopics.length === 0 && generalLinks.length === 0) {
        generalLane.innerHTML = "";
        generalLane.classList.add("d-none");
        board.innerHTML = "<section class='panel p-3'><p class='mb-0 fw-bold'>No links match this search.</p></section>";
        resultStatus.textContent = `0 links shown from ${topicLinks.length}.`;
        return;
      }

      if (generalLinks.length > 0) {
        const generalCards = generalLinks
          .sort((a, b) => compareLinks(a, b, linkMode, dateMode))
          .map((link) => {
            const host = hostFromUrl(link.url);
            const dateText = formatDate(link.date);
            const tags = keywordTagsFor(link);
            const visibleTags = tags.slice(0, 5);
            return `
              <a class="resource-card ${cardClass(link.topic)}" href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.title}. ${summaryFor(link)} Date ${dateText}. Tags: ${tags.join(", ")}. Opens in a new tab.">
                <div class="resource-head">
                  <img class="favicon" src="${faviconUrl(link.url)}" alt="" aria-hidden="true" loading="lazy">
                  <h3 class="resource-title">${link.title}</h3>
                </div>
                <p class="resource-summary">${summaryFor(link)}</p>
                <p class="resource-host">${host}</p>
                <p class="resource-date">Date: ${dateText}</p>
                <div class="tag-list" aria-label="Related tags">
                  ${visibleTags.map((tag) => `<span class="tag-chip">#${tag}</span>`).join("")}
                </div>
              </a>
            `;
          })
          .join("");

        generalLane.classList.remove("d-none");
        generalLane.innerHTML = `
          <h2 class="h6 fw-bold mb-2">General Links <span class="badge text-bg-light border border-dark">${generalLinks.length}</span></h2>
          <div class="general-row" aria-label="General links row">${generalCards}</div>
        `;
      } else {
        generalLane.innerHTML = "";
        generalLane.classList.add("d-none");
      }

      board.innerHTML = subtopics.map((subtopic) => {
        const cards = filteredGrouped[subtopic]
          .sort((a, b) => compareLinks(a, b, linkMode, dateMode))
          .map((link) => {
            const host = hostFromUrl(link.url);
            const dateText = formatDate(link.date);
            const tags = keywordTagsFor(link);
            const visibleTags = tags.slice(0, 5);
            return `
              <a class="resource-card ${cardClass(link.topic)}" href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.title}. ${summaryFor(link)} Date ${dateText}. Tags: ${tags.join(", ")}. Opens in a new tab.">
                <div class="resource-head">
                  <img class="favicon" src="${faviconUrl(link.url)}" alt="" aria-hidden="true" loading="lazy">
                  <h3 class="resource-title">${link.title}</h3>
                </div>
                <p class="resource-summary">${summaryFor(link)}</p>
                <p class="resource-host">${host}</p>
                <p class="resource-date">Date: ${dateText}</p>
                <div class="tag-list" aria-label="Related tags">
                  ${visibleTags.map((tag) => `<span class="tag-chip">#${tag}</span>`).join("")}
                </div>
              </a>
            `;
          })
          .join("");

        return `
          <section class="kanban-col ${colClass(currentTopic)}" aria-label="Subsection ${subtopic}">
            <h2>${subtopic} <span class="badge text-bg-light border border-dark">${filteredGrouped[subtopic].length}</span></h2>
            ${cards}
          </section>
        `;
      }).join("");

      resultStatus.textContent = `${filtered.length} links shown from ${topicLinks.length}.`;
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
      if (sortState.date === "none") {
        sortState.date = "date-asc";
      } else if (sortState.date === "date-asc") {
        sortState.date = "date-desc";
      } else {
        sortState.date = "none";
      }
      syncSortToggles();
      render();
    });

    syncSortToggles();
    render();
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHome();
    renderTopicPage();
  });
})();
