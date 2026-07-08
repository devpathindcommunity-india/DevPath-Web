export default function ProjectCardSkeleton() {
  return (
    <div
      className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse"
      aria-hidden="true"
    >
      {/* Thumbnail / video area */}
      <div className="aspect-video bg-muted" />

      <div className="p-5 flex flex-col flex-grow">
        {/* Title row */}
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="h-5 bg-muted rounded w-2/3" />
          <div className="h-5 w-5 bg-muted rounded-full shrink-0" />
        </div>

        {/* Author + star row */}
        <div className="flex justify-between items-center mb-3">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-5 w-12 bg-muted rounded-full" />
        </div>

        {/* Skills row */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <div className="h-4 w-14 bg-muted rounded-full" />
          <div className="h-4 w-14 bg-muted rounded-full" />
          <div className="h-4 w-10 bg-muted rounded-full" />
        </div>

        {/* Description lines */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>

        {/* "Read More" placeholder */}
        <div className="h-3 w-16 bg-muted rounded mt-auto" />
      </div>
    </div>
  );
}
