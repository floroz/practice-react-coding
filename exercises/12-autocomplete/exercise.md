# Exercise 12: Debounced Autocomplete with Transitions

**Difficulty**: Medium  
**Time**: 30-35 minutes  
**Concepts**: `useTransition`, debouncing, async search, controlled inputs, race conditions

## Challenge

Build an autocomplete search component that fetches results from an API with proper debouncing, loading states using `useTransition`, race condition handling, and highlighted search matches.

This is a very common interview question that tests your understanding of async operations, performance optimization, and React 18's concurrent features.

## Requirements

### Part 1: Search Input

1. Create controlled input component
2. Display search results below input
3. Handle input changes with proper debouncing
4. Show clear/reset button when input has value
5. Handle empty state and loading state

### Part 2: Debouncing

1. Implement debounce logic (wait for user to stop typing)
2. Configurable delay (e.g., 300ms)
3. Cancel previous debounce on new input
4. Don't search for empty or very short queries

### Part 3: API Integration

1. Create mock search API
2. Simulate network delay
3. Return filtered results based on query
4. Handle API errors gracefully
5. Support pagination/limiting results

### Part 4: useTransition for Loading States

1. Use `useTransition` for non-blocking updates
2. Show loading indicator while fetching
3. Keep previous results visible during fetch
4. Handle concurrent requests properly

### Part 5: Race Condition Handling

1. Cancel outdated requests
2. Only show results from latest query
3. Handle rapid typing correctly
4. Use AbortController or similar

### Part 6: Highlighted Matches

1. Highlight matching text in results
2. Case-insensitive matching
3. Support multiple matches per result
4. Proper escaping for special characters

### Part 7: Keyboard Navigation

1. Arrow Up/Down to navigate results
2. Enter to select highlighted result
3. ESC to close results
4. Proper focus management

## Edge Cases to Consider

- What if user types very fast?
- What if API returns results out of order?
- How do you handle special characters in search?
- What about accented characters?
- Should you show results for single character?
- What if API fails intermittently?
- How do you handle very large result sets?
- What about mobile keyboard behavior?

## Validation

Your solution should:

1. ✅ Debounce input (not searching on every keystroke)
2. ✅ Show loading state during search
3. ✅ Handle race conditions correctly
4. ✅ Highlight matching text in results
5. ✅ Support keyboard navigation
6. ✅ Clear results when input is cleared
7. ✅ Handle errors gracefully
8. ✅ Use `useTransition` for smooth updates

### Testing Scenarios

1. **Normal Search**: Type slowly → see debounced search → results appear
2. **Fast Typing**: Type very fast → only final query searches
3. **Race Condition**: Type "abc" → before results come, type "xyz" → only "xyz" results show
4. **Loading State**: Search → see loading indicator → results appear
5. **Error Handling**: Simulate API error → see error message
6. **Keyboard Nav**: Search → use arrows to navigate → press Enter to select
7. **Clear**: Type something → click clear → input and results cleared
8. **Empty Query**: Clear input → no search triggered

## Bonus Challenges

- Add search history/recent searches
- Implement caching to avoid duplicate requests
- Add "no results" state with suggestions
- Support multiple result categories
- Add infinite scroll for results
- Implement "Search on focus" (show recent/popular)
- Add keyboard shortcuts (Ctrl+K to focus)
- Support voice search
- Add analytics (track searches)
- Implement fuzzy matching

## TypeScript Tips

```typescript
interface SearchResult {
  id: string;
  title: string;
  description: string;
  category?: string;
}

interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  selectedIndex: number;
}

// For debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## Key Concepts

**Debouncing**: Delay executing a function until after a certain time has passed since it was last called. Essential for search inputs to avoid excessive API calls.

**Race Condition**: When multiple async operations complete in unexpected order. Example: Search for "abc", then "xyz", but "abc" results arrive last and overwrite "xyz" results.

**Solutions for Race Conditions**:

1. **AbortController**: Cancel previous request
2. **Request ID**: Track and ignore outdated responses
3. **Latest Flag**: Only update if still the current query

**useTransition**: React 18 hook that marks updates as non-urgent, keeping UI responsive during expensive operations.

```typescript
const [isPending, startTransition] = useTransition();

startTransition(() => {
  // This update won't block user input
  setResults(newResults);
});
```

**When to Use Debouncing**:

- Search inputs
- Form validation
- Scroll events
- Window resize handlers
- API calls triggered by user input

**Typical Debounce Delays**:

- Search: 300-500ms
- Form validation: 500-1000ms
- Scroll: 100-200ms

## Implementation Hints

1. Create custom `useDebounce` hook
2. Use `useTransition` for result updates
3. Store AbortController in ref
4. Track latest query ID to ignore stale results
5. Use regex for highlighting: `query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`
6. For keyboard nav, track selected index in state
7. Handle Arrow keys in onKeyDown
8. Use `useEffect` to abort on unmount

## Example Highlight Function

```typescript
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i}>{part}</mark> : part
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

## Mock API Example

```typescript
const mockApi = {
  async search(query: string, signal?: AbortSignal): Promise<SearchResult[]> {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 300 + Math.random() * 500);
      signal?.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new Error("Aborted"));
      });
    });

    return MOCK_DATA.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  },
};
```

