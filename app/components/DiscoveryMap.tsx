"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

type Location = {
  latitude: number;
  longitude: number;
};

type Discovery = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type Props = {
  userLocation: Location;
  discoveries: Discovery[];
    claimedIds?: string[];
};

export default function DiscoveryMap({
  userLocation,
  discoveries,
    claimedIds = [],
}: Props) {
  return (
    <MapContainer
      center={[
        userLocation.latitude,
        userLocation.longitude,
      ]}
      zoom={14}
      style={{
        height: "450px",
        width: "100%",
        borderRadius: "16px",
        marginBottom: "24px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <CircleMarker
        center={[
          userLocation.latitude,
          userLocation.longitude,
        ]}
        radius={10}
        pathOptions={{ color: "#38bdf8" }}
      >
        <Popup>Your location</Popup>
      </CircleMarker>

      {discoveries
        .filter(
          (place) =>
            Number.isFinite(place.latitude) &&
            Number.isFinite(place.longitude)
        )
        .map((place) => (
          <CircleMarker
            key={place.id}
            center={[
              place.latitude,
              place.longitude,
            ]}
            radius={9}
            pathOptions={{
  color: claimedIds.includes(place.id)
    ? "#9333ea"
    : "#22c55e",
}}
          >
            <Popup>
              <strong>{place.name}</strong>
              <p
  style={{
    color: claimedIds.includes(place.id)
      ? "#9333ea"
      : "#15803d",
    fontWeight: "bold",
  }}
>
  {claimedIds.includes(place.id)
  ? "✓ Already Discovered"
  : "📍 Available to Discover"}
</p>
              <p>
                <a href={`/discovery/${place.id}`}>
                  Explore Discovery
                </a>
              </p>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
