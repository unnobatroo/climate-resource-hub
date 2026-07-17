import type { Topic } from "../types";
import { topicConfig } from "../config";
import { SearchBar } from "./SearchBar";

interface HeroProps {
  currentTopic: Topic | null;
  query: string;
  onQueryChange: (query: string) => void;
  resourceCount: number;
  panelResourceCount: number;
}

export function Hero({
  currentTopic,
  query,
  onQueryChange,
  resourceCount,
  panelResourceCount
}: HeroProps) {
  const title = currentTopic
    ? topicConfig[currentTopic].title
    : "Useful resources for climate action.";
  const description = currentTopic
    ? topicConfig[currentTopic].description
    : "A focused directory for finding climate work, evidence, learning, and funding.";
  const panelLabel = currentTopic
    ? topicConfig[currentTopic].panelLabel
    : "Built for action";
  const panelDescription = currentTopic
    ? topicConfig[currentTopic].panelDescription
    : "curated climate resources";

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{currentTopic ?? "A practical climate directory"}</p>
        <h1>{title}</h1>
        <p className="lede">{description}</p>
        <SearchBar query={query} onQueryChange={onQueryChange} resourceCount={resourceCount} />
      </div>

      <aside className="climate-panel" aria-label={`${panelResourceCount} ${panelDescription}`}>
        <div className="climate-panel-copy">
          <span>{panelLabel}</span>
          <strong>{panelResourceCount}</strong>
          <p>{panelDescription}</p>
        </div>
        <div className="landscape" aria-hidden="true">
          <span className="sun" />
          <span className="hill hill-back" />
          <span className="hill hill-front" />
          <span className="river" />
        </div>
      </aside>
    </section>
  );
}
