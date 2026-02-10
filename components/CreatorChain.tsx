import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Sparkles } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface CreatorCardProps {
  user: User;
  isFollowing: boolean;
  onFollow: (e: React.MouseEvent) => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ user, isFollowing, onFollow }) => {
    const navigate = useNavigate();
    
    return (
        <div 
            onClick={() => navigate(`/profile/${user.id}`)}
            className="group relative w-full aspect-[4/5] rounded-xl overflow-hidden cursor-pointer bg-neutral-900 border border-white/10 hover:border-accent/50 transition-all duration-300 transform-gpu"
        >
            {/* Optimized Image Loading */}
            <img 
                src={`${user.avatar}&w=300&h=300&q=80`} 
                alt={user.username} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
                loading="lazy"
                decoding="async"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-between">
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-white text-sm truncate pr-2">{user.name}</h3>
                        <p className="text-xs text-neutral-400 truncate">@{user.username}</p>
                    </div>
                    <button 
                        onClick={onFollow}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                            isFollowing 
                            ? 'bg-white text-black scale-100 opacity-100' 
                            : 'bg-accent text-white scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                        }`}
                    >
                        {isFollowing ? <Check size={14} /> : <Plus size={16} />}
                    </button>
                </div>
                
                {/* Bio snippet on hover */}
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                    <p className="text-[10px] text-neutral-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 line-clamp-2">
                        {user.bio || "Digital artist & visual curator."}
                    </p>
                </div>
            </div>
        </div>
    );
};

const MarqueeColumn = ({ users, duration, direction = 'up' }: { users: User[], duration: number, direction?: 'up' | 'down' }) => {
    const { isFollowing, toggleFollow } = useGlobalContext();
    
    // Triple the list to ensure seamless looping without visual gaps
    const list = useMemo(() => [...users, ...users, ...users], [users]);

    return (
        <div className="relative w-full md:w-64 flex-shrink-0">
            <motion.div
                initial={{ y: direction === 'up' ? 0 : -1000 }}
                animate={{ y: direction === 'up' ? -1000 : 0 }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}
                className="flex flex-col gap-4 will-change-transform"
            >
                {list.map((user, idx) => (
                    <CreatorCard 
                        key={`${user.id}-${idx}-${direction}`} 
                        user={user} 
                        isFollowing={isFollowing(user.id)}
                        onFollow={(e) => {
                            e.stopPropagation();
                            toggleFollow(user.id);
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
};

export const CreatorChain: React.FC = () => {
  const { allUsers } = useGlobalContext();

  // Filter valid users and slice to ensure performance
  const validUsers = useMemo(() => 
    allUsers.filter(u => u && u.id && u.username).slice(0, 15), 
  [allUsers]);

  if (validUsers.length === 0) return null;

  // Split users into chunks for columns
  const chunk1 = validUsers.slice(0, 5);
  const chunk2 = validUsers.slice(5, 10);
  const chunk3 = validUsers.slice(10, 15);

  return (
    <section className="relative py-24 bg-black overflow-hidden flex flex-col items-center justify-center min-h-[900px]">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 mb-16 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-accent text-xs font-bold uppercase tracking-widest mb-4">
                    <Sparkles size={12} /> Community
                </div>
                <h2 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-4 tracking-tight">
                    Featured Creators
                </h2>
                <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                    Follow the visionaries defining the next generation of digital art.
                </p>
            </motion.div>
        </div>
        
        {/* Skewed Marquee Container */}
        <div className="relative w-full h-[800px] overflow-hidden mask-gradient-y flex justify-center">
            <div className="flex gap-4 md:gap-8 transform -rotate-3 scale-110 origin-center">
                {/* Column 1: Slow Up */}
                <div className="hidden md:block">
                    <MarqueeColumn users={chunk1.length ? chunk1 : validUsers} duration={45} direction="up" />
                </div>
                
                {/* Column 2: Fast Down (Center) */}
                <div className="scale-110 z-10 shadow-2xl shadow-black/50">
                    <MarqueeColumn users={chunk2.length ? chunk2 : validUsers} duration={35} direction="down" />
                </div>

                {/* Column 3: Slow Up */}
                <div className="hidden md:block">
                    <MarqueeColumn users={chunk3.length ? chunk3 : validUsers} duration={50} direction="up" />
                </div>

                {/* Mobile Fallback: Single Column */}
                <div className="md:hidden block">
                    <MarqueeColumn users={validUsers} duration={40} direction="up" />
                </div>
            </div>

            {/* Top/Bottom Fade Masks */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
        </div>

        {/* Call to Action */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative z-20 mt-[-50px]"
        >
            <button 
                onClick={() => window.location.hash = '/explore'}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 hover:bg-neutral-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
                Discover All Creators
            </button>
        </motion.div>
    </section>
  );
};