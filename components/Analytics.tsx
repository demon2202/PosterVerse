import React from 'react';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';
import { Eye, Heart, Bookmark, TrendingUp, ArrowUpRight } from 'lucide-react';

export const Analytics: React.FC = () => {
  const stats = [
    { title: 'Total Views', value: '45.2k', change: '+12%', icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Likes', value: '8.4k', change: '+5%', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Saves', value: '1.2k', change: '+18%', icon: Bookmark, color: 'text-accent', bg: 'bg-accent/10' },
    { title: 'Reach', value: '120k', change: '+24%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-20 pb-20 transition-colors duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-black dark:text-white">Creator Analytics</h1>
            <p className="text-neutral-500">Track your visual impact</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.map((stat, idx) => (
                <motion.div 
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900"
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
                        <stat.icon size={20} />
                    </div>
                    <h3 className="text-neutral-500 text-sm font-medium">{stat.title}</h3>
                    <div className="flex items-end gap-2 mt-1">
                        <span className="text-2xl font-bold text-black dark:text-white">{stat.value}</span>
                        <span className="text-xs text-green-500 font-medium mb-1 flex items-center">
                            {stat.change} <ArrowUpRight size={10} />
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Charts Mock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900 h-80 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-black dark:text-white">Engagement Growth</h3>
                    <select className="bg-transparent text-sm text-neutral-500 border-none outline-none">
                        <option>Last 30 Days</option>
                        <option>Last 7 Days</option>
                    </select>
                </div>
                <div className="flex items-end space-x-2 h-48 mt-4">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                            className="flex-1 bg-accent/20 rounded-t-sm relative group"
                        >
                            <div className={`absolute bottom-0 left-0 right-0 bg-accent rounded-t-sm`} style={{ height: `${h * 0.4}%` }} />
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="p-6 rounded-2xl border border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900 h-80">
                 <h3 className="font-bold text-black dark:text-white mb-6">Top Locations</h3>
                 <div className="space-y-4">
                    {[
                        { city: 'Berlin', val: 78 },
                        { city: 'New York', val: 65 },
                        { city: 'Tokyo', val: 45 },
                        { city: 'London', val: 30 }
                    ].map((loc, i) => (
                        <div key={loc.city}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-black dark:text-white">{loc.city}</span>
                                <span className="text-neutral-500">{loc.val}%</span>
                            </div>
                            <div className="h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${loc.val}%` }}
                                    transition={{ delay: 0.8 + i * 0.1, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-accent to-blue-500" 
                                />
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
