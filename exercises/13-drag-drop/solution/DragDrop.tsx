import { useReducer, useState, useRef } from "react";
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
  | {
      type: "ADD_ITEM";
      payload: { columnId: string; title: string; description?: string };
    }
  | { type: "DELETE_ITEM"; payload: { itemId: string; columnId: string } };

const initialState: BoardState = {
  items: {
    "1": {
      id: "1",
      title: "Setup project repository",
      description: "Initialize Git and install dependencies",
      columnId: "todo",
    },
    "2": {
      id: "2",
      title: "Design UI mockups",
      description: "Create wireframes for main pages",
      columnId: "todo",
    },
    "3": {
      id: "3",
      title: "Setup database schema",
      description: "Design and implement tables",
      columnId: "todo",
    },
    "4": {
      id: "4",
      title: "Implement authentication",
      description: "Add login and registration",
      columnId: "in-progress",
    },
    "5": {
      id: "5",
      title: "Create API endpoints",
      description: "RESTful API for user management",
      columnId: "in-progress",
    },
    "6": {
      id: "6",
      title: "Initial project setup",
      description: "Completed project scaffolding",
      columnId: "done",
    },
  },
  columns: {
    todo: { id: "todo", title: "📋 To Do", itemIds: ["1", "2", "3"] },
    "in-progress": {
      id: "in-progress",
      title: "⚙️ In Progress",
      itemIds: ["4", "5"],
    },
    done: { id: "done", title: "✅ Done", itemIds: ["6"] },
  },
  columnOrder: ["todo", "in-progress", "done"],
};

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "MOVE_ITEM": {
      const { itemId, sourceColumnId, destColumnId, destIndex } =
        action.payload;

      // Get source column
      const sourceColumn = state.columns[sourceColumnId];
      const newSourceItemIds = sourceColumn.itemIds.filter(
        (id) => id !== itemId
      );

      // Get destination column
      const destColumn = state.columns[destColumnId];
      const newDestItemIds =
        sourceColumnId === destColumnId
          ? [...newSourceItemIds]
          : [...destColumn.itemIds];

      // Insert at correct position
      newDestItemIds.splice(destIndex, 0, itemId);

      return {
        ...state,
        columns: {
          ...state.columns,
          [sourceColumnId]: { ...sourceColumn, itemIds: newSourceItemIds },
          [destColumnId]: { ...destColumn, itemIds: newDestItemIds },
        },
        items: {
          ...state.items,
          [itemId]: { ...state.items[itemId], columnId: destColumnId },
        },
      };
    }

    case "ADD_ITEM": {
      const { columnId, title, description } = action.payload;
      const newItemId = `item-${Date.now()}`;
      const newItem: Item = {
        id: newItemId,
        title,
        description,
        columnId,
      };

      const column = state.columns[columnId];
      const newItemIds = [...column.itemIds, newItemId];

      return {
        ...state,
        items: {
          ...state.items,
          [newItemId]: newItem,
        },
        columns: {
          ...state.columns,
          [columnId]: { ...column, itemIds: newItemIds },
        },
      };
    }

    case "DELETE_ITEM": {
      const { itemId, columnId } = action.payload;
      const { [itemId]: deletedItem, ...remainingItems } = state.items;

      const column = state.columns[columnId];
      const newItemIds = column.itemIds.filter((id) => id !== itemId);

      return {
        ...state,
        items: remainingItems,
        columns: {
          ...state.columns,
          [columnId]: { ...column, itemIds: newItemIds },
        },
      };
    }

    default:
      return state;
  }
}

function ItemCard({
  item,
  isDragging,
  onDragStart,
  onDelete,
}: {
  item: Item;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, itemId: string, columnId: string) => void;
  onDelete: (itemId: string, columnId: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item.id, item.columnId)}
      className={`${styles.item} ${isDragging ? styles.dragging : ""}`}
    >
      <div className={styles.itemContent}>
        <h4 className={styles.itemTitle}>{item.title}</h4>
        {item.description && (
          <p className={styles.itemDescription}>{item.description}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(item.id, item.columnId)}
        className={styles.deleteButton}
        aria-label="Delete item"
      >
        ✕
      </button>
    </div>
  );
}

