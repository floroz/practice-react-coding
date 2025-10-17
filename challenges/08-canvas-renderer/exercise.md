# Exercise 8: Canvas Rendering Engine

**Difficulty**: Hard  
**Time**: 2-3 hours  
**Concepts**: Canvas API, coordinate transforms, event handling, rendering architecture, layer systems

## Challenge

Build a minimal Photoshop-like rendering engine from scratch using **HTML Canvas**. This exercise focuses on understanding Canvas capabilities, APIs, and limitations compared to alternatives like SVG and WebGL.

Your editor will support three core features:

1. **Add and manipulate text** (position, scale, rotate, color)
2. **Change or blur the background image**
3. **Crop and export** the composition

This is not about producing perfect code quickly — it's about **deeply understanding** how rendering engines work.

---

## Why Canvas?

Before we start, understand what Canvas gives you:

- **Pixel-based rendering**: Draw directly to a bitmap (immediate mode)
- **Full control**: You manually control every pixel
- **Performance**: Hardware-accelerated drawing
- **Export**: Easy PNG/JPG export via `toBlob()`

**Trade-offs vs alternatives:**

| Feature                    | Canvas         | SVG           | WebGL          |
| -------------------------- | -------------- | ------------- | -------------- |
| Rendering                  | Immediate mode | Retained mode | Immediate mode |
| Hit testing                | Manual         | Built-in      | Manual         |
| Scalability                | Rasterized     | Infinite      | Complex        |
| Text selection             | No             | Yes           | No             |
| Learning curve             | Medium         | Easy          | Hard           |
| Performance (many objects) | Good           | Poor          | Excellent      |

---

## Learning Journey

### Phase 1: Foundation (30 minutes)

**Goal**: Create a basic Canvas renderer that loads and displays an image.

#### Expected Outcome

✅ Canvas displays a loaded background image centered at 800x600  
✅ Clicking anywhere on the canvas logs the mouse coordinates to console  
✅ A "Redraw" button clears and re-renders the canvas  
✅ Canvas rendering is clean with no blurriness or distortion

#### Success Checklist

- [ ] Canvas element is mounted and sized correctly (800x600)
- [ ] Background image loads from URL and displays centered
- [ ] Mouse clicks log coordinates relative to canvas (not window)
- [ ] Re-render function clears canvas and redraws everything
- [ ] Canvas pixel ratio matches display (sharp on retina displays)

#### Concepts to Learn

1. **Canvas Setup**: How to create and size a canvas element
2. **Coordinate System**: Canvas uses top-left origin (0,0)
3. **Image Loading**: Images must load before drawing
4. **Render Loop**: The pattern of clear → draw → done

#### Need Help? Code Snippets

**Setting up Canvas with proper sizing:**

```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set canvas size (not CSS size)
  canvas.width = 800;
  canvas.height = 600;

  // Handle retina displays
  const dpr = window.devicePixelRatio || 1;
  canvas.width = 800 * dpr;
  canvas.height = 600 * dpr;
  canvas.style.width = "800px";
  canvas.style.height = "600px";
  ctx.scale(dpr, dpr);
}, []);
```

**Loading and drawing an image:**

```typescript
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // For CORS if needed
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

// Usage in render function
const drawBackground = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
) => {
  const canvasWidth = 800;
  const canvasHeight = 600;

  // Center the image
  const x = (canvasWidth - img.width) / 2;
  const y = (canvasHeight - img.height) / 2;

  ctx.drawImage(img, x, y);
};
```

**Converting mouse coordinates:**

```typescript
const getCanvasCoordinates = (
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};
```

#### Common Pitfalls

❌ **Setting canvas size via CSS only** — this stretches the canvas instead of setting its resolution  
❌ **Drawing before image loads** — use `img.onload` or `await loadImage()`  
❌ **Forgetting to clear canvas** — always call `ctx.clearRect()` before redrawing  
❌ **Ignoring devicePixelRatio** — results in blurry canvas on retina displays

#### Canvas API Quick Reference

