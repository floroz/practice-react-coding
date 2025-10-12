# How React Connects startTransition to Components

## Your Question

> How does React connect `startTransition(() => setSearchQuery(value))` to `<SearchResults query={searchQuery} />`?

## The Answer: It's About the Render Tree, Not Dependencies

React doesn't "track" which components use which state. Instead:

**When you call a state setter inside `startTransition`, React marks THE ENTIRE RE-RENDER as a transition.**

## Step-by-Step: The Connection

### 1. State Update

```javascript
startTransition(() => {
  setSearchQuery("reactjs"); // ← React: "Schedule a LOW PRIORITY render"
});
```

### 2. React Schedules a Re-Render

```javascript
// React needs to re-render SuspendedTransitions because state changed
function SuspendedTransitions() {
  const [searchQuery] = useState("reactjs"); // ← State has new value

  // React evaluates the JSX...
  return (
    <div>
      <SearchResults query={searchQuery} /> {/* Gets "reactjs" */}
      <QueryDisplay query={searchQuery} /> {/* Gets "reactjs" */}
    </div>
  );
}
```

### 3. React Renders All Children

```javascript
// React renders SearchResults with new prop
function SearchResults({ query }) {
  // query = "reactjs"
  const resource = fetchResults(query); // Fetch with new query
  const results = resource.read(); // ← Might throw Promise (Suspend!)
  return <div>...</div>;
}

// React also renders QueryDisplay
function QueryDisplay({ query }) {
  // query = "reactjs"
  return <div>Current Query: {query}</div>; // ← Also gets new value
}
```

### 4. React's Decision

- **If nothing suspends**: Commit new UI immediately
- **If anything suspends**: Keep old UI visible (this is the key!)

## 🔑 Key Insight: Transition Scope

```
startTransition(() => setSearchQuery("reactjs"))
              ↓
    Triggers re-render of parent component
              ↓
    ALL children in that render tree inherit "transition mode"
              ↓
    If ANY child suspends → Keep old UI visible
```

## Multiple Components Example

```javascript
export default function SuspendedTransitions() {
  const [searchQuery, setSearchQuery] = useState("react");
  const [unrelatedState, setUnrelatedState] = useState(0);

  // Transition render triggered by searchQuery
  startTransition(() => {
    setSearchQuery("reactjs");
  });

  return (
    <div>
      {/* ALL of these are part of the SAME render */}
      <SearchResults query={searchQuery} /> {/* Uses searchQuery ✅ */}
      <QueryDisplay query={searchQuery} /> {/* Uses searchQuery ✅ */}
      <RecentSearches /> {/* Doesn't use it ❌ */}
      <Counter count={unrelatedState} /> {/* Doesn't use it ❌ */}
    </div>
  );
}
```

**What happens:**

1. `setSearchQuery` marks the render as "transition"
2. React re-renders `SuspendedTransitions` component
3. React renders **all four** child components
4. ALL four are part of the transition (even if they don't use `searchQuery`)
5. If **any** of them suspend, old UI stays visible

## The Precise Rule ✨

> **"A state update inside `startTransition` makes the resulting render tree a transition. Any component that suspends during that render will cause React to keep the previous UI visible until ready."**

## It's NOT About Dependencies

React doesn't care which components use `searchQuery`. It cares about:

1. **Which render was triggered?** (The one from `setSearchQuery`)
2. **Was that render marked as transition?** (Yes, via `startTransition`)
3. **Did anything suspend?** (Yes, `SearchResults` threw a Promise)
4. **Decision:** Keep old UI visible ✅

## Visualizing the Render Tree

```
SuspendedTransitions (re-renders because searchQuery changed)
│
├─ <input />                           [Renders normally]
├─ {isPending && <Searching />}        [Renders normally]
│
└─ <Suspense>                          [Catches suspensions]
    ├─ <SearchResults query={...} />   [⚠️ SUSPENDS - throws Promise]
    └─ <QueryDisplay query={...} />    [Renders normally]

React's decision:
- SearchResults suspended
- This is a TRANSITION render
- Action: Keep showing OLD <SearchResults> + OLD <QueryDisplay>
```

## Compare: Normal Update vs Transition

### Normal State Update (WITHOUT startTransition)

```javascript
setSearchQuery("reactjs"); // Urgent, high priority

// React renders tree
<SearchResults query="reactjs" />
  ↓ throws Promise
  ↓
Suspense fallback shows immediately
  ↓
USER SEES: Loading spinner (old results disappear)
```

### Transition Update (WITH startTransition)

```javascript
startTransition(() => setSearchQuery("reactjs")); // Non-urgent, low priority

// React renders tree IN BACKGROUND
<SearchResults query="reactjs" />
  ↓ throws Promise
  ↓
React keeps old UI visible
  ↓
USER SEES: Old results (with "Searching..." indicator)
```

## Real-World Analogy 🏗️

Think of React as a construction crew:

**Normal Update (Urgent):**

- "Tear down the old building NOW"
- "Show scaffolding while we build"
- User sees: Destruction → Loading → New building

**Transition Update (Non-urgent):**

- "Build the new building OFF-SITE first"
- "Don't touch the old building yet"
- "When new building is ready, swap them instantly"
- User sees: Old building → (construction happening elsewhere) → New building

## Experiment: See It In Action

Add logging to see all components rendering:

```javascript
function SearchResults({ query }) {
  console.log("🔍 SearchResults rendering:", query);
  const resource = fetchResults(query);
  const results = resource.read();
  return <div>...</div>;
}

function QueryDisplay({ query }) {
  console.log("📊 QueryDisplay rendering:", query);
  return <div>Current Query: {query}</div>;
}

export default function SuspendedTransitions() {
  console.log("🏠 Parent rendering");
  // ... rest of component
}
```

**Type "reactjs" and watch console:**

```
🏠 Parent rendering              (inputValue changed - immediate)
🔍 SearchResults rendering: react
📊 QueryDisplay rendering: react

[500ms debounce passes]

🏠 Parent rendering              (transition started)
🔍 SearchResults rendering: reactjs  (suspends!)
📊 QueryDisplay rendering: reactjs

[OLD UI still visible to user!]

[Promise resolves]

🏠 Parent rendering              (transition completes)
🔍 SearchResults rendering: reactjs  (success!)
📊 QueryDisplay rendering: reactjs

[NEW UI swaps in!]
```

Notice: Both `SearchResults` AND `QueryDisplay` render together because they're part of the same render tree!

## Advanced: Nested Transitions

```javascript
function Parent() {
  const [query, setQuery] = useState("react");

  startTransition(() => setQuery("reactjs"));

  return (
    <div>
      <SearchResults query={query} />
      <Sidebar>
        <RelatedSearches query={query} /> {/* Also in transition! */}
      </Sidebar>
    </div>
  );
}
```

Even deeply nested components are part of the same transition render.

## Summary

1. **`startTransition` marks a RENDER, not specific components**
2. **All components in that render inherit transition behavior**
3. **React doesn't track "dependencies" - it tracks "render trees"**
4. **If ANY component suspends during transition, old UI stays**
5. **Even components that don't use the state are part of the transition**

The magic is: **React can work on multiple versions of the UI at once (concurrent rendering)**, and `startTransition` tells React which version to show to users while the new one prepares.
