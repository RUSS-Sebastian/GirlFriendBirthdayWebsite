import { useEffect, useRef } from "react";
import gsap from "gsap";

import albumIcon from "../assets/icons/album.svg";
import flowerIcon from "../assets/icons/flower.svg";
import lockIcon from "../assets/icons/lock.svg";
import messageIcon from "../assets/icons/message.svg";

const icons = [
  { src: albumIcon, alt: "Album" },
  { src: flowerIcon, alt: "Flower" },
  { src: lockIcon, alt: "Lock" },
  { src: messageIcon, alt: "Message" },
];

export default function GiftsScreen({
  active,
  onAlbumClick,
  onFlowerClick,
  onLockClick,
  onMessageClick,
}) {
  const headingRef = useRef(null);
  const subtextRef = useRef(null);
  const cardRefs = useRef([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!active || hasAnimated.current) return;

    const heading = headingRef.current;
    const subtext = subtextRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!heading || !subtext || cards.length !== 4) return;
    hasAnimated.current = true;

    const tl = gsap.timeline({ defaults: { ease: "back.out(1.7)" } });

    // 1. Heading bounce
    tl.fromTo(
      heading,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8 },
    );

    // 2. Subtext bounce
    tl.fromTo(
      subtext,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6 },
      "-=0.4",
    );

    // 3–6. Cards bounce in sequentially
    cards.forEach((card, i) => {
      tl.fromTo(
        card,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 },
        i === 0 ? "-=0.2" : "-=0.3",
      );
    });
  }, [active]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-4 overflow-visible"
      style={{ backgroundColor: "#FFFDD0" }}
    >
      <div className="flex flex-col items-center justify-center w-full max-w-[85vw] sm:max-w-sm">
        <h1
          ref={headingRef}
          className="font-bold text-center mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#ff0000",
            fontSize: "clamp(1.6rem, 6vw, 2.2rem)",
          }}
        >
          THESE ARE FOR YOU!
        </h1>

        <p
          ref={subtextRef}
          className="text-center font-medium mb-5 sm:mb-6"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            color: "#ff0000",
            fontSize: "clamp(0.75rem, 2.8vw, 1rem)",
          }}
        >
          I hope you like it. I love you &gt;&lt;
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full overflow-visible">
          {icons.map((icon, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              onClick={() => {
                if (i === 0 && onAlbumClick) onAlbumClick();
                else if (i === 1 && onFlowerClick) onFlowerClick();
                else if (i === 2 && onLockClick) onLockClick();
                else if (i === 3 && onMessageClick) onMessageClick();
              }}
              className="aspect-square rounded-2xl border-[3px] flex items-center justify-center p-1 sm:p-1.5 bg-white
                         cursor-pointer active:scale-95 transition-transform"
              style={{
                borderColor: "#ff0000",
                boxShadow: "0 3px 8px rgba(255,0,0,0.1)",
              }}
            >
              <img
                src={icon.src}
                alt={icon.alt}
                className="w-1/3 h-1/3 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
