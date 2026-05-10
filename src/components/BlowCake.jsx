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
      <div className="w-full max-w-sm bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl p-6 text-center border border-white/40">
        {/* Heading */}
        <h2
          className="font-bold mb-2"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: "#ff0000",
            fontSize: "clamp(1.5rem, 6vw, 2.2rem)",
          }}
        >
          Here is my cake for you 🎂
        </h2>
        <p
          className="mb-6"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            color: "#ff0000",
            fontSize: "clamp(0.9rem, 3.5vw, 1.2rem)",
          }}
        >
          Blow out the candle baby! 🤩
        </p>

        {/* Cake – all sizes relative to container width */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-full max-w-[280px] mx-auto">
            {/* Candle group */}
            <div className="flex justify-center gap-3 mb-1">
              {candles.map((lit, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <Flame lit={lit} />
                  <div className="w-2 h-8 sm:h-10 bg-pink-400 rounded-sm shadow-sm" />
                </div>
              ))}
            </div>

            {/* Cake layers – widths as percentages of the container */}
            <div className="w-4/5 h-10 bg-amber-900 rounded-t-lg mx-auto shadow-inner" />
            <div className="w-[88%] h-3 bg-white rounded-lg mx-auto -mt-1 shadow" />
            <div className="w-[95%] h-10 bg-amber-800 mx-auto shadow-inner" />
            <div className="w-full h-3 bg-white rounded-lg mx-auto -mt-1 shadow" />
            <div className="w-full h-10 bg-amber-900 rounded-b-lg mx-auto shadow-inner" />
            <div className="w-[110%] h-2 bg-gray-300 rounded-full mx-auto mt-1 shadow-lg" />
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
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
            }}
          >
            {micRequested ? "🔊 Listening... Blow now!" : "Tap to Blow"}
          </button>
        ) : (
          <p
            className="text-red-600 font-bold"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
            }}
          >
            🎉 You did it! Happy Birthday!
          </p>
        )}
      </div>
    </div>
  );
}
