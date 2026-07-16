import type { Resource, Topic } from "../types";
import { slugify } from "../utils";
import { ResourceCard } from "./ResourceCard";

interface ResourceGroupProps {
  title: string;
  resources: Resource[];
  topic: Topic;
  featured?: boolean;
  headingHref?: string;
}

export function ResourceGroup({
  title,
  resources,
  topic,
  featured = false,
  headingHref
}: ResourceGroupProps) {
  return (
    <section
      className={featured ? "resource-group featured" : "resource-group"}
      data-topic={topic}
      id={featured ? "general" : slugify(title)}
    >
      <header className="group-heading">
        <div>
          {featured ? <p>Recommended starting points</p> : null}
          <h2>{headingHref ? <a href={headingHref}>{title}</a> : title}</h2>
        </div>
        <span>{resources.length} {resources.length === 1 ? "resource" : "resources"}</span>
      </header>
      <div className="resource-grid">
        {resources.map((resource) => (
          <ResourceCard resource={resource} key={resource.url} />
        ))}
      </div>
    </section>
  );
}
