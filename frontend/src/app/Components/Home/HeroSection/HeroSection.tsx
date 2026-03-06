import React from 'react';

const HeroSection: React.FC = () => {
  const videoId = 'xJ05rWqlS8w';

  return (
    <section className="relative w-full h-[100vh] overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full z-[1]">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
          title="Hero Background Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover border-none scale-150" // Scaled to hide edges/UI
        />
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/40 z-[1.5]"></div>
      </div>

      <div className="relative z-[2] text-center text-white max-w-[800px] px-8">
        <div className="animate-fade-in-up">
          <h1 className="text-[clamp(2.5rem,5vw,4.4rem)] font-bold mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-linear-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent tracking-tight">
            Welcome to Our Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] font-medium">
            Discover excellence in awards and services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-10 py-4 bg-linear-to-br from-[#667eea] to-[#764ba2] text-white rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(102,126,234,0.4)] active:scale-95 w-full sm:w-auto">
              Get Started
            </button>
            <button className="px-10 py-4 bg-white/20 text-white backdrop-blur-md border-2 border-white/30 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-white/30 hover:-translate-y-1 hover:shadow-lg active:scale-95 w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