```typescript
// Clearing
ctx.clearRect(x, y, width, height); // Clear region

// Drawing images
ctx.drawImage(img, x, y); // Draw at position
ctx.drawImage(img, x, y, width, height); // Draw with size
ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh); // Crop and draw

// Getting context
const ctx = canvas.getContext("2d");
```

---

### Phase 2: Text and Layers (60 minutes)

**Goal**: Implement a layer system with text manipulation (move, select, drag).

#### Expected Outcome

✅ Button adds new text layer saying "Hello Canvas" at cursor position  
✅ Clicking on text selects it and shows a bounding box  
✅ Dragging selected text moves it to a new position  
✅ Multiple text layers can be added and work independently  
✅ Layers render in correct order (background → text layers)

#### Success Checklist

- [ ] "Add Text" button creates a new text layer at clicked position
- [ ] Text renders on canvas with readable styling (24px, white, black stroke)
- [ ] Click detection works — can select text by clicking on it
- [ ] Selected layer shows visual bounding box with handles
- [ ] Mouse drag moves selected text smoothly
- [ ] Multiple text layers maintain independent state
- [ ] Clicking empty space deselects all layers

#### Concepts to Learn

1. **Layer Data Structure**: How to represent layers in state
2. **Hit Testing**: Detecting if a click intersects a layer
3. **Event Handling**: mousedown → mousemove → mouseup pattern
4. **Text Metrics**: Measuring text bounds for hit detection
5. **Draw Order**: Rendering layers from back to front

#### Need Help? Code Snippets

**Layer data structure:**

```typescript
interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  strokeColor: string;
  rotation: number; // in radians
  scale: number;
}

interface EditorState {
  backgroundImage: HTMLImageElement | null;
  textLayers: TextLayer[];
  selectedLayerId: string | null;
}
```

**Drawing text with styling:**

```typescript
const drawTextLayer = (ctx: CanvasRenderingContext2D, layer: TextLayer) => {
  ctx.save(); // Save current state

  // Apply transforms
  ctx.translate(layer.x, layer.y);
  ctx.rotate(layer.rotation);
  ctx.scale(layer.scale, layer.scale);

  // Set text style
  ctx.font = `${layer.fontSize}px Arial`;
  ctx.fillStyle = layer.color;
  ctx.strokeStyle = layer.strokeColor;
  ctx.lineWidth = 2;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  // Draw text
  ctx.strokeText(layer.text, 0, 0);
  ctx.fillText(layer.text, 0, 0);

  ctx.restore(); // Restore previous state
};
```

**Hit testing for text:**

```typescript
const isPointInText = (
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  x: number,
  y: number
): boolean => {
  ctx.font = `${layer.fontSize}px Arial`;
  const metrics = ctx.measureText(layer.text);

  // Approximate text bounds
  const textWidth = metrics.width;
  const textHeight = layer.fontSize;

  // Check if point is in bounding box
  const left = layer.x - textWidth / 2;
  const right = layer.x + textWidth / 2;
  const top = layer.y - textHeight / 2;
  const bottom = layer.y + textHeight / 2;

  return x >= left && x <= right && y >= top && y <= bottom;
};
```

**Mouse drag handling pattern:**

```typescript
const [isDragging, setIsDragging] = useState(false);
const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  const coords = getCanvasCoordinates(e, canvasRef.current!);

  // Find clicked layer (check from top to bottom)
  const clickedLayer = textLayers
    .slice()
    .reverse()
    .find((layer) => isPointInText(ctx, layer, coords.x, coords.y));

  if (clickedLayer) {
    setSelectedLayerId(clickedLayer.id);
    setIsDragging(true);
    setDragStart(coords);
  } else {
    setSelectedLayerId(null);
  }
};

const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
  if (!isDragging || !selectedLayerId) return;

  const coords = getCanvasCoordinates(e, canvasRef.current!);
  const dx = coords.x - dragStart.x;
  const dy = coords.y - dragStart.y;

  // Update layer position
  setTextLayers((layers) =>
    layers.map((layer) =>
      layer.id === selectedLayerId
        ? { ...layer, x: layer.x + dx, y: layer.y + dy }
        : layer
    )
  );

  setDragStart(coords);
};

const handleMouseUp = () => {
  setIsDragging(false);
};
```

