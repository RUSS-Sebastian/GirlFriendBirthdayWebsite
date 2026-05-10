import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import woodBg from "../assets/images/memory.png";

export default function MemoriesScreen({ active, onBack }) {
  const containerRef = useRef(null);
  const imageScrollRef = useRef(null);
  const hasAnimated = useRef(false);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 640);

  // Track screen width
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Slide‑in from right
  useEffect(() => {
    if (!active || hasAnimated.current) return;
    hasAnimated.current = true;
    gsap.fromTo(
      containerRef.current,
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" },
    );
  }, [active]);

  // Center scroll on mobile only
  const handleImageLoad = () => {
    if (!isDesktop && imageScrollRef.current) {
      const el = imageScrollRef.current;
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    }
  };

  // Floating hearts
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    const hearts = ["❤️", "💕", "💗", "💖", "💘", "💝"];
    for (let i = 0; i < 8; i++) {
      const heart = document.createElement("span");
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.className = "absolute text-2xl sm:text-3xl pointer-events-none";
      heart.style.left = Math.random() * 100 + "%";
      heart.style.top = Math.random() * 100 + "%";
      heart.style.opacity = 0;
      container.appendChild(heart);

      gsap.fromTo(
        heart,
        { y: 0, opacity: 0, scale: 0.5 },
        {
          y: -(50 + Math.random() * 100),
          opacity: 1,
          scale: 1 + Math.random(),
          duration: 2 + Math.random() * 3,
          ease: "power1.out",
          delay: Math.random() * 1.5,
          onComplete: () => heart.remove(),
        },
      );
    }
  }, [active]);

  const handleReturn = () => {
    gsap.to(containerRef.current, {
      x: "100%",
      opacity: 0,
      duration: 0.6,
      ease: "power3.in",
      onComplete: () => {
        if (onBack) onBack();
      },
    });
  };

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* 1. Header */}
      <div
        className="w-full flex flex-col items-center justify-center"
        style={{
          height: isDesktop ? "15vh" : "20vh",
          backgroundColor: "transparent",
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: "#B22222",
            fontSize: "clamp(2rem, 7vw, 3.5rem)",
            textAlign: "center",
            margin: 0,
            textShadow: "0 2px 4px rgba(178,34,34,0.1)",
          }}
        >
          Captured memories
        </h1>
        <div
          style={{
            width: "80px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #D4A574, #D4A574, transparent)",
            marginTop: "0.5rem",
            boxShadow: "0 0 10px rgba(212,165,116,0.3)",
          }}
        />
      </div>

      {/* 2. Image container – responsive magic happens here */}
      <div
        ref={imageScrollRef}
        className="hide-scrollbar"
        style={
          isDesktop
            ? {
                // Desktop: image fills the width, height auto, we scroll vertically
                width: "100%",
                height: "auto",
                overflowX: "hidden",
                overflowY: "hidden",
                borderRadius: "0.5rem",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                border: "4px solid #FFF",
              }
            : {
                // Mobile: your beloved horizontally scrollable frame
                overflowX: "auto",
                overflowY: "hidden",
                width: "100%",
                height: "60vh",
                borderRadius: "0.5rem",
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                border: "4px solid #FFF",
                maxWidth: "95vw",
                margin: "0 auto",
              }
        }
      >
        <img
          src={woodBg}
          alt="Our memories"
          onLoad={handleImageLoad}
          style={
            isDesktop
              ? {
                  width: "100%",
                  height: "auto",
                  display: "block",
                }
              : {
                  height: "100%",
                  width: "auto",
                  display: "block",
                  maxWidth: "none",
                  margin: "0 auto",
                }
          }
        />
      </div>

      {/* 3. Return button */}
      <div
        className="w-full flex flex-col items-center justify-center py-6"
        style={{ backgroundColor: "transparent" }}
      >
        <button
          onClick={handleReturn}
          className="px-8 py-3 rounded-full font-semibold bg-red-500 text-white shadow-lg transform transition-all duration-300 hover:bg-red-600 hover:scale-105 active:scale-95"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "clamp(1rem, 4vw, 1.3rem)",
            boxShadow: "0 4px 15px rgba(255,0,0,0.3)",
          }}
        >
          Return
        </button>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
