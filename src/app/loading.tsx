export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface-deep z-50">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-pulse" />
        <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
