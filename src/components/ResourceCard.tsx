import { memo } from "react";
import type { Resource } from "../types";
import { faviconOf } from "../utils";

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard = memo(function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <a
      className="resource-card"
      data-topic={resource.topic}
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h3>
        <img src={faviconOf(resource.url)} alt="" loading="lazy" width="20" height="20" />
        <span>
          {resource.title}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </span>
      </h3>
      <p>{resource.summary}</p>
    </a>
  );
});
