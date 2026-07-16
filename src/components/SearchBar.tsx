import { useEffect, useRef } from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  resourceCount: number;
}

export function SearchBar({ query, onQueryChange, resourceCount }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const isTyping = target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || (target instanceof HTMLElement && target.isContentEditable);

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === "Escape" && document.activeElement === inputRef.current && query) {
        onQueryChange("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onQueryChange, query]);

  return (
    <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      <label className="visually-hidden" htmlFor="resource-search">Search climate resources</label>
      <input
        id="resource-search"
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={`Search ${resourceCount} resources`}
      />
      {query ? (
        <button type="button" onClick={() => onQueryChange("")}>Clear</button>
      ) : (
        <kbd aria-hidden="true">/</kbd>
      )}
    </form>
  );
}
