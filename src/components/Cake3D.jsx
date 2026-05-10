import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Preload the model
useGLTF.preload("/models/strawberry_cake.glb");

/* ==========================
   Microphone blow detector
   ========================== */
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

/* ==========================
   Bright custom flame
   ========================== */
function Flame({ position, lit }) {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current && lit) {
      const s = 0.8 + Math.sin(clock.elapsedTime * 20 + position[0]) * 0.2;
      meshRef.current.scale.setScalar(s);
      if (lightRef.current) lightRef.current.intensity = s * 0.7;
    }
  });

  if (!lit) return null;

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color="#ff3300" />
      </mesh>
      <pointLight
        ref={lightRef}
        intensity={0.8}
        distance={2.5}
        color="#ff4400"
      />
    </group>
  );
}

/* ==========================
   3D cake scene
   ========================== */
function CakeScene({ candlesLit, setCandlesLit, micRequested }) {
  const { scene } = useGLTF("/models/strawberry_cake.glb");
  const flameNames = [
    "pCone1_orange_fire_0",
    "pCone2_orange_fire_0",
    "pCone3_orange_fire_0",
    "pCone4_orange_fire_0",
    "pCone5_orange_fire_0",
    "pCone6_orange_fire_0",
    "pCone7_orange_fire_0",
    "pCone8_orange_fire_0",
  ];

  const [flamePositions, setFlamePositions] = useState([]);

  useEffect(() => {
    const positions = flameNames
      .map((name) => {
        const obj = scene.getObjectByName(name);
        if (obj) {
          obj.visible = false;
          const pos = new THREE.Vector3();
          obj.getWorldPosition(pos);
          return pos.toArray();
        }
        return null;
      })
      .filter(Boolean);
    setFlamePositions(positions);
  }, [scene]);

  const handleBlow = useCallback(() => {
    setCandlesLit(new Array(flamePositions.length).fill(false));
  }, [flamePositions.length, setCandlesLit]);

  useBlowDetector(micRequested && candlesLit.some((lit) => lit), handleBlow);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.5} />

      <group scale={60} position={[0, -1.2, 0]} rotation={[0, Math.PI / 8, 0]}>
        <primitive object={scene} />
      </group>

      {flamePositions.map((pos, i) => (
        <Flame key={i} position={pos} lit={candlesLit[i]} />
      ))}
    </>
  );
}

/* ==========================
   Celebration effects (with onComplete tracking)
   ========================== */
