import { useEffect, useRef } from "react";
import gsap from "gsap";
import celebrateSticker from "../assets/stickers/celebrate.gif";

export default function BirthdayCelebration() {
  const svgRef = useRef(null);
  const stickerRef = useRef(null);
  const confettiContainerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Bounce in the rainbow text
    tl.fromTo(
      svgRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.0,
        ease: "back.out(1.7)",
      },
    );

    // Bounce in the sticker a little later
    tl.fromTo(
      stickerRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "back.out(1.7)",
      },
      "-=0.4",
    );

    // Confetti burst
    if (confettiContainerRef.current) {
      const colours = [
        "#ff0000",
        "#ffdd00",
        "#ff00aa",
        "#ff8800",
        "#00ffcc",
        "#ff44aa",
      ];
      for (let i = 0; i < 60; i++) {
        const dot = document.createElement("div");
        dot.className = "absolute rounded-full";
        const size = 4 + Math.random() * 8;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.backgroundColor =
          colours[Math.floor(Math.random() * colours.length)];
        dot.style.left = `${Math.random() * 100}%`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.opacity = 0;
        confettiContainerRef.current.appendChild(dot);

        gsap.fromTo(
          dot,
          { y: -20, opacity: 1 },
          {
            y: window.innerHeight + 50,
            opacity: 0,
            x: (Math.random() - 0.5) * 200,
            duration: 2 + Math.random() * 3,
            ease: "power1.in",
            delay: Math.random() * 0.5,
            onComplete: () => dot.remove(),
          },
        );
      }
    }
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-4 mt-8 sm:mt-12">
      {/* Confetti layer */}
      <div
        ref={confettiContainerRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Rainbow curved text – wider viewBox to prevent clipping */}
      <svg
        ref={svgRef}
        viewBox="0 0 900 280"
        className="w-[95%] max-w-4xl h-auto mb-4"
        style={{ opacity: 0 }}
      >
        <defs>
          <path
            id="rainbowPath"
            d="M 80,230 Q 450,-70 820,230"
            fill="transparent"
          />
        </defs>
        <text
          fontSize="54"
          fontWeight="700"
          fontFamily="'Playfair Display', serif"
          fill="#FF0000"
          textAnchor="middle"
        >
          <textPath href="#rainbowPath" startOffset="50%">
            Happy 20th Birthday My baby Girl!
          </textPath>
        </text>
      </svg>

      {/* Sticker – smaller */}
      <img
        ref={stickerRef}
        src={celebrateSticker}
        alt="Celebrate"
        className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
