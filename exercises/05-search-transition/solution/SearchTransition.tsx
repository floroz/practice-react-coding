import { useState, useTransition, useMemo } from "react";
import styles from "./SearchTransition.module.css";

interface Item {
  id: number;
  name: string;
  category: string;
  description: string;
}

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Food",
  "Sports",
  "Home",
  "Toys",
];
const ADJECTIVES = [
  "Amazing",
  "Premium",
  "Deluxe",
  "Super",
  "Ultra",
  "Professional",
  "Essential",
];
const NOUNS = [
  "Widget",
  "Gadget",
  "Device",
  "Tool",
  "Product",
  "Item",
  "Thing",
];

// Generate large dataset
function generateItems(count: number): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `${ADJECTIVES[i % ADJECTIVES.length]} ${NOUNS[i % NOUNS.length]} ${String(i + 1)}`,
    category: CATEGORIES[i % CATEGORIES.length],
    description: `This is a detailed description for item ${String(i + 1)}. It contains various features and benefits that make it unique.`,
  }));
}

function highlightText(text: string, query: string): React.JSX.Element {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className={styles.highlight}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function SearchTransition() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Generate items once
  const items = useMemo(() => generateItems(8000), []);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;

    const lowerQuery = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery, items]);

  const handleSearch = (value: string) => {
    setQuery(value);
    // Mark the filtering as a non-urgent update
    startTransition(() => {
      setSearchQuery(value);
    });
  };

  return (
    <div className={styles.container}>
      <h2>Search with useTransition</h2>
      <p style={{ color: "#888", marginBottom: "1rem" }}>
        Search through {items.length.toLocaleString()} items without blocking
        the UI. The search uses <code>useTransition</code> to keep the input
        responsive.
      </p>

      <div className={styles.search}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search items..."
          value={query}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />

        <div className={styles.stats}>
          <span>
            Showing {filteredItems.length.toLocaleString()} of{" "}
            {items.length.toLocaleString()} items
          </span>
          {isPending && <span className={styles.pending}>🔄 Searching...</span>}
        </div>
      </div>

      <div className={styles.results}>
        {filteredItems.length === 0 ? (
          <div className={styles.noResults}>
            No items found for "{searchQuery}"
          </div>
        ) : (
          filteredItems.slice(0, 100).map((item) => (
            <div key={item.id} className={styles.item}>
              <h4>{highlightText(item.name, searchQuery)}</h4>
              <span className={styles.category}>
                {highlightText(item.category, searchQuery)}
              </span>
              <p>{highlightText(item.description, searchQuery)}</p>
            </div>
          ))
        )}
        {filteredItems.length > 100 && (
          <div className={styles.noResults}>
            ... and {(filteredItems.length - 100).toLocaleString()} more items
          </div>
        )}
      </div>
    </div>
  );
}
