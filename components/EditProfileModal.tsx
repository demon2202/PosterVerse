
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Loader2 } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
    const { user, updateUserProfile } = useGlobalContext();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user && isOpen) {
            setName(user.name);
            setBio(user.bio || '');
            setAvatar(user.avatar);
        }
    }, [user, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            await updateUserProfile({ name, bio, avatar });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
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
                        className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-display font-bold text-white mb-6">Edit Profile</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col items-center">
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group"
                                >
                                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                </div>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 text-sm text-accent hover:underline">Change Photo</button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none"
                                        placeholder="Your Name"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Bio</label>
                                    <textarea 
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none resize-none h-24"
                                        placeholder="Tell the world about yourself..."
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                            </button>
                        </form>
                    </motion.div>
                 </div>
            )}
        </AnimatePresence>
    );
};
