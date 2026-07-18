import { memo, type SyntheticEvent } from "react";
import type { Resource } from "../types";
import { faviconOf } from "../utils";

interface ResourceCardProps {
  resource: Resource;
}

function hideBrokenFavicon(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.hidden = true;
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
        <span className="resource-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 0 0 7.07.07l2-2A5 5 0 0 0 12 4m2 7a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20" />
          </svg>
          <img
            src={faviconOf(resource.url)}
            alt=""
            loading="lazy"
            width="22"
            height="22"
            onError={hideBrokenFavicon}
          />
        </span>
        <span>
          {resource.title}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </span>
      </h3>
      <p>{resource.summary}</p>
    </a>
  );
});
