import { motion } from 'motion/react';
import { Download, Crown, ExternalLink, Trash2 } from 'lucide-react';
import { Image } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImageCardProps {
  image: Image;
  onDownload: (image: Image) => void;
  onDelete?: (id: string) => void;
  isPremiumUser: boolean;
  isAdmin?: boolean;
}

export function ImageCard({ image, onDownload, onDelete, isPremiumUser, isAdmin }: ImageCardProps) {
  const canDownload = !image.isPremium || isPremiumUser;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:shadow-indigo-500/10 hover:shadow-2xl"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <motion.img
          src={image.thumbnailUrl}
          alt={image.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
          referrerPolicy="no-referrer"
          onDragStart={(e) => e.preventDefault()}
        />
      </div>

      {/* Subtle Overlay Shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-40" />

      {/* Info Layer */}
      <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate uppercase tracking-widest">{image.title}</span>
            <span className="text-[10px] text-zinc-400 font-medium">by {image.author}</span>
          </div>
          
          <div className="flex gap-1.5">
            <Dialog>
              <DialogTrigger render={
                <button className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer outline-none shadow-xl">
                  <ExternalLink className="h-3.5 w-3.5 text-white" />
                </button>
              } />
              <DialogContent className="max-w-5xl bg-zinc-950 border-white/5 text-white p-0 overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex flex-col lg:flex-row h-full">
                  {/* Image View */}
                  <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-0">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="max-h-full max-w-full object-contain select-none"
                      referrerPolicy="no-referrer"
                      onDragStart={(e) => e.preventDefault()}
                    />
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-bold tracking-widest text-white uppercase">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        4K Ultra HD Selection
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Info */}
                  <div className="w-full lg:w-96 p-8 flex flex-col bg-zinc-950 lg:border-l border-white/5">
                    <div className="mb-8">
                      <div className="mb-4">
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[9px] font-bold uppercase tracking-widest border border-indigo-500/20">
                          {image.isPremium ? 'Premium Asset' : 'Free Selection'}
                        </span>
                      </div>
                      <h2 className="text-3xl font-extrabold mb-3 tracking-tighter leading-none">{image.title}</h2>
                      <div className="flex items-center gap-2 text-zinc-500 text-sm">
                        <span className="font-mono text-zinc-700">01</span>
                        <span>Captured by</span>
                        <span className="text-white font-bold">{image.author}</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                          <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Dimensions</span>
                          <span className="text-xs font-mono text-zinc-300">{image.width} x {image.height}</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                          <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Format</span>
                          <span className="text-xs font-mono text-zinc-300">RAW IMAGE / 4K</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button 
                          onClick={() => onDownload(image)}
                          disabled={!canDownload}
                          className={cn(
                            "w-full h-14 rounded-full font-bold transition-all hover:scale-[1.02]",
                            canDownload 
                              ? "bg-white text-black hover:bg-zinc-200" 
                              : "bg-amber-500 text-black hover:bg-amber-400"
                          )}
                        >
                          {canDownload ? (
                            <>
                              <Download className="mr-2 h-5 w-5" />
                              DOWNLOAD SOURCE
                            </>
                          ) : (
                            <>
                              <Crown className="mr-2 h-5 w-5" />
                              UN LOCK ACCESS
                            </>
                          )}
                        </Button>
                        {!canDownload && (
                          <p className="mt-3 text-center text-[10px] text-amber-500/60 font-medium uppercase tracking-widest">
                            Requires 4K Vision Premium Membership
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-12">
                      <p className="text-[10px] text-zinc-800 font-mono italic">
                        © 2026 4K VISION CURATION / LICENSED SOURCE
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <button
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-all cursor-pointer outline-none shadow-xl border",
                canDownload
                  ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700"
                  : "bg-amber-500 border-amber-400 text-black hover:bg-amber-400"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onDownload(image);
              }}
            >
              {canDownload ? <Download className="h-3.5 w-3.5" /> : <Crown className="h-3.5 w-3.5" />}
            </button>

            {isAdmin && onDelete && (
              <button
                className="h-8 w-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 backdrop-blur-md flex items-center justify-center transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(image.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Static Badges (Visible on mobile or when not hovered) */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
        {image.isPremium && (
          <div className="h-6 w-6 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg">
            <Crown className="h-3.5 w-3.5 text-black" />
          </div>
        )}
      </div>

      <div className="absolute top-3 left-3 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[9px] font-bold text-white tracking-widest uppercase">
          4K
        </span>
      </div>
    </motion.div>
  );
}
