
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, Sun, Moon, MessageSquare, LogIn, PlusSquare, Sparkles, Heart, UserPlus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalContext } from '../context/GlobalContext';
import { UploadModal } from './UploadModal';

export const Navbar: React.FC = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'All' | 'Creators' | 'Posters' | 'Tags'>('All');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { theme, toggleTheme, notifications, unreadCount, markAsRead, user, logout, posters, allUsers } = useGlobalContext();

  const trendingTags = ['#3DRender', '#Typography', '#Abstract'];

  useEffect(() => {
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
        setActiveIndex(-1);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [searchQuery, searchFilter]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markAsRead();
    }
  };

  const handleNotificationItemClick = (type: string, refId?: string) => {
      setShowNotifications(false);
      if (type === 'message') navigate('/messages');
      else if (type === 'follow') navigate('/profile');
      else if (type === 'like' || type === 'system') navigate('/explore');
  };

  // Improved Search Logic
  const filteredUsers = useMemo(() => {
    if (searchFilter === 'Posters' || searchFilter === 'Tags') return [];
    if (!searchQuery) return [];
    
    const q = searchQuery.toLowerCase().replace('@', '');
    return allUsers.filter(u => 
        u.username.toLowerCase().includes(q) || 
        u.name.toLowerCase().includes(q)
    ).slice(0, 5); // Increased limit to find new users easily
  }, [searchQuery, searchFilter, allUsers]);

  const filteredPosters = useMemo(() => {
    if (searchFilter === 'Creators') return [];
    if (!searchQuery) return [];
    
    const q = searchQuery.toLowerCase();
    
    return posters.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const tagMatch = p.tags.some(t => t.toLowerCase().includes(q));
        
        if (searchFilter === 'Posters') return titleMatch;
        if (searchFilter === 'Tags') return tagMatch;
        // All
        return titleMatch || tagMatch;
    }).slice(0, 5);
  }, [searchQuery, searchFilter, posters]);

  // Unified list for keyboard navigation
  const navigableItems = useMemo(() => {
    if (searchQuery.length === 0) {
        return trendingTags.map(tag => ({ type: 'tag', data: tag }));
    }
    return [
        ...filteredUsers.map(u => ({ type: 'user', data: u })),
        ...filteredPosters.map(p => ({ type: 'poster', data: p }))
    ];
  }, [searchQuery, filteredUsers, filteredPosters]);

  // Keyboard Handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchFocused) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev < navigableItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : navigableItems.length - 1));
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && navigableItems[activeIndex]) {
            const item = navigableItems[activeIndex];
            if (item.type === 'tag') {
                setSearchQuery(item.data as string);
                setActiveIndex(-1);
            } else if (item.type === 'user') {
                const u = item.data as any;
                navigate(`/profile/${u.id}`);
                setIsSearchFocused(false);
            } else if (item.type === 'poster') {
                const p = item.data as any;
                navigate(`/explore?poster=${p.id}`);
                setIsSearchFocused(false);
            }
        }
    } else if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setActiveIndex(-1);
    }
  };

  const navVariants = {
      initial: { 
          height: '5rem', // h-20
          backgroundColor: 'rgba(0,0,0,0)', 
          backdropFilter: 'blur(0px)',
          borderBottomColor: 'rgba(255,255,255,0.05)'
      },
      scrolled: { 
          height: '4rem', // h-16
          backgroundColor: 'rgba(5,5,5,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottomColor: 'rgba(255,255,255,0.1)'
      }
  };

  const iconVariants = {
      hover: { scale: 1.1, rotate: 5 }
  };
  
  const getNotificationIcon = (type: string) => {
      switch(type) {
          case 'like': return <Heart size={16} className="text-red-500 fill-current" />;
          case 'follow': return <UserPlus size={16} className="text-blue-500" />;
          case 'message': return <MessageSquare size={16} className="text-green-500" />;
          default: return <Sparkles size={16} className="text-accent" />;
      }
  };

  return (
    <>
      <motion.nav 
        initial="initial"
        animate={isScrolled ? "scrolled" : "initial"}
        variants={navVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-40 border-b flex items-center"
      >
        {/* Subtle Gradient Edge Highlight on Scroll */}
        <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" 
            initial={{ opacity: 0 }}
            animate={{ opacity: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.5 }}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex items-center justify-between relative">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-display font-bold text-black dark:text-white tracking-tighter group relative z-10">
             <span className="relative z-10">Frame<span className="text-accent group-hover:text-blue-500 transition-colors">Shift</span></span>
             <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                layoutId="logoUnderline"
             />
          </Link>

          {/* Desktop Nav & Search */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center max-w-2xl mx-auto z-10">
             <div className="relative w-full max-w-md" ref={searchRef}>
                <motion.div 
                    layout
                    className={`relative flex items-center bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-4 py-2.5 transition-all duration-300 ${
                        isSearchFocused 
                        ? 'bg-white dark:bg-black shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-accent/40 w-[120%] -translate-x-[10%]' 
                        : 'w-full hover:bg-black/10 dark:hover:bg-white/10'
                    }`}
                >
                   <Search size={18} className={`mr-2 transition-colors ${isSearchFocused ? 'text-accent' : 'text-neutral-500 dark:text-neutral-400'}`} />
                   <input
                     type="text"
                     placeholder={isSearchFocused ? "Search..." : "Search @creators, #tags..."}
                     className="bg-transparent border-none outline-none text-black dark:text-white text-sm w-full placeholder-neutral-500 transition-all caret-accent"
                     onFocus={() => setIsSearchFocused(true)}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     onKeyDown={handleKeyDown}
                   />
                   {isSearchFocused && searchQuery && (
                       <button onClick={() => setSearchQuery('')} className="p-1 hover:text-accent text-neutral-400">
                           <X size={14} />
                       </button>
                   )}
                </motion.div>

                {/* Search Dropdown */}
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(10px)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute top-full left-[-10%] right-[-10%] mt-4 bg-white/95 dark:bg-[#0a0a0a]/95 border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1 z-50 backdrop-blur-xl"
                    >
                      <div className="p-4">
                        {/* Dynamic Filter Buttons */}
                        {searchQuery.length > 0 && (
                            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                                {['All', 'Creators', 'Posters', 'Tags'].map((filter) => (
                                    <button
                                      key={filter}
                                      onClick={() => setSearchFilter(filter as any)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-transparent ${
                                          searchFilter === filter 
                                          ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                                          : 'bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-black dark:hover:text-white hover:border-white/10'
                                      }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        )}

                        {searchQuery.length === 0 ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="px-2 mb-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1"><Sparkles size={10} className="text-accent" /> Trending Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {trendingTags.map((tag, i) => (
                                            <motion.span 
                                              key={tag}
                                              initial={{ opacity: 0, x: -10 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: i * 0.05 }}
                                              onClick={() => setSearchQuery(tag)}
                                              onMouseEnter={() => setActiveIndex(i)}
                                              className={`px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 cursor-pointer transition-colors ${activeIndex === i ? 'bg-accent/20 text-accent' : 'bg-neutral-100 dark:bg-white/5 hover:bg-accent/10 hover:text-accent'}`}
                                            >
                                                {tag}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                               {filteredUsers.length > 0 && (
                                   <div className="mb-4">
                                       <p className="px-2 mb-2 text-[10px] font-bold text-neutral-500 uppercase">Creators</p>
                                       {filteredUsers.map((user, idx) => (
                                           <Link 
                                              to={`/profile/${user.id}`} 
                                              onClick={() => setIsSearchFocused(false)}
                                              onMouseEnter={() => setActiveIndex(idx)}
                                              key={user.id} 
                                              className={`flex items-center space-x-3 p-2 rounded-xl cursor-pointer transition-colors group ${activeIndex === idx ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                                           >
                                               <img src={user.avatar} className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800" alt={user.username} />
                                               <div>
                                                   <p className="text-sm font-bold text-black dark:text-white group-hover:text-accent transition-colors">{user.username}</p>
                                                   <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.name}</p>
                                               </div>
                                           </Link>
                                       ))}
                                   </div>
                               )}
                               {filteredPosters.length > 0 && (
                                   <div>
                                       <p className="px-2 mb-2 text-[10px] font-bold text-neutral-500 uppercase">Posters</p>
                                       {filteredPosters.map((poster, idx) => {
                                           const adjustedIdx = idx + filteredUsers.length;
                                           return (
                                               <div key={poster.id} className={`flex items-center space-x-3 p-2 rounded-xl cursor-pointer transition-colors group ${activeIndex === adjustedIdx ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                                                   onClick={() => {
                                                       navigate(`/explore?poster=${poster.id}`);
                                                       setIsSearchFocused(false);
                                                   }}
                                                   onMouseEnter={() => setActiveIndex(adjustedIdx)}
                                               >
                                                   <img src={poster.imageUrl} className="w-8 h-10 object-cover rounded shadow-sm group-hover:shadow-md transition-shadow" alt={poster.title} />
                                                   <div>
                                                       <p className="text-sm font-bold text-black dark:text-white group-hover:text-accent transition-colors">{poster.title}</p>
                                                       <p className="text-xs text-neutral-500 dark:text-neutral-400">by @{poster.creator.username}</p>
                                                   </div>
                                               </div>
                                           );
                                       })}
                                   </div>
                               )}
                               {filteredUsers.length === 0 && filteredPosters.length === 0 && (
                                   <div className="text-center py-8 text-neutral-500 text-sm">No results found.</div>
                               )}
                            </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-6 z-10">
            <Link to="/explore" className={`relative text-sm font-bold transition-colors ${location.pathname === '/explore' ? 'text-black dark:text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'}`}>
                Explore
                {location.pathname === '/explore' && <motion.div layoutId="navUnderline" className="absolute -bottom-6 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_currentColor]" />}
            </Link>
            
            {user ? (
              <>
                <button 
                  onClick={() => setIsUploadOpen(true)}
                  className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-accent transition-colors"
                  title="Upload Poster"
                >
                  <PlusSquare size={20} />
                </button>

                <Link to="/messages" className={`relative group p-2 text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors`}>
                    <MessageSquare size={20} />
                    {location.pathname === '/messages' && <motion.div layoutId="navUnderline" className="absolute -bottom-4 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_currentColor]" />}
                </Link>

                <motion.button 
                  onClick={toggleTheme}
                  whileHover="hover"
                  variants={iconVariants}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-300 transition-colors relative"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </motion.button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <motion.button 
                    onClick={handleNotificationClick}
                    whileHover="hover"
                    variants={iconVariants}
                    className="relative text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors p-2"
                  >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent rounded-full animate-pulse border-2 border-white dark:border-black shadow-sm" />
                      )}
                  </motion.button>
                  
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-4 w-80 bg-white/95 dark:bg-neutral-900/95 border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                      >
                        <div className="p-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/5 dark:bg-white/5">
                          <h3 className="font-bold text-black dark:text-white">Notifications</h3>
                          <button onClick={markAsRead} className="text-xs text-accent hover:underline font-medium">Mark all read</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length > 0 ? notifications.map(notif => (
                              <div 
                                key={notif.id} 
                                onClick={() => handleNotificationItemClick(notif.type, notif.referenceId)}
                                className={`p-4 flex items-start space-x-3 border-b border-black/5 dark:border-white/5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${!notif.read ? 'bg-accent/5' : ''}`}
                              >
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 relative overflow-hidden">
                                    {notif.userAvatar ? (
                                        <>
                                            <img src={notif.userAvatar} className="w-full h-full object-cover opacity-80" alt="Notification" />
                                            <div className="absolute inset-0 bg-black/20" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {getNotificationIcon(notif.type)}
                                            </div>
                                        </>
                                    ) : (
                                        getNotificationIcon(notif.type)
                                    )}
                                  {!notif.read && <div className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full border border-white dark:border-black" />}
                                </div>
                                <div>
                                  <p className="text-sm text-black dark:text-white leading-tight">
                                    {notif.userId && <span className="font-bold">@{notif.userId} </span>}
                                    {notif.text}
                                  </p>
                                  <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-wide flex items-center gap-1">
                                      {notif.time}
                                      {notif.type !== 'system' && <ArrowRight size={8} />}
                                  </p>
                                </div>
                              </div>
                            )) : (
                                <div className="p-8 text-center text-neutral-500 text-sm">No new notifications.</div>
                            )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to={`/profile/${user.id}`} className="relative group w-9 h-9 rounded-full bg-gradient-to-tr from-accent to-blue-500 p-[2px]">
                   <img src={user.avatar} className="w-full h-full rounded-full border-2 border-white dark:border-black relative z-10" alt="Profile" />
                </Link>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                <LogIn size={18} /> Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-black dark:text-white z-10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
             {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </motion.nav>

      {/* Upload Modal */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed inset-0 z-50 bg-white dark:bg-black pt-20 px-6 md:hidden flex flex-col"
            >
                <div className="flex flex-col space-y-8 text-2xl font-display font-bold">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-black dark:text-white">Home</Link>
                    <Link to="/explore" onClick={() => setMobileMenuOpen(false)} className="text-neutral-500 dark:text-neutral-400">Explore</Link>
                    {user ? (
                      <>
                        <button onClick={() => { setIsUploadOpen(true); setMobileMenuOpen(false); }} className="text-left text-neutral-500 dark:text-neutral-400">Create Poster</button>
                        <Link to="/messages" onClick={() => setMobileMenuOpen(false)} className="text-neutral-500 dark:text-neutral-400">Messages</Link>
                        <Link to={`/profile/${user.id}`} onClick={() => setMobileMenuOpen(false)} className="text-neutral-500 dark:text-neutral-400">Profile</Link>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-accent">Log In</Link>
                    )}
                </div>
                
                <div className="mt-auto mb-10 space-y-6">
                    <div className="flex items-center justify-between pt-6 border-t border-black/10 dark:border-white/10">
                      <span className="text-sm font-medium text-neutral-500">Theme</span>
                      <button onClick={toggleTheme} className="p-3 bg-black/5 dark:bg-white/10 rounded-full">
                         {theme === 'dark' ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-black" />}
                      </button>
                    </div>
                    {user && (
                      <button onClick={() => {logout(); setMobileMenuOpen(false)}} className="w-full py-4 border border-black/10 dark:border-white/10 text-neutral-500 font-bold rounded-xl">
                        Log Out
                      </button>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
