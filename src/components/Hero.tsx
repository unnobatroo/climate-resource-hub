import type { Topic } from "../types";
import { topicConfig } from "../config";
import { SearchBar } from "./SearchBar";

interface HeroProps {
  currentTopic: Topic | null;
  query: string;
  onQueryChange: (query: string) => void;
  resourceCount: number;
}

export function Hero({ currentTopic, query, onQueryChange, resourceCount }: HeroProps) {
  const title = currentTopic
    ? topicConfig[currentTopic].title
    : "Useful resources for climate action.";
  const description = currentTopic
    ? topicConfig[currentTopic].description
    : "A focused directory for finding climate work, evidence, learning, and funding.";

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">{currentTopic ? topicConfig[currentTopic].action : "A practical climate directory"}</p>
        <h1>{title}</h1>
        <p className="lede">{description}</p>
        <SearchBar query={query} onQueryChange={onQueryChange} resourceCount={resourceCount} />
      </div>

      <aside className="climate-panel" aria-label={`${resourceCount} curated climate resources`}>
        <div className="climate-panel-copy">
          <span>Built for action</span>
          <strong>{resourceCount}</strong>
          <p>curated climate resources</p>
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
