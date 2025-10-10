import { useReducer } from "react";
import styles from "./TodoReducer.module.css";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface State {
  todos: Todo[];
  filter: "all" | "active" | "completed";
}

type Action =
  | { type: "ADD_TODO"; payload: { text: string } }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "DELETE_TODO"; payload: { id: string } };
// TODO: Add more action types

// TODO: Implement reducer function
function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    // Implement cases
    default:
      return state;
  }
}

export default function TodoReducer() {
  // TODO: Use useReducer and implement the UI

  return (
    <div className={styles.container}>
      <h2>Todo App with useReducer</h2>
      {/* Implement UI */}
    </div>
  );
}
