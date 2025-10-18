import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./ModalManager.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
  closeOnEsc = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Focus first focusable element in modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    return () => {
      // Restore body scroll
      document.body.style.overflow = "";

      // Return focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEsc, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {title && (
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );

  // Render into portal
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    // Create modal root if it doesn't exist
    const root = document.createElement("div");
    root.id = "modal-root";
    document.body.appendChild(root);
    return createPortal(modalContent, root);
  }

  return createPortal(modalContent, modalRoot);
}

export default function ModalManager() {
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <h2>Modal Manager with Portals</h2>
        <p className={styles.subtitle}>
          Test focus trapping, keyboard navigation, and stacked modals
        </p>
      </header>

      <div className={styles.instructions}>
        <h3>Try these interactions:</h3>
        <ul>
          <li>
            Press <kbd>ESC</kbd> to close modal
          </li>
          <li>Click outside modal to close</li>
          <li>
            Use <kbd>Tab</kbd> to cycle through focusable elements
          </li>
          <li>Open multiple modals to test stacking</li>
        </ul>
      </div>

      <div className={styles.buttons}>
        <button onClick={() => setModal1Open(true)} className={styles.button}>
          Open Info Modal
        </button>
        <button onClick={() => setModal2Open(true)} className={styles.button}>
          Open Form Modal
        </button>
        <button onClick={() => setModal3Open(true)} className={styles.button}>
          Open Nested Modal
        </button>
      </div>

      <Modal
        isOpen={modal1Open}
        onClose={() => setModal1Open(false)}
        title="Information Modal"
      >
        <p>This is a basic modal with information.</p>
        <p>You can press ESC or click outside to close it.</p>
        <div className={styles.modalActions}>
          <button
            onClick={() => setModal1Open(false)}
            className={styles.primaryButton}
          >
            Got it!
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modal2Open}
        onClose={() => setModal2Open(false)}
        title="Form Modal"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              placeholder="Your message..."
              className={styles.textarea}
              rows={4}
            />
          </div>
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={() => setModal2Open(false)}
              className={styles.secondaryButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton}>
              Submit
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={modal3Open}
        onClose={() => setModal3Open(false)}
        title="Nested Modal Demo"
      >
        <p>This modal demonstrates nested modal behavior.</p>
        <p>Click the button below to open another modal on top of this one.</p>
        <div className={styles.modalActions}>
          <button
            onClick={() => setModal1Open(true)}
            className={styles.primaryButton}
          >
            Open Another Modal
          </button>
          <button
            onClick={() => setModal3Open(false)}
            className={styles.secondaryButton}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

