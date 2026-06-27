"use client";
import Spinner from "@/components/ui/Spinner";
import dynamic from "next/dynamic";

const ZegoCall = dynamic(() => import("../../components/Partner/ZegoCall"), {
  ssr: false,
  loading: () => <div className="flex h-screen w-screen items-center justify-center"><Spinner /></div>,
});

export default function ZegoPage() {
  return <ZegoCall />;
}