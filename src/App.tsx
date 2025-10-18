import "./App.css";

// Import exercises - uncomment the one you want to practice
// import CounterUndo from "../exercises/01-counter-undo/starter/CounterUndo";
// import CounterUndo from '../exercises/01-counter-undo/solution/CounterUndo'

// import CustomHooks from "../exercises/02-custom-hooks/starter/CustomHooks";
// import CustomHooks from "../exercises/02-custom-hooks/solution/CustomHooks";

// import DynamicForm from "../exercises/03-dynamic-form/starter/DynamicForm";
// import DynamicForm from '../exercises/03-dynamic-form/solution/DynamicForm'

// import SuspenseData from "../exercises/04-suspense-data/starter/SuspenseData";
// import SuspenseData from '../exercises/04-suspense-data/solution/SuspenseData'

// import SuspenseData2 from "../exercises/04b-suspended-transitions/starter/SuspendedTransitions";
// import SuspenseData2 from '../exercises/04b-suspended-transitions/solution/SuspendedTransitions'

// import SearchTransition from "../exercises/05-search-transition/starter/SearchTransition";
// import SearchTransition from '../exercises/05-search-transition/solution/SearchTransition'

// import Performance from "../exercises/06-performance/starter/Performance";
// import Performance from '../exercises/06-performance/solution/Performance'
// import Performance from "../exercises/06-performance/compiler/Performance";
// import Performance from "../exercises/06-performance/compiler-friendly/Performance";
// import Performance from "../exercises/06-performance/compiler/PerformanceModular";
// import Performance from "../exercises/06-performance/compiler/PerformancePure";

// import TodoReducer from "../exercises/07-todo-reducer/starter/TodoReducer";
// import TodoReducer from '../exercises/07-todo-reducer/solution/TodoReducer'

// import OptimisticUpdates from "../exercises/08-optimistic-updates/starter/OptimisticUpdates";
// import OptimisticUpdates from "../exercises/08-optimistic-updates/solution/OptimisticUpdates";

// import InfiniteScroll from "../exercises/09-infinite-scroll/starter/InfiniteScroll";
// import InfiniteScroll from "../exercises/09-infinite-scroll/solution/InfiniteScroll";

// import ModalManager from "../exercises/10-modal-manager/starter/ModalManager";
// import ModalManager from "../exercises/10-modal-manager/solution/ModalManager";

// import ContextOptimization from "../exercises/11-context-optimization/starter/ContextOptimization";
// import ContextOptimization from "../exercises/11-context-optimization/solution/ContextOptimization";

// import Autocomplete from "../exercises/12-autocomplete/starter/Autocomplete";
// import Autocomplete from "../exercises/12-autocomplete/solution/Autocomplete";

// import DragDrop from "../exercises/13-drag-drop/starter/DragDrop";
// import DragDrop from "../exercises/13-drag-drop/solution/DragDrop";

// import CanvasRenderer from '../exercises/08-canvas-renderer/starter/CanvasRenderer'

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
              <li>
                <strong>Optimistic UI Updates</strong> - Optimistic updates,
                async actions, error rollback
              </li>
              <li>
                <strong>Infinite Scroll</strong> - Intersection Observer,
                virtualization, lazy loading
              </li>
              <li>
                <strong>Modal Manager</strong> - Portals, focus trap, keyboard
                navigation, a11y
              </li>
              <li>
                <strong>Context Optimization</strong> - Context API,
                performance, memoization
              </li>
              <li>
                <strong>Autocomplete Search</strong> - Debouncing,
                useTransition, race conditions
              </li>
              <li>
                <strong>Drag and Drop Board</strong> - Drag & Drop API,
                useReducer, complex state
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
