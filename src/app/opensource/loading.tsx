export default function OpensourceLoading() {
  return (
    <div className="min-h-screen bg-surface-deep px-4 py-10 max-w-6xl mx-auto animate-pulse">
      {/* Hero / header */}
      <div className="text-center mb-12 space-y-3">
        <div className="h-10 w-64 bg-white/10 rounded-xl mx-auto" />
        <div className="h-4 w-96 bg-white/5 rounded mx-auto" />
        <div className="flex justify-center gap-4 mt-4">
          <div className="h-10 w-36 bg-white/10 rounded-lg" />
          <div className="h-10 w-36 bg-white/5 rounded-lg" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card/30 border border-white/10 rounded-2xl p-5 space-y-2"
          >
            <div className="h-6 w-12 bg-white/10 rounded mx-auto" />
            <div className="h-3 w-20 bg-white/5 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Featured repos */}
      <div className="h-5 w-36 bg-white/10 rounded mb-5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card/30 border border-white/10 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div className="h-4 w-32 bg-white/10 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-4/5 bg-white/5 rounded" />
            </div>
            <div className="flex gap-4">
              <div className="h-3 w-12 bg-white/5 rounded" />
              <div className="h-3 w-12 bg-white/5 rounded" />
              <div className="h-3 w-12 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
