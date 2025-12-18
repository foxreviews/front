interface SkeletonCardProps {
  type?: "card" | "list";
}

export default function SkeletonCard({ type = "card" }: SkeletonCardProps) {
  if (type === "card") {
    return (
      <div className="animate-pulse bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-10 bg-gray-300 rounded-full w-full"></div>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="animate-pulse flex items-center gap-4 p-4 border-b border-gray-200">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return null;
}