function AddItemForm({
  columnId,
  onAdd,
}: {
  columnId: string;
  onAdd: (columnId: string, title: string, description?: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(columnId, title, description);
    setTitle("");
    setDescription("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className={styles.addButton}>
        + Add Item
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.addForm}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Item title..."
        className={styles.addInput}
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)..."
        className={styles.addTextarea}
        rows={2}
      />
      <div className={styles.addFormActions}>
        <button type="submit" className={styles.addSubmit}>
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setTitle("");
            setDescription("");
          }}
          className={styles.addCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function DragDrop() {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [draggedOverColumnId, setDraggedOverColumnId] = useState<string | null>(
    null
  );
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const draggedSourceColumnRef = useRef<string | null>(null);
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleDragStart = (
    e: React.DragEvent,
    itemId: string,
    columnId: string
  ) => {
    setDraggedItemId(itemId);
    draggedSourceColumnRef.current = columnId;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemId);
  };

  const calculateInsertIndex = (
    e: React.DragEvent,
    columnId: string
  ): number => {
    const columnEl = columnRefs.current[columnId];
    if (!columnEl) return 0;

    const items = Array.from(columnEl.querySelectorAll(`.${styles.item}`));
    const mouseY = e.clientY;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const rect = item.getBoundingClientRect();

      // Skip the dragged item itself
      if (item.classList.contains(styles.dragging)) continue;

      if (mouseY < rect.top + rect.height / 2) {
        return i;
      }
    }

    return items.length - (draggedSourceColumnRef.current === columnId ? 1 : 0);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    setDraggedOverColumnId(columnId);
    const newInsertIndex = calculateInsertIndex(e, columnId);
    setInsertIndex(newInsertIndex);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    const currentTarget = e.currentTarget as HTMLElement;

    if (!currentTarget.contains(relatedTarget)) {
      setDraggedOverColumnId(null);
      setInsertIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();

    if (!draggedItemId || !draggedSourceColumnRef.current) return;

    const sourceColumnId = draggedSourceColumnRef.current;
    const destIndex = insertIndex ?? 0;

    dispatch({
      type: "MOVE_ITEM",
      payload: {
        itemId: draggedItemId,
        sourceColumnId,
        destColumnId: columnId,
        destIndex,
      },
    });

    // Reset drag state
    setDraggedItemId(null);
    setDraggedOverColumnId(null);
    setInsertIndex(null);
    draggedSourceColumnRef.current = null;
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDraggedOverColumnId(null);
    setInsertIndex(null);
    draggedSourceColumnRef.current = null;
  };

  const handleAddItem = (
    columnId: string,
    title: string,
    description?: string
  ) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { columnId, title, description },
    });
  };

  const handleDeleteItem = (itemId: string, columnId: string) => {
    dispatch({
      type: "DELETE_ITEM",
      payload: { itemId, columnId },
    });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Drag and Drop Board</h2>
        <p className={styles.subtitle}>
          Drag items between columns or reorder within columns
        </p>
      </header>

      <div className={styles.info}>
        <h3>Features:</h3>
        <ul>
          <li>✅ Drag items between columns</li>
          <li>✅ Reorder items within columns</li>
          <li>✅ Visual feedback during drag</li>
          <li>✅ Add and delete items</li>
          <li>✅ useReducer for state management</li>
        </ul>
      </div>

      <div className={styles.board}>
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];
          const isDropTarget = draggedOverColumnId === columnId;

          return (
            <div
              key={columnId}
              className={`${styles.column} ${isDropTarget ? styles.dropTarget : ""}`}
              onDragOver={(e) => handleDragOver(e, columnId)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div className={styles.columnHeader}>
                <h3>{column.title}</h3>
                <span className={styles.count}>{column.itemIds.length}</span>
              </div>

              <div
                ref={(el) => (columnRefs.current[columnId] = el)}
                className={styles.columnContent}
              >
                {column.itemIds.map((itemId, index) => {
                  const item = state.items[itemId];
                  const isDragging = draggedItemId === itemId;
                  const shouldShowPlaceholder =
                    isDropTarget &&
                    insertIndex === index &&
                    draggedItemId !== itemId;

                  return (
                    <div key={itemId}>
                      {shouldShowPlaceholder && (
                        <div className={styles.placeholder} />
                      )}
                      <ItemCard
                        item={item}
                        isDragging={isDragging}
                        onDragStart={handleDragStart}
                        onDelete={handleDeleteItem}
                      />
                    </div>
                  );
                })}
                {isDropTarget && insertIndex === column.itemIds.length && (
                  <div className={styles.placeholder} />
                )}
                {column.itemIds.length === 0 && isDropTarget && (
                  <div className={styles.emptyPlaceholder}>Drop here</div>
                )}
              </div>

              <AddItemForm columnId={columnId} onAdd={handleAddItem} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

