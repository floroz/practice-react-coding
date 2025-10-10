# React Interview Practice Exercises

This directory contains 7 progressively challenging React exercises designed to help you prepare for technical interviews. Each exercise covers important React concepts and patterns commonly tested in live coding challenges.

## Structure

Each exercise folder contains:

- **`exercise.md`** - The challenge description, requirements, and constraints (what an interviewer would give you)
- **`starter/`** - Starter files with minimal scaffolding (where you write your solution)
- **`solution/`** - Complete working solution for reference

## How to Use

1. Open `src/App.tsx`
2. Uncomment the import for the exercise you want to practice (choose starter version)
3. Read the `exercise.md` file for requirements
4. Implement your solution in the starter file
5. Check the solution file if you get stuck or want to compare approaches

## Exercises Overview

### 1. Counter with Undo/Redo (15-20 min)
**Concepts**: `useState`, basic state management, array operations

Build a counter with increment, decrement, and undo/redo functionality. Tests understanding of maintaining state history.

**Key Skills**: State management, array manipulation, button disable logic

---

### 2. Custom Hooks (20-25 min)
**Concepts**: Custom hooks, `useEffect`, `localStorage`, `useId`

Implement `useLocalStorage` and `useDebounce` custom hooks from scratch and create a demo component using both.

**Key Skills**: Hook composition, side effects, cleanup, localStorage APIs

---

### 3. Dynamic Form Builder (25-30 min)
**Concepts**: Controlled inputs, dynamic rendering, form validation

Build a form builder that allows adding/removing fields dynamically with different field types and validation.

**Key Skills**: Form handling, validation, dynamic lists, `useId` for stable keys

---

### 4. Data Fetching with Suspense (30-35 min)
**Concepts**: Suspense, Error Boundaries, data fetching patterns (React 18)

Implement data fetching with Suspense for loading states and Error Boundaries for error handling.

**Key Skills**: Suspense, Error Boundaries, resource wrappers, async patterns

---

### 5. Search with useTransition (30-35 min)
**Concepts**: `useTransition`, `useDeferredValue` (React 18 concurrent features)

Build a search interface that filters a large list (8,000+ items) without blocking the UI.

**Key Skills**: Concurrent rendering, non-urgent updates, performance optimization

---

### 6. Performance Optimization (35-40 min)
**Concepts**: `React.memo`, `useMemo`, `useCallback`, performance profiling

Optimize a slow component with unnecessary re-renders using React's performance tools.

**Key Skills**: Identifying performance issues, memoization, when to optimize

---

### 7. Todo App with useReducer (40-45 min)
**Concepts**: `useReducer`, complex state logic, TypeScript discriminated unions

Build a feature-rich todo app with filtering, sorting, bulk operations, and persistence using `useReducer`.

**Key Skills**: Complex state management, discriminated unions, localStorage persistence

## Tips for Interview Practice

1. **Time Yourself**: Respect the suggested time limits to simulate interview pressure
2. **Think Out Loud**: Practice explaining your approach as you code
3. **Start Simple**: Get basic functionality working before adding extras
4. **Ask Questions**: In real interviews, clarify requirements before coding
5. **Test Edge Cases**: Consider empty states, errors, and boundary conditions
6. **Write Clean Code**: Focus on readability and proper naming
7. **Use TypeScript**: Leverage types to catch errors early

## Modern React Features Covered

- ✅ React 18+ Suspense for data fetching
- ✅ Concurrent features (`useTransition`, `useDeferredValue`)
- ✅ New hooks (`useId`, `useDeferredValue`)
- ✅ Error Boundaries
- ✅ Performance optimization techniques
- ✅ Custom hooks patterns
- ✅ Complex state management with `useReducer`
- ✅ TypeScript with React
- ✅ CSS Modules

## Common Interview Patterns

These exercises cover the most common patterns you'll encounter:

- State management (simple and complex)
- Form handling and validation
- Data fetching and async operations
- List rendering and filtering
- Performance optimization
- Error handling
- Custom hooks
- TypeScript usage

## Next Steps

After completing these exercises:

1. Try implementing variations (different requirements)
2. Optimize your solutions for different constraints
3. Practice explaining your code to others
4. Review alternative approaches in the solution files
5. Time yourself and track improvement

Good luck with your interviews! 🚀

