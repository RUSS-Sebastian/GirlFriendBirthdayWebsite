import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MessageScreen({ active, onBack }) {
  const containerRef = useRef(null);
  const heartContainerRef = useRef(null);
  const hasAnimated = useRef(false);

  // Slide in/out animations (unchanged)
  useEffect(() => {
    if (!active || hasAnimated.current || !containerRef.current) return;
    hasAnimated.current = true;

    gsap.fromTo(
      containerRef.current,
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" },
    );
  }, [active]);

  const handleReturn = () => {
    if (!containerRef.current) return;

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

  // Hearts creation (unchanged)
  const createHearts = () => {
    if (!heartContainerRef.current) return;
    const hearts = ["❤️", "💕", "💘", "🥰", "💗", "💓", "💞"];
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement("span");
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.className = "heart-float text-3xl sm:text-4xl";
      heart.style.left = Math.random() * 80 + 10 + "%";
      heart.style.bottom = "60px";
      heart.style.animationDelay = Math.random() * 0.6 + "s";
      heartContainerRef.current.appendChild(heart);
      setTimeout(() => heart.remove(), 4200);
    }
  };

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 overflow-y-auto"
      style={{
        background: "linear-gradient(to bottom, #fafaf9, #fffbeb, #fafaf9)",
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      <style>{`
        .font-display { font-family: 'Playfair Display', serif; letter-spacing: 0.02em; }
        .font-body { font-family: 'Cormorant Garamond', serif; }
        
        @keyframes fadeUpDelayed { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse { 0%, 100% { opacity: 0.35; filter: blur(60px); } 50% { opacity: 0.65; filter: blur(70px); } }
        @keyframes floatHeart { 0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; } 100% { transform: translateY(-140px) scale(0.3) rotate(360deg); opacity: 0; } }
        @keyframes shimmer { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-fade-up { animation: fadeUpDelayed 1s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.3s; }
        .delay-2 { animation-delay: 0.6s; }
        .delay-3 { animation-delay: 0.9s; }
        .delay-4 { animation-delay: 1.2s; }
        .delay-5 { animation-delay: 1.5s; }
        .delay-6 { animation-delay: 1.8s; }
        .delay-7 { animation-delay: 2.1s; }
        
        .glow-orb { animation: glowPulse 6s ease-in-out infinite; }
        .heart-float { animation: floatHeart 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; position: absolute; pointer-events: none; }
        
        .section-divider { 
          width: 80px; 
          height: 2px; 
          background: linear-gradient(90deg, transparent, #d4a574, #d4a574, transparent);
          box-shadow: 0 0 20px rgba(212, 165, 116, 0.3);
        }
        
        .letter-section { 
          border-left: 3px solid #d4a574;
          padding-left: 1.5rem;
          position: relative;
        }
        
        .letter-section::before {
          content: '';
          position: absolute;
          left: -7px;
          top: 0;
          width: 11px;
          height: 11px;
          background: #d4a574;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(212, 165, 116, 0.5);
        }
        
        .quote-box {
          border: 2px solid #d4a574;
          border-radius: 0;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(255,251,235,0.5) 0%, rgba(255,245,230,0.3) 100%);
          position: relative;
          box-shadow: inset 0 0 30px rgba(212, 165, 116, 0.1);
        }
        
        .quote-box::before {
          content: '"';
          position: absolute;
          top: -10px;
          left: 20px;
          font-size: 3rem;
          color: #d4a574;
          opacity: 0.3;
          font-family: 'Playfair Display', serif;
        }
        
        .section-title {
          position: relative;
          display: inline-block;
          padding-bottom: 0.5rem;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40%;
          height: 2px;
          background: linear-gradient(90deg, #d4a574, transparent);
        }
        
        .romantic-glow {
          text-shadow: 0 0 40px rgba(212, 165, 116, 0.3), 0 0 20px rgba(217, 119, 6, 0.1);
        }
        
        .love-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .love-button:hover {
          transform: scale(1.05);
          letter-spacing: 0.15em;
        }
        
        .love-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(212, 165, 116, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .love-button:active::after {
          width: 300px;
          height: 300px;
        }

        .hero-accent {
          animation: slideInLeft 1s ease-out 0.7s forwards;
          opacity: 0;
        }

        /* New consistent return button */
        .return-btn {
          border-color: #d4a574;
          color: #5b3a29;
          background-color: transparent;
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          letter-spacing: 0.05em;
        }
      `}</style>

      {/* Ambient glow orbs (unchanged) */}
      <div className="fixed top-10 left-5 w-80 h-80 rounded-full bg-amber-200 blur-3xl glow-orb opacity-25 pointer-events-none"></div>
      <div
        className="fixed top-1/3 right-0 w-96 h-96 rounded-full bg-rose-100 blur-3xl glow-orb opacity-20 pointer-events-none"
        style={{ animationDelay: "2.5s" }}
      ></div>
      <div
        className="fixed bottom-10 left-1/4 w-72 h-72 rounded-full bg-amber-100 blur-3xl glow-orb opacity-15 pointer-events-none"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Hero Section (unchanged) */}
      <header className="w-full px-4 sm:px-6 py-16 sm:py-24 md:py-32 lg:py-40 flex flex-col items-center text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <p className="font-body text-amber-700 text-base sm:text-lg md:text-xl tracking-widest uppercase animate-fade-up delay-1 font-light">
            To my dearest love
          </p>
          <div className="mt-8 animate-fade-up delay-2">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-stone-800 leading-tight romantic-glow">
              Happy 20th Birthday
            </h1>
          </div>
          <div className="flex justify-center mt-10 animate-fade-up delay-2">
            <div className="section-divider"></div>
          </div>
          <p className="font-body text-stone-600 text-lg sm:text-xl md:text-2xl italic mt-8 animate-fade-up delay-3 leading-relaxed">
            ပါဗျ ကိုကိုအချစ်ရဆုံး​ကောင်မ​လေး​ရေ 🥰
          </p>
          <div className="mt-12 hero-accent">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              className="mx-auto opacity-30"
            >
              <path
                d="M30 45C22.8 45 15 40 15 30C15 20 22 15 30 15C38 15 45 20 45 30C45 40 38 45 30 45Z"
                stroke="#d4a574"
                strokeWidth="1.5"
                opacity="0.5"
              />
              <circle cx="30" cy="30" r="2" fill="#d4a574" opacity="0.5" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Letter Content (unchanged) */}
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-24 lg:pb-32 relative z-10">
        {/* Section 1 */}
        <section className="letter-section mb-16 sm:mb-20 animate-fade-up delay-4">
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose">
            ဒီ​နေ့က က​လေး​လေးရဲ့​မွေး​နေ့ဖြစ်​တဲ့အပြင် က​လေး​လေးဘ၀ရဲ့ chapter
            သစ်တစ်ခု စတင်လိုက်တဲ့​နေ့​လေးဖြစ်လို ကိုကိုအတွက် တကယ်ကို
            ထူးခြားတဲ့​​နေ့​လေးပါဗျ 🥰
          </p>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-6">
            က​လေး​လေးရဲ့ ဆယ်​ကျောက်သက်အရွယ်​လေး ကုန်ဆုံးသွားပြီဆို​ပေမယ့်
            ​ရှေ့​လျောက်ကြုံ​တွေ့ရမယ့် အ​ကောင်းဆုံးနှစ်​တွေက အခုမှ လာမှာပါဗျ 🥰
          </p>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-6">
            ဒီခရီးလမ်းမှာ က​လေး​လေးနဲ့ အတူရှိခွင့်ရတဲ့အတွက်လည်း ကိုကို တကယ်ပဲ​
            ​ကျေးဇူးတင်ပါတယ်ဗျ 💕
          </p>
        </section>

        {/* Quote Highlight */}
        <div className="my-16 sm:my-20 md:my-24 animate-fade-up delay-5">
          <div className="quote-box">
            <p className="font-display text-2xl sm:text-3xl md:text-4xl text-amber-900 italic leading-snug">
              က​လေး​လေးက ကိုကိုအတွက် စကားလုံး​တွေနဲ့​တောင်
              ​ဖော်ပြလိုမရနိုင်​လောက်​အောင် အဓိပ္ပါယ်အရမ်းရှိတဲ့သူ
            </p>
          </div>
          <div className="flex justify-center mt-10">
            <div className="section-divider"></div>
          </div>
        </div>

        {/* Section 2 */}
        <section className="letter-section mb-16 sm:mb-20 animate-fade-up delay-5">
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose">
            ကိုကို ​ဘေးမှာ အမြဲရှိ အမြဲ support ​ပေးတဲ့အတွက်လည်း ကိုကို
            အရမ်း​ကျေးဇူးတင်ပါတယ်ဗျ 🫂
          </p>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-6">
            က​လေး​လေး ကအသက်၂၀ပြည့်​လည်း ကိုကိုအတွက်
            အမြဲချစ်စရာ​ကောင်းတဲ့က​လေး​​လေး ဖြစ်​နေမှာပါဗျ 😚
          </p>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-6">
            က​လေး​လေးအသက်ပိုကြီးလာ​လေ​လေ ကိုကိုက ပိုချစ်လာ​လေပါဗျ 💘
          </p>
        </section>

        {/* Section 3 */}
        <section className="letter-section mb-16 sm:mb-20 animate-fade-up delay-6">
          <h2 className="section-title font-display text-2xl sm:text-3xl md:text-4xl text-stone-800 mb-8">
            About You
          </h2>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose">
            က​လေး​လေးဟာ ရုပ်ရည်လှပတာသာမက က​လေး​လေးရဲ့စိတ်ထား​လေးကပါ
            အရမ်းကိုဖြူစင်သန့်ရှင်းပါတယ်ဗျ။
          </p>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-6">
            က​လေး​လေးရဲ့ ကြင်နာမှု၊ က​လေး​လေးရဲ့အပြုံး​လေး​တွေ၊ က​လေး​လေး
            ကိုယ်တိုင်​တောင်သတိမထားမိပဲ လုပ်လိုက်တဲ့ အပြုမူ​လေး​တွေက ကိုကိုကို
            ​နေ့တိုင်းပိုပြီးအချစ်တိုး​စေပါတယ်ဗျ 😍
          </p>
          <p className="font-display text-xl sm:text-2xl md:text-3xl text-amber-700 italic mt-8">
            I love your attitude 💘
          </p>
        </section>

        {/* Section 4 */}
        <section className="letter-section mb-16 sm:mb-20 animate-fade-up delay-6">
          <h2 className="section-title font-display text-2xl sm:text-3xl md:text-4xl text-stone-800 mb-8">
            Our Moments
          </h2>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose">
            က​လေး​လေးနဲ့ အတူရှိတဲ့အချိန်​တွေက ကိုကိုကို တန်ဖိုးထားရတဲ့
            အမှတ်တရ​တွေ အများကြီး​ပေးခဲ့ ပါတယ်ဗျ။
          </p>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-6">
            ​သေးငယ်တဲ့ အခိုက်အတန့်​တွေကအစ ကြီးမားတဲ့အဖြစ်အပျက်​တွေအထိ
            က​လေး​လေးနဲ့အတူရှိ​နေလိုသာ ပိုပြီးထူးခြားခဲ့တာပါဗျ 😍
          </p>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-6">
            က​လေး​​လေး ဟာကိုကိုရည်းစားတင်မဟုတ်ဘဲ ကိုကိုရဲ့​ပျော်ရွှင်မှု၊
            ကိုကိုရဲ့လုံခြုံရာ​နေရာ​လေးနဲ့ ကိုကိုအတွက်
            အ​ရေးပါဆုံးသူတစ်​ယောက်ပါဗျ 🥰
          </p>
        </section>

        {/* Section 5 */}
        <section className="letter-section mb-16 sm:mb-20 animate-fade-up delay-7">
          <h2 className="section-title font-display text-2xl sm:text-3xl md:text-4xl text-stone-800 mb-8">
            I Believe In You
          </h2>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose">
            က​လေး​လေးရဲ့ အိမ်မက်​တွေ၊ က​လေး​လေးရဲ့ လုပ်နိုင်စွမ်း​တွေအားလုံးကို
            ကိုကိုယုံကြည်ပါတယ်ဗျ။ က​လေး​လေး ဟာ ဘယ်​တော့မှမညံ့ပါဘူးဗျ။
          </p>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-6">
            က​လေး​လေးက အလားအလာ​တွေအများကြီးရှိသလို က​လေး​လေးရဲ့အနာဂတ်ဟာလည်း
            အမြဲ​တောက်ပ​နေမှာပါဗျ 🥰
          </p>
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-6">
            ဘယ်လိုလို အခက်အခဲ​တွေဖြစ်​နေပ​စေ က​လေး​လေး​ကျော်ဖြတ်နိုင်မှာဖြစ်သလို
            ကိုကိုလည်း က​လေး​လေး​ဘေးက​နေ အမြဲတမ်း ပံ့ပိုး​ပေးပြီး
            အား​ပေး​နေမယ့်သူတစ်​ယောက် ဖြစ်​နေမှာပါဗျ 🥰
          </p>
        </section>

        {/* Wishes Section */}
        <section className="my-16 sm:my-20 md:my-24 text-center animate-fade-up delay-7">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-stone-800 mb-12">
            Birthday Wishes
          </h2>
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <p className="font-body text-stone-600 text-lg sm:text-xl md:text-2xl italic leading-relaxed">
              အိမ်မက်​တွေ ​အောင်မြင်စွာဖြစ်လာပါ​စေ 🥰
            </p>
            <p className="font-body text-stone-600 text-lg sm:text-xl md:text-2xl italic leading-relaxed">
              ဘ၀မှာ လွတ်လပ်​သော သူတစ်​ယောက်ဖြစ်​ပါ​စေ
            </p>
            <p className="font-body text-stone-600 text-lg sm:text-xl md:text-2xl italic leading-relaxed">
              အမြဲ​ပျော်ရွှင် ​အေးချမ်းရ​သော ဘ၀​လေးရပါ​စေ
            </p>
            <p className="font-body text-stone-600 text-lg sm:text-xl md:text-2xl italic leading-relaxed">
              ကျန်းကျန်းမာမာ ချမ်းချမ်းသာသာ နဲ့ဖြတ်​ကျော်နိုင်ပါ​စေ 😇
            </p>
          </div>
        </section>

        {/* Gratitude */}
        <section className="letter-section mb-16 sm:mb-20 animate-fade-up delay-7">
          <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose">
            ကိုကိုကို ချစ်​ပေးလို၊ နားလည်​ပေးလိုနဲ့ က​လေး​လေးရှိရုံနဲ့တင်
            ကိုကိုဘ၀ကို ပို​ကောင်း​အောင် လုပ်​ပေးလို ​ကျေးဇူးအများကြီးတင်ပါတယ်ဗျ
            🥰
          </p>
        </section>

        {/* Final English Section */}
        <section className="my-16 sm:my-20 md:my-24 py-12 sm:py-16 md:py-20 px-6 sm:px-8 md:px-12 bg-gradient-to-br from-amber-50 via-rose-50 to-stone-50 border-2 border-amber-200 text-center animate-fade-up delay-7 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-amber-100 to-transparent opacity-10 pointer-events-none"></div>
          <div className="relative z-10">
            <p className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-stone-800 italic leading-snug">
              "I'll always do my best to make you feel as special as you are"
            </p>
            <div className="flex justify-center my-10">
              <div className="section-divider"></div>
            </div>
            <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose max-w-2xl mx-auto">
              Happy 20th birthday once again, my love. This is just the
              beginning of something beautiful, and I'm so excited to see where
              life takes us together.
            </p>
            <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-8 max-w-2xl mx-auto">
              I love you more than you know ❤️
            </p>
            <p className="font-body text-stone-700 text-lg sm:text-xl md:text-2xl leading-relaxed lg:leading-loose mt-8 max-w-2xl mx-auto">
              You are the only one I want to marry. I believe we will achieve
              our dream 🤝🥰
            </p>
          </div>
        </section>

        {/* Footer with hearts (unchanged) */}
        <footer
          className="text-center py-16 sm:py-20 md:py-24 relative"
          ref={heartContainerRef}
        >
          <p className="font-display text-4xl sm:text-5xl md:text-6xl text-amber-800 romantic-glow">
            Forever Yours 💘
          </p>
          <button
            onClick={createHearts}
            className="love-button mt-8 sm:mt-10 font-body text-stone-500 text-xs sm:text-sm tracking-widest uppercase hover:text-amber-700 transition-colors cursor-pointer px-6 py-2 rounded-full border border-stone-300 hover:border-amber-700"
          >
            ✨ tap for love ♡ ✨
          </button>
        </footer>

        {/* Elegant Return button (new) */}
        <div className="text-center pb-12">
          <button
            onClick={handleReturn}
            className="px-8 py-3 rounded-full font-semibold border-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md return-btn"
          >
            Return
          </button>
        </div>
      </main>
    </div>
  );
}
