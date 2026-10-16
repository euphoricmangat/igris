"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Multi-signal inputs for Relief height mapping:
 * - window scroll depth → continuous boost
 * - optional mic RMS (explicit opt-in)
 */
export function useReliefSignals() {
  const scrollBoost = useRef(0);
  const audioBoost = useRef(0);
  const [listening, setListening] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollBoost.current = Math.min(1.35, (window.scrollY / max) * 1.35);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!listening) {
      audioBoost.current = 0;
      return;
    }

    let cancelled = false;
    const start = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        if (cancelled) {
          media.getTracks().forEach((t) => t.stop());
          return;
        }
        stream.current = media;
        const ctx = new AudioContext();
        audioCtx.current = ctx;
        const source = ctx.createMediaStreamSource(media);
        const a = ctx.createAnalyser();
        a.fftSize = 256;
        source.connect(a);
        analyser.current = a;
        const data = new Uint8Array(a.frequencyBinCount);

        const tick = () => {
          a.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          audioBoost.current = Math.min(1.6, rms * 4.2);
          raf.current = requestAnimationFrame(tick);
        };
        tick();
      } catch {
        setListening(false);
      }
    };
    void start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf.current);
      stream.current?.getTracks().forEach((t) => t.stop());
      stream.current = null;
      void audioCtx.current?.close();
      audioCtx.current = null;
      analyser.current = null;
      audioBoost.current = 0;
    };
  }, [listening]);

  return {
    scrollBoost,
    audioBoost,
    listening,
    toggleListen: () => setListening((v) => !v),
  };
}
