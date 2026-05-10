import { useEffect, useRef } from "react";
import gsap from "gsap";
import woodBg from "../assets/images/memory.png";

export default function MemoriesScreen({ active, onBack }) {
  const containerRef = useRef(null);
  const imageScrollRef = useRef(null); // ref for the scrollable image container
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!active || hasAnimated.current) return;
    hasAnimated.current = true;

    // Slide‑in from right for the whole screen
    gsap.fromTo(
      containerRef.current,
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" },
    );

    // After the image scroll container is rendered, center it
    setTimeout(() => {
      if (imageScrollRef.current) {
        const el = imageScrollRef.current;
        // Scroll to center so the user can scroll left or right
        el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      }
    }, 100); // small delay to let the paint happen
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
      {/* 1. Heading – exactly 20% of the viewport height */}
      <div
        className="w-full flex items-center justify-center"
        style={{ height: "20vh", backgroundColor: "#FFFFFF" }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: "#FF0000",
            fontSize: "clamp(2rem, 7vw, 3.5rem)",
            textAlign: "center",
            margin: 0,
          }}
        >
          Captured memories
        </h1>
      </div>

      {/* 2. Horizontally scrollable wood background – only this section scrolls X */}
      <div
        ref={imageScrollRef}
        className="hide-scrollbar"
        style={{
          overflowX: "auto",
          overflowY: "auto",
          width: "100%",
          height: "120vh", // tall, so vertical scroll works for the whole page
        }}
      >
        <div
          style={{
            minWidth: "1300px", // wider than most screens, forces horizontal scroll
            height: "100%",
            backgroundImage: `url(${woodBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      {/* 3. Return section – exactly 20% of the viewport height */}
      <div
        className="w-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        style={{ height: "20vh", backgroundColor: "#FFFFFF" }}
        onClick={handleReturn}
      >
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            color: "#FF0000",
            fontSize: "clamp(1.2rem, 5vw, 2rem)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Return
        </p>
      </div>

      {/* Hidden scrollbar */}
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
