import { useEffect, useRef } from "react";
import gsap from "gsap";
import bouquetImg from "../assets/images/bouquet.png";

export default function FlowerScreen({ active, onBack }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!active || hasAnimated.current || !containerRef.current) return;
    hasAnimated.current = true;

    // Fade in the whole container
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power3.out" },
    );

    // Image fade in with slight upward motion
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.4, ease: "power3.out", delay: 0.3 },
    );

    // Text stagger after image
    gsap.fromTo(
      textRef.current.children,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.8,
      },
    );
  }, [active]);

  const handleReturn = () => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
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
      style={{
        background: "linear-gradient(135deg, #fef9f1 0%, #fff5ec 100%)",
      }}
    >
      <div className="min-h-full flex flex-col items-center justify-center px-4 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col items-center w-full max-w-2xl">
          {/* Bouquet image – BIGGER, takes ≈90% of viewport height */}
          <div
            ref={imageRef}
            className="w-full mb-6 sm:mb-8"
            style={{ height: "calc(90vh - 160px)" }}
          >
            <img
              src={bouquetImg}
              alt="Bouquet"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          {/* Text section */}
          <div ref={textRef} className="w-full text-center">
            <h1
              className="font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#5b3a29",
                fontSize: "clamp(2rem, 6vw, 3.2rem)",
                letterSpacing: "0.02em",
                lineHeight: 1.2,
              }}
            >
              Bouquet for you
            </h1>

            <div className="flex justify-center mb-6">
              <div
                style={{
                  width: "80px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, #d4a574, transparent)",
                }}
              />
            </div>

            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed lg:leading-loose mb-6 max-w-xl mx-auto"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "#6b4f44",
                fontStyle: "italic",
              }}
            >
              This isn’t just a bouquet.
              <br />
              It’s a small piece of how I see you — calm, beautiful, and warm in
              ways I can’t always explain properly.
              <br />I hope every flower here reminds you that you are
              appreciated more than words can show.
            </p>

            <button
              onClick={handleReturn}
              className="px-6 py-2.5 rounded-full font-semibold border-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md mt-2"
              style={{
                borderColor: "#d4a574",
                color: "#5b3a29",
                backgroundColor: "transparent",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
                letterSpacing: "0.05em",
              }}
            >
              Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
