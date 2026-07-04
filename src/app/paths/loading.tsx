export default function PathsLoading() {
  return (
    <main className="min-h-screen bg-surface-deep p-8 animate-pulse">
      {/* Header row */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-44 bg-white/10 rounded-xl" />
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-white/10 rounded-lg" />
          <div className="h-10 w-28 bg-white/5 rounded-lg" />
        </div>
      </div>

      {/* Path cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card/30 border border-white/10 rounded-2xl p-6 space-y-4"
          >
            {/* Icon placeholder */}
            <div className="w-12 h-12 rounded-xl bg-white/10" />
            <div className="h-5 w-3/4 bg-white/10 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-4/5 bg-white/5 rounded" />
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full bg-white/5 rounded-full">
              <div
                className="h-2 bg-cyan-500/30 rounded-full"
                style={{ width: `${30 + i * 10}%` }}
              />
            </div>
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-white/5 rounded" />
              <div className="h-3 w-16 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
