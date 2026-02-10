
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Settings, MapPin, Link as LinkIcon, Grid, Bookmark, Layers, LogOut, Plus, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalContext } from '../context/GlobalContext';
import { PosterModal } from '../components/PosterModal';
import { Poster } from '../types';
import { useParams } from 'react-router-dom';
import { UploadModal } from '../components/UploadModal';
import { EditProfileModal } from '../components/EditProfileModal';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posters' | 'saved' | 'collections'>('posters');
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const { savedPosters, user: currentUser, logout, posters, allUsers, toggleFollow, isFollowing } = useGlobalContext();
  const { userId } = useParams();

  // Determine which user profile to show
  // If route has userId, find that user. If not (legacy or self), fallback to currentUser.
  const profileUser = userId ? allUsers.find(u => u.id === userId) : currentUser;

  // Security check: If checking own profile via ID, treat as own.
  const isOwnProfile = currentUser && profileUser && currentUser.id === profileUser.id;

  if (!profileUser) return <div className="min-h-screen flex items-center justify-center text-white bg-black">User not found</div>;

  const following = isFollowing(profileUser.id);

  // Filter real posters from state for this profile user
  const myPosters = posters.filter(p => p.creatorId === profileUser.id);
  // Fetch full poster objects based on saved IDs (Only for own profile)
  const savedPosterData = isOwnProfile ? posters.filter(p => savedPosters.includes(p.id)) : [];

  // Use the first poster cover or fallback
  const fallbackCover = posters[0]?.imageUrl || '';

  const collections = [
      { id: 'c1', title: 'Typography Inspiration', count: 12, cover: posters[0]?.imageUrl || fallbackCover },
      { id: 'c2', title: 'Cyberpunk Vibes', count: 8, cover: posters[2]?.imageUrl || fallbackCover },
  ];

  // Available tabs depend on if it's your profile
  const tabs = [
      { id: 'posters', icon: Grid, label: 'Posters' },
      { id: 'collections', icon: Layers, label: 'Collections' },
  ];
  if (isOwnProfile) {
      tabs.push({ id: 'saved', icon: Bookmark, label: 'Saved' });
  }

  const renderEmptyState = () => {
      if (activeTab === 'saved') {
          return (
            <div className="col-span-full py-20 text-center text-neutral-500 flex flex-col items-center">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4">
                    <Bookmark size={32} className="text-neutral-400" />
                </div>
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">No saved posters yet</h3>
                <p className="max-w-xs">Save posters you love to build your personal collection of inspiration.</p>
            </div>
          );
      }
      return (
        <div className="col-span-full py-20 text-center text-neutral-500">
            <p>No posters found in this section.</p>
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20 transition-colors duration-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
             <div className="relative group">
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-accent to-blue-500">
                     <img src={profileUser.avatar} className="w-full h-full rounded-full border-4 border-white dark:border-black object-cover" />
                 </div>
                 {isOwnProfile && (
                     <div 
                        onClick={() => setIsEditProfileOpen(true)}
                        className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                     >
                         <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-full backdrop-blur">Change</span>
                     </div>
                 )}
             </div>
             
             <div className="flex-1 w-full">
                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                     <h1 className="text-3xl font-display font-bold text-black dark:text-white mb-2 md:mb-0">{profileUser.username}</h1>
                     <div className="flex gap-3">
                         {isOwnProfile ? (
                             <>
                                <button onClick={logout} className="p-2 border border-black/10 dark:border-white/10 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Log Out">
                                    <LogOut size={20} />
                                </button>
                                <button 
                                    onClick={() => setIsEditProfileOpen(true)}
                                    className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-black/5 dark:shadow-white/5"
                                >
                                    Edit Profile
                                </button>
                                <button className="p-2 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
                                    <Settings size={20} />
                                </button>
                             </>
                         ) : (
                             currentUser && (
                                <button 
                                    onClick={() => toggleFollow(profileUser.id)}
                                    className={`px-8 py-2 font-medium rounded-lg transition-all shadow-lg ${following ? 'bg-transparent border border-neutral-600 text-black dark:text-white' : 'bg-accent text-white hover:opacity-90'}`}
                                >
                                    {following ? 'Following' : 'Follow'}
                                </button>
                             )
                         )}
                     </div>
                 </div>
                 
                 <div className="flex gap-8 mb-6 text-sm">
                     <span className="text-black dark:text-white"><strong className="font-bold">{profileUser.followers}</strong> followers</span>
                     <span className="text-black dark:text-white"><strong className="font-bold">{profileUser.following}</strong> following</span>
                 </div>
                 
                 <div className="mb-4">
                     <h2 className="font-bold text-black dark:text-white text-lg">{profileUser.name}</h2>
                     <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-lg">{profileUser.bio}</p>
                 </div>
                 
                 <div className="flex flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="flex items-center gap-1"><MapPin size={14} /> Global</span>
                    <span className="flex items-center gap-1 text-accent hover:underline cursor-pointer"><LinkIcon size={14} /> frameshift.app/{profileUser.username}</span>
                 </div>
             </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-8 md:gap-16 border-t border-black/10 dark:border-white/10 mb-8 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 border-t-2 text-xs md:text-sm font-medium uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'border-black dark:border-white text-black dark:text-white' : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'}`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>

        {/* Content */}
        <AnimatePresence mode='wait'>
            {activeTab === 'collections' ? (
                 <motion.div 
                    key="collections"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20"
                >
                    {/* CTA Button */}
                    {isOwnProfile && (
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex flex-col items-center justify-center aspect-[16/9] rounded-2xl bg-gradient-to-br from-accent to-blue-600 text-white cursor-pointer shadow-lg shadow-accent/25 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus size={32} className="text-white" />
                            </div>
                            <span className="font-display font-bold text-xl relative z-10">New Collection</span>
                            <span className="text-sm text-white/80 relative z-10 mt-1">Curate your inspiration</span>
                        </motion.div>
                    )}

                    {collections.map((col, idx) => (
                        <div key={col.id} className="group relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-black/5 dark:border-white/5">
                            <img src={col.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center text-center p-4">
                                <h3 className="text-2xl font-display font-bold text-white mb-1">{col.title}</h3>
                                <p className="text-sm text-neutral-200">{col.count} Posters</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    key="grid"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 pb-20"
                >
                    {/* Upload Poster Button (Only in Posters tab for own profile) */}
                    {isOwnProfile && activeTab === 'posters' && (
                        <motion.div 
                            onClick={() => setIsUploadOpen(true)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 flex flex-col items-center justify-center hover:border-accent transition-colors bg-black/5 dark:bg-white/5"
                        >
                             <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center mb-2 group-hover:bg-accent group-hover:text-white transition-colors">
                                <Upload size={24} className="text-neutral-500 dark:text-neutral-400 group-hover:text-white" />
                             </div>
                             <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 group-hover:text-accent">Upload Poster</span>
                        </motion.div>
                    )}

                    {(activeTab === 'posters' ? myPosters : savedPosterData).length > 0 ? (
                        (activeTab === 'posters' ? myPosters : savedPosterData).map((poster, idx) => (
                            <motion.div 
                                key={poster.id}
                                layoutId={`poster-${poster.id}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900"
                                onClick={() => setSelectedPoster(poster)}
                            >
                                <img src={poster.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white font-bold">
                                    <span>❤️ {poster.likes}</span>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        renderEmptyState()
                    )}
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <PosterModal 
        poster={selectedPoster} 
        onClose={() => setSelectedPoster(null)} 
      />

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
    </div>
  );
};
