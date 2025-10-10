import { useState } from "react";
import styles from "./CounterUndo.module.css";

export default function CounterUndo() {
  // TODO: Implement counter with undo/redo functionality

  return (
    <div className={styles.container}>
      <h2>Counter with Undo/Redo</h2>
      <div className={styles.counter}>{/* Display current count */}</div>
      <div className={styles.buttons}>
        {/* Implement Increment, Decrement, Undo, Redo buttons */}
      </div>
    </div>
  );
}
