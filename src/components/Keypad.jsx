import { useState, useEffect } from "react";

export default function Keypad({ onSubmit }) {
  const [password, setPassword] = useState("");

  const handleNumberClick = (num) => {
    if (password.length < 4) {
      setPassword((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPassword((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPassword("");
  };

  const handleSubmit = () => {
    if (password.length === 4) {
      console.log("Password submitted:", password);
      if (onSubmit) onSubmit(password);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumberClick(Number(e.key));
      } else if (e.key === "Backspace" || e.key === "Delete") {
        handleDelete();
      } else if (e.key === "Enter") {
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [password]); // eslint-disable-line

  const btnBase =
    "rounded-2xl font-semibold transition-all duration-300 ease-out hover:scale-105 active:scale-95 shadow-md";

  return (
    <div
      className="w-full max-w-[260px] text-center px-2"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      {/* Heart & title */}
      <div className="mb-5">
        <div
          className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-3 transition-transform duration-300 hover:scale-110 hover:rotate-6"
          style={{ background: "linear-gradient(135deg, #fffdd0, #fff4c4)" }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            className="sm:w-8 sm:h-8"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#ff0000"
              opacity="0.9"
            />
          </svg>
        </div>
        <h2
          className="text-lg sm:text-xl md:text-2xl font-semibold mb-1"
          style={{ color: "#ff0000", fontFamily: "'Montserrat', sans-serif" }}
        >
          Enter Your Code
        </h2>
        <p
          className="text-xs opacity-60"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Type 4 special numbers ✨
        </p>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-semibold transition-all duration-300"
            style={{
              background: password[index] ? "#ff0000" : "#fffdd0",
              color: password[index] ? "#fff" : "#ccc",
              boxShadow: password[index]
                ? "0 4px 12px rgba(255, 0, 0, 0.3)"
                : "0 2px 6px rgba(0, 0, 0, 0.05)",
              transform: password[index] ? "scale(1.05)" : "scale(1)",
            }}
          >
            {password[index] || "•"}
          </div>
        ))}
      </div>

      {/* Number pad 1-9 */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className={`${btnBase} h-12 sm:h-14 md:h-16 text-lg sm:text-xl`}
            style={{
              background: "linear-gradient(135deg, #fffdd0, #fff9c4)",
              color: "#ff0000",
              fontFamily: "'Montserrat', sans-serif",
              boxShadow: "0 3px 10px rgba(255, 253, 208, 0.5)",
            }}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Bottom row: Clear, 0, Enter */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <button
          onClick={handleClear}
          className={`${btnBase} h-12 sm:h-14 md:h-16 text-xs sm:text-sm font-medium`}
          style={{
            background: "#ff0000",
            color: "#fff",
            fontFamily: "'Montserrat', sans-serif",
            boxShadow: "0 4px 12px rgba(255, 0, 0, 0.3)",
          }}
        >
          Clear
        </button>
        <button
          onClick={() => handleNumberClick(0)}
          className={`${btnBase} h-12 sm:h-14 md:h-16 text-lg sm:text-xl`}
          style={{
            background: "linear-gradient(135deg, #fffdd0, #fff9c4)",
            color: "#ff0000",
            fontFamily: "'Montserrat', sans-serif",
            boxShadow: "0 3px 10px rgba(255, 253, 208, 0.5)",
          }}
        >
          0
        </button>
        <button
          onClick={handleSubmit}
          disabled={password.length !== 4}
          className={`${btnBase} h-12 sm:h-14 md:h-16 text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none`}
          style={{
            background: password.length === 4 ? "#ff0000" : "#e0e0e0",
            color: "#fff",
            fontFamily: "'Montserrat', sans-serif",
            boxShadow:
              password.length === 4
                ? "0 4px 12px rgba(255, 0, 0, 0.3)"
                : "none",
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}
