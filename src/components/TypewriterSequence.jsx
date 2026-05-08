import { useState, useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import Keypad from "./Keypad";

// Stickers
import amazedSparkle from "../assets/stickers/amazed-sparkle.gif";
import thinking from "../assets/stickers/thinking.gif";
import sad from "../assets/stickers/sad.gif";
import cry from "../assets/stickers/cry.gif";
import mayaowl from "../assets/stickers/myaowl.gif";
import vaultVideo from "../assets/videos/vault.mp4";

function HeadingContainer({
  containerRef,
  hRef,
  text,
  style,
  visible = false,
}) {
  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <h1
        ref={hRef}
        className="w-full text-center font-bold leading-tight"
        style={style}
      >
        {text}
      </h1>
    </div>
  );
}

const generateBlobs = (count) =>
  Array.from({ length: count }, (_, i) => ({
    size: 80 + Math.random() * 200,
    top: Math.random() * 100,
    left: Math.random() * 100,
    borderRadius: `
      ${30 + Math.random() * 40}% ${50 + Math.random() * 30}%
      ${40 + Math.random() * 40}% ${50 + Math.random() * 30}% /
      ${40 + Math.random() * 20}% ${30 + Math.random() * 40}%
      ${50 + Math.random() * 30}% ${40 + Math.random() * 40}%
    `,
    id: i,
  }));

