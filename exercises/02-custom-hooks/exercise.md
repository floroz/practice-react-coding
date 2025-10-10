# Exercise 2: Custom Hooks

**Difficulty**: Easy-Medium  
**Time**: 20-25 minutes  
**Concepts**: Custom hooks, useEffect, localStorage, useId (React 18)

## Challenge

Implement two commonly used custom hooks from scratch and create a demo component that uses both. This tests your understanding of React hooks composition and side effects.

## Requirements

### Part 1: Implement `useLocalStorage`

Create a custom hook that syncs state with localStorage:

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
```

- Read from localStorage on mount
- Write to localStorage whenever the value changes
- Handle JSON serialization/deserialization
- Handle localStorage not being available (SSR safety)

### Part 2: Implement `useDebounce`

Create a custom hook that debounces a value:

```typescript
function useDebounce<T>(value: T, delay: number): T
```

- Return the debounced value
- Update only after the specified delay has passed
- Reset the timer if the value changes before the delay completes

### Part 3: Demo Component

Create a component that uses both hooks:
- An input field with debounced search
- The search term is saved to localStorage
- Display both the immediate and debounced values
- Show localStorage persistence by reloading

## Edge Cases to Consider

- What happens if localStorage is full?
- What if the stored value is corrupted JSON?
- How do you clean up timers in useDebounce?
- What if the delay changes?

## Bonus Challenges

- Add a third hook: `useMediaQuery` for responsive design
- Make `useLocalStorage` sync across tabs using storage events
- Add TypeScript generics properly

## TypeScript Tips

Use generics to make your hooks type-safe. Consider using `Dispatch<SetStateAction<T>>` for the setter to match useState's signature.

