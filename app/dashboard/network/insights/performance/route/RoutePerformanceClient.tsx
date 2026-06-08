// app/dashboard/network/insights/performance/route/page.js
import dynamic from 'next/dynamic';

const RoutePerformancePage = dynamic(
  () => import('./RoutePerformanceClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
);

export default function Page() {
  return <RoutePerformancePage />;
}