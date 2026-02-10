import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Poster } from '../types';
import { PosterCard } from './PosterCard';

interface PosterCarouselProps {
  posters: Poster[];
  onPosterClick: (poster: Poster) => void;
}

export const PosterCarousel: React.FC<PosterCarouselProps> = ({ posters, onPosterClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full">
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-8 pt-2 px-4 md:px-8 snap-x no-scrollbar"
      >
        {posters.map((poster, idx) => (
          <div key={poster.id} className="min-w-[280px] md:min-w-[320px] snap-start">
             <PosterCard poster={poster} onClick={onPosterClick} />
          </div>
        ))}
        {/* Spacer for right padding */}
        <div className="min-w-[1px] h-1" />
      </div>
      
      {/* Fade masks */}
      <div className="absolute top-0 bottom-8 left-0 w-8 bg-gradient-to-r from-white dark:from-black to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-8 right-0 w-8 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />
    </div>
  );
};
