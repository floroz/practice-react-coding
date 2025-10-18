# Exercise 13: Drag and Drop Board

**Difficulty**: Hard  
**Time**: 40-45 minutes  
**Concepts**: Drag and Drop API, `useReducer`, complex state, refs, DOM manipulation

## Challenge

Build a Kanban-style board (like Trello) with drag-and-drop functionality. Items can be reordered within columns or moved between columns. This tests your understanding of the Drag and Drop API, complex state management, and visual feedback.

This is a challenging but realistic interview question for senior positions.

## Requirements

### Part 1: Board Structure

1. Create a board with 3-4 columns (e.g., Todo, In Progress, Done)
2. Each column displays its items
3. Show item count per column
4. Items have title and optional description/tags
5. Responsive layout

### Part 2: Drag and Drop

1. Make items draggable
2. Detect when dragging over a column
3. Show drop zones/placeholders
4. Handle drop events
5. Update state when items are moved

### Part 3: State Management

1. Use `useReducer` for complex state
2. Actions: MOVE_ITEM, REORDER_WITHIN_COLUMN, ADD_ITEM, DELETE_ITEM
3. Handle all state transitions properly
4. Maintain data integrity

### Part 4: Visual Feedback

1. Show visual feedback during drag:
   - Dim dragged item
   - Highlight drop zones
   - Show placeholder in target position
2. Smooth animations
3. Cursor changes appropriately

### Part 5: Reordering

1. Support reordering within same column
2. Calculate correct insert position
3. Show placeholder at insert position
4. Update state correctly

### Part 6: Additional Features

1. Add new item form
2. Delete item button
3. Edit item (bonus)
4. Persist to localStorage
5. Handle edge cases

## Edge Cases to Consider

- What if user drags outside valid drop zones?
- How do you handle rapid drag operations?
- What about touch devices?
- How do you calculate insert position accurately?
- What if column is empty?
- How do you handle very long item text?
- What about keyboard accessibility?
- Should you allow column reordering?

## Validation

Your solution should:

1. ✅ Items are draggable
2. ✅ Can move items between columns
3. ✅ Can reorder items within a column
4. ✅ Visual feedback during drag
5. ✅ State updates correctly
6. ✅ No duplicate items
7. ✅ Proper TypeScript types
8. ✅ useReducer for state management

### Testing Scenarios

1. **Move Between Columns**: Drag item from Todo to In Progress → updates correctly
2. **Reorder in Column**: Drag item to different position in same column → reorders
3. **Empty Column**: Drag item to empty column → works correctly
4. **Visual Feedback**: Drag item → see highlighting and placeholders
5. **Multiple Items**: Move several items → all work correctly
6. **Persistence**: Refresh page → state is restored
7. **Add/Delete**: Add new item → delete item → works correctly

## Bonus Challenges

- Add drag handle (only specific area is draggable)
- Implement column reordering
- Add item filtering/search
- Implement item priority/color coding
- Add animations for state changes
- Support touch/mobile drag
- Add keyboard shortcuts (move with arrow keys)
- Implement item archiving
- Add due dates and reminders
- Support sub-tasks
- Add item assignment (avatars)
- Implement undo/redo

## TypeScript Tips

```typescript
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
  | { type: "DELETE_ITEM"; payload: { itemId: string } }
  | {
      type: "REORDER";
      payload: { columnId: string; sourceIndex: number; destIndex: number };
    };

// For drag state
interface DragState {
  draggedItemId: string | null;
  draggedOverColumnId: string | null;
  insertIndex: number | null;
}
```

## Key Concepts

**HTML5 Drag and Drop API**: Browser API for implementing drag-and-drop interactions.

**Key Events**:

- `dragstart`: When drag begins
- `dragover`: While dragging over element
- `drop`: When item is dropped
- `dragend`: When drag operation ends

**Required Setup**:

```typescript
// Make element draggable
<div draggable="true" onDragStart={handleDragStart}>

// Handle drag over (must prevent default!)
<div onDragOver={(e) => { e.preventDefault(); }}>

// Handle drop
<div onDrop={handleDrop}>
```

**DataTransfer**: Object that holds data being dragged

```typescript
e.dataTransfer.setData("itemId", id);
const itemId = e.dataTransfer.getData("itemId");
```

**Why useReducer?**

- Complex state with multiple related values
- Multiple ways to update state (move, reorder, add, delete)
- Ensures state consistency
- Easier to test
- Better for complex logic

**State Management Strategy**:

1. Normalize state (items in object, not arrays)
2. Store item IDs in columns, not full items
3. Use reducer for all state updates
4. Keep drag state separate from data state

## Implementation Hints

1. Use `useReducer` for board state
2. Use `useState` for drag UI state (separate concerns)
3. Set `draggable="true"` on items
4. Always `preventDefault()` in `onDragOver`
5. Use `e.dataTransfer.setData()` to pass item ID
6. Calculate insert index from mouse position
7. Use refs to measure element positions
8. Add visual classes during drag operations
9. Use `localStorage` to persist state
10. Consider using `getBoundingClientRect()` for position calculations

## Drag Over Calculation

```typescript
function calculateInsertIndex(
  e: React.DragEvent,
  columnRef: React.RefObject<HTMLDivElement>
): number {
  if (!columnRef.current) return 0;

  const items = Array.from(columnRef.current.querySelectorAll(".item"));
  const mouseY = e.clientY;

  for (let i = 0; i < items.length; i++) {
    const rect = items[i].getBoundingClientRect();
    if (mouseY < rect.top + rect.height / 2) {
      return i;
    }
  }

  return items.length;
}
```

## Example Reducer

```typescript
function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "MOVE_ITEM": {
      const { itemId, sourceColumnId, destColumnId, destIndex } =
        action.payload;

      // Remove from source
      const sourceColumn = state.columns[sourceColumnId];
      const newSourceItemIds = sourceColumn.itemIds.filter(
        (id) => id !== itemId
      );

      // Add to destination
      const destColumn = state.columns[destColumnId];
      const newDestItemIds = [...destColumn.itemIds];
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
    // ... other cases
  }
}
```

