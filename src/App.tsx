import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { FilterBar } from "./components/FilterBar";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ResourceGroup } from "./components/ResourceGroup";
import { RouteOverview } from "./components/RouteOverview";
import { GENERAL_CATEGORY, topicConfig } from "./config";
import { resources as resourceData } from "./data";
import type { Theme, Topic } from "./types";
import { topicOrder } from "./types";
import {
  categoriesFor,
  groupBySubtopic,
  groupByTopic,
  searchResources,
  slugify,
  sortResources,
  topicFromPath
} from "./utils";

const resources = sortResources(resourceData);

function initialTheme(): Theme {
  const saved = localStorage.getItem("climate-hub-theme");
  if (saved === "light" || saved === "dark") return saved;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function initialSelectedCategories(topic: Topic | null): string[] {
  if (!topic || !location.hash) return [];
  const hash = decodeURIComponent(location.hash.slice(1));
  const category = categoriesFor(resources, topic)
    .find((item) => item !== GENERAL_CATEGORY && slugify(item) === hash);
  return category ? [category] : [];
}

export function App() {
  const currentTopic = topicFromPath(location.pathname);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get("q") ?? "");
  const [selected, setSelected] = useState<string[]>(() => initialSelectedCategories(currentTopic));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("climate-hub-theme", theme);
  }, [theme]);

  useEffect(() => {
    const url = new URL(location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [query]);

  function toggleTheme() {
    setTheme((current) => current === "dark" ? "light" : "dark");
  }

  function toggleCategory(category: string) {
    setSelected((current) => current.includes(category)
      ? current.filter((item) => item !== category)
      : [...current, category]);
  }

  const trimmedQuery = query.trim();
  const matches = searchResources(resources, trimmedQuery);
  const panelResourceCount = currentTopic
    ? resources.filter((resource) => resource.topic === currentTopic).length
    : resources.length;

  let content;
  let status: string;

  if (trimmedQuery) {
    const grouped = groupByTopic(matches);
    status = `${matches.length} ${matches.length === 1 ? "resource" : "resources"} found across the directory.`;
    content = matches.length ? (
      <div className="search-results">
        <header className="search-results-heading">
          <p>Search results</p>
          <h2>“{trimmedQuery}”</h2>
        </header>
        {topicOrder.map((topic) => grouped[topic]?.length ? (
          <ResourceGroup
            title={topic}
            resources={grouped[topic]}
            topic={topic}
            headingHref={topicConfig[topic].page}
            key={topic}
          />
        ) : null)}
      </div>
    ) : (
      <section className="empty-state">
        <h2>No climate resource matched “{trimmedQuery}”.</h2>
        <p>Try a shorter phrase, organization name, or topic.</p>
      </section>
    );
  } else if (currentTopic) {
    const topicResources = resources.filter((resource) => resource.topic === currentTopic);
    const categories = categoriesFor(resources, currentTopic);
    const groups = groupBySubtopic(topicResources);
    const filterable = categories.filter((category) => category !== GENERAL_CATEGORY);
    const visibleCategories = selected.length ? selected : filterable;
    const visibleCount = (groups[GENERAL_CATEGORY]?.length ?? 0)
      + visibleCategories.reduce((sum, category) => sum + (groups[category]?.length ?? 0), 0);

    status = selected.length
      ? `${visibleCount} resources shown in ${selected.length} selected ${selected.length === 1 ? "category" : "categories"}.`
      : `${topicResources.length} resources across ${categories.length} categories.`;

    const counts = Object.fromEntries(filterable.map((category) => [category, groups[category].length]));
    content = (
      <>
        <FilterBar
          categories={filterable}
          selected={selected}
          counts={counts}
          onToggle={toggleCategory}
          onClear={() => setSelected([])}
        />
        {groups[GENERAL_CATEGORY]?.length ? (
          <ResourceGroup
            title="Start here"
            resources={groups[GENERAL_CATEGORY]}
            topic={currentTopic}
            featured
          />
        ) : null}
        {visibleCategories.map((category) => (
          <ResourceGroup
            title={category}
            resources={groups[category]}
            topic={currentTopic}
            key={category}
          />
        ))}
      </>
    );
  } else {
    status = `${resources.length} independently curated resources across four climate paths.`;
    content = <RouteOverview resources={resources} />;
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header currentTopic={currentTopic} theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content" className="shell" data-topic={currentTopic ?? undefined}>
        <Hero
          currentTopic={currentTopic}
          query={query}
          onQueryChange={setQuery}
          resourceCount={resources.length}
          panelResourceCount={panelResourceCount}
        />
        <p className="result-status" role="status" aria-live="polite">{status}</p>
        <div className="directory-content">{content}</div>
      </main>
      <Footer />
    </>
  );
}
