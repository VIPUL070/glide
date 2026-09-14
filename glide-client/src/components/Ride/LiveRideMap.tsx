"use client";

import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { BookingStatus } from "@/data/booking";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface LiveRideMapProps {
  driverPos: [number, number] | null;
  pickup: [number, number] | null;
  dropoff: [number, number] | null;
  rideStatus: Record<BookingStatus, "arriving" | "ongoing" | "completed">;
  currStatus: BookingStatus;
  onStats?: (data: {
    distanceToPickup: number;
    distanceToDropoff: number;
    etaToPickup: number;
    etaToDropoff: number;
  }) => void;
}

// Automatically fits the map to show all available points
const AutoFitBounds = ({
  points,
}: {
  points: ([number, number] | null)[];
}) => {
  const map = useMap();
  useEffect(() => {
    const validPoints = points.filter(
      (p): p is [number, number] => p !== null && !isNaN(p[0]) && !isNaN(p[1])
    );
    if (validPoints.length > 0) {
      const bounds = L.latLngBounds(validPoints);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [points, map]);
  return null;
};

const LiveRideMap = ({
  driverPos,
  pickup,
  dropoff,
  rideStatus,
  currStatus,
  onStats,
}: LiveRideMapProps) => {
  const currRideStatus = rideStatus[currStatus];

  const [routeToPickup, setRouteToPickup] = useState<[number, number][]>([]);
  const [routeToDropoff, setRouteToDropoff] = useState<[number, number][]>([]);

  // Keep latest onStats without triggering dependency re-runs
  const onStatsRef = useRef(onStats);
  useEffect(() => {
    onStatsRef.current = onStats;
  }, [onStats]);

  const showPickupMarker = currRideStatus === "arriving";
  const showPickupRoute = currRideStatus === "arriving" && routeToPickup.length > 0;
  const showDropoffRoute = currRideStatus !== "completed" && routeToDropoff.length > 0;

  const pickupIcon = new L.DivIcon({
    html: `<div style="background-color: #000; color: #fff; font-size: 11px; font-weight: 700; font-family: sans-serif; padding: 4px 10px; border-radius: 999px; white-space: nowrap; display: inline-block;">PICKUP</div>`,
    iconSize: [70, 24],
    iconAnchor: [35, 12],
    className: "custom-leaflet-icon",
  });

  const dropoffIcon = new L.DivIcon({
    html: `<div style="background-color: #000; color: #fff; font-size: 11px; font-weight: 700; font-family: sans-serif; padding: 4px 10px; border-radius: 999px; white-space: nowrap; display: inline-block;">DROPOFF</div>`,
    iconSize: [76, 24],
    iconAnchor: [38, 12],
    className: "custom-leaflet-icon",
  });

  const driverIcon = new L.DivIcon({
    html: `<div style="background-color: #000; color: #fff; font-size: 11px; font-weight: 700; font-family: sans-serif; padding: 4px 10px; border-radius: 999px; white-space: nowrap; display: inline-block;">🚗 DRIVER</div>`,
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
    return null;
  };

  useEffect(() => {
    if (!pickup || !dropoff) return;

    let isMounted = true;
    const [pLat, pLng] = pickup;
    const [dLat, dLng] = dropoff;

    const getRoute = async () => {
      try {
        if (currRideStatus === "arriving") {
          // 1. Calculate route from Driver -> Pickup (if driver location is available)
          let pickupRoute = null;
          if (driverPos) {
            pickupRoute = await loadRoute(driverPos[0], driverPos[1], pLat, pLng);
          }

          // 2. Calculate ride route from Pickup -> Dropoff
          const dropoffRoute = await loadRoute(pLat, pLng, dLat, dLng);

          if (!isMounted) return;

          if (pickupRoute?.geometry?.coordinates) {
            setRouteToPickup(
              pickupRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon])
            );
          } else {
            setRouteToPickup([]);
          }

          if (dropoffRoute?.geometry?.coordinates) {
            setRouteToDropoff(
              dropoffRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon])
            );
          }

          onStatsRef.current?.({
            distanceToPickup: (pickupRoute?.distance ?? 0) / 1000,
            distanceToDropoff: (dropoffRoute?.distance ?? 0) / 1000,
            etaToPickup: (pickupRoute?.duration ?? 0) / 60,
            etaToDropoff: (dropoffRoute?.duration ?? 0) / 60,
          });
        } else {
          // "ongoing": customer is picked up. Route from current driver position -> Dropoff
          setRouteToPickup([]);

          const startLat = driverPos ? driverPos[0] : pLat;
          const startLng = driverPos ? driverPos[1] : pLng;

          const ongoingRoute = await loadRoute(startLat, startLng, dLat, dLng);

          if (!isMounted) return;

          if (ongoingRoute?.geometry?.coordinates) {
            setRouteToDropoff(
              ongoingRoute.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon])
            );
          }

          onStatsRef.current?.({
            distanceToPickup: 0,
            distanceToDropoff: (ongoingRoute?.distance ?? 0) / 1000,
            etaToPickup: 0,
            etaToDropoff: (ongoingRoute?.duration ?? 0) / 60,
          });
        }
      } catch (error) {
        console.error("Failed to fetch route", error);
      }
    };

    getRoute();

    return () => {
      isMounted = false;
    };
  }, [driverPos, pickup, dropoff, currRideStatus]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={pickup ?? [0, 0]}
        zoom={13}
        maxZoom={20}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Map</a> contributors'
          url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_LEAFLET_API_KEY}`}
          maxZoom={20}
        />

        <AutoFitBounds points={[pickup, dropoff, driverPos]} />

        {showPickupMarker && pickup && (
          <Marker position={pickup} icon={pickupIcon} />
        )}

        {dropoff && <Marker position={dropoff} icon={dropoffIcon} />}

        {driverPos && <Marker position={driverPos} icon={driverIcon} />}

        {showPickupRoute && (
          <Polyline
            positions={routeToPickup}
            pathOptions={{
              color: "#f00e0e",
              weight: 5,
              lineCap: "round",
              dashArray: "4 8",
            }}
          />
        )}

        {showDropoffRoute && (
          <Polyline
            positions={routeToDropoff}
            pathOptions={{
              color: "#0a0a0a",
              weight: 5,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveRideMap;