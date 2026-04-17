import React, { useState } from 'react';
import { Search, Crown, Menu, X, Image as ImageIcon, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category } from '../types';
import { cn } from '@/lib/utils';
import { User } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  onSearch: (query: string) => void;
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  isPremiumUser: boolean;
  isAdmin: boolean;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onUpgrade: () => void;
}

const CATEGORIES: Category[] = ['All', 'Cars', 'Anime', 'Nature', 'Architecture', 'Technology', 'Abstract'];

export function Navbar({ onSearch, activeCategory, onCategoryChange, isPremiumUser, isAdmin, user, onLogin, onLogout, onUpgrade }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onCategoryChange('All')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black shadow-xl transition-all group-hover:bg-indigo-500 group-hover:text-white">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-white uppercase leading-none">4K Vision</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-1 w-1 rounded-full bg-indigo-500" />
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  {isAdmin ? 'Admin Portal' : isPremiumUser ? 'Premium Access' : 'Private Collection'}
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar - Luxury Style */}
          <form onSubmit={handleSubmit} className="hidden flex-1 max-w-xl md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within:text-white" />
              <input
                type="text"
                placeholder="Search ultra high-resolution..."
                className="w-full h-11 bg-zinc-900/50 border border-white/5 rounded-full pl-12 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:bg-zinc-900 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {!isPremiumUser && !isAdmin && (
              <button 
                onClick={onUpgrade}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg active:scale-95"
              >
                <Crown className="h-3.5 w-3.5" />
                Premium
              </button>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <button className="relative h-11 w-11 rounded-xl p-0.5 border border-white/10 hover:border-white/20 transition-all cursor-pointer outline-none bg-zinc-900">
                    <Avatar className="h-full w-full rounded-lg overflow-hidden">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback className="bg-zinc-900 text-zinc-400">
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                } />
                <DropdownMenuContent className="w-64 bg-zinc-950 border-white/10 text-white rounded-xl shadow-2xl p-2" align="end">
                  <DropdownMenuLabel className="font-normal px-3 py-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold truncate">{user.displayName}</p>
                        {isPremiumUser && <Crown className="h-3 w-3 text-amber-500" />}
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-tight">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5 mx-2" />
                  <DropdownMenuItem onClick={onLogout} className="m-1 rounded-lg text-red-500 focus:text-white focus:bg-red-500/20 cursor-pointer text-xs font-bold uppercase tracking-widest py-3">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Terminate Session</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button 
                onClick={onLogin}
                className="px-6 py-2.5 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
              >
                Join Now
              </button>
            )}

            <button 
              className="md:hidden h-11 w-11 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Categories Scroller - Refined */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 no-scrollbar border-t border-white/5">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "whitespace-nowrap h-9 px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                activeCategory === category
                  ? "bg-white text-black shadow-lg"
                  : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-zinc-800 bg-black p-4 md:hidden">
            <div className="flex flex-col gap-4">
              {!isPremiumUser && (
                <Button 
                  onClick={onUpgrade}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Get Premium - $5/mo
                </Button>
              )}
              
              {user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-2">
                    <Avatar className="h-10 w-10 border border-zinc-800">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback className="bg-zinc-900 text-zinc-400">
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user.displayName}</span>
                      <span className="text-xs text-zinc-500">{user.email}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={onLogout}
                    variant="outline"
                    className="w-full border-zinc-800 text-red-400 hover:bg-red-400/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={onLogin}
                  className="w-full bg-white text-black font-bold"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In with Google
                </Button>
              )}
            </div>
          </div>
        )}
    </nav>
  );
}
