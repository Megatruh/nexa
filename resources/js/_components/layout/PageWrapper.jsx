/**
 * PageWrapper - Wrapper halaman dengan background dan Navbar/Footer
 * Menyediakan background bintang-bintang dan layout konsisten
 */

import React, { useMemo } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

// Komponen bintang-bintang di background
function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }, []);

  return (
    <div className="stars-bg">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            "--duration": `${star.duration}s`,
            "--delay": `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function PageWrapper({ children, hideFooter = false, fullWidth = false }) {
  return (
    <div className="nexa-bg min-h-screen">
      <StarField />
      <Navbar />
      <main className={`page-content ${fullWidth ? "" : "max-w-6xl mx-auto px-4 md:px-6"} py-8`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

/**
 * Khusus untuk halaman Try Out (full screen, tanpa footer)
 */
export function TryOutWrapper({ children }) {
  return (
    <div className="nexa-bg min-h-screen">
      <StarField />
      <div className="page-content">{children}</div>
    </div>
  );
}
