// --- GlobalLoader Component ---
// Global loading indicator with progress bar

import React, { useEffect, useState } from 'react';

const GlobalLoader = ({ isLoading = false, progress = null }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Simulated progress if not provided
      if (progress === null) {
        const interval = setInterval(() => {
          setWidth((prev) => {
            if (prev >= 90) return prev;
            return prev + Math.random() * 10;
          });
        }, 200);
        return () => clearInterval(interval);
      }
      // Controlled progress handled separately
    } else {
      // Complete animation
      setWidth(100);
      const timeout = setTimeout(() => setWidth(0), 400);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  // Handle controlled progress separately to avoid setState in effect warning
  useEffect(() => {
    if (isLoading && progress !== null) {
      setWidth(progress);
    }
  }, [progress, isLoading]);

  if (!isLoading && width === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-transparent z-tooltip"
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-busy={isLoading}
    >
      <div
        className="h-full bg-primary-500 transition-all duration-300 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default GlobalLoader;
