import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { Poster } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { user, addPoster } = useGlobalContext();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !image) return;

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newPoster: Poster = {
      id: `p-${Date.now()}`,
      title,
      description: desc,
      imageUrl: image,
      creatorId: user.id,
      creator: user,
      likes: 0,
      tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      createdAt: new Date().toISOString(),
      colors: ['#000000', '#ffffff'], // Mock palette
      license: 'personal'
    };

    addPoster(newPoster);
    setIsLoading(false);
    onClose();
    
    // Reset form
    setTitle('');
    setDesc('');
    setTags('');
    setImage(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-display font-bold text-white mb-6">Create New Poster</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-accent/50 transition-colors cursor-pointer flex flex-col items-center justify-center overflow-hidden bg-white/5 ${image ? 'border-none' : ''}`}
              >
                {image ? (
                  <img src={image} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
                      <Upload size={24} className="text-neutral-400" />
                    </div>
                    <p className="text-sm font-medium text-white">Click to upload image</p>
                    <p className="text-xs text-neutral-500 mt-1">JPG, PNG up to 10MB</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none"
                    placeholder="e.g. Neon Dreams"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Description</label>
                  <textarea 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none resize-none h-24"
                    placeholder="Tell us about your artwork..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Tags</label>
                  <input 
                    type="text" 
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none"
                    placeholder="cyberpunk, 3d, abstract (comma separated)"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading || !image || !title}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Publish Poster'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
