import { useState, useEffect } from "react";
import styles from "./CustomHooks.module.css";

// Custom hook: useLocalStorage
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

// Custom hook: useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay completes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Demo component using the custom hooks
export default function CustomHooks() {
  const [searchTerm, setSearchTerm] = useLocalStorage("searchTerm", "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <div className={styles.container}>
      <h2>Custom Hooks Demo</h2>
      <div className={styles.demo}>
        <label htmlFor="search">
          Search (saved to localStorage, debounced by 500ms):
        </label>
        <input
          id="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type something..."
          className={styles.input}
        />

        <div className={styles.info}>
          <p>
            <span className={styles.label}>Immediate value:</span>{" "}
            {searchTerm || "(empty)"}
          </p>
          <p>
            <span className={styles.label}>Debounced value:</span>{" "}
            {debouncedSearchTerm || "(empty)"}
          </p>
          <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#888" }}>
            💡 Try refreshing the page - your search term will persist!
          </p>
        </div>

        {debouncedSearchTerm && (
          <div className={styles.results}>
            <h3>Search Results for: "{debouncedSearchTerm}"</h3>
            <p>API call would happen here with the debounced value...</p>
          </div>
        )}
      </div>
    </div>
  );
}
