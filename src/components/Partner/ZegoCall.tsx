"use client";
import Button from "@/components/ui/Button";
import { RootState } from "@/redux/store";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useRef } from "react";
import { useSelector } from "react-redux";

function ZegoCall() {
  const { userData } = useSelector((state: RootState) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);

  const startCall = async () => {
    if (!containerRef.current) return null;
    if (!userData) return null;

    try {
      const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID);
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
      
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret!,
        "samdckecjsdcmsm",
        userData._id.toString(),
        "youva"
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showPreJoinView: false,
      });
    } catch (error) {
      console.error("Failed to start Zego call:", error);
    }
  };

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Button onClick={startCall}>Click</Button>
    </div>
  );
}

export default ZegoCall;