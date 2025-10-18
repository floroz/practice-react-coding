import { useState } from "react";
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
  if (!isOpen) return null;

  // TODO: Implement portal rendering
  // TODO: Implement focus trap
  // TODO: Implement ESC key handler
  // TODO: Implement click outside handler
  // TODO: Prevent body scroll
  // TODO: Add ARIA attributes

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        {title && (
          <div className={styles.header}>
            <h2>{title}</h2>
            <button onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export default function ModalManager() {
  const [modal1Open, setModal1Open] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);

  return (
    <div className={styles.container}>
      <h2>Modal Manager with Portals</h2>
      <p className={styles.subtitle}>
        Test focus trapping, keyboard navigation, and stacked modals
      </p>

      <div className={styles.buttons}>
        <button onClick={() => setModal1Open(true)} className={styles.button}>
          Open Modal 1
        </button>
        <button onClick={() => setModal2Open(true)} className={styles.button}>
          Open Modal 2
        </button>
        <button onClick={() => setModal3Open(true)} className={styles.button}>
          Open Modal 3
        </button>
      </div>

      <Modal
        isOpen={modal1Open}
        onClose={() => setModal1Open(false)}
        title="First Modal"
      >
        <p>This is the first modal. Try pressing ESC or clicking outside!</p>
        <button onClick={() => setModal1Open(false)}>Close</button>
      </Modal>

      <Modal
        isOpen={modal2Open}
        onClose={() => setModal2Open(false)}
        title="Second Modal"
      >
        <p>This modal can open another modal (nested).</p>
        <button onClick={() => setModal3Open(true)}>Open Modal 3</button>
        <button onClick={() => setModal2Open(false)}>Close</button>
      </Modal>

      <Modal
        isOpen={modal3Open}
        onClose={() => setModal3Open(false)}
        title="Third Modal"
      >
        <p>This is a nested modal! ESC should close this one first.</p>
        <input type="text" placeholder="Focus test" />
        <button onClick={() => setModal3Open(false)}>Close</button>
      </Modal>
    </div>
  );
}

