# Exercise 1: Counter with Undo/Redo

**Difficulty**: Easy  
**Time**: 15-20 minutes  
**Concepts**: useState, basic state management, array operations

## Challenge

Build a counter component that supports increment, decrement, and undo/redo functionality. This tests your understanding of state management and how to maintain a history of state changes.

## Requirements

1. Display the current counter value starting at 0
2. Implement three buttons:
   - **Increment** (+1)
   - **Decrement** (-1)
   - **Undo** (revert to previous state)
   - **Redo** (go forward in history after undo)
3. Disable the Undo button when there's no history
4. Disable the Redo button when there's nothing to redo
5. After a new action (increment/decrement), clear the redo history

## Edge Cases to Consider

- What happens when you undo all the way to the beginning?
- What happens when you perform an action after undoing?
- Should the initial state be part of the history?

## Bonus Challenges

- Add a "Reset" button that clears all history and returns to 0
- Display the history as a list showing all previous values
- Add keyboard shortcuts (e.g., Ctrl+Z for undo, Ctrl+Y for redo)

## TypeScript Tips

Consider creating an interface for your state structure that tracks both the current value and the history.

