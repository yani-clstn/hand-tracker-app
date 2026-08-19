"use client";

import { useEffect, RefObject } from "react";

export function useWebcam(videoRef: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    async function setupCamera() {
      if (!videoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", () => {
          videoRef.current?.play();
        });
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    }

    setupCamera();
  }, [videoRef]);
}