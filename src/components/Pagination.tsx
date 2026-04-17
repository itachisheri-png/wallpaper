import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-zinc-500 hover:text-white hover:bg-white/5 h-10 px-4 rounded-none border-b border-transparent hover:border-white/20 transition-all font-mono text-xs uppercase tracking-widest disabled:opacity-20"
      >
        <ChevronLeft className="mr-2 h-3 w-3" />
        Prev
      </Button>

      <div className="flex items-center gap-4">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 text-zinc-700 font-mono text-xs">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={cn(
                  "relative h-10 min-w-[32px] font-mono text-xs transition-all duration-500",
                  currentPage === page
                    ? "text-white scale-110"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {page}
                {currentPage === page && (
                  <motion.div
                    layoutId="activePageUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                  />
                )}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-zinc-500 hover:text-white hover:bg-white/5 h-10 px-4 rounded-none border-b border-transparent hover:border-white/20 transition-all font-mono text-xs uppercase tracking-widest disabled:opacity-20"
      >
        Next
        <ChevronRight className="ml-2 h-3 w-3" />
      </Button>
    </div>
  );
}
