import { topicConfig } from "../config";
import type { Resource } from "../types";
import { topicOrder } from "../types";

interface RouteOverviewProps {
  resources: Resource[];
}

export function RouteOverview({ resources }: RouteOverviewProps) {
  return (
    <section className="route-overview" aria-labelledby="route-heading">
      <header className="section-intro">
        <p>Choose a direction</p>
        <h2 id="route-heading">Four ways into climate action</h2>
      </header>
      <div className="route-grid">
        {topicOrder.map((topic) => {
          const count = resources.filter((resource) => resource.topic === topic).length;
          const config = topicConfig[topic];
          return (
            <a className="route-card" data-topic={topic} href={config.page} key={topic}>
              <span>{config.action}</span>
              <h3>{topic}</h3>
              <p>{config.shortDescription}</p>
              <footer>
                <span>{count} resources</span>
                <span aria-hidden="true">→</span>
              </footer>
            </a>
          );
        })}
      </div>
    </section>
  );
}
