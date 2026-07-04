export function SectionDivider() {
  return (
    <div className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/20 to-transparent">
          {/* Animated glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />

          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_30px_rgba(0,212,255,0.8)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