**Drawing selection bounding box:**

```typescript
const drawSelectionBox = (ctx: CanvasRenderingContext2D, layer: TextLayer) => {
  ctx.font = `${layer.fontSize}px Arial`;
  const metrics = ctx.measureText(layer.text);

  const width = metrics.width + 20;
  const height = layer.fontSize + 20;

  ctx.save();
  ctx.translate(layer.x, layer.y);
  ctx.rotate(layer.rotation);

  // Draw box
  ctx.strokeStyle = "#00f";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(-width / 2, -height / 2, width, height);

  // Draw corner handles
  ctx.fillStyle = "#00f";
  const handleSize = 8;
  [-1, 1].forEach((dx) => {
    [-1, 1].forEach((dy) => {
      const hx = (dx * width) / 2;
      const hy = (dy * height) / 2;
      ctx.fillRect(
        hx - handleSize / 2,
        hy - handleSize / 2,
        handleSize,
        handleSize
      );
    });
  });

  ctx.restore();
};
```

#### Common Pitfalls

❌ **Not using ctx.save()/restore()** — transforms leak to other layers  
❌ **Wrong hit testing order** — check layers from top to bottom, not bottom to top  
❌ **Forgetting to re-render on state change** — use `useEffect` to trigger redraws  
❌ **Coordinate space confusion** — hit testing must account for transforms  
❌ **Text metrics inaccuracy** — `measureText()` only gives width, height is approximate

#### TypeScript Tips

```typescript
// Generate unique IDs
import { nanoid } from "nanoid"; // or use crypto.randomUUID()

const createTextLayer = (x: number, y: number): TextLayer => ({
  id: nanoid(),
  text: "Hello Canvas",
  x,
  y,
  fontSize: 24,
  color: "#ffffff",
  strokeColor: "#000000",
  rotation: 0,
  scale: 1,
});
```

---

### Phase 3: Editing Tools (60 minutes)

**Goal**: Add background editing, blur filter, crop tool, and PNG export.

#### Expected Outcome

✅ "Change Background" button swaps to a new image URL  
✅ Blur slider (0-20) applies blur filter to background in real-time  
✅ "Crop Mode" shows draggable rectangle overlay  
✅ "Confirm Crop" extracts the region and resizes canvas  
✅ "Export PNG" button downloads the composition as a file  
✅ Text layers render correctly in the exported image

#### Success Checklist

- [ ] Background can be replaced by entering new image URL
- [ ] Blur slider smoothly blurs background (0 = sharp, 20 = very blurry)
- [ ] Crop mode shows semi-transparent overlay with draggable rectangle
- [ ] Cropping maintains aspect ratio and quality
- [ ] Export generates clean PNG with correct content
- [ ] Text layers and effects are preserved in export
- [ ] Cropped export only includes the selected region

#### Concepts to Learn

1. **Canvas Filters**: Using `ctx.filter` for blur and other effects
2. **Crop Logic**: Extracting a region using `drawImage` with 9 parameters
3. **Export Methods**: `toBlob()` vs `toDataURL()` trade-offs
4. **Compositing**: Drawing multiple layers with filters
5. **Performance**: When to cache filtered images

#### Need Help? Code Snippets

**Applying blur filter to background:**

```typescript
const drawBackgroundWithBlur = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  blurAmount: number
) => {
  ctx.save();

  // Apply filter
  ctx.filter = `blur(${blurAmount}px)`;

  // Draw image
  const x = (800 - img.width) / 2;
  const y = (600 - img.height) / 2;
  ctx.drawImage(img, x, y);

  // Reset filter
  ctx.filter = "none";
  ctx.restore();
};
```

**Crop tool with draggable rectangle:**

