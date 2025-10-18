import { useReducer, useState } from "react";
import styles from "./DragDrop.module.css";

interface Item {
  id: string;
  title: string;
  description?: string;
  columnId: string;
}

interface Column {
  id: string;
  title: string;
  itemIds: string[];
}

interface BoardState {
  items: Record<string, Item>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

type BoardAction =
  | {
      type: "MOVE_ITEM";
      payload: {
        itemId: string;
        sourceColumnId: string;
        destColumnId: string;
        destIndex: number;
      };
    }
  | { type: "ADD_ITEM"; payload: { columnId: string; title: string } }
  | { type: "DELETE_ITEM"; payload: { itemId: string; columnId: string } };

// Initial state
const initialState: BoardState = {
  items: {
    "1": { id: "1", title: "Setup project", columnId: "todo" },
    "2": { id: "2", title: "Design UI mockups", columnId: "todo" },
    "3": {
      id: "3",
      title: "Implement authentication",
      columnId: "in-progress",
    },
  },
  columns: {
    todo: { id: "todo", title: "To Do", itemIds: ["1", "2"] },
    "in-progress": { id: "in-progress", title: "In Progress", itemIds: ["3"] },
    done: { id: "done", title: "Done", itemIds: [] },
  },
  columnOrder: ["todo", "in-progress", "done"],
};

// TODO: Implement reducer
function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "MOVE_ITEM":
      // TODO: Implement move logic
      return state;
    case "ADD_ITEM":
      // TODO: Implement add logic
      return state;
    case "DELETE_ITEM":
      // TODO: Implement delete logic
      return state;
    default:
      return state;
  }
}

export default function DragDrop() {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  // TODO: Implement drag handlers
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    // TODO: Set dragged item
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    // TODO: Prevent default and show drop zone
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    // TODO: Handle drop and dispatch MOVE_ITEM
  };

  return (
    <div className={styles.container}>
      <h2>Drag and Drop Board</h2>
      <p className={styles.subtitle}>
        Drag items between columns or reorder within columns
      </p>

      <div className={styles.board}>
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];
          return (
            <div key={columnId} className={styles.column}>
              <div className={styles.columnHeader}>
                <h3>{column.title}</h3>
                <span className={styles.count}>{column.itemIds.length}</span>
              </div>

              <div className={styles.columnContent}>
                {/* TODO: Render items */}
                {/* TODO: Add drag and drop handlers */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

