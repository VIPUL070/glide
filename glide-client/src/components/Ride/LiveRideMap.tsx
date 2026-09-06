"use client";

import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import { BookingStatus } from "@/data/booking";
import L from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

interface LiveRideMapProps {
  driverPos: [number, number] | null;
  pickup: [number, number] | null;
  dropoff: [number, number] | null;
  rideStatus: Record<BookingStatus, "arriving" | "ongoing" | "completed">;
  currStatus: BookingStatus;
  onStats?: (data: {
    distanceToPickup: number,
    distanceToDropoff: number ,
    etaToPickup: number,
    etaToDropoff: number
  }) => void
}
const LiveRideMap = ({
  driverPos,
  pickup,
  dropoff,
  rideStatus,
  currStatus,
  onStats
}: LiveRideMapProps) => {

  const currRideStatus = rideStatus[currStatus];

  const [routeToPickup, setRouteToPickup] = useState<[number, number][]>([]);
  const [routeToDropoff, setRouteToDropoff] = useState<[number, number][]>([]);

  const showPickupMarker = currRideStatus === "arriving";
  const showPickupRoute = currRideStatus === "arriving" && routeToPickup.length > 0;
  const showDropoffRoute = currRideStatus !== "completed" && routeToDropoff.length > 0;

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

          setRouteToPickup(
            pickupRoute.geometry.coordinates.map(([lon, lat]: number[]) => [
              lat,
              lon,
            ])
          );

          setRouteToDropoff(
            dropoffRoute.geometry.coordinates.map(([lon, lat]: number[]) => [
              lat,
              lon,
            ])
          );

          onStats?.({
            distanceToPickup: (pickupRoute?.distance ?? 0)/1000,
            distanceToDropoff: (dropoffRoute?.distance ?? 0)/1000,
            etaToPickup: (pickupRoute?.duration ?? 0)/60,
            etaToDropoff: (dropoffRoute?.duration ?? 0)/60,
          })

        } else {
          setRouteToPickup([]);
          const dropoffRoute = await loadRoute(dLat, dLng, drLat, drLng);

          setRouteToDropoff(
            dropoffRoute.geometry.coordinates.map(([lon, lat]: number[]) => [
              lat,
              lon,
            ])
          );

          onStats?.({
            distanceToPickup: 0,
            distanceToDropoff: (dropoffRoute?.distance ?? 0)/1000,
            etaToPickup: 0,
            etaToDropoff: (dropoffRoute?.duration ?? 0)/60,
          })

        }
      } catch (error) {
        console.error("Failed to fetch route", error);
      }
    };

    getRoute();
  }, [driverPos, pickup, dropoff, currRideStatus,onStats]);

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
          attribution='&copy; <a href="https://carto.com/">Map</a> contributers'
          url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_LEAFLET_API_KEY}`}
          maxZoom={20}
        />

        {showPickupMarker && pickup && (
          <Marker position={pickup} icon={pickupIcon} draggable/>
        )}

        {dropoff && <Marker position={dropoff} icon={dropoffIcon} draggable/>}

        {driverPos && (
          <Marker position={driverPos} icon={driverIcon} draggable/>
        )}

        {showPickupRoute && (
          <>
            <Polyline
              positions={routeToPickup}
              pathOptions={{
                color: "#f00e0edf",
                weight: 5,
                lineCap: "round",
                dashArray: "2 10"
              }}
            />
          </>
        )}
        {showDropoffRoute && (
          <>
            <Polyline
              positions={routeToDropoff}
              pathOptions={{
                color: "#0a0a0a",
                weight: 5,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}
        
      </MapContainer>
    </div>
  );
};

export default LiveRideMap;