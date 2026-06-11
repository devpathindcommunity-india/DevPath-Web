export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-surface-deep px-4 py-10 max-w-4xl mx-auto animate-pulse">
      {/* Avatar + name block */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <div className="w-28 h-28 rounded-full bg-white/10 shrink-0" />
        <div className="flex-1 space-y-3 w-full">
          <div className="h-7 w-48 bg-white/10 rounded-xl" />
          <div className="h-4 w-32 bg-white/5 rounded" />
          <div className="h-4 w-64 bg-white/5 rounded" />
          <div className="flex gap-3 mt-2">
            <div className="h-8 w-24 bg-white/10 rounded-lg" />
            <div className="h-8 w-24 bg-white/10 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card/30 border border-white/10 rounded-2xl p-4 space-y-2"
          >
            <div className="h-6 w-10 bg-white/10 rounded mx-auto" />
            <div className="h-3 w-16 bg-white/5 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Badges / Achievements */}
      <div className="h-5 w-32 bg-white/10 rounded mb-4" />
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-white/5 rounded-2xl border border-white/10"
          />
        ))}
      </div>

      {/* Activity / content cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-card/30 border border-white/10 rounded-2xl p-5 space-y-2"
          >
            <div className="h-4 w-2/3 bg-white/10 rounded" />
            <div className="h-3 w-1/2 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
