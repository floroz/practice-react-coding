# Exercise 4: Data Fetching with Suspense

**Difficulty**: Medium  
**Time**: 30-35 minutes  
**Concepts**: Suspense, Error Boundaries, data fetching patterns (React 18)

## Challenge

Build a data fetching component that uses React 18's Suspense for handling loading states and Error Boundaries for error handling. This tests your understanding of modern React data fetching patterns and concurrent features.

## Requirements

1. Create an ErrorBoundary component that catches and displays errors
2. Create a data fetching utility that works with Suspense
3. Fetch data from a mock API (use JSONPlaceholder or create mock data)
4. Wrap the data component in Suspense with a loading fallback
5. Implement error handling with the ErrorBoundary
6. Add a "Retry" button when errors occur
7. Show different loading states for different parts of the UI

## API Suggestions

Use JSONPlaceholder: `https://jsonplaceholder.typicode.com/users`

Or create a mock API that:

- Randomly succeeds/fails (for testing error states)
- Has configurable delay (for testing loading states)

## Edge Cases to Consider

- Network failures
- Slow connections (test with artificial delays)
- Race conditions when switching between data sources
- What happens when data fetching throws synchronously?

## Bonus Challenges

- Add multiple Suspense boundaries for different data sources
- Implement a cache to avoid refetching
- Add a refresh button that invalidates cache
- Show partial data while fetching additional data
- Implement pagination with Suspense

## TypeScript Tips

Create proper types for your API response. Handle the case where the Promise might be in different states (pending, fulfilled, rejected).

## Important Note

React 18's Suspense for data fetching requires a special integration. For this exercise, you'll implement a simple resource wrapper that Suspense can work with. In production, you'd use libraries like React Query or SWR with Suspense support.
