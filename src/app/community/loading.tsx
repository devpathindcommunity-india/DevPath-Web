export default function CommunityLoading() {
  return (
    <div className="min-h-screen bg-surface-deep px-4 py-10 max-w-6xl mx-auto animate-pulse">
      {/* Header */}
      <div className="h-10 w-48 bg-white/10 rounded-xl mb-2" />
      <div className="h-4 w-72 bg-white/5 rounded mb-8" />

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <div className="h-10 w-32 bg-white/10 rounded-lg" />
        <div className="h-10 w-32 bg-white/5 rounded-lg" />
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 mb-8">
        <div className="h-10 flex-1 bg-white/10 rounded-lg" />
        <div className="h-10 w-24 bg-white/10 rounded-lg" />
        <div className="h-10 w-10 bg-white/10 rounded-lg" />
      </div>

      {/* Discussion cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-card/30 border border-white/10 rounded-2xl p-5 flex gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-white/10 rounded" />
              <div className="h-3 w-1/2 bg-white/5 rounded" />
              <div className="flex gap-4 mt-3">
                <div className="h-3 w-16 bg-white/5 rounded" />
                <div className="h-3 w-16 bg-white/5 rounded" />
                <div className="h-3 w-16 bg-white/5 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
