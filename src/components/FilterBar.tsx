interface FilterBarProps {
  categories: string[];
  selected: string[];
  counts: Record<string, number>;
  onToggle: (category: string) => void;
  onClear: () => void;
}

export function FilterBar({ categories, selected, counts, onToggle, onClear }: FilterBarProps) {
  if (!categories.length) return null;

  return (
    <section className="filter-bar" aria-labelledby="filter-heading">
      <h2 id="filter-heading">Filter by category</h2>
      <div className="filter-actions" role="group" aria-label="Resource categories">
        {categories.map((category) => {
          const active = selected.includes(category);
          return (
            <button
              type="button"
              className={active ? "filter-chip active" : "filter-chip"}
              aria-pressed={active}
              onClick={() => onToggle(category)}
              key={category}
            >
              <span>{category}</span>
              <span>{counts[category]}</span>
            </button>
          );
        })}
        {selected.length > 0 && (
          <button className="filter-reset" type="button" onClick={onClear}>Show all</button>
        )}
      </div>
    </section>
  );
}
