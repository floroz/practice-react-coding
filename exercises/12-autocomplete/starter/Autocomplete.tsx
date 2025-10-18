import { useState } from "react";
import styles from "./Autocomplete.module.css";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
}

// Mock data
const MOCK_DATA: SearchResult[] = [
  {
    id: "1",
    title: "React Hooks",
    description: "Learn about useState, useEffect, and more",
    category: "React",
  },
  {
    id: "2",
    title: "TypeScript Basics",
    description: "Introduction to TypeScript",
    category: "TypeScript",
  },
  {
    id: "3",
    title: "JavaScript Arrays",
    description: "Array methods and operations",
    category: "JavaScript",
  },
  // Add more mock data...
];

// TODO: Implement mock API
const mockApi = {
  async search(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
    // TODO: Implement with delay and filtering
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [];
  },
};

// TODO: Implement useDebounce hook
function useDebounce<T>(value: T, delay: number): T {
  // TODO: Implement debounce logic
  return value;
}

export default function Autocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: Implement debounced search
  // TODO: Implement useTransition for non-blocking updates
  // TODO: Handle race conditions with AbortController
  // TODO: Implement keyboard navigation
  // TODO: Implement result highlighting

  return (
    <div className={styles.container}>
      <h2>Autocomplete Search</h2>
      <p className={styles.subtitle}>
        Type to search with debouncing and race condition handling
      </p>

      <div className={styles.searchBox}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className={styles.input}
        />
        {/* TODO: Add clear button */}
        {/* TODO: Add loading indicator */}
      </div>

      {/* TODO: Render results */}
      {/* TODO: Handle error state */}
      {/* TODO: Handle empty state */}
    </div>
  );
}

