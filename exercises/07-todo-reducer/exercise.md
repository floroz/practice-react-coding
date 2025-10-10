# Exercise 7: Todo App with useReducer

**Difficulty**: Medium-Hard  
**Time**: 40-45 minutes  
**Concepts**: useReducer, complex state logic, TypeScript discriminated unions

## Challenge

Build a feature-rich todo application using `useReducer` instead of `useState`. This tests your understanding of complex state management and when to use reducers over simple state.

## Requirements

1. Implement a todo app with `useReducer` managing all state
2. Todo operations:
   - Add new todo
   - Toggle completion
   - Delete todo
   - Edit todo text
   - Bulk operations (complete all, delete all completed)
3. Filtering:
   - Show all, active, or completed todos
   - Display counts for each filter
4. Sorting:
   - By date added (newest/oldest)
   - By alphabetical order
   - By completion status
5. Persistence:
   - Save to localStorage
   - Load on mount
6. Advanced features:
   - Due dates
   - Priority levels (high, medium, low)
   - Categories/tags

## TypeScript Requirements

- Use discriminated unions for actions
- Proper typing for state shape
- Type-safe reducer function
- Properly typed action creators (optional but recommended)

## Edge Cases to Consider

- Empty todo text
- Editing while filtering
- Deleting the last todo
- Sorting with identical values
- LocalStorage quota exceeded
- Invalid state transitions

## Bonus Challenges

- Undo/Redo functionality (using a history reducer)
- Drag and drop reordering
- Sub-tasks/nested todos
- Search functionality
- Export/Import todos as JSON
- Statistics dashboard (completion rate, etc.)

## Why useReducer?

This exercise demonstrates when `useReducer` is better than `useState`:

- Multiple related state values
- Complex state transitions
- State depends on previous state
- Multiple ways to update the same state
- Easier to test reducer logic in isolation

## Example State Shape

```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: "high" | "medium" | "low";
}

interface State {
  todos: Todo[];
  filter: "all" | "active" | "completed";
  sort: "date-desc" | "date-asc" | "alpha";
}

type Action =
  | { type: "ADD_TODO"; payload: { text: string } }
  | { type: "TOGGLE_TODO"; payload: { id: string } }
  | { type: "DELETE_TODO"; payload: { id: string } };
// ... more actions
```
