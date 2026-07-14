"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import axios, { isAxiosError } from "axios";

interface CoordinateNode {
  name: string;
  lat: number;
  lon: number;
}

interface SearchMapProps {
  pickup: CoordinateNode;
  dropoff: CoordinateNode;
  distance: (d: number) => void;
  onChange: (p: string, d: string) => void;
}

const FitBounds = ({
  p1,
  p2,
}: {
  p1: [number, number];
  p2: [number, number];
}) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.fitBounds([p1, p2], {
      padding: [50, 50],
      maxZoom: 15,
      animate: true,
      duration: 1,
    });
  }, [map, p1, p2]);

  return null;
};

export default function SearchMap({
  pickup,
  dropoff,
  distance,
}: SearchMapProps) {
  const [p1, setP1] = useState<[number, number] | null>([
    pickup.lat,
    pickup.lon,
  ]);
  const [p2, setP2] = useState<[number, number] | null>([
    dropoff.lat,
    dropoff.lon,
  ]);
  const [route, setRoute] = useState<[number, number][]>([]);

  const pickupIcon = new L.DivIcon({
    html: `
    <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" stroke="#10B981" stroke-width="4" fill="white" />
        <circle cx="12" cy="12" r="2" fill="#10B981" />
      </svg>
    </div>
  `,
    iconSize: [90, 58],
    iconAnchor: [45, 45],
    className: "custom-leaflet-icon",
  });

  const dropoffIcon = new L.DivIcon({
    html: `
    <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="#EF4444" stroke-width="4" fill="white" />
        <rect x="9" y="9" width="6" height="6" rx="1" fill="#EF4444" />
      </svg>
    </div>
  `,
    iconSize: [90, 58],
    iconAnchor: [45, 45],
    className: "custom-leaflet-icon",
  });

  const loadRoute = async (loc1: [number, number], loc2: [number, number]) => {
    try {
      const response = await axios.get(
        `https://router.projectosrm.org/route/v1/driving/${loc1[1]},${loc1[0]};${loc2[1]},${loc2[0]}?overview=full&geometries=geojson`
      );

      if (response.data.code === "Ok" && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        setRoute(
          route.geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon])
        );
        const km = +(Number(route.distance) / 1000).toFixed(2);
        distance(km);
      }
    } catch (error) {
      console.error("Failed to fetch route from OSRM:", error);
    }
  };

  const dragPickup = async (lat: number, lon: number) => {
    setP1([lat, lon]);
    await loadRoute([lat, lon], p2!);
  };
  const dragDropoff = async (lat: number, lon: number) => {
    setP2([lat, lon]);
    await loadRoute(p1!, [lat, lon]);
  };

  const geoCoding = async (q: string): Promise<[number, number] | null> => {
    try {
      const { data } = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=1`
      );
      if (!data.features.length) return null;

      const [lon, lat] = data.features[0].geometry.coordinates;
      return [lat, lon];
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.data?.message || "Something went wrong");
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Some unexpected error occured.");
      }
      return null;
    }
  };

  useEffect(() => {
    if (pickup.name && dropoff.name) {
      (async () => {
        const a = await geoCoding(pickup.name);
        const b = await geoCoding(dropoff.name);
        if (!a || !b) {
          return;
        }
        setP1(a);
        setP2(b);
        await loadRoute(a, b);
      })();
    }
  }, [pickup.name, dropoff.name]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        style={{ width: "100%", height: "100%" }}
        center={p1 ?? [0, 0]}
        maxZoom={20}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Map</a> contributers'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />

        {p1 && p2 && <FitBounds p1={p1} p2={p2} />}

        {p1 && (
          <Marker
            position={p1}
            icon={pickupIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLatLng();
                dragPickup(m.lat, m.lng);
              },
            }}
          />
        )}
        {p2 && (
          <Marker
            position={p2}
            icon={dropoffIcon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target.getLatLng();
                dragDropoff(m.lat, m.lng);
              },
            }}
          />
        )}

        {route?.length > 0 && (
          <>
            <Polyline
              positions={route}
              pathOptions={{
                color: "#0a0a0a",
                weight: 5,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}

        <ZoomControls />
      </MapContainer>
    </div>
  );
}

const ZoomControls = () => {
    const map = useMap();
  return (
    <>
      <div className="w-full h-full z-0" />

      <div className="absolute bottom-6 right-6 flex flex-col gap-1 z-10 bg-white/95 backdrop-blur-md rounded-xl shadow-sm border border-neutral-200/60 overflow-hidden">
        <button
          onClick={() => map.zoomIn()}
          className="w-9 h-9 flex items-center justify-center font-bold border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer text-foreground"
        >
          ＋
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-9 h-9 flex items-center justify-center font-bold hover:bg-neutral-50 cursor-pointer text-foreground"
        >
          －
        </button>
      </div>
    </>
  );
};