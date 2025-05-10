import Mapusers from "../components/MapUsers";

export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Our Global Community
      </h1>

      <div className="h-[500px] rounded-lg shadow-lg mb-8">
        <Mapusers />
      </div>

      <p className="text-center text-gray-600 italic">
        Click on the markers to see stories from around the world!
      </p>
      <p className="text-center text-sm text-gray-500 mt-1">
        Use the + and - buttons to zoom the map
      </p>
    </div>
  );
}
