import MapUsers from "../components/MapUsers";

export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Our Global Community
      </h1>

      <div className="h-[500px] rounded-lg shadow-md overflow-hidden mb-8">
        <MapUsers />
      </div>

      <div className="text-center text-gray-600 text-sm">
        <p>Click on a marker to view a country and its stories.</p>
        <p className="mt-1">Use the + and – buttons to zoom in or out.</p>
      </div>
    </div>
  );
}
