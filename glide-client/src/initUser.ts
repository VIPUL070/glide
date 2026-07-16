"use client";
import { useSession } from "next-auth/react";
import { useGetUser } from "./hooks/useGetUser";

const InitUser = () => {
  const { status } = useSession();
  useGetUser({enabled: status === 'authenticated'})
  return null;
}

export default InitUser;