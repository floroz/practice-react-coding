import { useState, useEffect, useRef, useTransition } from "react";
import styles from "./Autocomplete.module.css";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
}

const MOCK_DATA: SearchResult[] = [
  {
    id: "1",
    title: "React Hooks",
    description: "Learn about useState, useEffect, and custom hooks",
    category: "React",
  },
  {
    id: "2",
    title: "React Context",
    description: "State management with Context API",
    category: "React",
  },
  {
    id: "3",
    title: "React Router",
    description: "Client-side routing in React applications",
    category: "React",
  },
  {
    id: "4",
    title: "TypeScript Basics",
    description: "Introduction to TypeScript fundamentals",
    category: "TypeScript",
  },
  {
    id: "5",
    title: "TypeScript Generics",
    description: "Advanced TypeScript with generic types",
    category: "TypeScript",
  },
  {
    id: "6",
    title: "JavaScript Arrays",
    description: "Array methods: map, filter, reduce",
    category: "JavaScript",
  },
  {
    id: "7",
    title: "JavaScript Promises",
    description: "Asynchronous programming with Promises",
    category: "JavaScript",
  },
  {
    id: "8",
    title: "JavaScript Async/Await",
    description: "Modern async syntax in JavaScript",
    category: "JavaScript",
  },
  {
    id: "9",
    title: "CSS Grid",
    description: "Layout with CSS Grid system",
    category: "CSS",
  },
  {
    id: "10",
    title: "CSS Flexbox",
    description: "Flexible box layout in CSS",
    category: "CSS",
  },
  {
    id: "11",
    title: "Node.js Basics",
    description: "Server-side JavaScript with Node.js",
    category: "Node",
  },
  {
    id: "12",
    title: "Express Framework",
    description: "Web framework for Node.js",
    category: "Node",
  },
  {
    id: "13",
    title: "MongoDB",
    description: "NoSQL database for modern apps",
    category: "Database",
  },
  {
    id: "14",
    title: "PostgreSQL",
    description: "Powerful relational database",
    category: "Database",
  },
  {
    id: "15",
    title: "REST APIs",
    description: "RESTful API design principles",
    category: "API",
  },
  {
    id: "16",
    title: "GraphQL",
    description: "Query language for APIs",
    category: "API",
  },
  {
    id: "17",
    title: "Git Basics",
    description: "Version control with Git",
    category: "Tools",
  },
  {
    id: "18",
    title: "Docker Containers",
    description: "Containerization with Docker",
    category: "Tools",
  },
  {
    id: "19",
    title: "Webpack",
    description: "Module bundler for JavaScript",
    category: "Tools",
  },
  {
    id: "20",
    title: "Vite",
    description: "Next generation frontend tooling",
    category: "Tools",
  },
];

const mockApi = {
  async search(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
    // Simulate network delay
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 400 + Math.random() * 400);
      signal?.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new Error("Aborted"));
      });
    });

    // Simulate occasional errors
    if (Math.random() < 0.05) {
      throw new Error("Failed to fetch results");
    }

    if (!query.trim()) return [];

    // Filter results
    return MOCK_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
  },
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  try {
    const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  } catch {
    return text;
  }
}

export default function Autocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);

  const [isPending, startTransition] = useTransition();
  const abortControllerRef = useRef<AbortController | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      setIsLoading(true);
      setError(null);
      setSelectedIndex(-1);

      try {
        const searchResults = await mockApi.search(debouncedQuery, signal);

        startTransition(() => {
          setResults(searchResults);
          setShowResults(true);
          setIsLoading(false);
        });
      } catch (err) {
        if (err instanceof Error && err.message === "Aborted") {
          return; // Ignore aborted requests
        }
        setError(err instanceof Error ? err.message : "Search failed");
        setIsLoading(false);
      }
    };

    performSearch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    setError(null);
    setSelectedIndex(-1);
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.title);
    setShowResults(false);
    setSelectedIndex(-1);
    // In a real app, you'd navigate or perform some action here
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Autocomplete Search</h2>
        <p className={styles.subtitle}>
          Type to search with debouncing and race condition handling
        </p>
      </header>

      <div className={styles.info}>
        <h3>Features:</h3>
        <ul>
          <li>✅ Debounced search (300ms delay)</li>
          <li>✅ Race condition handling with AbortController</li>
          <li>✅ useTransition for smooth updates</li>
          <li>✅ Highlighted search matches</li>
          <li>✅ Keyboard navigation (↑↓ Enter Esc)</li>
        </ul>
      </div>

      <div className={styles.searchWrapper}>
        <div className={styles.searchBox}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
            placeholder="Search for topics... (min 2 characters)"
            className={styles.input}
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={showResults}
          />

          {(isLoading || isPending) && (
            <div className={styles.loadingSpinner} aria-label="Loading">
              <div className={styles.spinner} />
            </div>
          )}

          {query && (
            <button
              onClick={handleClear}
              className={styles.clearButton}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {showResults && (
          <div className={styles.results} id="search-results" role="listbox">
            {error && (
              <div className={styles.error} role="alert">
                ❌ {error}
                <button
                  onClick={() => setError(null)}
                  className={styles.retryButton}
                >
                  Retry
                </button>
              </div>
            )}

            {!error && results.length === 0 && !isLoading && (
              <div className={styles.noResults}>
                No results found for "<strong>{debouncedQuery}</strong>"
              </div>
            )}

            {!error && results.length > 0 && (
              <div className={styles.resultsList}>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={`${styles.resultItem} ${
                      index === selectedIndex ? styles.selected : ""
                    }`}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    <div className={styles.resultContent}>
                      <div className={styles.resultTitle}>
                        {highlightMatch(result.title, debouncedQuery)}
                      </div>
                      <div className={styles.resultDescription}>
                        {highlightMatch(result.description, debouncedQuery)}
                      </div>
                    </div>
                    <span className={styles.resultCategory}>
                      {result.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.hint}>
        💡 Try typing quickly to see debouncing in action. Results update
        smoothly without blocking the UI.
      </div>
    </div>
  );
}

