import { useRef, useEffect, useState } from "react";
import styles from "./CanvasRenderer.module.css";

export default function CanvasRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // TODO: Phase 1 - Set up state for background image
  // Example: const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);

  // TODO: Phase 2 - Set up state for text layers
  // Example: const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  // Example: const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // TODO: Phase 3 - Set up state for blur and crop
  // Example: const [blurAmount, setBlurAmount] = useState(0);
  // Example: const [cropMode, setCropMode] = useState(false);

  // TODO: Phase 1 - Initialize canvas and load initial background image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // TODO: Set canvas size (800x600)
    // TODO: Handle devicePixelRatio for retina displays
    // TODO: Load a default background image
  }, []);

  // TODO: Phase 1 - Create render function
  // This function should clear the canvas and redraw everything
  // const render = () => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas?.getContext('2d');
  //   if (!canvas || !ctx) return;
  //
  //   // Clear canvas
  //   // Draw background image
  //   // Draw text layers (Phase 2)
  //   // Draw selection box (Phase 2)
  //   // Draw crop overlay (Phase 3)
  // };

  // TODO: Phase 1 - Set up effect to re-render when state changes
  // useEffect(() => {
  //   render();
  // }, [backgroundImage, textLayers, selectedLayerId, blurAmount, cropMode]);

  // TODO: Phase 2 - Mouse event handlers for layer manipulation
  // const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {};
  // const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {};
  // const handleMouseUp = () => {};

  // TODO: Phase 2 - Function to add text layer
  // const addTextLayer = (x: number, y: number) => {};

  // TODO: Phase 3 - Function to change background
  // const changeBackground = async (url: string) => {};

  // TODO: Phase 3 - Function to export canvas as PNG
  // const exportAsPNG = () => {};

  // TODO: Phase 3 - Function to perform crop
  // const performCrop = () => {};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Canvas Renderer</h1>
        <p>Build a minimal Photoshop-like editor</p>
      </div>

      <div className={styles.workspace}>
        {/* Canvas */}
        <div className={styles.canvasWrapper}>
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            // TODO: Phase 2 - Add mouse event handlers
            // onClick={handleClick}
            // onMouseDown={handleMouseDown}
            // onMouseMove={handleMouseMove}
            // onMouseUp={handleMouseUp}
          />
        </div>

        {/* Controls Panel */}
        <div className={styles.controls}>
          <div className={styles.section}>
            <h3>Phase 1: Foundation</h3>
            <button className={styles.button}>Load Test Image</button>
            <button className={styles.button}>Redraw Canvas</button>
          </div>

          <div className={styles.section}>
            <h3>Phase 2: Text & Layers</h3>
            <button className={styles.button}>Add Text Layer</button>
            <p className={styles.hint}>
              Click canvas to add text at that position
            </p>
          </div>

          <div className={styles.section}>
            <h3>Phase 3: Editing Tools</h3>
            <div className={styles.inputGroup}>
              <label>Background URL:</label>
              <input
                type="text"
                className={styles.input}
                placeholder="https://example.com/image.jpg"
              />
              <button className={styles.button}>Change Background</button>
            </div>

            <div className={styles.inputGroup}>
              <label>Blur: 0</label>
              <input
                type="range"
                min="0"
                max="20"
                defaultValue="0"
                className={styles.slider}
              />
            </div>

            <button className={styles.button}>Toggle Crop Mode</button>
            <button className={styles.button}>Confirm Crop</button>
            <button className={styles.button}>Export PNG</button>
          </div>

          <div className={styles.section}>
            <h3>Debug Info</h3>
            <div className={styles.debug}>
              <p>Selected Layer: None</p>
              <p>Total Layers: 0</p>
              <p>Canvas Size: 800x600</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
