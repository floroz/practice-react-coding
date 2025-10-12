# useTransition Timeline Explanation

## The Question: Why doesn't the screen go blank?

When you use `startTransition`, React performs **concurrent rendering** - it can work on multiple versions of the UI at the same time.

## Step-by-Step: What Happens

### 1. Initial State

```
inputValue = "react"
searchQuery = "react"
isPending = false

UI showing: Results for "react" ✅
```

### 2. User Types "j" → "reactjs"

```javascript
// This happens IMMEDIATELY (synchronous, urgent)
setInputValue("reactjs");
```

**Result:** Input field updates instantly - user sees "reactjs" typed

### 3. Debounce Timer (500ms later)

```javascript
debouncedValue changes: "react" → "reactjs"
```

This triggers the useEffect...

### 4. useEffect Runs

```javascript
useEffect(() => {
  startTransition(() => {
    setSearchQuery("reactjs"); // ⬅️ This is "non-urgent"
  });
}, [debouncedValue]);
```

**Key moment:** React marks this update as **non-urgent/transition**

### 5. React Creates a "Transition Lane"

React internally:

```javascript
// Pseudocode of what React does
{
  currentUI: <SearchResults query="react" />,   // Keep showing this!
  preparingUI: <SearchResults query="reactjs" />, // Work on this in background
  isPending: true // Signal that transition is in progress
}
```

### 6. React Tries to Render New UI (Background)

```javascript
// React executes this in the background:
<SearchResults query="reactjs" />
  ↓
fetchResults("reactjs")
  ↓
resource.read() // Data not ready yet!
  ↓
throws Promise // Suspense!
```

### 7. React's Decision Point 🎯

**Traditional React:**

```
Promise thrown → Show Suspense fallback → BLANK SCREEN
```

**With startTransition:**

```
Promise thrown in transition → Keep old UI visible → Continue showing "react" results
                              → Set isPending = true
```

**Why?** Because React knows:

- This is a "transition" (non-urgent update)
- User experience matters more than showing latest state immediately
- Better to show stale content than blank screen

### 8. Background Promise Resolves

```
Time passes... (500ms - 2500ms)
  ↓
Promise resolves with data
  ↓
React tries rendering again (in background)
  ↓
resource.read() → returns SearchResult[] ✅
  ↓
Success! New UI is ready
```

### 9. React Swaps the UI

```javascript
// React commits the new UI
{
  currentUI: <SearchResults query="reactjs" />, // ✅ Swap complete
  isPending: false // ✅ No longer pending
}
```

**User sees:** Smooth transition from old results to new results

## The Contract: What React Guarantees

1. **Urgent updates always go through immediately**
   - Input value updates
   - isPending state changes

2. **Non-urgent (transition) updates can be "interrupted"**
   - If you type again before results load, React abandons old transition
   - Starts fresh with new query

3. **Old UI stays visible until new UI is ready**
   - No blank screens
   - No loading spinners replacing content

## Visual Comparison

### WITHOUT startTransition

```
[Results for "react"]  →  [Loading...]  →  [Results for "reactjs"]
                              ↑
                        User sees blank!
```

### WITH startTransition

```
[Results for "react"]  →  [Results for "react" + 🔍]  →  [Results for "reactjs"]
                                    ↑
                              Old content stays!
```

## Key Insight: Priority System

React treats updates with different priorities:

| Priority       | Example                                   | Behavior                             |
| -------------- | ----------------------------------------- | ------------------------------------ |
| **Urgent**     | `setInputValue`                           | Execute immediately, block rendering |
| **Transition** | `startTransition(() => setSearchQuery())` | Interruptible, keep old UI           |
| **Deferred**   | `useDeferredValue`                        | Even lower priority                  |

## The "Lanes" Mental Model

Think of React updates like traffic lanes:

```
┌──────────────────────┐
│  🚨 URGENT LANE      │  ← setInputValue (must be instant)
│  Fast Pass           │
└──────────────────────┘

┌──────────────────────┐
│  🚗 TRANSITION LANE  │  ← startTransition(() => setSearchQuery())
│  Can wait            │  (keep old UI while preparing new)
│  Interruptible       │
└──────────────────────┘

┌──────────────────────┐
│  🐌 DEFERRED LANE    │  ← useDeferredValue
│  Lowest priority     │
└──────────────────────┘
```

React processes urgent lane first, transition lane when CPU is available.

## Experiment: See It In Action

Add this to your component to visualize:

```javascript
useEffect(() => {
  console.log("🎬 Render:", {
    inputValue,
    searchQuery,
    isPending,
    areTheyDifferent: inputValue !== searchQuery,
  });
});
```

Type quickly and watch:

1. `inputValue` updates immediately
2. `searchQuery` lags behind (debounced + transition)
3. `isPending` shows when transition is active
4. When `searchQuery` catches up, `isPending` becomes false

## The Power: Why This Matters

**Before React 18:**

- Every state update was "urgent"
- Had to hack with setTimeout, loading states, etc.
- Complex coordination to avoid blank screens

**With startTransition:**

- Tell React what's urgent vs what can wait
- React handles the complexity
- Simple API, great UX automatically

## Common Patterns

### Pattern 1: Search (your example)

```javascript
// Urgent: input feels responsive
setInput(value);

// Non-urgent: old results stay visible
startTransition(() => setQuery(value));
```

### Pattern 2: Tab Switching

```javascript
// Non-urgent: old tab content stays while new loads
startTransition(() => setActiveTab(newTab));
```

### Pattern 3: Filtering Large Lists

```javascript
// Non-urgent: old filtered list stays visible
startTransition(() => setFilter(newFilter));
```

## Key Takeaway

`startTransition` is React saying:

> "I know you want to update this state, but it's not urgent. Let me work on it in the background, and I'll keep showing the old UI until the new one is completely ready. This way, the user never sees a jarring loading state."

It's opt-in concurrent rendering for better UX!
