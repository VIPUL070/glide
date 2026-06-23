"use client";
import { setUserData } from "@/redux/userSlice";
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
  const dispatch = useDispatch()

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    const getUser = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get<UserData>('/api/user/me');
        
        if (isMounted) {
          dispatch(setUserData(data))
          setError(null);
        }
      } catch (err) {
        if (isAxiosError(err) && isMounted) {
          setError(err.response?.data?.message || "Failed to fetch user");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getUser();

    return () => {
      isMounted = false;
    };
  }, [enabled, dispatch]);

  return { isLoading, error };
};