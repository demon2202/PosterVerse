
import React, { useState, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Feed } from '../components/Feed';
import { Poster } from '../types';
import { PosterModal } from '../components/PosterModal';
import { useGlobalContext } from '../context/GlobalContext';
import { X, Filter } from 'lucide-react';

export const Explore: React.FC = () => {
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { posters, likedPosters, savedPosters, user, allUsers, toggleFollow, isFollowing } = useGlobalContext();

  // Smart Recommendation Algorithm
  const sortedPosters = useMemo(() => {
    // 1. Collect tags from liked/saved posters
    const interactedPosterIds = [...likedPosters, ...savedPosters];
    const preferredTags = new Set<string>();
    
    posters.forEach(p => {
        if (interactedPosterIds.includes(p.id)) {
            p.tags.forEach(t => preferredTags.add(t));
        }
    });

    return [...posters].sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        // Boost own uploads
        if (user && a.creatorId === user.id) scoreA += 100;
        if (user && b.creatorId === user.id) scoreB += 100;

        // Boost based on tag matching
        if (a.tags.some(t => preferredTags.has(t))) scoreA += 5;
        if (b.tags.some(t => preferredTags.has(t))) scoreB += 5;

        // Boost recent uploads (simple check if it's a 'p-' ID which we assume is new)
        if (a.id.startsWith('p-')) scoreA += 10;
        if (b.id.startsWith('p-')) scoreB += 10;

        // Fallback to likes count
        scoreA += a.likes * 0.001;
        scoreB += b.likes * 0.001;

        return scoreB - scoreA;
    });
  }, [posters, likedPosters, savedPosters, user]);

  // Filter Logic - Fixed to handle case sensitivity and partial matches properly
  const filteredPosters = useMemo(() => {
    if (!activeTag) return sortedPosters;
    
    // Normalize the active tag to lowercase for comparison
    const term = activeTag.toLowerCase();
    
    return sortedPosters.filter(p => 
        p.tags.some(t => {
            const tagLower = t.toLowerCase();
            // Handle specific edge cases or general inclusion
            if (term === '3d render' || term === '3d') return tagLower.includes('3d');
            if (term === 'swiss style') return tagLower.includes('swiss');
            return tagLower.includes(term);
        })
    );
  }, [sortedPosters, activeTag]);

  const categories = ['Typography', '3D', 'Swiss Style', 'Minimal', 'Abstract', 'Cyberpunk', 'Retro'];

  return (
    <div className="min-h-screen bg-black pt-20 transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-12">
            <h1 className="text-4xl font-display font-bold text-white mb-6">Explore</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium uppercase tracking-widest mr-2">
                    <Filter size={16} /> Filter by
                </div>
                <div className="flex flex-wrap gap-2">
                    {categories.map(tag => (
                        <button 
                            key={tag} 
                            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            className={`px-6 py-2 rounded-full border transition-all duration-200 text-sm font-medium cursor-pointer ${
                                activeTag === tag 
                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] transform scale-105' 
                                : 'border-white/10 hover:bg-white/10 text-white hover:border-white/30'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                    {activeTag && (
                        <button 
                            onClick={() => setActiveTag(null)}
                            className="px-3 py-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                            title="Clear Filter"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
        
        {/* Trending Creators Horizontal Scroll */}
        <div className="mb-12">
            <h3 className="text-lg font-bold text-white mb-4">Trending Creators</h3>
            <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x">
                {allUsers.slice(0, 10).map(u => (
                    <div key={u.id} className="flex-shrink-0 snap-start w-64 bg-neutral-900 border border-white/5 rounded-xl p-4 flex flex-col items-center hover:border-accent/50 transition-colors cursor-pointer group">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-accent transition-all">
                            <img src={u.avatar} className="w-full h-full object-cover" alt={u.username} />
                        </div>
                        <h4 className="font-bold text-white">{u.name}</h4>
                        <p className="text-sm text-neutral-400 mb-3">@{u.username}</p>
                        {user && user.id !== u.id && (
                             <button 
                                onClick={() => toggleFollow(u.id)}
                                className={`w-full py-2 text-sm font-medium rounded-lg transition-colors ${isFollowing(u.id) ? 'bg-white text-black hover:bg-neutral-200' : 'bg-white/5 text-white hover:bg-white hover:text-black'}`}
                            >
                                {isFollowing(u.id) ? 'Following' : 'Follow'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div className="min-h-[400px]">
            <Feed posters={filteredPosters} onPosterClick={setSelectedPoster} />
        </div>
      </div>

      <PosterModal 
        poster={selectedPoster} 
        onClose={() => setSelectedPoster(null)} 
      />
    </div>
  );
};
