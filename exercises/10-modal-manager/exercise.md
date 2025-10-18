# Exercise 10: Modal Manager with Portals

**Difficulty**: Medium  
**Time**: 30-35 minutes  
**Concepts**: React Portals, focus management, accessibility, keyboard navigation

## Challenge

Create a flexible modal system using React Portals that handles multiple stacked modals, focus trapping, keyboard navigation, and proper accessibility. This is a common real-world component that tests your understanding of DOM manipulation, event handling, and a11y best practices.

## Requirements

### Part 1: Portal Setup

1. Create a modal container in the HTML body
2. Use `ReactDOM.createPortal` to render modals
3. Ensure modals render outside the React root
4. Support multiple modal instances

### Part 2: Modal Component

1. Create a reusable Modal component with:
   - Backdrop (overlay)
   - Content container
   - Close button
   - Title (optional)
   - Footer (optional)
2. Accept children for modal content
3. Control visibility with `isOpen` prop

### Part 3: Keyboard Navigation

1. Close modal on ESC key press
2. Trap focus within modal (Tab cycles through focusable elements)
3. Return focus to trigger element on close
4. Handle Shift+Tab for reverse navigation

### Part 4: Click Outside to Close

1. Detect clicks on backdrop
2. Close modal when clicking outside content
3. Prevent closing when clicking inside modal

### Part 5: Accessibility (a11y)

1. Add proper ARIA attributes:
   - `role="dialog"`
   - `aria-modal="true"`
   - `aria-labelledby` for title
   - `aria-describedby` for description
2. Announce modal to screen readers
3. Prevent body scroll when modal is open
4. Manage focus appropriately

### Part 6: Modal Manager

1. Support multiple modals simultaneously
2. Stack modals correctly (z-index)
3. Handle ESC key for topmost modal only
4. Render demo with multiple modal triggers

## Edge Cases to Consider

- What happens if user opens multiple modals?
- How do you handle nested modals?
- What if the modal container doesn't exist yet?
- How do you prevent body scroll on mobile?
- What about focus on elements that get removed?
- How do you handle very long modal content?
- What about animations entering/exiting?

## Validation

Your solution should:

1. ✅ Render modal outside React root (using Portal)
2. ✅ Close on ESC key press
3. ✅ Close on backdrop click
4. ✅ Trap focus within modal
5. ✅ Prevent body scroll when open
6. ✅ Return focus to trigger on close
7. ✅ Have proper ARIA attributes
8. ✅ Support multiple stacked modals
9. ✅ Be keyboard navigable

### Testing Scenarios

1. **Basic Open/Close**: Click button → modal opens → ESC → modal closes
2. **Click Outside**: Open modal → click backdrop → modal closes
3. **Focus Trap**: Open modal → Tab through elements → focus stays in modal
4. **Multiple Modals**: Open modal 1 → open modal 2 → ESC closes modal 2 only
5. **Body Scroll**: Open modal → try scrolling page → page doesn't scroll
6. **Focus Return**: Focus button → open modal → close → focus returns to button
7. **Keyboard Only**: Navigate and interact using only keyboard

## Bonus Challenges

- Add enter/exit animations with CSS transitions
- Implement different modal sizes (small, medium, large, fullscreen)
- Add confirm/cancel callbacks
- Create a `useModal` custom hook
- Support nested modals (modal opens another modal)
- Add swipe-to-close on mobile
- Implement draggable modal
- Add maximize/minimize functionality
- Create different modal variants (alert, confirm, prompt)
- Add transition animations based on open direction

## TypeScript Tips

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  size?: "small" | "medium" | "large";
}

// For focus trap
interface FocusableElement extends HTMLElement {
  disabled?: boolean;
  tabIndex?: number;
}

// For modal manager
interface ModalInstance {
  id: string;
  zIndex: number;
  onClose: () => void;
}
```

## Key Concepts

**React Portals**: Render children into a DOM node outside the parent component's DOM hierarchy. Essential for modals, tooltips, and dropdowns.

**Focus Trap**: Keep keyboard focus within the modal. Users shouldn't be able to Tab to elements behind the modal.

**Focus Management**:

1. Save reference to active element before opening
2. Move focus to first focusable element in modal
3. Trap focus with Tab/Shift+Tab
4. Return focus on close

**Body Scroll Lock**: Prevent page scrolling when modal is open:

```css
body.modal-open {
  overflow: hidden;
}
```

**Accessibility Considerations**:

- Screen readers should announce the modal
- Users should know the modal purpose (title)
- All interactive elements should be keyboard accessible
- Clear focus indicators
- Proper semantic HTML

**When to Use Portals**:

- Modals/dialogs
- Tooltips
- Dropdowns
- Notifications/toasts
- Popovers

## Implementation Hints

1. Create portal root: `document.getElementById('modal-root')`
2. Use `useEffect` to add/remove body class for scroll lock
3. Query focusable elements: `querySelectorAll('button, a, input, textarea, select, [tabindex]')`
4. Use `useRef` to store previous focus element
5. Add event listeners for ESC and click outside
6. Clean up event listeners in `useEffect` return
7. For stacking, use context or state management
8. Consider using `useCallback` for event handlers

## Example Usage

```typescript
function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Example Modal"
      >
        <p>This is modal content!</p>
        <button onClick={() => setIsOpen(false)}>
          Close
        </button>
      </Modal>
    </>
  );
}
```

