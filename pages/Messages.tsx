
import React, { useState, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { useGlobalContext } from '../context/GlobalContext';
import { Send, Image, Plus, MessageSquare, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../types';

export const Messages: React.FC = () => {
  const { user, getConversations, getMessages, sendMessage, allUsers } = useGlobalContext();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [searchUser, setSearchUser] = useState('');

  // Fetch real data
  const threads = getConversations();
  const currentMessages = selectedUserId ? getMessages(selectedUserId) : [];
  const selectedUser = threads.find(t => t.user.id === selectedUserId)?.user || allUsers.find(u => u.id === selectedUserId);

  const handleSend = () => {
      if (!newMessage.trim() || !selectedUserId) return;
      sendMessage(selectedUserId, newMessage);
      setNewMessage('');
  };

  const filteredUsers = useMemo(() => {
      if (!searchUser) return allUsers.filter(u => u.id !== user?.id).slice(0, 10);
      return allUsers.filter(u => 
        u.id !== user?.id && 
        (u.username.toLowerCase().includes(searchUser.toLowerCase()) || 
         u.name.toLowerCase().includes(searchUser.toLowerCase()))
      );
  }, [allUsers, searchUser, user]);
  
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-16 flex flex-col h-screen overflow-hidden">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 flex gap-6 h-[calc(100vh-64px)]">
          {/* Thread List */}
          <div className={`w-full md:w-80 lg:w-96 flex flex-col bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                  <h1 className="text-2xl font-display font-bold text-black dark:text-white">Messages</h1>
                  <button onClick={() => setIsNewChatModalOpen(true)} className="p-2 bg-accent/10 text-accent rounded-full hover:bg-accent hover:text-white transition-colors">
                      <Plus size={20} />
                  </button>
              </div>
              
              {threads.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500">
                      <MessageSquare size={32} className="mb-4 opacity-50" />
                      <p>No conversations yet.</p>
                      <button onClick={() => setIsNewChatModalOpen(true)} className="mt-4 text-accent font-bold text-sm">Start a chat</button>
                  </div>
              ) : (
                  <div className="flex-1 overflow-y-auto p-2">
                    {threads.map(thread => (
                        <div 
                            key={thread.user.id} 
                            onClick={() => setSelectedUserId(thread.user.id)}
                            className={`p-4 rounded-xl flex gap-3 cursor-pointer transition-colors ${selectedUserId === thread.user.id ? 'bg-white dark:bg-white/10 shadow-sm' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            <div className="relative">
                                <img src={thread.user.avatar} className="w-12 h-12 rounded-full object-cover" alt={thread.user.username} />
                                {thread.unreadCount > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-black">{thread.unreadCount}</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-black dark:text-white truncate">{thread.user.name}</h3>
                                    <span className="text-[10px] text-neutral-500">
                                        {new Date(thread.lastMessage.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <p className={`text-sm truncate ${thread.unreadCount > 0 ? 'text-black dark:text-white font-semibold' : 'text-neutral-500'}`}>
                                    {thread.lastMessage.senderId === user?.id ? 'You: ' : ''}{thread.lastMessage.text}
                                </p>
                            </div>
                        </div>
                    ))}
                  </div>
              )}
          </div>

          {/* Chat Window */}
          <div className={`flex-1 flex-col bg-white dark:bg-black rounded-3xl border border-black/5 dark:border-white/5 overflow-hidden relative shadow-2xl ${!selectedUserId ? 'hidden md:flex' : 'flex'}`}>
              {selectedUserId && selectedUser ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-black/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-3">
                            <button className="md:hidden" onClick={() => setSelectedUserId(null)}>←</button>
                            <img src={selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.id}`} className="w-10 h-10 rounded-full" alt={selectedUser.username} />
                            <div>
                                <h3 className="font-bold text-black dark:text-white">{selectedUser.name || 'Unknown User'}</h3>
                                <p className="text-xs text-neutral-500">@{selectedUser.username}</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col-reverse">
                        {/* Flex-col-reverse allows auto scroll to bottom, need to reverse mapping */}
                        {[...currentMessages].reverse().map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.senderId === user?.id ? 'bg-accent text-white rounded-tr-none' : 'bg-white dark:bg-neutral-800 text-black dark:text-white rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        {currentMessages.length === 0 && (
                            <div className="text-center text-neutral-400 py-10">
                                This is the start of your conversation.
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-black/5 dark:border-white/5 bg-white dark:bg-black z-10">
                        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 rounded-full px-4 py-2 border border-black/5 dark:border-white/5 focus-within:border-accent transition-colors">
                            <button className="text-neutral-400 hover:text-accent"><Image size={20}/></button>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                className="flex-1 bg-transparent border-none outline-none text-black dark:text-white placeholder-neutral-500 h-10"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button 
                                onClick={handleSend}
                                className="p-2 bg-accent text-white rounded-full hover:scale-105 transition-transform shadow-lg shadow-accent/20"
                            >
                                <Send size={16} className="ml-0.5" />
                            </button>
                        </div>
                    </div>
                  </>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
                      <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4">
                          <Send size={32} className="text-neutral-400" />
                      </div>
                      <p className="text-lg font-medium">Select a thread to start messaging</p>
                  </div>
              )}
          </div>
      </div>

      {/* New Chat Modal - Fully Functional */}
      <AnimatePresence>
      {isNewChatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[80vh] flex flex-col"
              >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-black dark:text-white">New Message</h2>
                    <button onClick={() => setIsNewChatModalOpen(false)}><X className="text-neutral-500 hover:text-white" /></button>
                  </div>

                  {/* Search Bar */}
                  <div className="flex items-center gap-2 bg-neutral-100 dark:bg-white/5 rounded-xl px-3 py-2 border border-transparent focus-within:border-accent mb-4">
                        <Search size={18} className="text-neutral-400" />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="bg-transparent border-none outline-none flex-1 text-black dark:text-white"
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                        />
                  </div>

                  {/* User List */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                       {filteredUsers.length > 0 ? filteredUsers.map(u => (
                           <div 
                                key={u.id}
                                onClick={() => {
                                    setSelectedUserId(u.id);
                                    setIsNewChatModalOpen(false);
                                    setSearchUser('');
                                }}
                                className="flex items-center gap-3 p-3 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-colors"
                           >
                               <img src={u.avatar} className="w-10 h-10 rounded-full object-cover" alt={u.username} />
                               <div>
                                   <p className="font-bold text-black dark:text-white">{u.name}</p>
                                   <p className="text-xs text-neutral-500">@{u.username}</p>
                               </div>
                           </div>
                       )) : (
                           <div className="text-center text-neutral-500 py-4">No users found.</div>
                       )}
                  </div>
              </motion.div>
          </div>
      )}
      </AnimatePresence>
    </div>
  );
};
