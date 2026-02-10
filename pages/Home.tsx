
import React, { useState, useRef, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Feed } from '../components/Feed';
import { PosterModal } from '../components/PosterModal';
import { Poster, Story, User } from '../types';
import { useGlobalContext } from '../context/GlobalContext';
import { Plus, Compass, TrendingUp, Zap, UserPlus, ArrowRight, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { CreatorChain } from '../components/CreatorChain';
import { motion, AnimatePresence } from 'framer-motion';

export const Home: React.FC = () => {
  // 1. Unconditional Hook Calls
  const { getFeed, getStories, user, addStory, allUsers, isFollowing, toggleFollow, posters } = useGlobalContext();
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [viewingStory, setViewingStory] = useState<(Story & { user: User }) | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Computed Values
  const feed = user ? getFeed() : [];
  const stories = user ? getStories() : [];
  
  const spotlightPoster = useMemo(() => {
    return posters.length > 0 ? posters[0] : null;
  }, [posters]);

  const suggestedUsers = useMemo(() => {
    if (!user) return [];
    return allUsers
      .filter(u => u.id !== user.id && !isFollowing(u.id))
      .slice(0, 4);
  }, [allUsers, user, isFollowing]);

  const filteredFeed = useMemo(() => {
    if (activeCategory === 'All') return feed;
    return feed.filter(p => p.tags.some(t => t.toLowerCase().includes(activeCategory.toLowerCase())));
  }, [feed, activeCategory]);

  const CATEGORIES = ['All', '3D', 'Typography', 'Abstract', 'Minimal', 'Surreal'];

  const handleStoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            addStory(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  // 3. Conditional Rendering (After hooks)
  if (!user) {
     return (
       <div className="min-h-screen bg-black text-white">
         <Navbar />
         <Hero />
         <CreatorChain />
       </div>
     );
  }

  // Logged In View
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black transition-colors duration-300 pt-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* --- Main Content Area (Left/Center) --- */}
            <div className="lg:col-span-7 space-y-10">
                
                {/* 1. Enhanced Stories Rail */}
                <section>
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
                        {/* Add Story Button */}
                        <div className="flex flex-col items-center gap-2 flex-shrink-0 group cursor-pointer">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center hover:border-accent hover:bg-accent/5 transition-all relative overflow-hidden"
                            >
                                <Plus size={24} className="text-neutral-500 group-hover:text-accent transition-colors" />
                                <input type="file" ref={fileInputRef} onChange={handleStoryUpload} className="hidden" accept="image/*" />
                            </div>
                            <span className="text-xs font-medium text-neutral-500 group-hover:text-accent">Add Story</span>
                        </div>

                        {/* Story Items */}
                        {stories.map((story, i) => (
                            <motion.div 
                                key={story.id} 
                                onClick={() => setViewingStory(story)}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] bg-gradient-to-tr from-accent via-purple-500 to-blue-500 group-hover:rotate-180 transition-all duration-700">
                                    <div className="w-full h-full rounded-full border-[3px] border-white dark:border-black overflow-hidden relative">
                                        <img src={story.user.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={story.user.username} />
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate w-16 md:w-20 text-center">{story.user.username}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 2. Spotlight Banner */}
                {spotlightPoster && (
                    <section className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden group cursor-pointer shadow-2xl" onClick={() => setSelectedPoster(spotlightPoster)}>
                        <img src={spotlightPoster.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Spotlight" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
                        
                        <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center items-start z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">Daily Spotlight</span>
                                <span className="text-neutral-300 text-xs flex items-center gap-1"><Zap size={12} className="text-yellow-400 fill-yellow-400" /> Trending Now</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2 leading-tight max-w-lg shadow-black drop-shadow-lg">{spotlightPoster.title}</h2>
                            <p className="text-neutral-300 text-sm md:text-base max-w-md line-clamp-2 mb-6">{spotlightPoster.description}</p>
                            
                            <div className="flex items-center gap-3">
                                <img src={spotlightPoster.creator.avatar} className="w-8 h-8 rounded-full border border-white/20" alt="Creator" />
                                <span className="text-white font-medium text-sm">by @{spotlightPoster.creator.username}</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. Feed Header & Filters */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold font-display text-black dark:text-white">Your Feed</h1>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Latest from your network</p>
                        </div>
                        
                        {/* Filter Chips */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                        activeCategory === cat 
                                        ? 'bg-black dark:bg-white text-white dark:text-black' 
                                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredFeed.length > 0 ? (
                        <Feed posters={filteredFeed} onPosterClick={setSelectedPoster} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/20">
                            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                                <Compass size={32} className="text-neutral-400" />
                            </div>
                            <h2 className="text-xl font-bold text-black dark:text-white mb-2">No posters found</h2>
                            <p className="text-neutral-500 max-w-xs mb-6">Try adjusting your filters or follow more creators.</p>
                            <Link to="/explore" className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                                Find Creators
                            </Link>
                        </div>
                    )}
                </section>
            </div>

            {/* --- Sidebar (Right - Desktop Only) --- */}
            <div className="hidden lg:block lg:col-span-4 lg:col-start-9 space-y-8">
                
                {/* Daily Challenge Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-900 to-black border border-white/10 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-accent/30 transition-colors" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <Sparkles className="text-accent" />
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded">Daily Challenge</span>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-2">Neon Noir</h3>
                        <p className="text-sm text-neutral-400 mb-6">Create a poster using only 3 colors and high contrast lighting.</p>
                        <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:scale-[1.02] transition-transform">
                            Join Challenge
                        </button>
                    </div>
                </div>

                {/* Suggested Creators */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-black/5 dark:border-white/5 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-black dark:text-white">Who to follow</h3>
                        <Link to="/explore" className="text-xs text-accent font-medium hover:underline">View all</Link>
                    </div>
                    <div className="space-y-4">
                        {suggestedUsers.map(u => (
                            <div key={u.id} className="flex items-center justify-between">
                                <Link to={`/profile/${u.id}`} className="flex items-center gap-3 group">
                                    <img src={u.avatar} className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800" alt={u.username} />
                                    <div>
                                        <p className="text-sm font-bold text-black dark:text-white group-hover:text-accent transition-colors">{u.name}</p>
                                        <p className="text-xs text-neutral-500">@{u.username}</p>
                                    </div>
                                </Link>
                                <button 
                                    onClick={() => toggleFollow(u.id)}
                                    className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-accent hover:text-white transition-colors text-black dark:text-white"
                                >
                                    <UserPlus size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trending Tags */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-black/5 dark:border-white/5 p-6 shadow-sm">
                    <h3 className="font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={16} /> Trending Tags
                    </h3>
                    <div className="space-y-4">
                        {[
                            { tag: 'Cyberpunk', posts: '2.4k' },
                            { tag: 'SwissStyle', posts: '1.8k' },
                            { tag: 'Blender3D', posts: '950' },
                            { tag: 'Typography', posts: '3.2k' },
                        ].map((item, i) => (
                            <div key={item.tag} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <span className="text-neutral-400 text-sm font-mono">0{i + 1}</span>
                                    <div>
                                        <p className="text-sm font-bold text-black dark:text-white group-hover:text-accent transition-colors">#{item.tag}</p>
                                        <p className="text-xs text-neutral-500">{item.posts} posts</p>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-neutral-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Links */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-500 px-2">
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">About</a>
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Help</a>
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
                    <span>© 2024 FrameShift</span>
                </div>
            </div>
        </div>
      </main>

      <PosterModal 
        poster={selectedPoster} 
        onClose={() => setSelectedPoster(null)} 
      />

      {/* Full Screen Story Viewer */}
      <AnimatePresence>
        {viewingStory && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black flex flex-col"
            >
                {/* Story Progress Bar (Mock) */}
                <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-20">
                    <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        onAnimationComplete={() => setViewingStory(null)}
                        className="h-1 bg-white rounded-full flex-1" 
                    />
                </div>

                {/* Close Button */}
                <button 
                    onClick={() => setViewingStory(null)} 
                    className="absolute top-6 right-4 z-20 text-white p-2 rounded-full hover:bg-white/10"
                >
                    <X size={24} />
                </button>

                {/* User Info */}
                <div className="absolute top-6 left-4 z-20 flex items-center gap-3">
                    <img src={viewingStory.user.avatar} className="w-10 h-10 rounded-full border-2 border-white" alt={viewingStory.user.username} />
                    <div>
                        <p className="text-white font-bold text-sm drop-shadow-md">{viewingStory.user.name}</p>
                        <p className="text-white/80 text-xs drop-shadow-md">@{viewingStory.user.username}</p>
                    </div>
                </div>

                {/* Story Image */}
                <div className="flex-1 flex items-center justify-center relative">
                    <img 
                        src={viewingStory.imageUrl} 
                        className="w-full h-full object-contain" 
                        alt="Story" 
                    />
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
