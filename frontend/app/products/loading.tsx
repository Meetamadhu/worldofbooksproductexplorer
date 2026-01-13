export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="w-full h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-100 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
