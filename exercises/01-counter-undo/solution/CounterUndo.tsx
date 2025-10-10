import { useState } from "react";
import styles from "./CounterUndo.module.css";

interface CounterState {
  past: number[];
  present: number;
  future: number[];
}

export default function CounterUndo() {
  const [state, setState] = useState<CounterState>({
    past: [],
    present: 0,
    future: [],
  });

  const { past, present, future } = state;

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const updateCounter = (newValue: number) => {
    setState({
      past: [...past, present],
      present: newValue,
      future: [], // Clear redo history on new action
    });
  };

  const increment = () => updateCounter(present + 1);
  const decrement = () => updateCounter(present - 1);

  const undo = () => {
    if (!canUndo) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setState({
      past: newPast,
      present: previous,
      future: [present, ...future],
    });
  };

  const redo = () => {
    if (!canRedo) return;

    const next = future[0];
    const newFuture = future.slice(1);

    setState({
      past: [...past, present],
      present: next,
      future: newFuture,
    });
  };

  const reset = () => {
    setState({
      past: [],
      present: 0,
      future: [],
    });
  };

  return (
    <div className={styles.container}>
      <h2>Counter with Undo/Redo</h2>
      <div className={styles.counter}>{present}</div>
      <div className={styles.buttons}>
        <button onClick={decrement}>Decrement (-)</button>
        <button onClick={increment}>Increment (+)</button>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
        <button onClick={reset}>Reset</button>
      </div>
      <div className={styles.history}>
        <p>History Length: {past.length + 1 + future.length}</p>
      </div>
    </div>
  );
}
