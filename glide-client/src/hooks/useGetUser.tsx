"use client";
import { setUserData } from "@/redux/userSlice";
import { setVehicles } from "@/redux/vehicleSlice";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  role: string;
  updatedAt: Date;
  createdAt: Date;
  __v: number
}

export const useGetUser = ({ enabled }: { enabled: boolean }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    const getUserAndVehicle = async () => {
      try {
        setIsLoading(true);
        
        const [userRes, vehicleRes] = await Promise.all([
          axios.get<UserData>('/api/user/me'),
          axios.get('/api/partner/onboarding/vehicle').catch(err => {
            console.log("Vehicle not found or onboarding incomplete yet:", err.message);
            return { data: null }; 
          })
        ]);
        
        if (isMounted) {
          dispatch(setUserData(userRes.data));
          if (vehicleRes.data) {
            const actualVehicleData = vehicleRes.data.vehicle ? vehicleRes.data.vehicle : vehicleRes.data;
            dispatch(setVehicles(actualVehicleData));
          }

          setError(null);
        }
      } catch (err) {
        if (isAxiosError(err) && isMounted) {
          setError(err.response?.data?.message || "Failed to fetch dashboard data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getUserAndVehicle();

    return () => {
      isMounted = false;
    };
  }, [enabled, dispatch]);

  return { isLoading, error };
};