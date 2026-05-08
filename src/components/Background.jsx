export default function Background() {
  return (
    <>
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(60)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute animate-particle-drift"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: Math.random() > 0.7 ? "#ff0000" : "#D4AF37",
              borderRadius: "50%",
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 4}s`,
              boxShadow: `0 0 ${Math.random() * 15 + 10}px ${
                Math.random() > 0.7
                  ? "rgba(255,0,0,0.8)"
                  : "rgba(212,175,55,0.8)"
              }`,
            }}
          />
        ))}
      </div>

      {/* Petals */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={`petal-${i}`}
            className="absolute animate-petal-fall-3d"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 8}s`,
            }}
          >
            <div
              style={{
                width: `${Math.random() * 20 + 25}px`,
                height: `${Math.random() * 25 + 30}px`,
                background: "linear-gradient(135deg, #f0c6c6 0%, #d4a0a0 100%)",
                borderRadius: "50% 0 50% 0",
                transform: `rotate(${Math.random() * 360}deg)`,
                boxShadow: "0 8px 16px rgba(212, 160, 160, 0.4)",
                opacity: 0.9,
              }}
            />
          </div>
        ))}
      </div>

      {/* Keyframes – can live here or in a global CSS */}
      <style>{`
        @keyframes particle-drift {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { transform: translate(50px, 50px); }
        }
        @keyframes petal-fall-3d {
          0% { transform: translateY(0) rotate(0deg) rotateX(0deg) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(50vh) rotate(180deg) rotateX(180deg) translateX(80px); }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg) rotateX(360deg) translateX(-80px); opacity: 0; }
        }
        .animate-particle-drift { animation: particle-drift ease-in-out infinite; }
        .animate-petal-fall-3d { animation: petal-fall-3d linear infinite; }
      `}</style>
    </>
  );
}
