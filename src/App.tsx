import "./App.css";

// Import exercises - uncomment the one you want to practice
// import CounterUndo from '../exercises/01-counter-undo/starter/CounterUndo'
// import CounterUndo from '../exercises/01-counter-undo/solution/CounterUndo'

// import CustomHooks from '../exercises/02-custom-hooks/starter/CustomHooks'
// import CustomHooks from '../exercises/02-custom-hooks/solution/CustomHooks'

// import DynamicForm from '../exercises/03-dynamic-form/starter/DynamicForm'
// import DynamicForm from '../exercises/03-dynamic-form/solution/DynamicForm'

// import SuspenseData from '../exercises/04-suspense-data/starter/SuspenseData'
// import SuspenseData from '../exercises/04-suspense-data/solution/SuspenseData'

// import SearchTransition from '../exercises/05-search-transition/starter/SearchTransition'
// import SearchTransition from '../exercises/05-search-transition/solution/SearchTransition'

// import Performance from '../exercises/06-performance/starter/Performance'
// import Performance from '../exercises/06-performance/solution/Performance'

// import TodoReducer from '../exercises/07-todo-reducer/starter/TodoReducer'
// import TodoReducer from '../exercises/07-todo-reducer/solution/TodoReducer'

function App() {
  return (
    <div className="app">
      <header
        style={{
          textAlign: "center",
          padding: "2rem",
          borderBottom: "1px solid #444",
        }}
      >
        <h1>React Interview Practice</h1>
        <p style={{ color: "#888" }}>
          To start an exercise, uncomment the import in <code>src/App.tsx</code>
        </p>
      </header>

      <main>
        {/* Your selected exercise will render here */}
        {/* Example: <CounterUndo /> */}

        <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
          <h2>Getting Started</h2>
          <p>
            Open <code>src/App.tsx</code> and uncomment an exercise import to
            begin.
          </p>
          <p>
            Each exercise has a starter file and a solution file for reference.
          </p>

          <div
            style={{
              marginTop: "2rem",
              textAlign: "left",
              maxWidth: "600px",
              margin: "2rem auto",
            }}
          >
            <h3>Available Exercises:</h3>
            <ol style={{ lineHeight: "2" }}>
              <li>
                <strong>Counter with Undo/Redo</strong> - useState, state
                management
              </li>
              <li>
                <strong>Custom Hooks</strong> - useEffect, localStorage,
                useDebounce
              </li>
              <li>
                <strong>Dynamic Form Builder</strong> - Controlled inputs,
                validation
              </li>
              <li>
                <strong>Suspense Data Fetching</strong> - Suspense, Error
                Boundaries (React 18)
              </li>
              <li>
                <strong>Search with useTransition</strong> - Concurrent features
                (React 18)
              </li>
              <li>
                <strong>Performance Optimization</strong> - React.memo, useMemo,
                useCallback
              </li>
              <li>
                <strong>Todo with useReducer</strong> - Complex state,
                TypeScript
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
