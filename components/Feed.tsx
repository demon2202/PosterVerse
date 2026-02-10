
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PosterCard } from './PosterCard';
import { Poster } from '../types';
import { Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeedProps {
  posters: Poster[];
  onPosterClick: (poster: Poster) => void;
}

export const Feed: React.FC<FeedProps> = ({ posters, onPosterClick }) => {
  if (posters.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center px-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/50"
      >
        <div className="relative mb-6">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
            <div className="relative w-20 h-20 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-full flex items-center justify-center shadow-lg">
                <Compass size={32} className="text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles size={14} fill="currentColor" />
            </div>
        </div>
        
        <h3 className="text-2xl font-display font-bold text-black dark:text-white mb-3">
            Inspiration Awaits
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mb-8 leading-relaxed">
            Your feed is currently empty. Follow creators or explore trending tags to populate your personal stream of visual culture.
        </p>
        
        <Link 
            to="/explore" 
            className="group px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-xl shadow-black/10 dark:shadow-white/10"
        >
            <Compass size={18} className="group-hover:rotate-45 transition-transform" />
            Start Exploring
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="columns-1 md:columns-2 lg:columns-3 gap-6 px-0 space-y-6"
    >
      {posters.map((poster) => (
        <PosterCard 
          key={poster.id} 
          poster={poster} 
          onClick={onPosterClick} 
        />
      ))}
    </motion.div>
  );
};
