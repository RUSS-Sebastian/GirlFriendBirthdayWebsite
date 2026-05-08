import { MdScreenRotation } from "react-icons/md";

export default function RotationHint({ hintRef }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        ref={hintRef}
        className="flex flex-col items-center justify-center gap-[clamp(0.5rem,2vw,1.5rem)] px-4 text-center max-w-[90%] opacity-0"
      >
        <MdScreenRotation className="text-[clamp(3rem,12vw,5.5rem)] text-blue-600" />
        <p
          className="font-semibold text-gray-700 leading-snug"
          style={{ fontSize: "clamp(1.1rem, 4vw, 1.5rem)" }}
        >
          For the best experience,
          <br />
          please rotate your phone.
        </p>
      </div>
    </div>
  );
}
