import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import styles from "./Performance.module.css";

// Expensive calculation (simulates heavy computation)
function expensiveCalculation(num: number): number {
  let result = num;
  for (let i = 0; i < 1000000; i++) {
    result += Math.sin(i) * 0.0001;
  }
  return Math.round(result);
}

// Counter component (updates frequently, should not affect list)
const Counter = memo(function Counter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);
  renderCount.current++;

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.counter}>
      Timer: {count}s
      <div style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.5rem" }}>
        Component renders: {renderCount.current}
      </div>
    </div>
  );
});

// Item component (expensive render, should be memoized)
interface ItemProps {
  id: number;
  value: number;
  onDelete: (id: number) => void;
}

// Unoptimized version
function ItemUnoptimized({ id, value, onDelete }: ItemProps) {
  const renderCount = useRef(0);
  renderCount.current++;

  // Expensive calculation without memoization
  const calculated = expensiveCalculation(value);

  return (
    <div className={styles.item}>
      <div>
        <strong>Item {id}</strong> - Value: {value} → Calculated: {calculated}
      </div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span className={styles.renderCount}>
          Renders: {renderCount.current}
        </span>
        <button
          onClick={() => {
            onDelete(id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// Optimized version
const ItemOptimized = memo(function Item({ id, value, onDelete }: ItemProps) {
  const renderCount = useRef(0);
  renderCount.current++;

  // Expensive calculation WITH memoization
  const calculated = useMemo(() => expensiveCalculation(value), [value]);

  return (
    <div className={styles.item}>
      <div>
        <strong>Item {id}</strong> - Value: {value} → Calculated: {calculated}
      </div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <span className={styles.renderCount}>
          Renders: {renderCount.current}
        </span>
        <button
          onClick={() => {
            onDelete(id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
});

export default function Performance() {
  const [items, setItems] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({ id: i, value: i * 10 }))
  );
  const [filter, setFilter] = useState("");
  const [optimized, setOptimized] = useState(false);

  const renderCount = useRef(0);
  renderCount.current++;

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.id.toString().includes(filter) ||
        item.value.toString().includes(filter)
    );
  }, [items, filter]);

  // Stable callback with useCallback
  const handleDelete = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Without useCallback (recreated on every render)
  const handleDeleteUnoptimized = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const ItemComponent = optimized ? ItemOptimized : ItemUnoptimized;
  const deleteHandler = optimized ? handleDelete : handleDeleteUnoptimized;

  return (
    <div className={styles.container}>
      <h2>Performance Optimization Demo</h2>
      <p style={{ color: "#888", marginBottom: "1rem" }}>
        Toggle optimization to see the difference. Watch the render counts!
      </p>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.label}>Main Component Renders</div>
          <div className={styles.value}>{renderCount.current}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.label}>Total Items</div>
          <div className={styles.value}>{items.length}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.label}>Filtered Items</div>
          <div className={styles.value}>{filteredItems.length}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.label}>Optimization</div>
          <div
            className={styles.value}
            style={{ color: optimized ? "#4caf50" : "#f44336" }}
          >
            {optimized ? "ON" : "OFF"}
          </div>
        </div>
      </div>

      <Counter />

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Filter items..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
        <button
          onClick={() => {
            setOptimized(!optimized);
          }}
        >
          {optimized ? "❌ Disable" : "✅ Enable"} Optimization
        </button>
      </div>

      <div className={styles.list}>
        <h3>Items List ({filteredItems.length})</h3>
        <p style={{ fontSize: "0.9rem", color: "#888", marginBottom: "1rem" }}>
          {optimized ? (
            <>
              ✅ Using <code>React.memo</code>, <code>useMemo</code>, and{" "}
              <code>useCallback</code>
            </>
          ) : (
            <>❌ No optimization - all items re-render on every state change</>
          )}
        </p>
        {filteredItems.map((item) => (
          <ItemComponent
            key={item.id}
            id={item.id}
            value={item.value}
            onDelete={deleteHandler}
          />
        ))}
      </div>
    </div>
  );
}
