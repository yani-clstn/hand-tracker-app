# Hand Tracker

An interactive, web-based computer vision application built with **Next.js**, **MediaPipe Tasks Vision**, and **HTML5 Canvas**. The application captures real-time webcam video directly in the browser to perform 21-point hand landmark estimation, real-time pinch gesture detection, dynamic geometric shape warping, and customizable neon glow visual effects.

---

## Features

- **Client-Side Vision Processing:** Zero server latency; all machine learning inference runs locally in the browser using WebAssembly (WASM).
- **Multi-Hand Landmark Tracking:** Simultaneously detects and tracks skeletal joints for up to two hands in real time.
- **Pinch & Distance Detection:** Calculates real-time Euclidean distance between thumb and index fingertips to trigger dynamic visual states.
- **Interactive Geometric Overlay:** Draws animated boundary polygons and curved shapes across multiple hands that react directly to user gestures.
- **Neon Aesthetic:** High-contrast cyberpunk palette (Electric Cyan, Lime Green, Magenta) with dynamic light emissions via WebGL/Canvas rendering.
- **Vercel Ready:** Fully configured for deployment as a static/serverless web app on Vercel.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Computer Vision / ML:** [`@mediapipe/tasks-vision`](https://www.npmjs.com/package/@mediapipe/tasks-vision)
- **Rendering Engine:** HTML5 Canvas 2D API (`CanvasRenderingContext2D`)
- **Media Access:** HTML5 `navigator.mediaDevices.getUserMedia` API

---

## File Structure

```text
src/
├── app/
│   ├── globals.css          # Core CSS reset & canvas layering styles
│   ├── layout.tsx           # Main application root layout
│   └── page.tsx             # Entry page rendering the HandTracker component
├── components/
│   └── HandTracker.tsx      # Main canvas overlay, render loop, and landmark drawing
└── lib/
    ├── handLandmarker.ts    # MediaPipe WASM model initialization helper
    └── useWebcam.ts         # Custom hook for camera permissions and video stream

```

---
## Terminal Setup & Execution Commands

Follow these exact terminal commands step-by-step to set up, build, and run the project locally:

```bash
# 1. Create a new Next.js project with App Router and TypeScript
npx create-next-app@latest hand-tracker-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Navigate into the project directory
cd hand-tracker-app

# 3. Install MediaPipe Vision Tasks package
npm install @mediapipe/tasks-vision

# 4. Start the local development server
npm run dev

---

## Getting Started

### Prerequisites

* **Node.js:** `v18.17.0` or higher
* **Package Manager:** `npm` (v9+) or `yarn` / `pnpm`
* **Webcam:** Integrated or external USB camera

### Installation

1. **Clone the repository:**
```bash
git clone [https://github.com/your-username/hand-tracker-app.git](https://github.com/your-username/hand-tracker-app.git)
cd hand-tracker-app

```


2. **Install dependencies:**
```bash
npm install

```


3. **Run the development server:**
```bash
npm run dev

```


4. Open `http://localhost:3000` in your browser and allow webcam permissions when prompted.

---

> **Note:** HTTPS is required by browser security policies for webcam access (`getUserMedia`). Vercel provides automatic SSL certificates for all deployed apps.

```
