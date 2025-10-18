const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl p-8 md:p-10 h-64">
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-64 mt-6"></div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
