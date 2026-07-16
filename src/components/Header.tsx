import type { Theme, Topic } from "../types";
import { topicOrder } from "../types";
import { topicConfig } from "../config";

interface HeaderProps {
  currentTopic: Topic | null;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ currentTopic, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="shell masthead">
        <a className="brand" href="index.html">
          <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M25.5 5.5C15 6.2 8.5 11.6 7 21.8c4.3-4.8 8.8-7.8 13.6-9.1-4.4 2.5-7.9 6.2-10.5 11.2 7.6 1.3 13.6-3.7 15.4-18.4Z" />
          </svg>
          <span>Climate Resource Hub</span>
        </a>

        <nav aria-label="Directory sections">
          <a
            className={!currentTopic ? "nav-link active" : "nav-link"}
            href="index.html"
            aria-current={!currentTopic ? "page" : undefined}
          >
            All
          </a>
          {topicOrder.map((topic) => (
            <a
              className={currentTopic === topic ? "nav-link active" : "nav-link"}
              href={topicConfig[topic].page}
              aria-current={currentTopic === topic ? "page" : undefined}
              key={topic}
            >
              {topic}
            </a>
          ))}
        </nav>

        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          aria-pressed={theme === "dark"}
        >
          <span aria-hidden="true">{theme === "dark" ? "☀" : "◐"}</span>
        </button>
      </div>
    </header>
  );
}
