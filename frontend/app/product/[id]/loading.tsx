export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="w-full h-96 bg-gray-200 rounded animate-pulse"></div>
          <div>
            <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-100 rounded mb-4 w-1/2 animate-pulse"></div>
            <div className="h-20 bg-gray-100 rounded mb-4 animate-pulse"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
