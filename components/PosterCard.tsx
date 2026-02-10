
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bookmark } from 'lucide-react';
import { Poster } from '../types';
import { useGlobalContext } from '../context/GlobalContext';

interface PosterCardProps {
  poster: Poster;
  onClick: (poster: Poster) => void;
  featured?: boolean;
}

export const PosterCard: React.FC<PosterCardProps> = ({ poster, onClick, featured = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  
  const { isSaved, toggleSave, isLiked, toggleLike, getLikeCount, user } = useGlobalContext();
  const saved = user ? isSaved(poster.id) : false;
  const liked = user ? isLiked(poster.id) : false;
  
  // Calculate total likes: Mock initial likes + real-time user likes
  const realLikes = getLikeCount(poster.id); 
  const totalLikes = (poster.likes || 0) + realLikes;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return; 
    
    // Standard behavior: Double tap always likes (and shows heart animation)
    if (!liked) toggleLike(poster.id);
    
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) toggleSave(poster.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) toggleLike(poster.id);
  };

  return (
    <motion.div
      layoutId={`poster-card-${poster.id}`}
      className={`relative break-inside-avoid group rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 shadow-lg hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 ${featured ? 'mb-0 h-full' : 'mb-6'}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(poster)}
      onDoubleClick={handleDoubleClick}
      whileHover={{ y: -8, scale: 1.02 }}
      style={{ isolation: 'isolate' }}
    >
      <div className="overflow-hidden relative w-full h-full">
        <motion.img
          layoutId={`poster-image-${poster.id}`}
          src={poster.imageUrl}
          alt={poster.title}
          className={`w-full object-cover will-change-transform ${featured ? 'h-full' : 'h-auto'}`}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0'}`} />

        {/* Double Click Heart Animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
              initial={{ scale: 0, opacity: 0, rotate: -20 }}
              animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 20, y: -20 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 15,
                mass: 0.8
              }}
            >
              <div className="relative">
                <Heart className="w-24 h-24 text-transparent fill-red-500/30 absolute inset-0 blur-lg scale-110" />
                <Heart className="w-24 h-24 text-white fill-red-500 drop-shadow-2xl relative z-10" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-5 transform transition-all duration-300 z-20 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-center justify-between">
              {/* Creator Info */}
              <div className="flex items-center space-x-3 overflow-hidden">
                  <img src={poster.creator.avatar} alt={poster.creator.username} className="w-9 h-9 rounded-full border border-white/30 shadow-sm" />
                  <div className="flex flex-col text-shadow-sm">
                    <span className="text-sm font-bold text-white leading-tight truncate drop-shadow-md">{poster.title}</span>
                    <span className="text-xs font-medium text-neutral-200 truncate drop-shadow-md">@{poster.creator.username}</span>
                  </div>
              </div>
              
              {/* Actions */}
              {user && (
                  <div className="flex items-center space-x-2 shrink-0">
                      {/* Like Button with Count */}
                      <button 
                          onClick={handleLike}
                          className={`group/btn relative flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-md transition-all active:scale-90 border ${
                            liked 
                              ? "bg-red-500/20 border-red-500/30 hover:bg-red-500/30" 
                              : "bg-white/10 border-white/10 hover:bg-white/20"
                          }`}
                      >
                          <Heart 
                            size={18} 
                            className={`transition-all duration-300 ${liked ? "text-red-500 fill-red-500" : "text-white group-hover/btn:scale-110"}`} 
                          />
                          <span className={`text-xs font-bold ${liked ? "text-red-100" : "text-white"}`}>
                            {totalLikes}
                          </span>
                      </button>

                      {/* Save Button */}
                      <button 
                          onClick={handleSave}
                          className="group/btn relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all active:scale-90 border border-white/10"
                      >
                          <Bookmark size={20} className={`transition-all duration-300 ${saved ? "text-accent fill-accent scale-110" : "text-white group-hover/btn:scale-110"}`} />
                      </button>
                  </div>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
