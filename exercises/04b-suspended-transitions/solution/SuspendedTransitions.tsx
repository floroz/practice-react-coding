import {
  Suspense,
  useState,
  useTransition,
  useEffect,
  useMemo,
  Component,
  type ReactNode,
  type ErrorInfo,
} from "react";
import styles from "./SuspendedTransitions.module.css";

// ==================== TYPES ====================

interface SearchResult {
  id: number;
  title: string;
  description: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface Resource<T> {
  read(): T;
}

// ==================== MOCK API ====================

let requestCounter = 0;

async function searchAPI(query: string): Promise<SearchResult[]> {
  const requestId = ++requestCounter;
  console.log(`[Request ${requestId}] Starting search for: "${query}"`);

  const delay = Math.random() * 2000 + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (Math.random() < 0.2) {
    console.log(`[Request ${requestId}] Failed`);
    throw new Error(`Search failed for "${query}"`);
  }

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

// ==================== DEBOUNCE HOOK ====================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// ==================== VALIDATION ====================

function validateQuery(query: string): void {
  if (!query.trim()) {
    throw new Error("Query cannot be empty");
  }
  if (query.length < 2) {
    throw new Error("Query must be at least 2 characters");
  }
}

// ==================== CACHE IMPLEMENTATION ====================

class SearchCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.ttl,
    });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getTimestamp(key: string): number | null {
    const entry = this.cache.get(key);
    return entry ? entry.timestamp : null;
  }
}

const searchCache = new SearchCache<SearchResult[]>(5);

// ==================== RESOURCE WRAPPER ====================

function createResource<T>(promise: Promise<T>): Resource<T> {
  let status: "pending" | "success" | "error" = "pending";
  let result: T;
  let error: Error;

  const suspender = promise.then(
    (data) => {
      status = "success";
      result = data;
    },
    (err) => {
      status = "error";
      error = err;
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

// ==================== ERROR BOUNDARY ====================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}

// ==================== SEARCH RESULTS COMPONENT ====================

// Track the latest query to prevent race conditions
let latestQueryId = 0;

function SearchResults({ query }: { query: string }) {
  // Validate query (synchronous error)
  validateQuery(query);

  // Check cache first
  const cached = searchCache.get(query);

  const resource = useMemo(() => {
    if (cached) {
      console.log(`[Cache Hit] Using cached results for "${query}"`);
      return createResource(Promise.resolve(cached));
    }

    // Assign ID to this query to track race conditions
    const queryId = ++latestQueryId;
    console.log(`[Query ${queryId}] Fetching results for "${query}"`);

    const promise = searchAPI(query).then((results) => {
      // Only cache if this is still the latest query
      if (queryId === latestQueryId) {
        searchCache.set(query, results);
        return results;
      }
      console.log(`[Query ${queryId}] Stale, ignoring results`);
      throw new Error("Stale query, discarded");
    });

    return createResource(promise);
  }, [query, cached]);

  const results = resource.read();

  return (
    <div>
      {results.map((result) => (
        <div key={result.id} className={styles.resultCard}>
          <div className={styles.resultTitle}>{result.title}</div>
          <div className={styles.resultDescription}>{result.description}</div>
        </div>
      ))}
    </div>
  );
}

// ==================== LOADING INDICATOR ====================

function SearchingIndicator() {
  return <span className={styles.searching}>🔍 Searching...</span>;
}

// ==================== ERROR FALLBACK ====================

function ErrorFallback({
  error,
  reset,
  retryCount,
}: {
  error: Error;
  reset: () => void;
  retryCount: number;
}) {
  return (
    <div className={styles.errorContainer}>
      <h3>❌ Error</h3>
      <p>{error.message}</p>
      {retryCount < 3 ? (
        <button onClick={reset} className={styles.retryButton}>
          Retry ({retryCount}/3)
        </button>
      ) : (
        <p>Maximum retries reached. Please try a different search.</p>
      )}
    </div>
  );
}

// ==================== CACHE STATUS COMPONENT ====================

function CacheStatus({ query }: { query: string }) {
  const timestamp = searchCache.getTimestamp(query);

  if (!timestamp) return null;

  const ageSeconds = Math.floor((Date.now() - timestamp) / 1000);
  const ageMinutes = Math.floor(ageSeconds / 60);

  const ageText =
    ageMinutes > 0
      ? `${ageMinutes} minute(s) ago`
      : `${ageSeconds} second(s) ago`;

  return <div className={styles.cacheStatus}>💾 Cached {ageText}</div>;
}

// ==================== MAIN COMPONENT ====================

export default function SuspendedTransitions() {
  const [inputValue, setInputValue] = useState("react");
  const [searchQuery, setSearchQuery] = useState("react");
  const [isPending, startTransition] = useTransition();
  const [retryCount, setRetryCount] = useState(0);
  const [errorKey, setErrorKey] = useState(0);

  const debouncedInput = useDebounce(inputValue, 500);

  // When debounced value changes, update search query in a transition
  useEffect(() => {
    if (debouncedInput) {
      startTransition(() => {
        setSearchQuery(debouncedInput);
      });
    }
  }, [debouncedInput]);

  const handleRefresh = () => {
    searchCache.invalidate(searchQuery);
    setErrorKey((k) => k + 1);
    setRetryCount(0);
  };

  const handleError = () => {
    setRetryCount((c) => c + 1);
    setErrorKey((k) => k + 1);
  };

  return (
    <div className={styles.container}>
      <h2>Advanced Search: Suspense + Transitions</h2>

      <div className={styles.searchBox}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search... (min 2 characters)"
          className={styles.searchInput}
        />

        {isPending && <SearchingIndicator />}

        <CacheStatus query={searchQuery} />

        <button onClick={handleRefresh} className={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>

      <div className={styles.resultsContainer}>
        <ErrorBoundary
          key={errorKey}
          fallback={(error, reset) => (
            <ErrorFallback
              error={error}
              reset={() => {
                handleError();
                reset();
              }}
              retryCount={retryCount}
            />
          )}
        >
          <Suspense
            fallback={
              <div className={styles.skeleton}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonText} />
              </div>
            }
          >
            <SearchResults query={searchQuery} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