function useCelebration(containerRef, active, onComplete) {
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!active || hasStarted.current) return;
    hasStarted.current = true;

    const container = containerRef.current;
    if (!container) return;

    let maxTime = 0;
    const track = (delay, duration, repeats = 0) => {
      const total = delay + duration * (repeats + 1);
      maxTime = Math.max(maxTime, total);
    };

    // Balloons
    for (let i = 0; i < 25; i++) {
      const balloon = document.createElement("div");
      balloon.textContent = "🎈";
      balloon.style.position = "absolute";
      balloon.style.fontSize = `${3 + Math.random() * 4}rem`;
      balloon.style.left = `${Math.random() * 100}%`;
      balloon.style.bottom = `-${5 + Math.random() * 10}%`;
      balloon.style.opacity = 0;
      container.appendChild(balloon);

      const delay = Math.random() * 0.8;
      const duration = 3.5 + Math.random() * 2.5;
      const repeat = 1;
      track(delay, duration, repeat);

      gsap.fromTo(
        balloon,
        { y: "0%", opacity: 0, rotation: Math.random() * 40 - 20 },
        {
          y: "-120vh",
          opacity: 1,
          duration,
          ease: "power1.out",
          delay,
          rotation: Math.random() * 40 - 20,
          repeat,
          yoyo: false,
          onComplete: () => balloon.remove(),
        },
      );
    }

    // Hearts
    for (let i = 0; i < 20; i++) {
      const heart = document.createElement("div");
      heart.textContent = ["❤️", "💕", "💗", "💖", "💘", "💝"][
        Math.floor(Math.random() * 6)
      ];
      heart.style.position = "absolute";
      heart.style.fontSize = `${2.5 + Math.random() * 3}rem`;
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.bottom = `-${5 + Math.random() * 10}%`;
      heart.style.opacity = 0;
      container.appendChild(heart);

      const delay = Math.random() * 0.5;
      const duration = 2.5 + Math.random() * 2;
      track(delay, duration);

      gsap.fromTo(
        heart,
        { y: "0%", opacity: 0, scale: 0.5, rotation: 0 },
        {
          y: "-110vh",
          opacity: 1,
          scale: 1 + Math.random(),
          rotation: Math.random() * 60 - 30,
          duration,
          ease: "back.out(1.4)",
          delay,
          onComplete: () => heart.remove(),
        },
      );
    }

    // Stars / sparkles
    for (let i = 0; i < 30; i++) {
      const star = document.createElement("div");
      star.textContent = ["✨", "🌟", "⭐", "💫"][
        Math.floor(Math.random() * 4)
      ];
      star.style.position = "absolute";
      star.style.fontSize = `${1.5 + Math.random() * 2.5}rem`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${50 + Math.random() * 30}%`;
      star.style.opacity = 0;
      container.appendChild(star);

      const delay = Math.random() * 0.7;
      const duration = 1.8 + Math.random() * 1.5;
      track(delay, duration);

      gsap.fromTo(
        star,
        { opacity: 0, scale: 0, y: 0, x: 0 },
        {
          opacity: 1,
          scale: 1 + Math.random(),
          y: -(100 + Math.random() * 60),
          x: (Math.random() - 0.5) * 100,
          duration,
          ease: "power2.out",
          delay,
          onComplete: () => star.remove(),
        },
      );
    }

    // Streamers
    for (let i = 0; i < 15; i++) {
      const streamer = document.createElement("div");
      streamer.style.position = "absolute";
      streamer.style.width = `${6 + Math.random() * 12}px`;
      streamer.style.height = `${40 + Math.random() * 60}px`;
      streamer.style.background = `hsl(${Math.random() * 360}, 80%, 65%)`;
      streamer.style.borderRadius = "10px";
      streamer.style.left = `${Math.random() * 100}%`;
      streamer.style.top = `-10%`;
      streamer.style.opacity = 0.9;
      streamer.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
      container.appendChild(streamer);

      const delay = Math.random() * 1.2;
      const duration = 3 + Math.random() * 4;
      track(delay, duration);

      gsap.fromTo(
        streamer,
        { y: -200, opacity: 0, rotation: 0 },
        {
          y: window.innerHeight + 200,
          opacity: 1,
          rotation: Math.random() * 360,
          duration,
          ease: "power1.inOut",
          delay,
          onComplete: () => streamer.remove(),
        },
      );
    }

    // Confetti
    const colors = [
      "#ff0000",
      "#ffdd00",
      "#ff00aa",
      "#ff8800",
      "#00ffcc",
      "#ff44aa",
      "#ffaa00",
      "#66ffcc",
      "#ff66cc",
    ];
    for (let i = 0; i < 80; i++) {
      const dot = document.createElement("div");
      dot.style.position = "absolute";
      dot.style.width = `${5 + Math.random() * 10}px`;
      dot.style.height = `${5 + Math.random() * 10}px`;
      dot.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      dot.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `-${5 + Math.random() * 15}%`;
      dot.style.opacity = 0;
      container.appendChild(dot);

      const delay = Math.random() * 0.5;
      const duration = 2.5 + Math.random() * 3;
      track(delay, duration);

      gsap.fromTo(
        dot,
        { y: 0, opacity: 1, x: 0, rotation: 0 },
        {
          y: window.innerHeight + 100,
          opacity: 0,
          x: (Math.random() - 0.5) * 300,
          rotation: Math.random() * 720 - 360,
          duration,
          ease: "power1.in",
          delay,
          onComplete: () => dot.remove(),
        },
      );
    }

    // Trigger onComplete after the longest animation finishes
    const timeout = setTimeout(
      () => {
        if (onComplete) onComplete();
      },
      maxTime * 1000 + 500,
    );

    return () => clearTimeout(timeout);
  }, [active, containerRef, onComplete]);
}

/* ==========================
   Main Cake3D component
   (now receives onNext prop)
   ========================== */
export default function Cake3D({ onNext }) {
  const [candlesLit, setCandlesLit] = useState(Array(8).fill(true));
  const [micRequested, setMicRequested] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const allOut = !candlesLit.some((lit) => lit);
  const celebrationContainerRef = useRef(null);
  const popupRef = useRef(null);

  // Celebration → show pop-up
  useCelebration(celebrationContainerRef, allOut, () => setShowPopup(true));

  // Bounce animation for the pop-up
  useEffect(() => {
    if (showPopup && popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2.2)" },
      );
    }
  }, [showPopup]);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between"
      style={{ backgroundColor: "#FFFDD0" }}
    >
      {/* Header – fully responsive text */}
      <div className="w-full text-center pt-6 pb-2">
        <h2
          className="font-bold mb-1"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: "#ff0000",
            fontSize: "clamp(1.3rem, 5vw, 2.2rem)",
          }}
        >
          Here is my cake for you 🎂
        </h2>
        <p
          className="font-semibold"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: "#db2777",
            fontSize: "clamp(0.9rem, 3.5vw, 1.3rem)",
          }}
        >
          Blow out the candles, baby! 🤩
        </p>
      </div>

      {/* 3D cake container – height scales with viewport */}
      <div className="w-full h-[55vh] max-h-[500px] flex-shrink-0">
        <Suspense
          fallback={
            <div
              className="h-full flex items-center justify-center text-red-500"
              style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)" }}
            >
              Loading cake...
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 1.8, 6.5], fov: 50 }}
            shadows
            gl={{ antialias: true }}
          >
            <CakeScene
              candlesLit={candlesLit}
              setCandlesLit={setCandlesLit}
              micRequested={micRequested}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Button area – fully responsive spacing and text */}
      <div className="w-full text-center pb-6">
        {!allOut ? (
          <button
            onClick={() => setMicRequested(true)}
            disabled={micRequested}
            className="px-6 py-3 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(0.9rem, 3vw, 1.1rem)",
            }}
          >
            {micRequested ? "🔊 Listening... Blow now!" : "🎤 Tap to Blow"}
          </button>
        ) : (
          <p
            className="text-red-600 font-bold"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
            }}
          >
            🎉 Happy Birthday, baby girl!
          </p>
        )}
      </div>

      {/* Celebration overlay */}
      <div
        ref={celebrationContainerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 5 }}
      />

      {/* Final pop‑up after celebration – responsive text & button */}
      {showPopup && (
        <div
          ref={popupRef}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6"
          style={{ backgroundColor: "#ff0000" }}
        >
          <p
            className="text-white text-center font-semibold leading-relaxed"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(1.3rem, 4vw, 2rem)",
            }}
          >
            Now let me show you something I’ve been keeping for you ❤️
          </p>
          <button
            onClick={() => {
              if (onNext) onNext();
            }}
            className="px-8 py-3 rounded-full font-bold bg-white text-red-600 shadow-xl transform transition-transform duration-300 hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(1rem, 3.5vw, 1.2rem)",
            }}
          >
            Let's go
          </button>
        </div>
      )}
    </div>
  );
}
