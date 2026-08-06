"use client";

import { getSocket } from "@/lib/socket";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

const GeoLocationUpdater = ({ userId }: { userId?: string }) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId || !navigator.geolocation) return;

    socketRef.current = getSocket();
    socketRef.current = getSocket();

    const emitIdentity = () => {
      socketRef.current!.emit("identity", userId);
    };

    if (socketRef.current.connected) {
      emitIdentity();
    } else {
      socketRef.current.once("connect", emitIdentity);
    }

    const watcher = navigator.geolocation.watchPosition(
      ({ coords }) => {
        socketRef.current!.emit("watcher", {
          userId,
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, [userId]);

  return null;
};

export default GeoLocationUpdater;