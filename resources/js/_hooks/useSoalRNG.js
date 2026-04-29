/**
 * useSoalRNG - Custom hook untuk manajemen soal dengan pengacakan
 * Mengelola state soal, navigasi, dan jawaban selama Try Out
 */

import { useState, useCallback, useMemo } from "react";
import { acakSoalDenganOpsi } from "../utils/rngSoal";

/**
 * @param {Array} soalList - daftar soal yang akan diacak
 * @returns {{ soalTeracak, soalSaat, indexSaat, jawaban, ... }}
 */
export function useSoalRNG(soalList = []) {
  // Acak soal sekali saat hook diinisialisasi
  const soalTeracak = useMemo(
    () => acakSoalDenganOpsi(soalList),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [indexSaat, setIndexSaat] = useState(0);
  const [jawaban, setJawaban] = useState({}); // { soalIndex: opsiId }
  const [flagged, setFlagged] = useState(new Set()); // soal ditandai untuk review
  const [isSelesai, setIsSelesai] = useState(false);

  const soalSaat = soalTeracak[indexSaat];
  const totalSoal = soalTeracak.length;

  const jawabSoal = useCallback((opsiId) => {
    setJawaban((prev) => ({ ...prev, [indexSaat]: opsiId }));
  }, [indexSaat]);

  const hapusJawaban = useCallback(() => {
    setJawaban((prev) => {
      const next = { ...prev };
      delete next[indexSaat];
      return next;
    });
  }, [indexSaat]);

  const next = useCallback(() => {
    if (indexSaat < totalSoal - 1) setIndexSaat((i) => i + 1);
  }, [indexSaat, totalSoal]);

  const prev = useCallback(() => {
    if (indexSaat > 0) setIndexSaat((i) => i - 1);
  }, [indexSaat]);

  const goTo = useCallback((index) => {
    if (index >= 0 && index < totalSoal) setIndexSaat(index);
  }, [totalSoal]);

  const toggleFlag = useCallback(() => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(indexSaat)) next.delete(indexSaat);
      else next.add(indexSaat);
      return next;
    });
  }, [indexSaat]);

  const selesai = useCallback(() => {
    setIsSelesai(true);
  }, []);

  // Statistik
  const jumlahDijawab = Object.keys(jawaban).length;
  const jumlahBelumDijawab = totalSoal - jumlahDijawab;
  const jumlahDiflag = flagged.size;
  const persen = Math.round((jumlahDijawab / totalSoal) * 100);

  return {
    soalTeracak,
    soalSaat,
    indexSaat,
    jawaban,
    flagged,
    isSelesai,
    totalSoal,
    jumlahDijawab,
    jumlahBelumDijawab,
    jumlahDiflag,
    persen,
    jawabSoal,
    hapusJawaban,
    next,
    prev,
    goTo,
    toggleFlag,
    selesai,
    jawabanSoalSaat: jawaban[indexSaat] || null,
    isFlagged: flagged.has(indexSaat),
  };
}
