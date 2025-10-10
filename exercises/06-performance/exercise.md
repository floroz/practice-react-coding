# Exercise 6: Performance Optimization

**Difficulty**: Medium-Hard  
**Time**: 35-40 minutes  
**Concepts**: React.memo, useMemo, useCallback, performance profiling

## Challenge

You're given a slow component with unnecessary re-renders. Your task is to identify performance issues and optimize them using React's performance tools. This tests your understanding of when and how to optimize React components.

## Requirements

1. Create a "slow" component that has performance issues:
   - Parent component that re-renders frequently
   - Multiple child components that re-render unnecessarily
   - Expensive calculations running on every render
   - Event handlers being recreated on every render

2. Add performance metrics:
   - Render counters for each component
   - Time measurements for expensive operations
   - Toggle to show "before" and "after" optimization

3. Optimize using:
   - `React.memo` for component memoization
   - `useMemo` for expensive calculations
   - `useCallback` for event handler stability
   - Proper dependency arrays

4. Create a comparison view showing performance improvements

## Scenario

Build a dashboard with:
- A counter that updates every second
- A list of items (100+ items)
- Each item has expensive formatting/calculations
- Filter controls that update the list
- The entire app should not re-render when only the counter changes

## Edge Cases to Consider

- When should you NOT use React.memo?
- What happens with incorrect dependency arrays?
- How do you handle props that are objects/arrays?
- When does memoization hurt more than it helps?

## Bonus Challenges

- Add React DevTools Profiler API integration
- Show flame graphs or timing data
- Add a "worst practices" mode to demonstrate anti-patterns
- Implement virtual scrolling for the list
- Add more realistic expensive operations

## TypeScript Tips

Properly type memoized components and callbacks. Use `React.FC` or explicit typing for memo components.

## Important Notes

This exercise is about understanding:
- WHY components re-render
- WHEN to optimize (premature optimization is bad)
- HOW to use optimization tools correctly
- MEASURING impact of optimizations

