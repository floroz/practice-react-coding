# Exercise 4B: Suspense + Transitions (Advanced)

**Difficulty**: Hard  
**Time**: 45-60 minutes  
**Concepts**: Suspense, useTransition, race conditions, advanced data fetching patterns

## Challenge

Build an advanced search interface that combines Suspense with useTransition to create a smooth user experience where old results stay visible while new ones load. This tests your understanding of how React's concurrent features work together in real-world scenarios.

## Requirements

### Part 1: Basic Search with Transitions (15 min)

1. Create a search input that fetches results from an API
2. Use `useSuspenseQuery` (or your resource wrapper) for data fetching
3. Implement debouncing (500ms) to reduce API calls
4. Use `useTransition` to keep old results visible while loading new ones
5. Show a subtle loading indicator (e.g., "Searching...") when `isPending`
6. The Suspense fallback should only show on initial load

**Expected UX:**

```
User types "react"
→ Old results stay visible
→ Small "Searching..." indicator appears
→ New results smoothly replace old ones (no blank screen)
```

### Part 2: Race Condition Handling (10 min)

7. Implement proper race condition handling
8. If user types quickly, ensure only the latest query's results are shown
9. Cancel or ignore stale requests

**Test scenario:**

```
User types: "a" → "ab" → "abc" quickly
- Request for "a" starts (slow network, takes 2s)
- Request for "ab" starts (fast, takes 0.5s)
- Request for "abc" starts (medium, takes 1s)

Expected: Show results for "abc" only (the latest query)
Actual without handling: Might show "a" results last! 😱
```

### Part 3: Multiple Data Sources (10 min)

10. Create a dashboard with 3 separate data fetches:
    - User profile (fast, 500ms)
    - Search results (medium, 1000ms)
    - Recommendations (slow, 2000ms)
11. Each should have its own Suspense boundary
12. Each should load independently without blocking the others
13. Use nested Suspense for progressive rendering

### Part 4: Synchronous Error Handling (5 min)

14. Add validation that throws synchronously (e.g., empty query)
15. Ensure ErrorBoundary catches it properly
16. Test both sync and async errors

**Example:**

```tsx
function validateQuery(query: string) {
  if (!query.trim()) {
    throw new Error("Query cannot be empty"); // Synchronous!
  }
  if (query.length < 2) {
    throw new Error("Query too short");
  }
}
```

### Part 5: Cache with Refresh (10 min)

17. Implement a simple cache for search results
18. Add a "Refresh" button that invalidates cache
19. Implement TTL (time-to-live) of 5 minutes
20. Show cache status (e.g., "Cached 2 minutes ago")

### Part 6: Error Recovery (5 min)

21. Implement retry with exponential backoff
22. Show retry count (e.g., "Retry 2/3")
23. After 3 failures, show "Give up" option
24. Add offline detection

## API Mock

Use this mock API for testing:

```tsx
let requestCounter = 0;

async function searchAPI(query: string): Promise<SearchResult[]> {
  const requestId = ++requestCounter;
  console.log(`[Request ${requestId}] Starting search for: "${query}"`);

  // Simulate variable network delay
  const delay = Math.random() * 2000 + 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // Simulate random failures (20% failure rate)
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
```

## TypeScript Types

```tsx
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
```

## Edge Cases to Consider

- User types then immediately clears input
- Network failure mid-search
- Component unmounts while request is in-flight
- User navigates away then back (cache persistence)
- Multiple rapid state updates
- Browser offline/online events

## Success Criteria

**User Experience:**

- ✅ Input stays responsive (never freezes)
- ✅ Old results visible while new ones load
- ✅ No "flash of loading spinner" on every keystroke
- ✅ Smooth transitions between result sets
- ✅ Clear indication when searching
- ✅ Graceful error handling with retry

**Technical:**

- ✅ No race conditions (always shows latest query results)
- ✅ Proper use of useTransition + Suspense together
- ✅ Debouncing prevents excessive API calls
- ✅ Cache reduces redundant requests
- ✅ Both sync and async errors handled
- ✅ Clean component separation

## Bonus Challenges

- Add search history (recent searches)
- Implement "Search as you type" vs "Search on submit" toggle
- Add keyboard navigation (arrow keys, enter to select)
- Show "Did you mean...?" suggestions on no results
- Add analytics (track search terms, timing)
- Implement request cancellation with AbortController
- Add optimistic UI (show expected results immediately)

## Debugging Tips

If your component is stuck in a loading state:

1. Check if promises are stable (not re-created on each render)
2. Use `console.log` to trace request lifecycle
3. Check Network tab for actual API calls
4. Verify cache keys are correct
5. Use React DevTools Profiler to see suspensions

If you see stale results:

1. Log request IDs to track race conditions
2. Verify you're handling request ordering
3. Check if cache keys include the query
4. Ensure you're not showing cached stale data

## Key Concepts to Master

1. **useTransition + Suspense**: How they work together for async operations
2. **Race conditions**: Why they happen and how to prevent them
3. **Debouncing**: Reducing API calls without hurting UX
4. **Progressive loading**: Multiple Suspense boundaries for better perceived performance
5. **Error handling**: Sync vs async errors, retry strategies
6. **Caching**: When to cache, when to invalidate, TTL strategies

## Comparison: Before vs After

### Before (Traditional):

```tsx
const { data, isLoading, error } = useQuery(["search", query], () =>
  searchAPI(query)
);

if (isLoading) return <Spinner />; // Old results disappear!
if (error) return <Error />;
return <Results data={data} />;
```

**Problem:** Full screen spinner on every search. Old results vanish.

### After (This Exercise):

```tsx
const [isPending, startTransition] = useTransition();

// Input updates immediately
const handleChange = (value) => {
  setInput(value);
  startTransition(() => setQuery(value)); // Non-urgent
};

return (
  <>
    <input value={input} onChange={handleChange} />
    {isPending && <SmallIndicator />}
    <Suspense fallback={<InitialLoader />}>
      <Results query={query} /> {/* Old results stay visible */}
    </Suspense>
  </>
);
```

**Result:** Smooth experience. Old results visible. Small indicator shows progress.

## Resources

- [React 18 Working Group: Suspense](https://github.com/reactwg/react-18/discussions/37)
- [useTransition docs](https://react.dev/reference/react/useTransition)
- [Concurrent React patterns](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)

## Time Allocation

- Part 1 (Basic): 15 min
- Part 2 (Race conditions): 10 min
- Part 3 (Multiple sources): 10 min
- Part 4 (Sync errors): 5 min
- Part 5 (Cache): 10 min
- Part 6 (Error recovery): 5 min
- Testing & refinement: 5 min

**Total: 60 minutes**

Good luck! This exercise will significantly level up your understanding of React's concurrent features in production scenarios.
