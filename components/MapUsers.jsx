import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../config/axios";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export default function MapUsers() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const [countriesRes, userMapRes] = await Promise.all([
        axios.get("https://restcountries.com/v3.1/all"),
        api.get("/map-data"),
      ]);

      if (!userMapRes.data.success) throw new Error("Failed to load user data");

      const locationData = userMapRes.data.countries
        .map((entry) => {
          const match = countriesRes.data.find(
            (c) =>
              c.name.common.toLowerCase() === entry.name.toLowerCase() ||
              c.name.official.toLowerCase() === entry.name.toLowerCase()
          );

          if (!match || !match.latlng) return null;

          return {
            name: match.name.common,
            lat: match.latlng[0],
            lng: match.latlng[1],
            count: entry.count,
            postId: entry.postId,
            flag: match.flags?.png || "",
          };
        })
        .filter(Boolean); // Remove nulls

      setLocations(locationData);
    } catch (err) {
      console.error(err);
      setError("Failed to load map data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded text-center">
        {error}
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        No location data available.
      </div>
    );
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((loc, i) => (
        <Marker key={i} position={[loc.lat, loc.lng]} icon={defaultIcon}>
          <Popup>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2 gap-2">
                {loc.flag && (
                  <img
                    src={loc.flag}
                    alt={loc.name}
                    className="w-5 h-4 rounded-sm"
                  />
                )}
                <h3 className="font-semibold">{loc.name}</h3>
              </div>
              <p className="text-gray-600 mb-2">
                {loc.count} {loc.count === 1 ? "member" : "members"}
              </p>

              {loc.postId ? (
                <Link
                  to={`/posts/${loc.postId}`}
                  className="inline-block px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Story
                </Link>
              ) : (
                <span className="text-xs text-gray-400">No stories yet</span>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
