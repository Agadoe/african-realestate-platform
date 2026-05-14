interface SkeletonProps {
  type?: 'card' | 'list' | 'text' | 'image';
  count?: number;
  className?: string;
}

export default function Skeleton({ type = 'card', count = 1, className = '' }: SkeletonProps) {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <>
        {skeletons.map((_, index) => (
          <div key={index} className={`card overflow-hidden ${className}`}>
            <div className="relative h-64">
              <div className="bg-slate-200 dark:bg-slate-700 w-full h-full animate-pulse"></div>
            </div>
            <div className="p-6">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3 animate-pulse w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-6 animate-pulse w-1/2"></div>
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mr-2"></div>
                  <div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-1 animate-pulse w-24"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
                  </div>
                </div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'list') {
    return (
      <>
        {skeletons.map((_, index) => (
          <div key={index} className={`flex card ${className}`}>
            <div className="md:w-80 h-64 relative">
              <div className="bg-slate-200 dark:bg-slate-700 w-full h-full animate-pulse"></div>
            </div>
            <div className="p-6 flex-1">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4 animate-pulse w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3 animate-pulse w-1/2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-6 animate-pulse w-2/3"></div>
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mr-2"></div>
                  <div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-1 animate-pulse w-24"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-16"></div>
                  </div>
                </div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'text') {
    return (
      <>
        {skeletons.map((_, index) => (
          <div key={index} className={className}>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3 animate-pulse"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3 animate-pulse w-5/6"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3 animate-pulse w-4/6"></div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'image') {
    return (
      <>
        {skeletons.map((_, index) => (
          <div key={index} className={`relative ${className}`}>
            <div className="bg-slate-200 dark:bg-slate-700 w-full h-full animate-pulse rounded-lg"></div>
          </div>
        ))}
      </>
    );
  }

  return null;
}