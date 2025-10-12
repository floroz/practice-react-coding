/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Suspense, useState, useTransition, useEffect } from "react";
import styles from "./SuspendedTransitions.module.css";

// ==================== TYPES ====================

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

// ==================== MOCK API ====================

let requestCounter = 0;

async function searchAPI(query: string): Promise<SearchResult[]> {
  const requestId = ++requestCounter;
  console.log(`[Request ${requestId}] Starting search for: "${query}"`);

  // Simulate variable network delay
  const delay = Math.random() * 2000 + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  console.log(`[Request ${requestId}] Completed after ${delay.toFixed(0)}ms`);

  return [
    {
      id: 1,
      title: `Result 1 for "${query}"`,
      description: "Description here",
    },
    {
      id: 2,
      title: `Result 2 for "${query}"`,
      description: "Description here",
    },
    {
      id: 3,
      title: `Result 3 for "${query}"`,
      description: "Description here",
    },
  ];
}

// ==================== INFRASTRUCTURE (Don't worry about this) ====================

// Simple resource wrapper for Suspense
function wrapPromise<T>(promise: Promise<T>) {
  let status = "pending";
  let result: T;
  let error: Error;

  const suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      error = e;
    }
  );

  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw error;
      return result;
    },
  };
}

// Cache to prevent duplicate requests
const cache = new Map<string, ReturnType<typeof wrapPromise<SearchResult[]>>>();

function fetchResults(query: string) {
  if (!cache.has(query)) {
    cache.set(query, wrapPromise(searchAPI(query)));
  }
  return cache.get(query)!;
}

// ==================== DEBOUNCE HOOK ====================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

// ==================== COMPONENTS ====================

function SearchResults({ query }: { query: string }) {
  const resource = fetchResults(query);
  const results = resource.read();

  return (
    <div className={styles.results}>
      <h3>Results for: "{query}"</h3>
      {results.map((result) => (
        <div key={result.id} className={styles.resultItem}>
          <h4>{result.title}</h4>
          <p>{result.description}</p>
        </div>
      ))}
    </div>
  );
}

function SearchingIndicator() {
  return <span className={styles.searching}>🔍 Searching...</span>;
}

// Demo: Another component consuming the same state
function QueryDisplay({ query }: { query: string }) {
  console.log("🎨 QueryDisplay rendering with:", query);
  return (
    <div style={{ padding: "10px", background: "#f0f0f0", marginTop: "10px" }}>
      <strong>Current Query State:</strong> "{query}"
      <br />
      <small>
        👆 This component also uses searchQuery. It's part of the same
        transition!
      </small>
    </div>
  );
}

// ==================== YOUR FOCUS: useTransition ====================

export default function SuspendedTransitions() {
  // PART 1: Basic Setup
  // TODO: Create state for input value and search query
  const [inputValue, setInputValue] = useState("react");

  // TODO: Should you have a separate state for the search query?
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Set up useTransition
  const [isPending, startTransition] = useTransition();

  // TODO: Set up debouncing
  // Should you debounce the input or the search query?
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    startTransition(() => {
      setSearchQuery(debouncedValue);
    });
  }, [debouncedValue]);

  useEffect(() => {
    console.log("🎬 Render:", {
      inputValue,
      searchQuery,
      isPending,
      areTheyDifferent: inputValue !== searchQuery,
    });
  });

  // EXPERIMENT 1: Try this approach
  // When input changes, what should happen immediately?
  // What can be wrapped in startTransition?

  // EXPERIMENT 2: Try WITHOUT startTransition
  // What changes in the UX?

  // EXPERIMENT 3: Try different delays
  // What happens with 0ms debounce vs 500ms?

  return (
    <div className={styles.container}>
      <h2>useTransition: Keep Old UI While Loading New</h2>

      <div className={styles.instructions}>
        <p>
          🎯 <strong>Your Learning Goals:</strong>
        </p>
        <ul>
          <li>
            Understand when to use <code>startTransition</code>
          </li>
          <li>See the difference between urgent vs non-urgent updates</li>
          <li>Keep old results visible while new ones load</li>
          <li>
            Show subtle loading indicator with <code>isPending</code>
          </li>
        </ul>
      </div>

      {/* Search Input */}
      <div className={styles.searchBox}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search..."
          className={styles.searchInput}
        />

        {/* TODO: Show SearchingIndicator when pending */}
        {isPending && <SearchingIndicator />}
      </div>

      {/* Results */}
      <div className={styles.resultsContainer}>
        {/* Suspense is OPTIONAL with transitions, but useful for initial load */}
        <Suspense
          fallback={
            <div className={styles.loading}>Loading initial results...</div>
          }
        >
          <SearchResults query={searchQuery} />
        </Suspense>

        {/* Another component using the same state - also part of transition! */}
        <QueryDisplay query={searchQuery} />
      </div>

      {/* Experiment Log */}
      <div className={styles.experimentLog}>
        <h3>🧪 Experiments to Try:</h3>
        <ol>
          <li>
            <strong>Without transition:</strong> Type quickly. Notice the
            jarring experience?
          </li>
          <li>
            <strong>With transition:</strong> Old results stay! Much smoother.
          </li>
          <li>
            <strong>isPending state:</strong> Shows you when new results are
            loading.
          </li>
          <li>
            <strong>Debouncing:</strong> Prevents too many API calls.
          </li>
        </ol>
      </div>
    </div>
  );
}
