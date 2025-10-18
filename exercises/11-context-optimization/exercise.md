# Exercise 11: Context Performance Optimization

**Difficulty**: Medium-Hard  
**Time**: 35-40 minutes  
**Concepts**: Context API, `React.memo`, `useMemo`, `useCallback`, performance profiling

## Challenge

Build a theme and user settings system using Context API, then optimize it to prevent unnecessary re-renders. This exercise demonstrates common Context performance pitfalls and how to fix them.

Many developers use Context incorrectly, causing performance issues. You'll learn to identify and solve these problems.

## Requirements

### Part 1: Create Context System

1. Implement ThemeContext with:
   - Theme mode (light/dark)
   - Primary color
   - Font size
   - Toggle functions
2. Implement UserContext with:
   - User name
   - User role
   - Notifications count
   - Update functions
3. Wrap app with both providers

### Part 2: Build UI Components

Create these components:

1. **Header**: Shows user name and notifications
2. **ThemeToggle**: Buttons to change theme
3. **UserProfile**: Display and edit user info
4. **NotificationBadge**: Show notification count
5. **ContentArea**: Large list or expensive component

### Part 3: Demonstrate the Problem

1. Add render counters to each component
2. Show which components re-render on any state change
3. Demonstrate that all consumers re-render when context changes
4. Show the performance impact with a large component tree

### Part 4: Optimize Performance

Implement these optimizations:

1. **Split Contexts**: Separate frequently vs. rarely changing data
2. **Memoize Provider Value**: Use `useMemo` for context value
3. **Memoize Components**: Use `React.memo` for consumers
4. **Optimize Selectors**: Only subscribe to needed data
5. **Memoize Callbacks**: Use `useCallback` for functions

### Part 5: Show the Results

1. Add toggle to switch between optimized/unoptimized versions
2. Display render counts for comparison
3. Demonstrate that only affected components re-render
4. Show performance metrics

## Edge Cases to Consider

- What if context value is an object that changes reference?
- How do you handle functions in context value?
- What about nested contexts?
- How do you optimize when multiple contexts are used?
- What if child components are expensive to render?
- Should you always memoize everything?

## Validation

Your solution should:

1. ✅ Create functional context providers
2. ✅ Demonstrate unnecessary re-renders
3. ✅ Show render counts visually
4. ✅ Implement all optimization techniques
5. ✅ Split contexts appropriately
6. ✅ Memoize provider values
7. ✅ Use React.memo on components
8. ✅ Compare optimized vs. unoptimized

### Testing Scenarios

1. **Baseline**: Change theme → count which components re-render
2. **User Update**: Change user name → count re-renders
3. **Notification**: Increment notifications → count re-renders
4. **Optimized Theme**: Change theme → only theme consumers re-render
5. **Optimized User**: Update user → only user consumers re-render
6. **Heavy Component**: Verify expensive component doesn't re-render unnecessarily

## Bonus Challenges

- Implement context selectors (subscribe to partial state)
- Create a custom `useContextSelector` hook
- Add performance profiling with React DevTools data
- Implement time-slicing for expensive updates
- Create a debug mode showing why components re-render
- Add comparison with useState lifted to parent
- Implement undo/redo for settings
- Add localStorage persistence
- Create a settings export/import feature

## TypeScript Tips

```typescript
interface ThemeContextValue {
  mode: "light" | "dark";
  primaryColor: string;
  fontSize: number;
  toggleMode: () => void;
  setPrimaryColor: (color: string) => void;
  setFontSize: (size: number) => void;
}

interface UserContextValue {
  name: string;
  role: "admin" | "user" | "guest";
  notifications: number;
  setName: (name: string) => void;
  setRole: (role: UserContextValue["role"]) => void;
  incrementNotifications: () => void;
}

// For render tracking
interface RenderCount {
  [componentName: string]: number;
}
```

## Key Concepts

**Context Re-render Problem**: When context value changes, ALL components that use `useContext` will re-render, even if they only use part of the data.

**Why This Happens**:

- Context value reference changes
- React can't track which part of context is used
- All consumers are notified of any change

**Solutions**:

1. **Split Contexts**:
   - Separate fast-changing and slow-changing data
   - Users only subscribe to what they need

2. **Memoize Provider Value**:

   ```typescript
   const value = useMemo(() => ({ state, actions }), [state, actions]);
   ```

3. **Memoize Components**:

   ```typescript
   const Component = React.memo(({ prop }) => {
     // Only re-renders if prop changes
   });
   ```

4. **Composition**:
   - Pass children to provider
   - Children don't re-render when context changes

**When to Optimize**:

- Context changes frequently
- Many components consume context
- Expensive components in tree
- Profiler shows performance issues

**When NOT to Optimize**:

- Context rarely changes
- Few consumers
- Fast components
- Premature optimization

## Implementation Hints

1. Start with unoptimized version
2. Add render counters using `useRef` and `useEffect`
3. Create toggle between versions
4. For optimization:
   - Split theme and user contexts
   - Wrap provider value in `useMemo`
   - Wrap callbacks in `useCallback`
   - Add `React.memo` to components
5. Compare render counts
6. Use React DevTools Profiler

## Example Pattern

```typescript
// ❌ Bad: Creates new object every render
function BadProvider({ children }) {
  const [state, setState] = useState(initialState);

  return (
    <Context.Provider value={{ state, setState }}>
      {children}
    </Context.Provider>
  );
}

// ✅ Good: Memoized value
function GoodProvider({ children }) {
  const [state, setState] = useState(initialState);

  const value = useMemo(
    () => ({ state, setState }),
    [state]
  );

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}

// ✅ Better: Split contexts
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
```

