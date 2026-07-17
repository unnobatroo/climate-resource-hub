import type { Theme, Topic } from "../types";
import { topicOrder } from "../types";
import { topicConfig } from "../config";

const navIcons = {
  Career: "M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-10 0h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm4-2h-2v2h2V5Zm7 7H4m6 0v2h4v-2",
  Research: "m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  Education: "M4 5.5A2.5 2.5 0 0 1 6.5 3H11a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 21.5v-16Zm16 0A2.5 2.5 0 0 0 17.5 3H13v16a2 2 0 0 1 2-2h2.5a2.5 2.5 0 0 1 2.5 2.5v-14Z",
  Invest: "M4 18 9 13l4 4 7-9m-5 0h5v5"
} as const;

function NavIcon({ path }: { path: string }) {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

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
            <NavIcon path="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />
            All
          </a>
          {topicOrder.map((topic) => (
            <a
              className={currentTopic === topic ? "nav-link active" : "nav-link"}
              data-topic={topic}
              href={topicConfig[topic].page}
              aria-current={currentTopic === topic ? "page" : undefined}
              key={topic}
            >
              <NavIcon path={navIcons[topic]} />
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
          <svg className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d={theme === "dark"
              ? "M12 4V2m0 20v-2M4.93 4.93 3.5 3.5m17 17-1.43-1.43M4 12H2m20 0h-2M4.93 19.07 3.5 20.5m17-17-1.43 1.43M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
              : "M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5a8.5 8.5 0 1 0 12 12Z"}
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
