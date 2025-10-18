import { useState, useRef, useEffect } from "react";
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

// Mock API
const mockApi = {
  async fetchItems(page: number, pageSize: number = 20): Promise<FetchResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate 10% error rate
    if (Math.random() < 0.1) {
      throw new Error("Failed to fetch items");
    }

    const start = page * pageSize;
    const items = Array.from({ length: pageSize }, (_, i) => ({
      id: `item-${start + i}`,
      title: `Item ${start + i + 1}`,
      description: `This is a description for item ${start + i + 1}. It contains some interesting content.`,
      imageUrl: `https://picsum.photos/seed/${start + i}/400/300`,
      timestamp: Date.now() - i * 60000,
    }));

    return {
      items,
      hasMore: start + pageSize < 200, // Total 200 items for testing
    };
  },
};

export default function InfiniteScroll() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // TODO: Create ref for sentinel element
  // TODO: Implement Intersection Observer
  // TODO: Implement fetchMoreItems function
  // TODO: Handle initial load
  // TODO: Clean up observer on unmount

  return (
    <div className={styles.container}>
      <h2>Infinite Scroll</h2>
      <p className={styles.subtitle}>
        Scroll down to load more items automatically
      </p>

      <div className={styles.stats}>Loaded: {items.length} items</div>

      <div className={styles.list}>
        {/* TODO: Render items */}
        {/* TODO: Add sentinel element for intersection observer */}
        {/* TODO: Show loading indicator */}
        {/* TODO: Show error state */}
        {/* TODO: Show "no more items" message */}
      </div>
    </div>
  );
}

