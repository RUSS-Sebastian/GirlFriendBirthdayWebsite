import { useRef } from "react";
import gsap from "gsap";

export default function useTypewriterTimeline() {
  const mainRef = useRef(null);
  const heading1ContainerRef = useRef(null);
  const heading1Ref = useRef(null);
  const heading2ContainerRef = useRef(null);
  const heading2Ref = useRef(null);
  const heading3ContainerRef = useRef(null);
  const heading3Ref = useRef(null);
  const heading4ContainerRef = useRef(null);
  const heading4Ref = useRef(null);
  const overlayRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const keypadRef = useRef(null);
  const leftContentRef = useRef(null); // ✨ New – sticker + text wrapper
  const mainRevealed = useRef(false);

  const texts = [
    "Some might find their way here…",
    "But this wasn’t made for everyone.",
    "Only one person can open this gift…",
    "And she knows who she is......",
  ];

  const revealMainContent = () => {
    if (mainRevealed.current || !mainRef.current) return;
    mainRevealed.current = true;

    const containers = [
      heading1ContainerRef.current,
      heading2ContainerRef.current,
      heading3ContainerRef.current,
      heading4ContainerRef.current,
    ];
    const headings = [
      heading1Ref.current,
      heading2Ref.current,
      heading3Ref.current,
      heading4Ref.current,
    ];

    const allChars = texts.map((text, i) => {
      const h = headings[i];
      if (!h) return [];
      h.innerHTML = "";
      return text.split("").map((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        if (char === " ") span.style.whiteSpace = "pre";
        span.style.opacity = 0;
        h.appendChild(span);
        return span;
      });
    });

    const tl = gsap.timeline();
    tl.set(mainRef.current, { opacity: 1, y: 0 });

    tl.to(allChars[0], {
      opacity: 1,
      duration: 0.2,
      stagger: 0.15,
      ease: "power2.out",
    });

    for (let i = 0; i < texts.length - 1; i++) {
      tl.to(
        containers[i],
        { opacity: 0, duration: 2, ease: "power2.inOut" },
        "+=0.3",
      );
      tl.set(containers[i + 1], { opacity: 1 });
      tl.to(
        allChars[i + 1],
        {
          opacity: 1,
          duration: 0.2,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.2",
      );
    }

    tl.to({}, { duration: 2 });
    tl.to(heading4ContainerRef.current, {
      y: -60,
      opacity: 0,
      duration: 3.8,
      ease: "power2.out",
    });

    // Panels appear
    tl.set(overlayRef.current, { opacity: 1, pointerEvents: "auto" });
    tl.set(leftPanelRef.current, { scaleY: 0, transformOrigin: "bottom" });
    tl.set(rightPanelRef.current, { scaleY: 0, transformOrigin: "top" });
    tl.to(leftPanelRef.current, {
      scaleY: 1,
      duration: 1.8,
      ease: "power3.inOut",
    });
    tl.to(
      rightPanelRef.current,
      { scaleY: 1, duration: 1.8, ease: "power3.inOut" },
      "<",
    );

    // Tiny pause after panels reach full height
    tl.to({}, { duration: 0.2 });

    // Bounce in both panel contents simultaneously
    tl.fromTo(
      leftContentRef.current,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "back.out(1.7)",
      },
    );
    tl.fromTo(
      keypadRef.current,
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "back.out(1.7)",
      },
      "<", // starts at the same time as the left content bounce
    );
  };

  return {
    mainRef,
    heading1ContainerRef,
    heading1Ref,
    heading2ContainerRef,
    heading2Ref,
    heading3ContainerRef,
    heading3Ref,
    heading4ContainerRef,
    heading4Ref,
    overlayRef,
    leftPanelRef,
    rightPanelRef,
    keypadRef,
    leftContentRef, // ✨ exported
    revealMainContent,
  };
}
