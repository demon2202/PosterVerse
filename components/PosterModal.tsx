
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, Heart, Share2, Download, Check, Palette, Shield, Bookmark, AlertTriangle, Sparkles, Shuffle, Plus } from 'lucide-react';
import { Poster } from '../types';
import { useGlobalContext } from '../context/GlobalContext';
import { RemixModal } from './RemixModal';

interface PosterModalProps {
  poster: Poster | null;
  onClose: () => void;
}

export const PosterModal: React.FC<PosterModalProps> = ({ poster, onClose }) => {
  const { isFollowing, toggleFollow, isSaved, toggleSave, isLiked, toggleLike, posters, user } = useGlobalContext();
  const [cachedPoster, setCachedPoster] = useState<Poster | null>(poster);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [isRemixOpen, setIsRemixOpen] = useState(false);

  // Cache the poster data so we can display it during the exit animation
  useEffect(() => {
    if (poster) setCachedPoster(poster);
  }, [poster]);

  // Use cached poster for rendering to support exit animations when prop becomes null
  const activePoster = poster || cachedPoster;

  // Wait for cache to be populated
  if (!activePoster) return null;

  const following = isFollowing(activePoster.creatorId);
  const saved = isSaved(activePoster.id);
  const liked = isLiked(activePoster.id);
  const isOwnPoster = user?.id === activePoster.creatorId;
  
  // Find similar from global posters state
  const similarPosters = posters
    .filter(p => p.id !== activePoster.id && p.tags.some(t => activePoster.tags.includes(t)))
    .slice(0, 4);

  const handleShare = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(`${window.location.origin}/#/explore?poster=${activePoster.id}`);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
  };

  const requestDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return; 
    setShowDownloadConfirm(true);
  };

  const confirmDownload = () => {
    const link = document.createElement('a');
    link.href = activePoster.imageUrl;
    link.download = `${activePoster.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadConfirm(false);
  };

  const handleRemix = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsRemixOpen(true);
  };

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const modalVariants: Variants = {
    hidden: { 
        opacity: 0, 
        scale: 0.92, 
        y: 30,
    },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        transition: { 
            duration: 0.4,
            ease: [0.19, 1, 0.22, 1] // Luxurious easeOut
        } 
    },
    exit: { 
        opacity: 0, 
        scale: 0.92, 
        y: 30, 
        transition: { 
            duration: 0.3, 
            ease: [0.19, 1, 0.22, 1] 
        } 
    }
  };

  return (
    <>
    <AnimatePresence mode='wait'>
      {poster && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-8 pointer-events-auto">
            <motion.div
            className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-xl"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            key="backdrop"
            />
            
            <motion.div
            className="relative z-10 w-full max-w-7xl h-full md:h-[90vh] bg-white dark:bg-neutral-900/50 border border-black/10 dark:border-white/10 md:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="modal-content"
            >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors backdrop-blur-md"
            >
                <X size={24} />
            </button>

                {/* Download Confirmation Overlay */}
                <AnimatePresence>
                {showDownloadConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-neutral-900 border border-white/10 p-8 rounded-2xl max-w-sm w-full text-center"
                        >
                            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Download size={32} className="text-accent" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Download Poster?</h3>
                            <p className="text-neutral-400 mb-6">Are you sure you want to download this poster?</p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowDownloadConfirm(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDownload}
                                    className="flex-1 py-3 rounded-xl font-bold bg-white text-black hover:bg-neutral-200 transition-colors"
                                >
                                    Download
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>

            {/* Image Side */}
            <div className="flex-1 bg-neutral-100 dark:bg-black flex items-center justify-center overflow-hidden relative group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-black/0 to-black/20 pointer-events-none" />
                <div 
                className={`relative transition-all duration-500 ease-out cursor-zoom-in ${isZoomed ? 'scale-[1.5] cursor-zoom-out' : 'scale-100'}`}
                onClick={() => setIsZoomed(!isZoomed)}
                >
                    <img
                    src={activePoster.imageUrl}
                    alt={activePoster.title}
                    className="max-w-full max-h-[85vh] md:max-h-full object-contain shadow-2xl"
                    />
                </div>
                
                {/* Floating Action Bar */}
                {user && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-0 group-hover:-translate-y-2">
                        <button 
                        onClick={(e) => {e.stopPropagation(); toggleLike(activePoster.id)}} 
                        className="group relative flex flex-col items-center gap-1 min-w-[3rem]"
                        >
                            <Heart size={24} className={`transition-all duration-300 ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-white group-hover:scale-110'}`} />
                            <span className="text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">Like</span>
                        </button>
                        <div className="w-[1px] h-6 bg-white/20" />
                        <button 
                        onClick={(e) => {e.stopPropagation(); toggleSave(activePoster.id)}}
                        className="group relative flex flex-col items-center gap-1 min-w-[3rem]"
                        >
                            <Bookmark size={24} className={`transition-all duration-300 ${saved ? 'fill-accent text-accent scale-110' : 'text-white group-hover:scale-110'}`} />
                            <span className="text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">Save</span>
                        </button>
                        <div className="w-[1px] h-6 bg-white/20" />
                        <button 
                            onClick={handleRemix}
                            className="group relative flex flex-col items-center gap-1 min-w-[3rem]"
                        >
                            <Shuffle size={24} className="text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-180" />
                            <span className="text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">Remix</span>
                        </button>
                        <div className="w-[1px] h-6 bg-white/20" />
                        <button 
                            onClick={handleShare}
                            className="group relative flex flex-col items-center gap-1 min-w-[3rem]"
                        >
                            {showCopied ? <Check size={24} className="text-green-500" /> : <Share2 size={24} className="text-white transition-all duration-300 group-hover:scale-110" />}
                            <span className={`text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 whitespace-nowrap ${showCopied ? 'text-green-500' : 'text-white'}`}>
                                {showCopied ? 'Copied!' : 'Share'}
                            </span>
                        </button>
                        <div className="w-[1px] h-6 bg-white/20" />
                        <button 
                            onClick={requestDownload}
                            className="group relative flex flex-col items-center gap-1 min-w-[3rem]"
                        >
                            <Download size={24} className="text-white transition-all duration-300 group-hover:scale-110" />
                            <span className="text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">Get</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Details Side */}
            <div className="w-full md:w-[420px] bg-white/95 dark:bg-neutral-950/90 backdrop-blur-md flex flex-col border-l border-black/5 dark:border-white/5 h-full overflow-y-auto no-scrollbar">
                <div className="p-8 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <img src={activePoster.creator.avatar} alt={activePoster.creator.username} className="w-14 h-14 rounded-full border-2 border-accent" />
                            {following && <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-black shadow-sm" />}
                        </div>
                        <div>
                        <h3 className="font-bold text-black dark:text-white text-lg leading-tight">{activePoster.creator.name}</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm">@{activePoster.creator.username}</p>
                        </div>
                    </div>
                    {user && !isOwnPoster && (
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleFollow(activePoster.creatorId)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2
                                ${following 
                                ? 'bg-transparent border border-neutral-200 dark:border-neutral-800 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10' 
                                : 'bg-accent text-white hover:brightness-110 shadow-lg shadow-accent/20'
                                }`}
                        >
                            {following ? (
                                <>
                                    <Check size={16} /> Following
                                </>
                            ) : (
                                <>
                                    <Plus size={16} /> Follow
                                </>
                            )}
                        </motion.button>
                    )}
                </div>

                <h2 className="text-3xl font-display font-bold text-black dark:text-white mb-3">{activePoster.title}</h2>
                <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed">{activePoster.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-6">
                    {activePoster.tags.map(tag => (
                        <span key={tag} className="text-xs font-semibold text-accent bg-accent/5 border border-accent/20 px-3 py-1.5 rounded-full hover:bg-accent/10 transition-colors cursor-pointer">#{tag}</span>
                    ))}
                </div>

                {/* AI Metadata & Palette */}
                <div className="mt-8 p-5 bg-neutral-100 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1"><Palette size={12}/> AI Visual Data</span>
                        <span className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1 border border-neutral-300 dark:border-neutral-700 px-2 py-0.5 rounded"><Shield size={10}/> {activePoster.license}</span>
                    </div>
                    <div className="flex h-10 rounded-xl overflow-hidden shadow-inner">
                        {activePoster.colors.map((color, i) => (
                            <div key={i} className="flex-1 hover:flex-[2] transition-all duration-300 relative group" style={{ backgroundColor: color }}>
                                <span className="absolute bottom-1 left-1 text-[8px] font-mono text-white/80 opacity-0 group-hover:opacity-100">{color}</span>
                            </div>
                        ))}
                    </div>
                </div>
                </div>

                {/* Similar Posters Rail */}
                <div className="p-8 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-neutral-500 uppercase">Similar Vibes</p>
                        {similarPosters.length > 0 && <button className="text-xs text-accent hover:underline">View All</button>}
                    </div>
                    {similarPosters.length > 0 ? (
                        <div className={`flex ${similarPosters.length < 3 ? 'gap-8' : 'gap-4'} overflow-x-auto pb-4 no-scrollbar items-center`}>
                            {similarPosters.map(p => (
                                <div key={p.id} className="flex-shrink-0 w-32 aspect-[3/4] rounded-xl overflow-hidden bg-neutral-800 cursor-pointer hover:ring-2 ring-accent transition-all">
                                    <img src={p.imageUrl} className="w-full h-full object-cover" />
                                </div>
                            ))}
                            {/* Improved No More Posters Card */}
                            {similarPosters.length < 4 && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex-shrink-0 w-32 aspect-[3/4] rounded-xl flex flex-col items-center justify-center bg-white/5 border border-dashed border-neutral-300 dark:border-neutral-700 p-4 opacity-80 hover:opacity-100 transition-all group cursor-default"
                                >
                                    <Sparkles size={20} className="text-neutral-400 group-hover:text-accent mb-2 transition-colors" />
                                    <span className="text-[10px] text-neutral-500 group-hover:text-neutral-300 font-bold uppercase tracking-wider text-center transition-colors">
                                        No more similar posters available
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <div className="py-8 text-center bg-neutral-50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                            <div className="flex justify-center mb-2 text-neutral-400">
                                <AlertTriangle size={20} />
                            </div>
                            <p className="text-sm text-neutral-500">No similar posters found.</p>
                        </div>
                    )}
                </div>

                {/* Comments Placeholder */}
                <div className="flex-1 p-8 space-y-6">
                    <p className="text-xs font-bold text-neutral-500 uppercase">Comments (0)</p>
                    <div className="flex items-center justify-center h-20 text-neutral-500 text-sm italic">
                        Be the first to comment.
                    </div>
                </div>

                {/* Bottom Actions Mobile */}
                {user && (
                    <div className="p-4 border-t border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 sticky bottom-0 backdrop-blur-md md:hidden">
                    <button onClick={requestDownload} className="w-full py-3 bg-white dark:bg-white text-black font-bold rounded-xl shadow-lg">
                        Download Original
                    </button>
                    </div>
                )}
            </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>

    <RemixModal 
        isOpen={isRemixOpen} 
        onClose={() => setIsRemixOpen(false)} 
        originalPoster={activePoster}
    />
    </>
  );
};
