# Exercise 5: Search with useTransition

**Difficulty**: Medium  
**Time**: 30-35 minutes  
**Concepts**: useTransition, useDeferredValue (React 18 concurrent features)

## Challenge

Build a search interface that filters a large list without blocking the UI. This demonstrates React 18's concurrent features that allow you to mark updates as non-urgent, keeping the UI responsive during expensive operations.

## Requirements

1. Generate a large list of items (5,000-10,000 items)
2. Create a search input that filters the list
3. Use `useTransition` to mark the filtering as a non-urgent update
4. Show a loading indicator while the transition is pending
5. Use `useDeferredValue` as an alternative approach (create two versions or a toggle)
6. Display the search results with highlighting
7. Show performance metrics (number of items, filter time)

## Data Structure

Generate items with:
- ID
- Name
- Category
- Description
- Tags

## Edge Cases to Consider

- Very long search queries
- Rapid input changes (user typing fast)
- Search with no results
- Special characters in search
- Case sensitivity

## Bonus Challenges

- Add filters (category, tags)
- Implement virtual scrolling for better performance
- Add sorting options
- Highlight search terms in results
- Add search history
- Compare performance with and without useTransition

## TypeScript Tips

Properly type the transition state and deferred values. Consider creating a custom hook for the search logic.

## Key Concepts

**useTransition**: Allows you to mark state updates as transitions (non-urgent)
- Returns `[isPending, startTransition]`
- Updates inside `startTransition` can be interrupted
- Great for CPU-intensive updates

**useDeferredValue**: Creates a deferred version of a value
- Returns a value that "lags behind" the latest value
- Automatically deprioritized during urgent updates
- Great for values passed to expensive child components

