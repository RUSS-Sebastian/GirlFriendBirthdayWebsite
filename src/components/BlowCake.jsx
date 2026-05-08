import { useState, useCallback, useRef, useEffect } from "react";
import gsap from "gsap";

// ---------- Blow detection hook (inline for convenience) ----------
function useBlowDetector(isActive, onBlow) {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const blowDetectedRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;

    let cancelled = false;

    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const detect = () => {
          if (cancelled) return;
          analyser.getByteTimeDomainData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const normalized = (dataArray[i] - 128) / 128;
            sum += normalized * normalized;
          }
          const rms = Math.sqrt(sum / dataArray.length);

          if (rms > 0.35 && !blowDetectedRef.current) {
            blowDetectedRef.current = true;
            onBlow();
            setTimeout(() => {
              blowDetectedRef.current = false;
            }, 800);
          }

          animationFrameRef.current = requestAnimationFrame(detect);
        };
        detect();
      } catch (err) {
        console.warn("Microphone access denied");
      }
    };

    startMic();

    return () => {
      cancelled = true;
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (streamRef.current)
        streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, [isActive, onBlow]);
}

// ---------- Flame component ----------
function Flame({ lit }) {
  if (!lit) return null;
  return (
    <div
      className="absolute -top-4 left-1/2 -translate-x-1/2 w-2.5 h-4 bg-yellow-400 rounded-full animate-flicker"
      style={{ boxShadow: "0 0 10px #ff6600, 0 0 20px #ff8800" }}
    />
  );
}

// ---------- Main component ----------
export default function BlowCake() {
  const [candles, setCandles] = useState([true, true, true]);
  const [allOut, setAllOut] = useState(false);
  const [micRequested, setMicRequested] = useState(false);

  const handleBlow = useCallback(() => {
    setCandles((prev) => {
      const next = [...prev];
      const idx = next.findIndex((lit) => lit);
      if (idx !== -1) {
        next[idx] = false;
        return next;
      }
      setAllOut(true);
      return next;
    });
  }, []);

  // Activate mic only after user clicks the button
  useBlowDetector(micRequested && !allOut, handleBlow);

  const allCandlesOut = !candles.some((lit) => lit);

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "#FFFDD0" }}
    >
      <div className="max-w-md w-full bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center border border-white/40">
        {/* Heading */}
        <h2
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ fontFamily: "'Montserrat', sans-serif", color: "#ff0000" }}
        >
          Here is my cake for you 🎂
        </h2>
        <p
          className="text-lg sm:text-xl text-pink-600 mb-6"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
        >
          Blow out the candle baby! 🤩
        </p>

        {/* Cake */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {/* Candle group */}
            <div className="flex justify-center gap-4 mb-1">
              {candles.map((lit, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <Flame lit={lit} />
                  <div className="w-2 h-10 bg-pink-400 rounded-sm shadow-sm" />
                </div>
              ))}
            </div>

            {/* Top layer (small) */}
            <div className="w-32 h-10 bg-amber-900 rounded-t-lg mx-auto shadow-inner" />
            {/* Cream layer */}
            <div className="w-36 h-3 bg-white rounded-lg mx-auto -mt-1 shadow" />
            {/* Middle layer */}
            <div className="w-40 h-10 bg-amber-800 mx-auto shadow-inner" />
            {/* Cream layer */}
            <div className="w-44 h-3 bg-white rounded-lg mx-auto -mt-1 shadow" />
            {/* Bottom layer */}
            <div className="w-48 h-10 bg-amber-900 rounded-b-lg mx-auto shadow-inner" />
            {/* Plate */}
            <div className="w-56 h-2 bg-gray-300 rounded-full mx-auto mt-1 shadow-lg" />
          </div>
        </div>

        {/* Blow button */}
        {!allOut ? (
          <button
            onClick={() => setMicRequested(true)}
            disabled={micRequested && allCandlesOut}
            className="px-8 py-3 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "1.1rem",
            }}
          >
            {micRequested ? "🔊 Listening... Blow now!" : "Tap to Blow"}
          </button>
        ) : (
          <p
            className="text-red-600 font-bold text-xl"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            🎉 You did it! Happy Birthday!
          </p>
        )}
      </div>
    </div>
  );
}
