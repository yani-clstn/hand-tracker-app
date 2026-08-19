"use client";

import { useEffect, useRef } from "react";
import { HandLandmarker } from "@mediapipe/tasks-vision";
import { initializeHandLandmarker } from "@/lib/handLandmarker";
import { useWebcam } from "@/lib/useWebcam";

// Hand Skeleton Connections
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],           // Index finger
  [5, 9], [9, 10], [10, 11], [11, 12],      // Middle finger
  [9, 13], [13, 14], [14, 15], [15, 16],    // Ring finger
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20] // Pinky
];

// Calculate Euclidean distance between two 2D points
function getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export default function HandTracker() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);

  useWebcam(videoRef);

  useEffect(() => {
    let animationFrameId: number;

    async function setupTracker() {
      landmarkerRef.current = await initializeHandLandmarker();

      const renderLoop = () => {
        if (
          videoRef.current &&
          canvasRef.current &&
          landmarkerRef.current &&
          videoRef.current.readyState >= 2
        ) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const results = landmarkerRef.current.detectForVideo(video, performance.now());

          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const landmarks = results.landmarks;

            if (landmarks && landmarks.length > 0) {
              landmarks.forEach((hand, handIndex) => {
                const thumbTip = hand[4];
                const indexTip = hand[8];
                const pinchDist = getDistance(thumbTip, indexTip);
                const isPinching = pinchDist < 0.08;

                // Neon Colors per hand (Hand 0: Electric Cyan / Hand 1: Hot Lime Green)
                const baseColor = handIndex === 0 ? "#00F0FF" : "#39FF14"; 
                const pinchColor = "#FF007F"; // Neon Pink/Magenta on Pinch
                const strokeColor = isPinching ? pinchColor : baseColor;

                // Enable Neon Glow Effect
                ctx.shadowColor = strokeColor;
                ctx.shadowBlur = isPinching ? 20 : 12;

                // 1. Draw Neon Skeleton Bones
                HAND_CONNECTIONS.forEach(([i, j]) => {
                  ctx.beginPath();
                  ctx.moveTo(hand[i].x * canvas.width, hand[i].y * canvas.height);
                  ctx.lineTo(hand[j].x * canvas.width, hand[j].y * canvas.height);
                  ctx.strokeStyle = strokeColor;
                  ctx.lineWidth = isPinching ? 4 : 2;
                  ctx.stroke();
                });

                // 2. Draw Glowing Joint Landmarks
                hand.forEach((point) => {
                  ctx.beginPath();
                  ctx.arc(point.x * canvas.width, point.y * canvas.height, 4, 0, 2 * Math.PI);
                  ctx.fillStyle = "#FFFFFF"; // Bright white core
                  ctx.fill();
                  ctx.strokeStyle = strokeColor;
                  ctx.lineWidth = 1.5;
                  ctx.stroke();
                });

                // 3. Pinch Pulse Ring at Midpoint
                const midX = ((thumbTip.x + indexTip.x) / 2) * canvas.width;
                const midY = ((thumbTip.y + indexTip.y) / 2) * canvas.height;

                ctx.beginPath();
                ctx.arc(midX, midY, isPinching ? 20 : 8, 0, 2 * Math.PI);
                ctx.shadowColor = isPinching ? "#FF007F" : baseColor;
                ctx.shadowBlur = 25;
                ctx.fillStyle = isPinching ? "rgba(255, 0, 127, 0.4)" : "rgba(0, 240, 255, 0.2)";
                ctx.fill();
                ctx.strokeStyle = isPinching ? "#FF007F" : baseColor;
                ctx.lineWidth = 2;
                ctx.stroke();
              });

              // 4. Inter-Hand Bounding Polygon with Neon Gradient Fill
              if (landmarks.length >= 2) {
                const h1 = landmarks[0];
                const h2 = landmarks[1];

                const index1 = h1[8];
                const index2 = h2[8];
                const thumb1 = h1[4];
                const thumb2 = h2[4];

                const pinch1 = getDistance(h1[4], h1[8]) < 0.08;
                const pinch2 = getDistance(h2[4], h2[8]) < 0.08;

                // Create Linear Neon Gradient across the polygon
                const gradient = ctx.createLinearGradient(
                  index1.x * canvas.width,
                  index1.y * canvas.height,
                  index2.x * canvas.width,
                  index2.y * canvas.height
                );

                if (pinch1 && pinch2) {
                  // Dual Pinch: Ultra Neon Magenta to Deep Violet
                  gradient.addColorStop(0, "rgba(255, 0, 127, 0.5)");
                  gradient.addColorStop(1, "rgba(138, 43, 226, 0.5)");
                  ctx.shadowColor = "#FF007F";
                } else if (pinch1 || pinch2) {
                  // Single Pinch: Electric Yellow to Neon Orange
                  gradient.addColorStop(0, "rgba(255, 230, 0, 0.45)");
                  gradient.addColorStop(1, "rgba(255, 100, 0, 0.45)");
                  ctx.shadowColor = "#FFE600";
                } else {
                  // Neutral State: Electric Cyan to Neon Blue
                  gradient.addColorStop(0, "rgba(0, 240, 255, 0.3)");
                  gradient.addColorStop(1, "rgba(111, 0, 255, 0.3)");
                  ctx.shadowColor = "#00F0FF";
                }

                ctx.shadowBlur = 30;

                // Shape Contour
                ctx.beginPath();
                ctx.moveTo(index1.x * canvas.width, index1.y * canvas.height);
                
                // Curve distortion based on wrist distance
                const midDist = (h1[0].y - h2[0].y) * 40;
                ctx.quadraticCurveTo(
                  ((index1.x + index2.x) / 2) * canvas.width,
                  ((index1.y + index2.y) / 2) * canvas.height + midDist,
                  index2.x * canvas.width,
                  index2.y * canvas.height
                );

                ctx.lineTo(thumb2.x * canvas.width, thumb2.y * canvas.height);
                ctx.lineTo(thumb1.x * canvas.width, thumb1.y * canvas.height);
                ctx.closePath();

                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.stroke();
              }
            }
          }
        }
        animationFrameId = requestAnimationFrame(renderLoop);
      };

      renderLoop();
    }

    setupTracker();

    return () => {
      cancelAnimationFrame(animationFrameId);
      landmarkerRef.current?.close();
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", backgroundColor: "#050505" }}>
      <video
        ref={videoRef}
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}