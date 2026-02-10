
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, PlusSquare, BarChart2 } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { UploadModal } from './UploadModal';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useGlobalContext();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Hide bottom nav on login page to avoid clutter
  if (location.pathname === '/login') return null;

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-black border-t border-black/5 dark:border-white/10 flex items-center justify-around z-40 pb-safe">
        <Link to="/" className={`p-2 transition-colors ${isActive('/') ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
          <Home size={24} strokeWidth={isActive('/') ? 3 : 2} />
        </Link>
        
        <Link to="/explore" className={`p-2 transition-colors ${isActive('/explore') ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
          <Compass size={24} strokeWidth={isActive('/explore') ? 3 : 2} />
        </Link>

        <button 
          onClick={() => setIsUploadOpen(true)}
          className="p-2 -mt-6 bg-accent rounded-full text-white shadow-lg shadow-accent/50 cursor-pointer hover:scale-105 transition-transform"
        >
          <PlusSquare size={24} />
        </button>

        <Link to="/analytics" className={`p-2 transition-colors ${isActive('/analytics') ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
          <BarChart2 size={24} strokeWidth={isActive('/analytics') ? 3 : 2} />
        </Link>

        <Link to="/profile" className={`p-2 transition-colors ${isActive('/profile') ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
          <div className={`w-7 h-7 rounded-full overflow-hidden border-2 ${isActive('/profile') ? 'border-black dark:border-white' : 'border-transparent'}`}>
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest`} 
                className="w-full h-full object-cover" 
                alt="Profile"
              />
          </div>
        </Link>
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
    </>
  );
};
