import { useEffect, useRef } from "react";
import gsap from "gsap";
import shySticker from "../assets/stickers/shy.gif"; // your sticker

export default function ProudMessage() {
  const containerRef = useRef(null);
  const stickerRef = useRef(null);

  // Bounce in the sticker after the slide transition (slight delay)
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      stickerRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "back.out(1.7)",
        delay: 0.5, // after the slide finishes
      },
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center px-8"
      style={{
        backgroundColor: "#FFFDD0",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div className="flex w-full max-w-5xl items-center">
        {/* Left half – text */}
        <div className="w-1/2 pr-6">
          <h2
            className="font-bold leading-tight whitespace-pre-line"
            style={{
              color: "#FF0000",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
            }}
          >
            I am so proud of my baby girl!
            {"\n"}
            You know the exact password!
          </h2>
        </div>

        {/* Right half – sticker */}
        <div className="w-1/2 flex justify-center">
          <img
            ref={stickerRef}
            src={shySticker}
            alt="Shy"
            className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
