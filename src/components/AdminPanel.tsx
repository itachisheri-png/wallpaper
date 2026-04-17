import React, { useState } from 'react';
import { Plus, X, Image as ImageIcon, Type, Link as LinkIcon, Save, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image } from '../types';

interface AdminPanelProps {
  onAddImage: (image: Image) => void;
  onClose: () => void;
}

const PEXELS_CURATED = [
  // Cars
  { id: 'px-car-1', title: 'Blue Supercar Speed', author: 'Pexels User', url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg', isPremium: true },
  { id: 'px-car-2', title: 'Classic Red Porsche', author: 'Pexels User', url: 'https://images.pexels.com/photos/1544636/pexels-photo-1544636.jpeg', isPremium: true },
  { id: 'px-car-3', title: 'Modern Electric Sedan', author: 'Pexels User', url: 'https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg', isPremium: false },
  { id: 'px-car-4', title: 'Drift in the Rain', author: 'Pexels User', url: 'https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg', isPremium: true },
  
  // Anime / Digital Art
  { id: 'px-art-1', title: 'Cyberpunk Neon City', author: 'Aleksandar Pasaric', url: 'https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg', isPremium: true },
  { id: 'px-art-2', title: 'Space Fantasy Galaxy', author: 'Pexels User', url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg', isPremium: true },
  { id: 'px-art-3', title: 'Abstract Light Trails', author: 'Padrinan', url: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg', isPremium: false },
  { id: 'px-art-4', title: 'Surreal Cloud Castle', author: 'Pexels User', url: 'https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg', isPremium: true },

  // Nature & Landscape
  { id: 'px-nat-1', title: 'Majestic Lion Portrait', author: 'Pixabay', url: 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg', isPremium: true },
  { id: 'px-nat-2', title: 'Emerald Forest Stream', author: 'James Wheeler', url: 'https://images.pexels.com/photos/462118/pexels-photo-462118.jpeg', isPremium: false },
  { id: 'px-nat-3', title: 'Serene Mountain Lake', author: 'Luis del Río', url: 'https://images.pexels.com/photos/15286/pexels-photo-15286.jpeg', isPremium: false },
  { id: 'px-nat-4', title: 'Starry Night Mountains', author: 'Stein Egil Liland', url: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg', isPremium: true },
  
  // Scifi / Tech
  { id: 'px-tech-1', title: 'Futuristic Server Room', author: 'Pexels User', url: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg', isPremium: true },
  { id: 'px-tech-2', title: 'Deep Sea Bioluminescence', author: 'Pexels User', url: 'https://images.pexels.com/photos/1643409/pexels-photo-1643409.jpeg', isPremium: true },
  { id: 'px-tech-3', title: 'Neon Arcade Vibes', author: 'Pexels User', url: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg', isPremium: false },
  { id: 'px-tech-4', title: 'Abstract Fiber Optics', author: 'Pexels User', url: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg', isPremium: true },
  
  { id: 'px-11', title: 'Crystal Clear Alpine Lake', author: 'Simon Migaj', url: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg', isPremium: true },
  { id: 'px-13', title: 'Modern Glass Architecture', author: 'Pixabay', url: 'https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg', isPremium: false },
  { id: 'px-17', title: 'Arctic Wolf Stare', author: 'Pexels User', url: 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg', isPremium: true },
  { id: 'px-20', title: 'Minimalist White Building', author: 'Pexels User', url: 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg', isPremium: true },
];

export function AdminPanel({ onAddImage, onClose }: AdminPanelProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    const newImage: Image = {
      id: `admin-${Date.now()}`,
      url: `${url}?auto=compress&cs=tinysrgb&w=3840`,
      downloadUrl: `${url}?auto=compress&cs=tinysrgb&w=3840`,
      thumbnailUrl: `${url}?auto=compress&cs=tinysrgb&w=800`,
      title: title,
      author: author || 'Admin',
      isPremium: isPremium,
      width: 3840,
      height: 2160,
    };

    onAddImage(newImage);
    setTitle('');
    setUrl('');
    setAuthor('');
    setIsPremium(false);
    onClose();
  };

  const handleSyncPexels = async () => {
    setIsSyncing(true);
    setSyncComplete(false);
    
    // Simulate transfer process
    for (const img of PEXELS_CURATED) {
      const newImage: Image = {
        ...img,
        url: `${img.url}?auto=compress&cs=tinysrgb&w=3840`,
        downloadUrl: `${img.url}?auto=compress&cs=tinysrgb&w=3840`,
        thumbnailUrl: `${img.url}?auto=compress&cs=tinysrgb&w=800`,
        width: 3840,
        height: 2160,
      };
      onAddImage(newImage);
      // Small delay to simulate "careful" transfer
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsSyncing(false);
    setSyncComplete(true);
    setTimeout(() => setSyncComplete(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl glass-panel p-6 shadow-2xl border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-500" />
            Admin: Gallery Management
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-8 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Bulk Transfer</h3>
            {syncComplete && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Transfer Complete</span>}
          </div>
          <p className="text-xs text-zinc-400 mb-4">
            Transfer curated 4K wallpapers from Pexels directly to your gallery. Duplicates are automatically handled.
          </p>
          <Button 
            onClick={handleSyncPexels} 
            disabled={isSyncing}
            className="w-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 h-10 rounded-lg font-bold"
          >
            {isSyncing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {isSyncing ? 'Transferring Pexels Gallery...' : 'Transfer Pexels 4K Gallery'}
          </Button>
        </div>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink mx-4 text-xs text-zinc-600 uppercase font-bold">Or Add Manually</span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Type className="h-4 w-4" /> Image Title
            </label>
            <Input
              placeholder="e.g. Cyberpunk City Night"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-white/10 focus:border-indigo-500/50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <LinkIcon className="h-4 w-4" /> Image URL (4K Direct Link)
            </label>
            <Input
              placeholder="https://images.pexels.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/5 border-white/10 focus:border-indigo-500/50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Author Name
            </label>
            <Input
              placeholder="e.g. John Doe"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="bg-white/5 border-white/10 focus:border-indigo-500/50"
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="premium"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="h-5 w-5 rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="premium" className="text-sm font-medium text-zinc-300">
              Mark as Premium Content
            </label>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl">
              <Save className="mr-2 h-5 w-5" />
              Publish to Gallery
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
