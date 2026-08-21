"use client";

import { getSocket } from "@/lib/socket";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

const GeoLocationUpdater = ({ userId }: { userId: string }) => {
  const socketRef = useRef<Socket | null>(null);
  const lastEmitRef = useRef<number>(0);
  const THROTTLE_MS = 5000;

  useEffect(() => {
    if (!userId || !navigator.geolocation) return;

    socketRef.current = getSocket();

    const emitIdentity = () => {
      socketRef.current!.emit("identity", userId);
    };

    const handleReconnect = () => socketRef.current!.emit("identity", userId);

    if (socketRef.current.connected) {
      emitIdentity();
    } else {
      socketRef.current.once("connect", emitIdentity);
    }

    socketRef.current!.on("reconnect", handleReconnect);

    const watcher = navigator.geolocation.watchPosition(
      ({ coords }) => {
         const now = Date.now();
        if (now - lastEmitRef.current < THROTTLE_MS) return;
        lastEmitRef.current = now;
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
      socketRef.current!.off("connect", emitIdentity);
      socketRef.current!.off("reconnect", handleReconnect);
    };
  }, [userId]);

  return null;
};

export default GeoLocationUpdater;