```typescript
interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

const [cropMode, setCropMode] = useState(false);
const [cropRegion, setCropRegion] = useState<CropRegion>({
  x: 100,
  y: 100,
  width: 600,
  height: 400,
});

const drawCropOverlay = (ctx: CanvasRenderingContext2D, region: CropRegion) => {
  const canvasWidth = 800;
  const canvasHeight = 600;

  // Darken outside area
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Clear crop region
  ctx.clearRect(region.x, region.y, region.width, region.height);

  // Draw crop border
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 5]);
  ctx.strokeRect(region.x, region.y, region.width, region.height);

  // Draw resize handles
  ctx.fillStyle = "#fff";
  const handleSize = 10;
  const positions = [
    { x: region.x, y: region.y }, // Top-left
    { x: region.x + region.width, y: region.y }, // Top-right
    { x: region.x, y: region.y + region.height }, // Bottom-left
    { x: region.x + region.width, y: region.y + region.height }, // Bottom-right
  ];

  positions.forEach((pos) => {
    ctx.fillRect(
      pos.x - handleSize / 2,
      pos.y - handleSize / 2,
      handleSize,
      handleSize
    );
  });

  ctx.restore();
};
```

**Performing the crop:**

```typescript
const performCrop = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  region: CropRegion,
  backgroundImage: HTMLImageElement,
  textLayers: TextLayer[]
) => {
  // Create temporary canvas with crop size
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = region.width;
  tempCanvas.height = region.height;
  const tempCtx = tempCanvas.getContext("2d")!;

  // Draw cropped region
  // This is the key: copy from source canvas to temp canvas
  tempCtx.drawImage(
    canvas,
    region.x,
    region.y,
    region.width,
    region.height, // Source
    0,
    0,
    region.width,
    region.height // Destination
  );

  // Now update main canvas
  canvas.width = region.width;
  canvas.height = region.height;
  ctx.drawImage(tempCanvas, 0, 0);

  // Update layer positions to account for crop
  return textLayers.map((layer) => ({
    ...layer,
    x: layer.x - region.x,
    y: layer.y - region.y,
  }));
};
```

**Exporting to PNG:**

```typescript
const exportAsPNG = (
  canvas: HTMLCanvasElement,
  filename: string = "canvas-export.png"
) => {
  canvas.toBlob((blob) => {
    if (!blob) return;

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  }, "image/png");
};

// Alternative: toDataURL (synchronous but less efficient)
const exportAsDataURL = (canvas: HTMLCanvasElement) => {
  const dataURL = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "canvas-export.png";
  a.click();
};
```

**Handling background image change:**

```typescript
const changeBackground = async (newImageUrl: string) => {
  try {
    const img = await loadImage(newImageUrl);
    setBackgroundImage(img);
  } catch (error) {
    console.error("Failed to load image:", error);
    alert("Failed to load image. Check the URL and CORS settings.");
  }
};
```

#### Common Pitfalls

❌ **Applying filter to entire canvas** — remember to reset `ctx.filter = 'none'`  
❌ **Forgetting CORS headers** — images from other domains may not export  
❌ **Cropping without temp canvas** — can lose data if not careful  
❌ **Not updating layer positions after crop** — text will be in wrong place  
❌ **Heavy blur on large images** — can be slow, consider debouncing slider

#### Performance Tips

```typescript
// Cache blurred background instead of re-blurring every frame
const [cachedBlurredBg, setCachedBlurredBg] =
  useState<HTMLCanvasElement | null>(null);

const createBlurredBackground = (img: HTMLImageElement, blur: number) => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const tempCtx = tempCanvas.getContext("2d")!;

  tempCtx.filter = `blur(${blur}px)`;
  tempCtx.drawImage(img, 0, 0);

  return tempCanvas;
};

// Use debounce for blur slider
import { debounce } from "lodash"; // or implement your own

const debouncedBlur = debounce((value: number) => {
  setBlurAmount(value);
}, 100);
```

#### Canvas API Quick Reference

```typescript
// Filters
ctx.filter = "blur(5px)";
ctx.filter = "brightness(1.2)";
ctx.filter = "contrast(1.5)";
ctx.filter = "grayscale(100%)";

// Export
canvas.toBlob(callback, "image/png", quality);
canvas.toDataURL("image/png");
canvas.toDataURL("image/jpeg", 0.9); // 90% quality

// 9-parameter drawImage (crop source)
ctx.drawImage(
  img,
  sourceX,
  sourceY,
  sourceWidth,
  sourceHeight,
  destX,
  destY,
  destWidth,
  destHeight
);
```

---

