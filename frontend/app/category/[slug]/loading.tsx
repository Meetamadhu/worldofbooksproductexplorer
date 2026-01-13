export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-10 bg-gray-200 rounded mb-8 w-40 animate-pulse"></div>
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/3 animate-pulse"></div>
        </div>
      </main>
    </div>
  );
}
