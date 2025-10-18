import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./InfiniteScroll.module.css";

interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  timestamp: number;
}

interface FetchResult {
  items: Item[];
  hasMore: boolean;
}

const mockApi = {
  async fetchItems(page: number, pageSize: number = 20): Promise<FetchResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (Math.random() < 0.1) {
      throw new Error("Failed to fetch items");
    }

    const start = page * pageSize;
    const items = Array.from({ length: pageSize }, (_, i) => ({
      id: `item-${start + i}`,
      title: `Item ${start + i + 1}`,
      description: `This is a description for item ${start + i + 1}. It contains some interesting content about various topics.`,
      imageUrl: `https://picsum.photos/seed/${start + i}/400/300`,
      timestamp: Date.now() - i * 60000,
    }));

    return {
      items,
      hasMore: start + pageSize < 200,
    };
  },
};

export default function InfiniteScroll() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const fetchMoreItems = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await mockApi.fetchItems(page);
      setItems((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [page, hasMore]);

  useEffect(() => {
    // Initial load
    fetchMoreItems();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingRef.current) {
          fetchMoreItems();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    observer.observe(sentinel);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchMoreItems, hasMore]);

  const handleRetry = () => {
    setError(null);
    fetchMoreItems();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Infinite Scroll</h2>
        <p className={styles.subtitle}>
          Scroll down to load more items automatically
        </p>
      </header>

      <div className={styles.stats}>
        <span>📊 Loaded: {items.length} items</span>
        {!hasMore && items.length > 0 && (
          <span className={styles.badge}>All loaded</span>
        )}
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <article key={item.id} className={styles.item}>
            <img
              src={item.imageUrl}
              alt={item.title}
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.content}>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
              <time className={styles.time}>
                {new Date(item.timestamp).toLocaleTimeString()}
              </time>
            </div>
          </article>
        ))}

        {/* Sentinel element for intersection observer */}
        <div ref={sentinelRef} className={styles.sentinel} />

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Loading more items...</p>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <p>❌ {error}</p>
            <button onClick={handleRetry} className={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {!hasMore && items.length > 0 && (
          <div className={styles.endMessage}>
            <p>🎉 You've reached the end!</p>
          </div>
        )}

        {items.length === 0 && !loading && !error && (
          <div className={styles.empty}>
            <p>No items to display</p>
          </div>
        )}
      </div>
    </div>
  );
}