### Phase 4: Architecture Refactoring (Bonus Discussion)

**Goal**: Separate concerns into maintainable modules.

#### Expected Outcome

✅ Renderer logic is isolated from React component  
✅ State management uses clear data structures  
✅ Event handlers are separated from render logic  
✅ Easy to add new layer types (shapes, images) or tools (rotate, scale)

#### Success Checklist

- [ ] `CanvasRenderer` class or module handles all drawing
- [ ] React component only manages state and UI
- [ ] Event system is pluggable (can swap mouse/touch/keyboard)
- [ ] Adding a new layer type requires minimal changes
- [ ] Code is testable (can test renderer without React)

#### Architecture Pattern

```typescript
// renderer.ts - Pure Canvas logic
export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clear() {
    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  drawBackground(img: HTMLImageElement, blur: number = 0) {
    // Drawing logic
  }

  drawTextLayer(layer: TextLayer) {
    // Drawing logic
  }

  drawSelectionBox(layer: TextLayer) {
    // Drawing logic
  }

  render(state: EditorState) {
    this.clear();

    if (state.backgroundImage) {
      this.drawBackground(state.backgroundImage, state.blurAmount);
    }

    state.textLayers.forEach(layer => {
      this.drawTextLayer(layer);
    });

    if (state.selectedLayerId) {
      const selectedLayer = state.textLayers.find(
        l => l.id === state.selectedLayerId
      );
      if (selectedLayer) {
        this.drawSelectionBox(selectedLayer);
      }
    }
  }
}

// state.ts - State management
export interface EditorState {
  backgroundImage: HTMLImageElement | null;
  textLayers: TextLayer[];
  selectedLayerId: string | null;
  blurAmount: number;
  cropMode: boolean;
  cropRegion: CropRegion | null;
}

export type EditorAction =
  | { type: 'ADD_TEXT_LAYER'; payload: TextLayer }
  | { type: 'UPDATE_LAYER'; payload: { id: string; changes: Partial<TextLayer> } }
  | { type: 'SELECT_LAYER'; payload: string | null }
  | { type: 'SET_BLUR'; payload: number }
  | { type: 'SET_BACKGROUND'; payload: HTMLImageElement };

export const editorReducer = (
  state: EditorState,
  action: EditorAction
): EditorState => {
  switch (action.type) {
    case 'ADD_TEXT_LAYER':
      return {
        ...state,
        textLayers: [...state.textLayers, action.payload],
      };
    // ... other cases
    default:
      return state;
  }
};

// CanvasRenderer.tsx - React integration
import { useReducer, useEffect, useRef } from 'react';
import { CanvasRenderer } from './renderer';
import { editorReducer, initialState } from './state';

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const [state, dispatch] = useReducer(editorReducer, initialState);

  // Initialize renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    rendererRef.current = new CanvasRenderer(ctx);
  }, []);

  // Render on state change
  useEffect(() => {
    if (!rendererRef.current) return;
    rendererRef.current.render(state);
  }, [state]);

  return (
    <div>
      <canvas ref={canvasRef} />
      {/* UI controls */}
    </div>
  );
}
```

#### Benefits of This Architecture

1. **Testability**: Renderer can be tested without React
2. **Reusability**: Renderer can be used in other frameworks (Vue, Svelte)
3. **Maintainability**: Clear separation of concerns
4. **Extensibility**: Easy to add new layer types or tools
5. **Performance**: Can optimize render logic independently

#### Discussion Questions

- How would you implement undo/redo with this architecture?
- Where would you add a "tools" abstraction (select tool, text tool, crop tool)?
- How would you handle multi-canvas rendering (layers in separate canvases)?
- What would a plugin system look like?

---

### Phase 5: Reflection and Limitations (Bonus Discussion)

**Goal**: Understand when Canvas is the right choice and when it isn't.

#### Canvas Limitations

1. **No Retained Mode**
   - Canvas doesn't remember what you drew
   - You must manually track all objects
   - Every change requires full redraw
   - **Impact**: Complex scenes need careful state management

2. **No Native Text Interaction**
   - Can't select or copy text
   - No native text editing (must build your own input)
   - Accessibility is very limited
   - **Impact**: Text-heavy apps need custom UI

3. **Pixel-Based Rendering**
   - Zooming degrades quality
   - No infinite resolution like SVG
   - Text isn't searchable
   - **Impact**: Not ideal for documents or diagrams

4. **No Built-in Hit Testing**
   - You must manually implement click detection
   - Complex shapes require path tracing
   - Performance degrades with many objects
   - **Impact**: Interactive apps need careful optimization

5. **Poor Accessibility**
   - Screen readers can't access content
   - No semantic structure
   - Keyboard navigation must be custom
   - **Impact**: May violate accessibility requirements

#### Reflection Questions

**Question 1**: What would break if you had 1000+ text layers?

<details>
<summary>Click to think through this</summary>

- Hit testing would be O(n) for every click
- Render time would increase linearly
- Dragging would feel laggy
- Memory usage would grow

**Solutions**:

- Spatial indexing (quadtree, R-tree)
- Layer culling (don't draw offscreen layers)
- Dirty rectangle optimization
- Consider WebGL or a library like PixiJS
</details>

**Question 2**: Why can't you CMD+F to find text in your canvas?

<details>
<summary>Click to think through this</summary>

Canvas is just pixels — the browser doesn't know about the text you drew. Unlike DOM text, which is semantic and searchable, canvas text is rasterized immediately.

This also impacts:

- SEO (search engines can't index it)
- Accessibility (screen readers can't read it)
- Copy/paste (users can't select text)
</details>

**Question 3**: When would you choose Fabric.js over raw Canvas?

<details>
<summary>Click to think through this</summary>

Use Fabric.js when you need:

- Object-oriented layer management (retained mode)
- Built-in transform controls (rotate, scale handles)
- Event system for layers (click, drag, hover)
- Serialization/deserialization
- Rich text editing

Stay with raw Canvas when you need:

- Maximum performance control
- Minimal bundle size
- Custom rendering pipelines
- Learning/educational purposes
</details>

**Question 4**: How would WebGL help with performance?

<details>
<summary>Click to think through this</summary>

WebGL renders via GPU, which excels at:

- Drawing thousands of objects (batching)
- Applying filters/effects in real-time
- Handling large images/textures
- Complex transforms

But WebGL is:

- Much harder to learn
- Overkill for simple use cases
- Requires shader programming
- Less browser-compatible

**When to switch**: If you're hitting performance limits with Canvas (>60fps target, complex filters, 1000+ objects).

</details>

#### When to Use What

**Use Raw Canvas when:**

- Building custom visualizations or games
- Need pixel-perfect control
- Performance is critical and you can optimize manually
- Learning rendering fundamentals

**Use SVG when:**

- Content is mostly vector graphics
- Need infinite zoom/pan
- Text selection/interaction is important
- Accessibility is required

**Use Canvas Libraries (Fabric.js, Konva, Pixie.js) when:**

- Building an editor or design tool
- Need event system and object management
- Want transform controls out of the box
- Time-to-market matters more than bundle size

**Use WebGL (Three.js, PixiJS) when:**

- Need to render thousands of objects
- Complex 3D graphics
- Real-time filters and effects
- Maximum performance is critical

#### Canvas vs Alternatives Comparison

| Requirement           | Canvas       | SVG          | Fabric.js   | PixiJS (WebGL)   |
| --------------------- | ------------ | ------------ | ----------- | ---------------- |
| Render 10,000 objects | ⚠️ Slow      | ❌ Very slow | ⚠️ OK       | ✅ Fast          |
| Text editing          | ❌ Custom    | ✅ Native    | ✅ Built-in | ❌ Custom        |
| Export PNG/JPG        | ✅ Easy      | ⚠️ Convert   | ✅ Easy     | ✅ Easy          |
| Accessibility         | ❌ None      | ✅ Good      | ❌ Limited  | ❌ None          |
| Bundle size           | ✅ 0kb       | ✅ 0kb       | ⚠️ ~300kb   | ⚠️ ~500kb        |
| Learning curve        | ⚠️ Medium    | ✅ Easy      | ⚠️ Medium   | ❌ Hard          |
| Browser support       | ✅ Excellent | ✅ Excellent | ✅ Good     | ⚠️ Good (WebGL2) |

---

## Common Pitfalls Summary

1. **Canvas sizing**: Always set `canvas.width/height`, not just CSS
2. **Coordinate spaces**: Convert mouse events to canvas coordinates
3. **State management**: Canvas doesn't track objects — you must
4. **Transform leaks**: Always use `ctx.save()` and `ctx.restore()`
5. **Hit testing**: Implement carefully, consider bounding boxes first
6. **Performance**: Profile before optimizing, don't guess
7. **CORS**: Use `crossOrigin = 'anonymous'` for external images
8. **Retina displays**: Account for `devicePixelRatio`

---

## Bonus Challenges

Once you've completed all 3 phases, try these:

### Level 1: Enhancements

1. **Undo/Redo**: Implement history with Command pattern
2. **Multiple text styles**: Add font family, weight, size controls
3. **Rotation handles**: Add rotation to transform controls
4. **Scale handles**: Drag corners to resize text
5. **Color picker**: Add UI to change text color
6. **Layer panel**: Show list of all layers with visibility toggles

### Level 2: Advanced Features

7. **Alignment guides**: Show lines when layers align with others
8. **Snapping**: Snap text to grid or other layers
9. **Image layers**: Support adding image layers, not just text
10. **Filters**: Add more filters (brightness, contrast, grayscale)
11. **Opacity**: Add opacity control per layer
12. **Blend modes**: Implement multiply, screen, overlay

### Level 3: Professional Features

13. **Virtual canvas**: Infinite canvas with pan/zoom
14. **Auto-save**: Persist state to localStorage
15. **Keyboard shortcuts**: Implement common shortcuts (Delete, Ctrl+Z, etc.)
16. **Shape layers**: Add rectangles, circles, lines
17. **Path drawing**: Freehand drawing tool
18. **Text wrapping**: Multi-line text with wrapping

### Level 4: Architecture

19. **Plugin system**: Make tools pluggable
20. **Worker thread**: Move heavy operations to Web Worker
21. **WebGL renderer**: Implement alternative WebGL backend
22. **Collaborative editing**: Add real-time collaboration

---

## TypeScript Tips

### Useful Type Definitions

```typescript
// Base layer interface
interface BaseLayer {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  visible: boolean;
}

// Discriminated union for different layer types
type Layer =
  | (BaseLayer & {
      type: "text";
      text: string;
      fontSize: number;
      color: string;
    })
  | (BaseLayer & { type: "image"; image: HTMLImageElement })
  | (BaseLayer & { type: "shape"; shape: "rect" | "circle"; size: number });

// Transform state
interface Transform {
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

// Tool modes
type Tool = "select" | "text" | "crop" | "draw";

// Event handler types
type CanvasMouseHandler = (
  e: React.MouseEvent<HTMLCanvasElement>,
  coords: { x: number; y: number }
) => void;
```

---

## What You'll Learn

By completing this exercise, you will deeply understand:

- **Canvas 2D API**: Core drawing methods, transforms, compositing
- **Rendering Architecture**: How immediate-mode renderers work
- **Event Handling**: Coordinate systems, hit testing, drag behavior
- **State Management**: Tracking complex UI state
- **Performance**: When and how to optimize rendering
- **Trade-offs**: When to use Canvas vs alternatives
- **Real-world Patterns**: How tools like Canva/Figma/Photopea work

---

## Getting Started

1. Start with Phase 1 — get a simple render loop working
2. Don't skip the reflection questions — they're important
3. Use the code snippets as references, not copy-paste solutions
4. Test each feature thoroughly before moving on
5. Ask for help when stuck — this is a hard exercise!

**Remember**: The goal isn't perfect code — it's deep understanding. Take your time and experiment!

---

## Resources

- [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [Canvas 2D Context Specification](https://html.spec.whatwg.org/multipage/canvas.html)
- [Fabric.js Documentation](http://fabricjs.com/)
- [PixiJS Documentation](https://pixijs.com/)
- [HTML Canvas Deep Dive](https://joshondesign.com/p/books/canvasdeepdive/toc.html)

Good luck! 🎨
