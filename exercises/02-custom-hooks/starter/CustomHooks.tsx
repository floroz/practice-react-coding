import { useState, useEffect } from "react";
import styles from "./CustomHooks.module.css";

// TODO: Implement useLocalStorage hook
function useLocalStorage<T>(key: string, initialValue: T) {
  // Your implementation here
}

// TODO: Implement useDebounce hook
function useDebounce<T>(value: T, delay: number) {
  // Your implementation here
}

// Demo component using the custom hooks
export default function CustomHooks() {
  // TODO: Use the custom hooks here

  return (
    <div className={styles.container}>
      <h2>Custom Hooks Demo</h2>
      <div className={styles.demo}>{/* Implement demo UI */}</div>
    </div>
  );
}
