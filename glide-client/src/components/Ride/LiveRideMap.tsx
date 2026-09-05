"use client";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { BookingStatus } from "@/data/booking";
import L from "leaflet";
import { useEffect } from "react";
import axios from "axios";

interface LiveRideMapProps {
  driverPos: [number, number] | null;
  pickup: [number, number] | null;
  dropoff: [number, number] | null;
  rideStatus: Record<BookingStatus, "arriving" | "ongoing" | "completed">;
  currStatus: BookingStatus;
}
const LiveRideMap = ({
  driverPos,
  pickup,
  dropoff,
  rideStatus,
  currStatus,
}: LiveRideMapProps) => {

  const currRideStatus = rideStatus[currStatus];

  const pickupIcon = new L.DivIcon({
    html: `
        <div style="background-color: #000; color: #fff; font-size: 11px; font-weight: 700; font-family: sans-serif; padding: 4px 10px; border-radius: 999px; white-space: nowrap; display: inline-block; letter-spacing: 0.05em;">
          PICKUP
        </div>
      `,
    iconSize: [70, 24],
    iconAnchor: [35, 12],
    className: "custom-leaflet-icon",
  });

  const dropoffIcon = new L.DivIcon({
    html: `
        <div style="background-color: #000; color: #fff; font-size: 11px; font-weight: 700; font-family: sans-serif; padding: 4px 10px; border-radius: 999px; white-space: nowrap; display: inline-block; letter-spacing: 0.05em;">
          DROPOFF
        </div>
      `,
    iconSize: [76, 24],
    iconAnchor: [38, 12],
    className: "custom-leaflet-icon",
  });

  const driverIcon = new L.DivIcon({
    html: `
        <div style="background-color: #000; color: #fff; font-size: 11px; font-weight: 700; font-family: sans-serif; padding: 4px 10px; border-radius: 999px; white-space: nowrap; display: inline-block; letter-spacing: 0.05em;">
          🚗 DRIVER
        </div>
      `,
    iconSize: [90, 24],
    iconAnchor: [45, 12],
    className: "custom-leaflet-icon",
  });

  const loadRoute = async (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number
  ) => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
      );

      if (response.data.code === "Ok" && response.data.routes.length > 0) {
        return response.data.routes[0];
      }
    } catch (error) {
      console.error("Failed to load route from OSRM:", error);
    }
  };

  useEffect(() => {
    if (!driverPos || !pickup || !dropoff) return;

    const [pLat, pLng] = pickup;
    const [dLat, dLng] = dropoff;
    const [drLat, drLng] = driverPos;

    const getRoute = async () => {
      try {
        if (currRideStatus === "arriving") {
          const pickupRoute = await loadRoute(drLat, drLng, pLat, pLng);
          const dropoffRoute = await loadRoute(dLat, dLng, drLat, drLng);
        }
      } catch (error) {
        console.error("Failed to fetch route", error);
      }
    };

    getRoute();
  }, [driverPos, pickup, dropoff, currRideStatus]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={pickup ?? [0, 0]}
        maxZoom={20}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Map</a> contributers'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />

        {pickup && <Marker position={pickup} icon={pickupIcon} draggable />}

        {dropoff && <Marker position={dropoff} icon={dropoffIcon} draggable />}

        {driverPos && (
          <Marker position={driverPos} icon={driverIcon} draggable />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveRideMap;
