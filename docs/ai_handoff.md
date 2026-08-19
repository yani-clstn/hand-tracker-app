# AI Handoff & Technical Architecture Document

## Project Context
This document serves as a technical context handoff for subsequent AI collaborators or developers continuing work on the `hand-tracker-app` project.

---

## Core System Architecture & Workflow

1. **Stream Capture (`useWebcam.ts`):** 
   - Requests camera access via `navigator.mediaDevices.getUserMedia()`.
   - Binds the stream to a hidden HTML `<video>` element set to `playsInline` and `muted`.

2. **Model Initialization (`handLandmarker.ts`):**
   - Loads MediaPipe WASM binaries via CDN (`@mediapipe/tasks-vision`).
   - Configures `HandLandmarker` in `LIVE_STREAM` mode running on GPU delegate (`runningMode: "LIVE_STREAM" as any`).

3. **Animation & Detection Loop (`HandTracker.tsx`):**
   - Executes inside a continuous `requestAnimationFrame` loop.
   - Synchronizes canvas resolution (`canvas.width`/`canvas.height`) with active video dimensions.
   - Evaluates frame landmarks using `landmarkerRef.current.detectForVideo(video, performance.now())`.

4. **Gesture Math & Render Pipeline (`HandTracker.tsx`):**
   - **Landmark Coordinates:** Normalized $(0.0 \text{ to } 1.0)$ coords are mapped to pixel bounds ($x \times \text{canvas.width}, y \times \text{canvas.height}$).
   - **Pinch Logic:** Calculates Euclidean distance between landmark `4` (Thumb tip) and landmark `8` (Index tip). Distances $< 0.08$ (relative normalized frame units) toggle pinch active states.
   - **Visual Effects:** Appled via `ctx.shadowColor` and `ctx.shadowBlur` to create emitting glow layers prior to rendering strokes, joints, and multi-hand bounding curves.

---

## Known Constraints & Potential Enhancements

- **Aspect Ratio Scaling:** Currently, video and canvas utilize `objectFit: "cover"`. Precise pixel coordinate mapping requires ensuring the canvas element aspect ratio matches the raw camera video aspect ratio.
- **Gesture Expansion:** The current implementation checks basic pinch states between Thumb and Index finger. Additional gestures (e.g., peace sign, open palm, fist) can be added by comparing relative angles/distances across landmarks `12` (Middle), `16` (Ring), and `20` (Pinky).
- **Performance Optimization:** If lower-end mobile devices experience framerate drops, reduce `ctx.shadowBlur` passes or decrease canvas resolution in `useWebcam.ts`.