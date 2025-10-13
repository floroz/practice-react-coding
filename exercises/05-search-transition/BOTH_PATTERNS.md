# useTransition vs useDeferredValue: Complete Patterns

## The Problem

Filtering 10,000 items is **CPU-intensive**. It blocks the UI thread, making input feel sluggish.

## Solution 1: useTransition Pattern

```tsx
export default function SearchWithTransition() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const items = generateItems(10_000);

  const handleChange = (value: string) => {
    // Urgent: Input updates immediately (responsive typing)
    setInput(value);

    // Non-urgent: Defer the expensive filtering
    startTransition(() => {
      setQuery(value);
    });
  };

  // Expensive computation uses deferred query
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input value={input} onChange={(e) => handleChange(e.target.value)} />

      {/* ✅ We have isPending! */}
      <div>
        Results: {filtered.length}
        {isPending && <span>⏳ Filtering...</span>}
      </div>

      <Results items={filtered} />
    </div>
  );
}
```

**Pros:**

- ✅ You get `isPending` for loading indicator
- ✅ Input is always responsive
- ✅ Fine-grained control over what's deferred

**Cons:**

- ❌ More boilerplate (two states, manual sync)
- ❌ Must remember to wrap setter in `startTransition`

## Solution 2: useDeferredValue Pattern

```tsx
export default function SearchWithDeferred() {
  const [input, setInput] = useState("");
  const items = generateItems(10_000);

  // Defer the expensive input value
  const deferredInput = useDeferredValue(input);

  // Expensive computation uses deferred value
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(deferredInput.toLowerCase())
  );

  // Detect if deferred value lags behind
  const isPending = input !== deferredInput;

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />

      {/* ✅ Manual isPending detection */}
      <div>
        Results: {filtered.length}
        {isPending && <span>⏳ Filtering...</span>}
      </div>

      <Results items={filtered} />
    </div>
  );
}
```

**Pros:**

- ✅ Less boilerplate (one state, one line to defer)
- ✅ Input is always responsive
- ✅ Simpler mental model

**Cons:**

- ❌ No built-in `isPending` (must derive it)
- ❌ Less control over what gets deferred

## Solution 3: Hybrid (For Advanced UX)

```tsx
export default function SearchHybrid() {
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const items = generateItems(10_000);

  // Defer the input value
  const deferredInput = useDeferredValue(input);

  // Expensive computation
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(deferredInput.toLowerCase())
  );

  return (
    <div>
      <input
        value={input}
        onChange={(e) => {
          // Wrap the state update in transition
          startTransition(() => {
            setInput(e.target.value);
          });
        }}
      />

      {/* ✅ Best of both worlds */}
      <div>
        Results: {filtered.length}
        {isPending && <span>⏳ Filtering...</span>}
      </div>

      <Results items={filtered} />
    </div>
  );
}
```

**When to use this:**

- When you need explicit control + automatic value deferral
- Advanced scenarios with multiple deferred computations

## Comparison Table

| Feature                | `useTransition`          | `useDeferredValue`                 |
| ---------------------- | ------------------------ | ---------------------------------- |
| **Built-in isPending** | ✅ Yes                   | ❌ No (derive manually)            |
| **Boilerplate**        | More (2 states)          | Less (1 state)                     |
| **Control**            | Explicit                 | Automatic                          |
| **Use case**           | Deferring state updates  | Deferring expensive derived values |
| **Best for**           | Complex state management | Simple value transformations       |

## When to Use Which?

### Use `useTransition` when:

- You need explicit `isPending` state
- You're managing complex state updates
- You want fine-grained control
- **Example:** Search with debouncing, filters, sorting

### Use `useDeferredValue` when:

- You have an expensive computation based on a value
- You want less boilerplate
- You're okay deriving `isPending` manually
- **Example:** Filtering a list, expensive chart rendering

### Use Both when:

- You need maximum control
- Complex UX with multiple loading states
- **Example:** Dashboard with multiple deferred sections

## The Key Insight

Both solve the same problem:

```
User types → CPU-heavy work → UI freezes 😱

Solution:
User types → Input responsive ✅
          → Heavy work happens in background
          → UI updates when ready ✅
```

**`useTransition`**: "Let me wrap this state update as non-urgent"
**`useDeferredValue`**: "Give me a version of this value that lags behind"

## Your Jankiness Problem 🎯

You said the UI feels janky with `useDeferredValue`. Here's why:

```tsx
const deferredResults = useDeferredValue(
  items.filter((item) => item.name.includes(input))
);
```

**Problem:** You're deferring the RESULT (array), not the INPUT (string)!

This means:

1. `input` changes → Expensive filter runs IMMEDIATELY
2. React then defers updating the `deferredResults`
3. Still janky! 😰

**Fix:** Defer the INPUT, not the result:

```tsx
const deferredInput = useDeferredValue(input);

// Now filter uses deferred input
const filtered = items.filter((item) => item.name.includes(deferredInput));
```

Now:

1. `input` changes → Updated immediately ✅
2. `deferredInput` lags behind → Filter runs with old value
3. When CPU is free → `deferredInput` updates → Filter re-runs
4. Smooth! ✨

## The Correct useDeferredValue Pattern

```tsx
export default function SearchTransition() {
  const [input, setInput] = useState("");
  const items = generateItems(10_000);

  // ✅ Defer the INPUT (not the result)
  const deferredInput = useDeferredValue(input);

  // ✅ Expensive computation uses deferred value
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(deferredInput.toLowerCase())
  );

  // ✅ Derive isPending
  const isPending = input !== deferredInput;

  return (
    <div className={styles.container}>
      <h2>Search with useDeferredValue</h2>

      <input
        value={input} // ← Immediate
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type to search..."
      />

      <div className={styles.stats}>
        <span>
          Results: {filtered.length} / {items.length}
        </span>
        {isPending && <span className={styles.pending}>⏳ Filtering...</span>}
      </div>

      <div className={styles.results}>
        {filtered.slice(0, 100).map((item) => (
          <div key={item.id} className={styles.item}>
            <h4>{item.name}</h4>
            <span className={styles.category}>{item.category}</span>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Performance Tip

Notice the `.slice(0, 100)` - even with transitions, rendering 10,000 DOM nodes is expensive!

Options:

1. Limit displayed results
2. Use virtual scrolling (react-window)
3. Pagination

## Summary

Your jankiness was because you deferred the **result** instead of the **input**!

**Rule of thumb:**

- Defer the **input** (cheap value)
- Let the **expensive computation** use the deferred input
- React will re-run the computation when CPU is available

Try the corrected pattern and the jank should disappear! 🚀
