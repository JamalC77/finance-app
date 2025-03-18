export default function Loading() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded shadow">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex">
            <div className="h-10 bg-gray-200 rounded flex-grow"></div>
            <div className="h-10 w-20 bg-gray-200 rounded ml-2"></div>
          </div>
        </div>
        
        <div className="h-40 bg-gray-100 rounded mb-4"></div>
      </div>
    </div>
  );
} 