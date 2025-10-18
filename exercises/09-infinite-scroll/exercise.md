# Exercise 09: Infinite Scroll with Virtualization

**Difficulty**: Medium  
**Time**: 30-35 minutes  
**Concepts**: Intersection Observer API, `useRef`, performance optimization, lazy loading

## Challenge

Build an infinite scroll component that fetches and displays data as users scroll down the page. Implement basic virtualization to efficiently handle thousands of items without performance degradation.

This is a common interview question that tests your understanding of performance optimization and browser APIs.

## Requirements

### Part 1: Infinite Scroll

1. Display an initial list of items (20-30 items)
2. Detect when user scrolls near the bottom
3. Automatically fetch and append more items
4. Show loading indicator while fetching
5. Handle end of data (no more items to load)
6. Implement error handling and retry

### Part 2: Intersection Observer

1. Use Intersection Observer API to detect scroll position
2. Create a "sentinel" element at the bottom
3. Trigger fetch when sentinel becomes visible
4. Clean up observer on unmount

### Part 3: Basic Virtualization

1. Only render items that are currently visible
2. Calculate visible range based on scroll position
3. Maintain scroll position during re-renders
4. Use padding to maintain scrollbar size
5. Ensure smooth scrolling experience

### Part 4: Data Generation

Create mock data with:

- Unique ID
- Title
- Description
- Thumbnail/image URL (can use placeholder service)
- Timestamp

## Edge Cases to Consider

- What happens when user scrolls very fast?
- How do you prevent fetching the same data twice?
- What if the container height is too large (all items fit)?
- How do you handle window resize?
- What if fetch fails during scroll?
- Should you keep all data in memory or paginate?
- What about scroll restoration on navigation?

## Validation

Your solution should:

1. ✅ Load initial items on mount
2. ✅ Fetch more items when scrolling near bottom
3. ✅ Show loading indicator during fetch
4. ✅ Handle fetch errors gracefully
5. ✅ Stop fetching when all data is loaded
6. ✅ Render only visible items (virtualization)
7. ✅ Maintain smooth 60fps scrolling
8. ✅ Clean up observers on unmount

### Testing Scenarios

1. **Normal Scroll**: Scroll slowly → see items load progressively
2. **Fast Scroll**: Scroll quickly to bottom → should handle gracefully
3. **Error State**: Simulate API error → show error and retry button
4. **End of Data**: Scroll until no more data → show "end" message
5. **Performance**: Generate 10,000 items → should remain smooth
6. **Multiple Triggers**: Scroll up/down near boundary → prevent duplicate fetches

## Bonus Challenges

- Add pull-to-refresh functionality
- Implement bi-directional scroll (load items above and below)
- Add skeleton loading states
- Implement search/filter that works with infinite scroll
- Add "scroll to top" button when scrolled down
- Cache fetched pages in localStorage
- Implement variable height items
- Add smooth scroll animations
- Show progress indicator (e.g., "Loaded 100 of 1000")

## TypeScript Tips

```typescript
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
  nextCursor?: string;
}

// For virtualization
interface VirtualRange {
  startIndex: number;
  endIndex: number;
  offsetY: number;
}
```

## Key Concepts

**Intersection Observer**: Browser API that efficiently detects when elements enter or exit the viewport. Much better than scroll event listeners.

**Virtualization (Windowing)**: Technique where you only render DOM elements for visible items. Critical for lists with thousands of items.

**Benefits**:

- Better performance (less DOM nodes)
- Lower memory usage
- Faster initial render
- Smooth scrolling

**Infinite Scroll Best Practices**:

- Use Intersection Observer, not scroll events
- Debounce fetch requests
- Show loading states
- Handle errors gracefully
- Provide "load more" button as fallback
- Consider accessibility (keyboard navigation)

**When to Use**:

- Social media feeds
- Product listings
- Search results
- Log viewers
- Chat applications

**When NOT to Use**:

- Short lists (< 50 items)
- When users need to find specific items
- When pagination is more appropriate
- SEO-critical content

## Implementation Hints

1. Use `IntersectionObserver` for scroll detection
2. Keep track of current page/cursor in state
3. Use `useRef` for the sentinel element
4. Calculate visible range: `Math.floor(scrollTop / itemHeight)`
5. Use `useCallback` to memoize fetch function
6. Implement debouncing to prevent rapid fetches
7. For virtualization:
   - Calculate `totalHeight = itemCount * itemHeight`
   - Calculate `startIndex` and `endIndex` from scroll position
   - Render only items in range
   - Use absolute positioning with transforms

## Example Mock API

```typescript
const mockApi = {
  async fetchItems(page: number, pageSize: number = 20): Promise<FetchResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const start = page * pageSize;
    const items = Array.from({ length: pageSize }, (_, i) => ({
      id: `item-${start + i}`,
      title: `Item ${start + i + 1}`,
      description: `Description for item ${start + i + 1}`,
      imageUrl: `https://picsum.photos/seed/${start + i}/400/300`,
      timestamp: Date.now() - i * 60000,
    }));

    return {
      items,
      hasMore: start + pageSize < 1000, // Total 1000 items
    };
  },
};
```

