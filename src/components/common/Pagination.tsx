'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loading?: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Pagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  loading = false,
  onNext,
  onPrevious,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPreviousPage || loading}
        aria-label="Go to previous page"
        className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      <span className="text-sm text-muted-foreground min-w-[80px] text-center">
        Page {currentPage}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={!hasNextPage || loading}
        aria-label="Go to next page"
        className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-card"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
