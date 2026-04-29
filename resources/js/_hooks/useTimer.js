/**
 * useTimer - Custom hook untuk countdown timer Try Out
 * Mengelola waktu pengerjaan dan auto-submit saat waktu habis
 */

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * @param {number} durasiMenit - durasi timer dalam menit
 * @param {Function} onTimeout - callback saat waktu habis
 * @returns {{ sisaDetik, isRunning, isTimeout, mulai, jeda, reset, formatTimer }}
 */
export function useTimer(durasiMenit, onTimeout) {
  const [sisaDetik, setSisaDetik] = useState(durasiMenit * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const intervalRef = useRef(null);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  }, []);

  const mulai = useCallback(() => {
    if (!isRunning && !isTimeout) {
      setIsRunning(true);
    }
  }, [isRunning, isTimeout]);

  const jeda = useCallback(() => {
    stop();
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setSisaDetik(durasiMenit * 60);
    setIsTimeout(false);
  }, [durasiMenit, stop]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSisaDetik((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsTimeout(true);
            onTimeout?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onTimeout]);

  const formatTimer = (detik) => {
    const m = Math.floor(detik / 60);
    const s = detik % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Warna timer berdasarkan sisa waktu
  const warnaTimer =
    sisaDetik <= 300
      ? "#ef4444"  // merah - kurang 5 menit
      : sisaDetik <= 600
      ? "#f59e0b"  // kuning - kurang 10 menit
      : "#a78bfa"; // ungu normal

  return {
    sisaDetik,
    isRunning,
    isTimeout,
    mulai,
    jeda,
    reset,
    display: formatTimer(sisaDetik),
    warnaTimer,
    persenSisa: (sisaDetik / (durasiMenit * 60)) * 100,
  };
}
