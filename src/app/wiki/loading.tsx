export default function WikiLoading() {
  return (
    <div className="min-h-screen bg-surface-deep flex animate-pulse">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/10 px-4 py-8 gap-6">
        <div className="h-8 w-32 bg-white/10 rounded-lg" />
        {Array.from({ length: 4 }).map((_, section) => (
          <div key={section} className="space-y-2">
            <div className="h-3 w-24 bg-white/10 rounded mb-3" />
            {Array.from({ length: 3 }).map((_, item) => (
              <div key={item} className="h-4 w-full bg-white/5 rounded" />
            ))}
          </div>
        ))}
      </aside>

      {/* Article content */}
      <main className="flex-1 px-6 py-10 max-w-3xl">
        {/* Search bar */}
        <div className="h-10 w-full bg-white/10 rounded-lg mb-10" />

        {/* Article title */}
        <div className="h-8 w-64 bg-white/10 rounded-xl mb-4" />
        <div className="h-3 w-40 bg-white/5 rounded mb-8" />

        {/* Article body paragraphs */}
        <div className="space-y-3 mb-8">
          {[100, 90, 95, 70, 85].map((w, i) => (
            <div
              key={i}
              className={`h-3 bg-white/5 rounded`}
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="h-4 w-48 bg-white/10 rounded mb-3" />
        <div className="space-y-3">
          {[88, 75, 93, 60].map((w, i) => (
            <div
              key={i}
              className="h-3 bg-white/5 rounded"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
