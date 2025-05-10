import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../config/axios";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Mapusers() {
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMapData();
  }, []);

  async function fetchMapData() {
    try {
      const countriesRes = await axios.get(
        "https://restcountries.com/v3.1/all"
      );

      const userDataRes = await api.get("/map-data");

      const mapData = [];

      userDataRes.data.countries.forEach((country) => {
        const match = countriesRes.data.find(
          (c) =>
            c.name.common.toLowerCase() === country.name.toLowerCase() ||
            c.name.official.toLowerCase() === country.name.toLowerCase()
        );

        if (match && match.latlng) {
          mapData.push({
            name: match.name.common,
            count: country.count,
            lat: match.latlng[0],
            lng: match.latlng[1],
            flag: match.flags.png,
            postId: country.postId,
          });
        }
      });

      setCountriesData(mapData);
    } catch (err) {
      console.error("Error loading map data:", err);
      setError("Failed to load map data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 p-4 rounded">{error}</div>;
  }

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
      doubleClickZoom={true}
      dragging={true}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {countriesData.map((country) => (
        <Marker key={country.name} position={[country.lat, country.lng]}>
          <Popup>
            <div className="text-center p-1">
              <div className="flex items-center justify-center mb-2">
                {country.flag && (
                  <img
                    src={country.flag}
                    alt={`${country.name} flag`}
                    className="h-4 mr-2"
                  />
                )}
                <h3 className="font-bold text-lg">{country.name}</h3>
              </div>

              <p className="text-gray-600 mb-2">
                {country.count} {country.count === 1 ? "Member" : "Members"}
              </p>

              {country.postId ? (
                <Link
                  to={`/posts/${country.postId}`}
                  className="hover:bg-gray-300 text-white px-4 py-2 rounded text-sm inline-block"
                >
                  View Story
                </Link>
              ) : (
                <p className="text-sm text-gray-500">No stories yet</p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
