# Exercise Summary

## Overview

This repository contains 7 carefully crafted React interview exercises that progressively increase in complexity. Each exercise covers concepts commonly tested in 30-60 minute live coding interviews.

## Complete Exercise List

### ✅ Exercise 1: Counter with Undo/Redo
- **File**: `01-counter-undo/`
- **Time**: 15-20 minutes
- **Difficulty**: Easy
- **Concepts**: 
  - `useState` for state management
  - State history tracking
  - Array operations (push, pop, slice)
  - Button disable logic based on state
- **Key Learning**: How to maintain a history of state changes and implement undo/redo patterns

---

### ✅ Exercise 2: Custom Hooks
- **File**: `02-custom-hooks/`
- **Time**: 20-25 minutes
- **Difficulty**: Easy-Medium
- **Concepts**:
  - Creating custom hooks
  - `useEffect` for side effects
  - `localStorage` integration
  - Debouncing user input
  - React 18 `useId` for stable IDs
- **Key Learning**: How to extract reusable logic into custom hooks and manage side effects properly

---

### ✅ Exercise 3: Dynamic Form Builder
- **File**: `03-dynamic-form/`
- **Time**: 25-30 minutes
- **Difficulty**: Medium
- **Concepts**:
  - Controlled form inputs
  - Dynamic list rendering with unique keys
  - Form validation patterns
  - Different input types (text, email, number)
  - State updates with arrays of objects
- **Key Learning**: Managing complex form state and implementing robust validation

---

### ✅ Exercise 4: Data Fetching with Suspense
- **File**: `04-suspense-data/`
- **Time**: 30-35 minutes
- **Difficulty**: Medium
- **Concepts**:
  - React 18 Suspense for data fetching
  - Error Boundaries for error handling
  - Resource wrapper pattern
  - Promise state management
  - Class components (for Error Boundary)
- **Key Learning**: Modern data fetching patterns with Suspense and proper error handling

---

### ✅ Exercise 5: Search with useTransition
- **File**: `05-search-transition/`
- **Time**: 30-35 minutes
- **Difficulty**: Medium
- **Concepts**:
  - React 18 `useTransition` for concurrent rendering
  - Non-urgent state updates
  - Large list filtering (8,000+ items)
  - `useMemo` for expensive computations
  - Text highlighting in results
- **Key Learning**: How to keep UI responsive during expensive operations using concurrent features

---

### ✅ Exercise 6: Performance Optimization
- **File**: `06-performance/`
- **Time**: 35-40 minutes
- **Difficulty**: Medium-Hard
- **Concepts**:
  - `React.memo` for component memoization
  - `useMemo` for expensive calculations
  - `useCallback` for stable function references
  - Performance measurement with `useRef`
  - Identifying unnecessary re-renders
- **Key Learning**: When and how to optimize React components for better performance

---

### ✅ Exercise 7: Todo App with useReducer
- **File**: `07-todo-reducer/`
- **Time**: 40-45 minutes
- **Difficulty**: Medium-Hard
- **Concepts**:
  - `useReducer` for complex state logic
  - TypeScript discriminated unions for actions
  - Multiple state operations (add, toggle, delete, edit, filter, sort)
  - LocalStorage persistence
  - Bulk operations
  - Priority levels
- **Key Learning**: When to use `useReducer` over `useState` and how to structure complex state logic

---

## Modern React Features Demonstrated

### React 18+ Features
- ✅ `useTransition` for concurrent rendering
- ✅ `useDeferredValue` for deferred updates
- ✅ Suspense for data fetching
- ✅ `useId` for stable unique IDs

### Core Hooks
- ✅ `useState` for simple state
- ✅ `useReducer` for complex state
- ✅ `useEffect` for side effects
- ✅ `useMemo` for memoized values
- ✅ `useCallback` for memoized callbacks
- ✅ `useRef` for persistent references
- ✅ Custom hooks for reusable logic

### Patterns
- ✅ Error Boundaries
- ✅ Controlled components
- ✅ Form validation
- ✅ Dynamic lists with keys
- ✅ Performance optimization
- ✅ LocalStorage persistence
- ✅ Debouncing
- ✅ Resource wrappers

### TypeScript
- ✅ Proper interface definitions
- ✅ Generic types for hooks
- ✅ Discriminated unions for reducers
- ✅ Type-safe event handlers
- ✅ Component prop typing

### Styling
- ✅ CSS Modules for scoped styles
- ✅ Responsive design
- ✅ Dark theme
- ✅ Accessible forms

## Interview Readiness Checklist

After completing these exercises, you should be comfortable with:

- [ ] Managing state in React (simple and complex)
- [ ] Creating custom hooks
- [ ] Handling forms and validation
- [ ] Working with async operations
- [ ] Understanding React's render cycle
- [ ] Optimizing performance when needed
- [ ] Using modern React 18+ features
- [ ] Writing TypeScript with React
- [ ] Implementing common patterns
- [ ] Handling edge cases and errors

## Progression Path

**Beginner → Intermediate**
1. Counter with Undo/Redo (basics)
2. Custom Hooks (reusability)
3. Dynamic Form (real-world patterns)

**Intermediate → Advanced**
4. Suspense Data (modern async)
5. Search Transition (concurrent features)
6. Performance (optimization)
7. Todo Reducer (complex state)

## Success Metrics

You'll know you're ready when you can:

1. Complete any exercise within the time limit
2. Explain your code decisions clearly
3. Handle edge cases without prompting
4. Write clean, readable TypeScript
5. Choose appropriate patterns for different problems
6. Debug issues quickly
7. Optimize only when necessary

## Next Steps

1. **Repeat exercises** - Try to improve your time
2. **Modify requirements** - Add new features
3. **Teach others** - Explain solutions to friends
4. **Mock interviews** - Practice with peers
5. **Build variations** - Apply patterns to new problems

Good luck with your interviews! 🎯

