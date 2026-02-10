
import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import BeamGridBackground from './ui/BeamGridBackground';
import { motion } from 'framer-motion';
import { Compass, Users, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

gsap.registerPlugin(ScrollTrigger);

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="group relative flex-shrink-0 w-64 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer overflow-hidden transition-all duration-300"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 border border-transparent group-hover:border-accent/40 rounded-2xl transition-colors duration-300" />
        
        <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Icon size={24} className="text-neutral-300 group-hover:text-accent transition-colors" />
            </div>
            <h3 className="text-white font-display font-bold text-lg mb-1">{title}</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">{desc}</p>
        </div>
    </motion.div>
);

const FloatingPoster = ({ src, className, delay, onClick }: { src: string, className: string, delay: number, onClick: () => void }) => (
    <motion.div 
        onClick={onClick}
        className={`absolute z-20 w-32 md:w-40 aspect-[3/4] rounded-lg overflow-hidden border border-white/10 shadow-2xl cursor-pointer ${className}`}
        initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
        animate={{ 
            y: [0, -15, 0],
            opacity: 0.8,
            filter: "blur(2px)" 
        }}
        whileHover={{ 
            scale: 1.1, 
            opacity: 1, 
            filter: "blur(0px)",
            zIndex: 30
        }}
        transition={{ 
            y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay },
            default: { duration: 0.3 }
        }}
    >
        <div className="absolute inset-0 bg-accent/20 mix-blend-overlay" />
        <img src={src} className="w-full h-full object-cover opacity-80" />
    </motion.div>
);

export const Hero: React.FC = () => {
  const component = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { posters } = useGlobalContext();

  useLayoutEffect(() => {
    // Guard against null refs to prevent GSAP "Invalid scope" errors
    if (!component.current || !slider.current) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.hero-panel');
      
      // Guard against missing targets
      if (panels.length === 0) return;

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: slider.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => "+=" + slider.current?.offsetWidth,
        }
      });
    }, component);

    return () => ctx.revert();
  }, [posters]); // Re-run if posters change

  // Use real posters from context, limit to 5
  const heroPosters = posters.slice(0, 5);
  const handlePosterClick = () => navigate('/login');

  if (heroPosters.length === 0) return null; // Or some loading state

  return (
    <div ref={component} className="relative w-full overflow-hidden bg-black">
      <div ref={slider} className="h-screen w-full flex flex-nowrap">
        
        {/* Panel 1: Main Landing with BeamGrid & Enhancements */}
        <div className="hero-panel w-screen h-full flex-shrink-0 flex items-center justify-center relative p-8 overflow-hidden">
            {/* Ambient Background Layer */}
            <div className="absolute inset-0 z-0">
                <BeamGridBackground 
                    gridColor="rgba(255, 255, 255, 0.05)" 
                    darkGridColor="rgba(255, 255, 255, 0.05)" 
                    beamColor="rgba(139, 92, 246, 0.5)" 
                    darkBeamColor="rgba(139, 92, 246, 0.5)" 
                    beamThickness={1}
                />
            </div>

            {/* Floating Decorative Posters - Now Clickable */}
            {heroPosters[0] && <FloatingPoster src={heroPosters[0].imageUrl} className="top-[15%] left-[5%] rotate-[-6deg]" delay={0} onClick={handlePosterClick} />}
            {heroPosters[1] && <FloatingPoster src={heroPosters[1].imageUrl} className="bottom-[25%] right-[8%] rotate-[6deg]" delay={1.5} onClick={handlePosterClick} />}
            {heroPosters[2] && <FloatingPoster src={heroPosters[2].imageUrl} className="top-[20%] right-[15%] rotate-[3deg] hidden md:block" delay={2.5} onClick={handlePosterClick} />}

            <div className="text-center z-10 max-w-4xl relative">
                <motion.h1 
                    initial={{ letterSpacing: "-0.05em", opacity: 0, y: 20 }}
                    animate={{ letterSpacing: "0em", opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-6xl md:text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500 mb-6 relative overflow-hidden pb-2"
                >
                    FrameShift
                    {/* Sheen Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shine pointer-events-none" />
                </motion.h1>
                
                <motion.div
                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                >
                    <p className="text-xl md:text-2xl text-neutral-400 font-light tracking-wide max-w-2xl mx-auto">
                        Where digital art meets social motion.
                    </p>
                    <motion.div 
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="text-sm text-neutral-600 mt-6 flex flex-col items-center gap-2"
                    >
                        <span>Scroll to explore</span>
                        <ArrowRight className="rotate-90 text-accent" size={16} />
                    </motion.div>
                </motion.div>
            </div>

            {/* React Bits-style Floating Section */}
            <motion.div 
                className="absolute bottom-10 left-0 right-0 z-20 flex justify-center w-full"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >
                <div className="flex gap-4 px-8 py-4 overflow-x-auto no-scrollbar mask-gradient-sides max-w-full">
                    <FeatureCard icon={Compass} title="Explore" desc="Discover trending visuals from around the globe." />
                    <FeatureCard icon={Users} title="Connect" desc="Follow creators and build your artistic network." />
                    <FeatureCard icon={Plus} title="Create" desc="Share your masterpiece and remix others." />
                </div>
            </motion.div>
        </div>

        {/* Existing Panels (Posters) */}
        {heroPosters.map((poster, index) => (
          <div key={poster.id} className="hero-panel w-screen h-full flex-shrink-0 flex items-center justify-center p-8 md:p-20 relative bg-black">
             <div className="absolute inset-0 opacity-20">
                 <BeamGridBackground interactive={false} beamCount={5} />
             </div>
             <div 
                onClick={handlePosterClick}
                className="relative w-full h-full max-w-[500px] max-h-[700px] group perspective-1000 z-10 cursor-pointer"
             >
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <img 
                    src={poster.imageUrl} 
                    alt={poster.title}
                    className="w-full h-full object-cover rounded-sm shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]" 
                />
                <div className="absolute bottom-[-40px] left-0">
                    <h2 className="text-4xl font-display font-bold text-white">{poster.title}</h2>
                    <p className="text-neutral-400">by @{poster.creator.username}</p>
                </div>
             </div>
             <span className="absolute bottom-10 right-10 text-[10rem] font-display font-bold text-white/5 pointer-events-none select-none">
                0{index + 1}
             </span>
          </div>
        ))}
      </div>
    </div>
  );
};
