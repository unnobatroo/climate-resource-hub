import type { Topic } from "../types";

interface ThematicIllustrationProps {
  topic: Topic | null;
}

export function ThematicIllustration({ topic }: ThematicIllustrationProps) {
  if (topic === "Research") {
    return (
      <div className="landscape landscape-research" aria-hidden="true">
        <span className="research-globe" />
        <span className="research-ring" />
        <span className="research-node research-node-one" />
        <span className="research-node research-node-two" />
        <span className="research-node research-node-three" />
      </div>
    );
  }

  if (topic === "Education") {
    return (
      <div className="landscape landscape-education" aria-hidden="true">
        <span className="education-sun" />
        <span className="book-page book-page-left" />
        <span className="book-page book-page-right" />
        <span className="book-spine" />
      </div>
    );
  }

  if (topic === "Invest") {
    return (
      <div className="landscape landscape-invest" aria-hidden="true">
        <span className="invest-sun" />
        <span className="invest-bar invest-bar-one" />
        <span className="invest-bar invest-bar-two" />
        <span className="invest-bar invest-bar-three" />
        <span className="invest-trend" />
      </div>
    );
  }

  return (
    <div className={`landscape ${topic === "Career" ? "landscape-career" : "landscape-overview"}`} aria-hidden="true">
      <span className="sun" />
      <span className="hill hill-back" />
      <span className="hill hill-front" />
      <span className={topic === "Career" ? "career-path" : "river"} />
      {topic === "Career" ? <span className="career-marker" /> : null}
    </div>
  );
}
