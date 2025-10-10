import React, { useReducer, useEffect } from "react";
import styles from "./TodoReducer.module.css";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: "high" | "medium" | "low";
}

type FilterType = "all" | "active" | "completed";
type SortType = "date-desc" | "date-asc" | "alpha";

interface State {
  todos: Todo[];
  filter: FilterType;
  sort: SortType;
}

type Action =
  | {
      type: "ADD_TODO";
      payload: { text: string; priority: "high" | "medium" | "low" };
    }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "DELETE_TODO"; payload: { id: string } }
  | { type: "EDIT_TODO"; payload: { id: string; text: string } }
  | { type: "SET_FILTER"; payload: { filter: FilterType } }
  | { type: "SET_SORT"; payload: { sort: SortType } }
  | { type: "COMPLETE_ALL" }
  | { type: "DELETE_COMPLETED" }
  | { type: "LOAD_TODOS"; payload: { todos: Todo[] } };

function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now().toString(),
            text: action.payload.text,
            completed: false,
            createdAt: Date.now(),
            priority: action.payload.priority,
          },
        ],
      };

    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };

    case "EDIT_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        ),
      };

    case "SET_FILTER":
      return {
        ...state,
        filter: action.payload.filter,
      };

    case "SET_SORT":
      return {
        ...state,
        sort: action.payload.sort,
      };

    case "COMPLETE_ALL":
      return {
        ...state,
        todos: state.todos.map((todo) => ({ ...todo, completed: true })),
      };

    case "DELETE_COMPLETED":
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };

    case "LOAD_TODOS":
      return {
        ...state,
        todos: action.payload.todos,
      };

    default:
      return state;
  }
}

const initialState: State = {
  todos: [],
  filter: "all",
  sort: "date-desc",
};

export default function TodoReducer() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [inputValue, setInputValue] = React.useState("");
  const [priority, setPriority] = React.useState<"high" | "medium" | "low">(
    "medium"
  );

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        const todos = JSON.parse(saved) as Todo[];
        dispatch({ type: "LOAD_TODOS", payload: { todos } });
      } catch (_error) {
        console.error("Failed to load todos");
      }
    }
  }, []);

  // Save to localStorage when todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(state.todos));
  }, [state.todos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch({
        type: "ADD_TODO",
        payload: { text: inputValue.trim(), priority },
      });
      setInputValue("");
    }
  };

  // Filter todos
  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  // Sort todos
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    switch (state.sort) {
      case "date-desc":
        return b.createdAt - a.createdAt;
      case "date-asc":
        return a.createdAt - b.createdAt;
      case "alpha":
        return a.text.localeCompare(b.text);
      default:
        return 0;
    }
  });

  const stats = {
    total: state.todos.length,
    active: state.todos.filter((t) => !t.completed).length,
    completed: state.todos.filter((t) => t.completed).length,
  };

  const priorityColors = {
    high: "#f44336",
    medium: "#ff9800",
    low: "#4caf50",
  };

  return (
    <div className={styles.container}>
      <h2>Todo App with useReducer</h2>

      <form onSubmit={handleSubmit} className={styles.inputSection}>
        <input
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="Add a new todo..."
        />
        <select
          value={priority}
          onChange={(e) => {
            setPriority(e.target.value as "high" | "medium" | "low");
          }}
          className={styles.prioritySelect}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <div className={styles.controls}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${state.filter === "all" ? styles.active : ""}`}
            onClick={() => {
              dispatch({ type: "SET_FILTER", payload: { filter: "all" } });
            }}
          >
            All ({stats.total})
          </button>
          <button
            className={`${styles.filterButton} ${state.filter === "active" ? styles.active : ""}`}
            onClick={() => {
              dispatch({ type: "SET_FILTER", payload: { filter: "active" } });
            }}
          >
            Active ({stats.active})
          </button>
          <button
            className={`${styles.filterButton} ${state.filter === "completed" ? styles.active : ""}`}
            onClick={() => {
              dispatch({
                type: "SET_FILTER",
                payload: { filter: "completed" },
              });
            }}
          >
            Completed ({stats.completed})
          </button>
        </div>

        <div className={styles.sort}>
          <label>Sort:</label>
          <select
            value={state.sort}
            onChange={(e) => {
              dispatch({
                type: "SET_SORT",
                payload: { sort: e.target.value as SortType },
              });
            }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>
      </div>

      <ul className={styles.todoList}>
        {sortedTodos.map((todo) => (
          <li
            key={todo.id}
            className={`${styles.todoItem} ${todo.completed ? styles.completed : ""}`}
            style={{ borderLeftColor: priorityColors[todo.priority] }}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={todo.completed}
              onChange={() => {
                dispatch({ type: "TOGGLE_TODO", payload: { id: todo.id } });
              }}
            />
            <span className={styles.todoText}>{todo.text}</span>
            <span
              className={styles.priority}
              style={{ color: priorityColors[todo.priority] }}
            >
              {todo.priority}
            </span>
            <button
              className={styles.deleteButton}
              onClick={() => {
                dispatch({ type: "DELETE_TODO", payload: { id: todo.id } });
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {state.todos.length === 0 && (
        <div className={styles.empty}>
          No todos yet. Add one to get started!
        </div>
      )}

      {state.todos.length > 0 && (
        <div className={styles.bulkActions}>
          <button
            onClick={() => {
              dispatch({ type: "COMPLETE_ALL" });
            }}
          >
            Complete All
          </button>
          <button
            onClick={() => {
              dispatch({ type: "DELETE_COMPLETED" });
            }}
          >
            Delete Completed
          </button>
        </div>
      )}

      <div className={styles.stats}>
        <span>Total: {stats.total}</span>
        <span>Active: {stats.active}</span>
        <span>Completed: {stats.completed}</span>
      </div>
    </div>
  );
}