export default function TypewriterSequence({ refs, onSuccess, onVideoEnd }) {
  const {
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
    leftContentRef,
  } = refs;

  const headingStyle = {
    fontFamily: "'Playfair Display', serif",
    color: "#FF0000",
    fontSize: "clamp(2.5rem, 10vw, 8rem)",
    fontFeatureSettings: '"liga" 0',
    fontVariantLigatures: "none",
  };

  // ---------- State ----------
  const [wrongPassword, setWrongPassword] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [keypadKey, setKeypadKey] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [blobsDone, setBlobsDone] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);

  const failOverlayRef = useRef(null);
  const entranceCompleteRef = useRef(false);
  const blobContainerRef = useRef(null);
  const blobRefs = useRef([]);
  const videoRef = useRef(null);
  const blobs = useMemo(() => generateBlobs(20), []);

  const redPanelContent = useMemo(() => {
    if (failCount === 0)
      return {
        sticker: amazedSparkle,
        text: "Enter our special telegram code",
      };
    if (failCount === 1)
      return {
        sticker: thinking,
        text: "I think you mistyped the password.\nIt is our telegram code!",
      };
    if (failCount === 2)
      return {
        sticker: sad,
        text: "Please try hard.\nIt is our telegram code.",
      };
    return {
      sticker: cry,
      text: "I think the current user isn't my girlfriend",
    };
  }, [failCount]);

  // --- Fail overlay entrance ---
  useEffect(() => {
    if (wrongPassword && failOverlayRef.current) {
      entranceCompleteRef.current = false;
      gsap.fromTo(
        failOverlayRef.current,
        { scaleY: 0, transformOrigin: "bottom" },
        {
          scaleY: 1,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            entranceCompleteRef.current = true;
            setFailCount((prev) => prev + 1);
          },
        },
      );
    }
  }, [wrongPassword]);

  // --- Blob spread ---
  useEffect(() => {
    if (isSuccess && blobContainerRef.current) {
      const els = blobRefs.current.filter(Boolean);
      gsap.set(els, { scale: 0, opacity: 1 });
      gsap.to(els, {
        scale: 5,
        duration: 2.8,
        stagger: { each: 0.12, from: "random" },
        ease: "power3.inOut",
        onComplete: () => setBlobsDone(true),
      });
    }
  }, [isSuccess]);

  // --- Start video muted as soon as it’s mounted ---
  useEffect(() => {
    if (isSuccess && videoRef.current) {
      const video = videoRef.current;
      video.muted = true; // start muted to allow autoplay
      video.play().catch(console.warn);
    }
  }, [isSuccess]);

  // --- Crossfade: blobs out → video visible, then unmute ---
  useEffect(() => {
    if (blobsDone && videoRef.current) {
      const video = videoRef.current;
      const tl = gsap.timeline({
        onComplete: () => {
          setVideoVisible(true);
          if (onSuccess) onSuccess(); // remove background, cream → black
          video.muted = false; // audio on now
        },
      });
      if (blobContainerRef.current) {
        tl.to(
          blobContainerRef.current,
          { opacity: 0, duration: 1.0, ease: "power2.out" },
          0,
        );
      }
      tl.to(video, { opacity: 1, duration: 1.0, ease: "power2.out" }, 0);
    }
  }, [blobsDone, onSuccess]);

  // --- Password submit ---
  const handlePasswordSubmit = (password) => {
    if (password === "1027") {
      setIsSuccess(true); // only triggers state change, DOM updates next
    } else {
      setWrongPassword(true);
    }
  };

  // --- Try again ---
  const handleTryAgain = () => {
    if (!failOverlayRef.current || !entranceCompleteRef.current) return;
    gsap.to(failOverlayRef.current, {
      scaleY: 0,
      transformOrigin: "bottom",
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        setWrongPassword(false);
        setKeypadKey((prev) => prev + 1);
        entranceCompleteRef.current = false;
      },
    });
  };

  // --- Video ended → cream ---
  const handleVideoEnded = () => {
    console.log("Video ended event fired");
    if (onVideoEnd) onVideoEnd();
  };

  // ========== RENDER ==========
  return (
    <>
      {/* ---- Typewriter ---- */}
      <div ref={mainRef} className="min-h-screen relative opacity-0 px-4 z-10">
        <HeadingContainer
          containerRef={heading1ContainerRef}
          hRef={heading1Ref}
          text="Some might find their way here…"
          style={headingStyle}
          visible
        />
        <HeadingContainer
          containerRef={heading2ContainerRef}
          hRef={heading2Ref}
          text="But this wasn’t made for everyone."
          style={headingStyle}
        />
        <HeadingContainer
          containerRef={heading3ContainerRef}
          hRef={heading3Ref}
          text="Only one person can open this gift…"
          style={headingStyle}
        />
        <HeadingContainer
          containerRef={heading4ContainerRef}
          hRef={heading4Ref}
          text="And she knows who she is......"
          style={headingStyle}
        />
      </div>

      {/* ---- Panels ---- */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-20 opacity-0 pointer-events-none"
      >
        <div
          ref={leftPanelRef}
          className="absolute left-0 top-0 h-full w-1/2 flex items-center justify-center"
          style={{ backgroundColor: "#FF0000" }}
        >
          <div
            ref={leftContentRef}
            className="flex flex-col items-center gap-4 opacity-0 scale-0 px-4"
          >
            <img
              src={redPanelContent.sticker}
              alt=""
              className="w-56 h-56 sm:w-72 sm:h-72 object-contain drop-shadow-lg"
            />
            <p
              className="text-white text-center font-medium leading-relaxed whitespace-pre-line"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
                letterSpacing: "0.02em",
              }}
            >
              {redPanelContent.text}
            </p>
          </div>
        </div>
        <div
          ref={rightPanelRef}
          className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center p-4"
          style={{ backgroundColor: "#FFFDD0" }}
        >
          <div ref={keypadRef} className="opacity-0 scale-0">
            <Keypad key={keypadKey} onSubmit={handlePasswordSubmit} />
          </div>
        </div>
      </div>

      {/* ---- Fail overlay ---- */}
      {wrongPassword && (
        <div
          ref={failOverlayRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-8 px-6"
          style={{
            backgroundColor: "#FFFDD0",
            fontFamily: "'Montserrat', sans-serif",
            transformOrigin: "bottom",
          }}
        >
          <img
            src={mayaowl}
            alt="Maya owl"
            className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
          />
          <p
            className="text-center text-red-600 font-semibold leading-snug"
            style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}
          >
            If you are my baby, you will know it
          </p>
          <button
            onClick={handleTryAgain}
            className="px-8 py-3 rounded-full font-semibold text-white shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "#FF0000",
              fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
            }}
          >
            Try again
          </button>
        </div>
      )}

      {/* ---- Blobs (virus) ---- */}
      {isSuccess && !videoVisible && (
        <div
          ref={blobContainerRef}
          className="absolute inset-0 z-50 overflow-hidden"
          style={{ backgroundColor: "transparent" }}
        >
          {blobs.map((blob) => (
            <div
              key={blob.id}
              ref={(el) => (blobRefs.current[blob.id] = el)}
              className="absolute"
              style={{
                width: `${blob.size}px`,
                height: `${blob.size}px`,
                top: `${blob.top}%`,
                left: `${blob.left}%`,
                backgroundColor: "#000000",
                borderRadius: blob.borderRadius,
                transformOrigin: "center center",
                transform: "scale(0)",
                willChange: "transform",
              }}
            />
          ))}
        </div>
      )}

      {/* ---- Video ---- */}
      {isSuccess && (
        <video
          ref={videoRef}
          src={vaultVideo}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0, zIndex: 60 }}
          playsInline
          muted
          onEnded={handleVideoEnded}
        />
      )}
    </>
  );
}
